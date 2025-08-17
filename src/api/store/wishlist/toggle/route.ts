import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { WISHLIST_MODULE } from "../../../../modules/wishlist"
import type WishlistModuleService from "../../../../modules/wishlist/service"

export const PostStoreWishlistToggleSchema = z.object({
  product_id: z.string(),
})

type PostStoreWishlistToggleReq = z.infer<typeof PostStoreWishlistToggleSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreWishlistToggleReq>,
  res: MedusaResponse
) => {
  const input = req.validatedBody || (req.body as PostStoreWishlistToggleReq)
  const customerId = (req.auth_context as any)?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
  const result = await wishlistService.toggle(input.product_id, customerId)
  res.json(result)
}
