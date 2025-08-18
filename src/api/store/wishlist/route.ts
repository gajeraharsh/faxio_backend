import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import type WishlistModuleService from "../../../modules/wishlist/service"
import { ContainerRegistrationKeys, remoteQueryObjectFromString } from "@medusajs/framework/utils"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "@medusajs/medusa/api/utils/middlewares/index"
import { wrapProductsWithTaxPrices } from "@medusajs/medusa/api/store/products/helpers"
import { isPresent, Modules } from "@medusajs/framework/utils"

export const PostStoreWishlistSchema = z.object({
  product_id: z.string(),
  notes: z.string().optional(),
})

type PostStoreWishlistReq = z.infer<typeof PostStoreWishlistSchema>

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerId = (req.auth_context as any)?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
  const items = await wishlistService.listByCustomer(customerId)

  if (!items?.length) {
    return res.json({ items: [] })
  }

  // Build pricing context similar to products endpoint
  const q = ((req as any).validatedQuery || (req as any).query || {}) as any
  let region_id: string | undefined = q.region_id
  let currency_code: string | undefined = q.currency_code
  try {
    if (!currency_code && region_id) {
      const regionModule: any = req.scope.resolve(Modules.REGION as any)
      const regions = await regionModule.listRegions({ id: region_id }, { take: 1 })
      if (regions?.length) {
        currency_code = regions[0].currency_code
      }
    }
  } catch {}
  if (currency_code) {
    ;(req as any).pricingContext = {
      currency_code,
      region_id,
      customer_id: customerId,
    }
  }

  // Collect product IDs from wishlist
  const productIds = items.map((it: any) => it.product_id)

  // Build a query to fetch products with pricing context similar to products list
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  // Minimal, but useful set of fields (extend as needed)
  const fields = [
    "id",
    "title",
    "subtitle",
    "handle",
    "description",
    "thumbnail",
    "images.id",
    "images.url",
    "variants.id",
    "variants.title",
    "variants.sku",
    "variants.inventory_quantity",
    "variants.calculated_price.calculated_amount",
    "variants.calculated_price.calculated_amount_type",
    "variants.calculated_price.original_amount",
    "variants.calculated_price.original_amount_type",
    "variants.calculated_price.currency_code",
  ]

  const context: Record<string, any> = {}
  if (isPresent((req as any).pricingContext)) {
    context["variants.calculated_price"] = {
      context: (req as any).pricingContext,
    }
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: { id: productIds },
      ...context,
      skip: 0,
      take: productIds.length,
    },
    fields,
  })

  const { rows: products } = await remoteQuery(queryObject)

  // Wrap with inventory quantity only if sales_channel_id context is present (otherwise skip)
  const hasSalesChannel = !!(req as any)?.filterableFields?.sales_channel_id
  if (hasSalesChannel) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req as any,
      products.map((p: any) => p.variants).flat(1)
    )
  }
  if (isPresent((req as any).pricingContext?.currency_code)) {
    await wrapProductsWithTaxPrices(req as any, products)
  }

  // Map product by id for quick lookup
  const byId = new Map(products.map((p: any) => [p.id, p]))

  // Attach product and set is_wishlist flag
  const enriched = items.map((it: any) => ({
    ...it,
    product: byId.get(it.product_id) ?? null,
    is_wishlist: true,
  }))

  res.json({ items: enriched })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreWishlistReq>,
  res: MedusaResponse
) => {
  const input = req.validatedBody || (req.body as PostStoreWishlistReq)
  const customerId = (req.auth_context as any)?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
  const item = await wishlistService.addItem({
    product_id: input.product_id,
    customer_id: customerId,
    notes: input.notes,
  })

  res.json({ item })
}
