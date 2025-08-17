import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WISHLIST_MODULE } from "../../../../modules/wishlist"
import type WishlistModuleService from "../../../../modules/wishlist/service"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const customerId = (req.auth_context as any)?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const { id } = req.params as { id: string }

  const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
  const result = await wishlistService.removeById(id, customerId)
  res.json(result)
}
