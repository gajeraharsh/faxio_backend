import { featureFlagRouter } from "@medusajs/framework"
import { MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes, QueryContextType } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  isPresent,
  QueryContext,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import IndexEngineFeatureFlag from "@medusajs/medusa/loaders/feature-flags/index-engine"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "@medusajs/medusa/api/utils/middlewares/index"
import { RequestWithContext, wrapProductsWithTaxPrices } from "@medusajs/medusa/api/store/products/helpers"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import type WishlistModuleService from "../../../modules/wishlist/service"
import { REVIEW_MODULE } from "../../../modules/review"
import type ReviewModuleService from "../../../modules/review/service"
import { getPool } from "../../../lib/pg"

export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) => {
  if (featureFlagRouter.isFeatureEnabled(IndexEngineFeatureFlag.key)) {
    // TODO: These filters are not supported by the index engine yet
    if (
      isPresent(req.filterableFields.tags) ||
      isPresent(req.filterableFields.categories)
    ) {
      return await getProducts(req, res)
    }

    return await getProductsWithIndexEngine(req, res)
  }

  return await getProducts(req, res)
}

async function getProductsWithIndexEngine(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const context: QueryContextType = {}
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  if (isPresent(req.pricingContext)) {
    context["variants"] ??= {}
    context["variants"]["calculated_price"] = QueryContext(req.pricingContext!)
  }

  const filters: Record<string, any> = req.filterableFields
  if (isPresent(filters.sales_channel_id)) {
    const salesChannelIds = filters.sales_channel_id

    filters["sales_channels"] ??= {}
    filters["sales_channels"]["id"] = salesChannelIds

    delete filters.sales_channel_id
  }

  const { data: products = [], metadata } = await query.index({
    entity: "product",
    fields: req.queryConfig.fields,
    filters,
    pagination: req.queryConfig.pagination,
    context,
  })

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      products.map((product) => product.variants).flat(1)
    )
  }

  await wrapProductsWithTaxPrices(req, products)
  await annotateProductsWithWishlist(req, products)
  await annotateProductsWithReviews(req, products)
  res.json({
    products,
    count: metadata!.estimate_count,
    estimate_count: metadata!.estimate_count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}

async function getProducts(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const context: object = {}
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  if (isPresent(req.pricingContext)) {
    context["variants.calculated_price"] = {
      context: req.pricingContext,
    }
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
      ...context,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      products.map((product) => product.variants).flat(1)
    )
  }

  await wrapProductsWithTaxPrices(req, products)
  await annotateProductsWithWishlist(req, products)
  await annotateProductsWithReviews(req, products)
  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

async function annotateProductsWithWishlist(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  products: any[]
) {
  try {
    const customerId = (req as any)?.auth_context?.actor_id
    if (!customerId || !Array.isArray(products) || products.length === 0) {
      // unauthenticated or no products; mark false (optional)
      for (const p of products ?? []) {
        ;(p as any).is_wishlist = false
      }
      return
    }

    const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
    const items = await wishlistService.listByCustomer(customerId)
    const set = new Set((items || []).map((it: any) => it.product_id))
    for (const p of products) {
      ;(p as any).is_wishlist = set.has((p as any).id)
    }
  } catch (e) {
    // Fail-safe: never block product listing due to wishlist
    for (const p of products ?? []) {
      ;(p as any).is_wishlist = false
    }
  }
}

async function annotateProductsWithReviews(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  products: any[]
) {
  try {
    if (!Array.isArray(products) || products.length === 0) {
      return
    }

    const ids = products.map((p) => (p as any).id).filter(Boolean)
    if (ids.length === 0) {
      return
    }

    // Use external Postgres pool to aggregate like the product details API
    const pool = getPool()
    const res = await pool.query(
      `
      SELECT
        r.product_id,
        COALESCE(AVG(r.rating)::numeric(10,2), 0) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM review r
      WHERE r.product_id = ANY($1)
        AND (r.status IS NULL OR r.status = 'approved')
      GROUP BY r.product_id
      `,
      [ids]
    )

    const map = new Map<string, { avg: number; count: number }>()
    for (const row of res?.rows ?? []) {
      const pid = String(row.product_id)
      const avg = row.avg_rating != null ? Number(row.avg_rating) : 0
      const count = row.review_count != null ? Number(row.review_count) : 0
      map.set(pid, { avg, count })
    }

    for (const p of products) {
      const pid = String((p as any).id)
      const rec = map.get(pid) || { avg: 0, count: 0 }
      const avg = Number.isFinite(rec.avg) ? rec.avg : 0
      const count = Number.isFinite(rec.count) ? rec.count : 0
      ;(p as any).review_count = count
      // Keep 1-decimal for rating used by frontend components
      ;(p as any).rating = Math.round(avg * 10) / 10
      // Also attach detailed stats like the details endpoint
    }
  } catch (e) {
    // Fail-safe defaults
    for (const p of products ?? []) {
      ;(p as any).review_count = 0
      ;(p as any).rating = 0
    }
  }
}