import { isPresent, MedusaError } from "@medusajs/framework/utils"
import { MedusaResponse } from "@medusajs/framework/http"
import {
  refetchProduct,
  RequestWithContext,
  wrapProductsWithTaxPrices,
} from "@medusajs/medusa/api/store/products/helpers"
import { HttpTypes } from "@medusajs/framework/types"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "@medusajs/medusa/api/utils/middlewares/index"
import { getPool } from "../../../../lib/pg"


export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductParams>,
  res: MedusaResponse<HttpTypes.StoreProductResponse>
) => {
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  const filters: object = {
    id: req.params.id,
    ...req.filterableFields,
  }

  if (isPresent(req.pricingContext)) {
    filters["context"] = {
      "variants.calculated_price": { context: req.pricingContext },
    }
  }

  const product = await refetchProduct(
    filters,
    req.scope,
    req.queryConfig.fields
  )

  if (!product) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with id: ${req.params.id} was not found`
    )
  }

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      product.variants || []
    )
  }

  await wrapProductsWithTaxPrices(req, [product])

  // Annotate with is_wishlist for authenticated users using a minimal custom query
  try {
    const customerId = (req as any)?.auth_context?.actor_id

    if (customerId) {
      const pool = getPool()
      const existsRes = await pool.query(
        `SELECT 1 FROM wishlist_item wi WHERE wi.product_id = $1 AND wi.customer_id = $2 LIMIT 1`,
        [product.id, customerId]
      )
      ;(product as any).is_wishlist = (existsRes?.rowCount || 0) > 0
    } else {
      ;(product as any).is_wishlist = false
    }
  } catch(err) {
    console.log(err)
    ;(product as any).is_wishlist = false
  }

  // External Postgres connection (outside Medusa DI)
  const pool = getPool()
  const aggRes = await pool.query(
    `
    SELECT
      COALESCE(AVG(r.rating)::numeric(10,2), 0) AS avg_rating,
      COUNT(r.id) AS review_count
    FROM review r
    WHERE r.product_id = $1
      AND (r.status IS NULL OR r.status = 'approved')
    `,
    [product.id]
  )
  const aggRow = aggRes?.rows?.[0] ?? {}
  const avgRating = aggRow.avg_rating != null ? Number(aggRow.avg_rating) : 0
  const reviewCount = aggRow.review_count != null ? Number(aggRow.review_count) : 0

  ;(product as any).metadata = {
    ...(product as any).metadata,
    review_stats: {
      average: Number(avgRating.toFixed(2)),
      count: reviewCount
    },
  }
  // Also expose at the top-level for convenience (optional)
  ;(product as any).review_stats = (product as any).metadata.review_stats

  // Debug: ensure we log the correct path
  res.json({ product })
}