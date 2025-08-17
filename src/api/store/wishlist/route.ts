import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import type WishlistModuleService from "../../../modules/wishlist/service"

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
  res.json({ items })
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
