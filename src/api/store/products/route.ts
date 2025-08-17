import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import type WishlistModuleService from "../../../modules/wishlist/service"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const productModule: any = req.scope.resolve(Modules.PRODUCT)

  const products = await productModule.listProducts({}, { take: 20, skip: 0 })

  const customerId = (req.auth_context as any)?.actor_id
  if (!customerId) {
    return res.json({ products: products.map((p: any) => ({ ...p, is_wishlist: false })) })
  }

  const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
  const wishlistItems = await wishlistService.listByCustomer(customerId)
  const wishlistIds = new Set(wishlistItems.map((w: any) => w.product_id))

  const enriched = products.map((p: any) => ({
    ...p,
    is_wishlist: wishlistIds.has(p.id),
  }))

  return res.json({ products: enriched })
}
