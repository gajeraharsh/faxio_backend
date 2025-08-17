import { MedusaService } from "@medusajs/framework/utils"
import WishlistItem from "./models/wishlist-item"

class WishlistModuleService extends MedusaService({
  WishlistItem,
}) {
  async listByCustomer(customerId: string) {
    return this.listWishlistItems({ customer_id: customerId })
  }

  async addItem(input: { product_id: string; customer_id: string; notes?: string | null }) {
    // enforce uniqueness by (customer_id, product_id)
    const existing = await this.listWishlistItems({ customer_id: input.customer_id, product_id: input.product_id })
    if (existing?.length) return existing[0]
    return this.createWishlistItems({ ...input } as any)
  }

  async removeById(id: string, customerId: string) {
    // ensure ownership
    const items = await this.listWishlistItems({ id, customer_id: customerId })
    if (!items?.length) return { id, deleted: false }
    await this.deleteWishlistItems(id)
    return { id, deleted: true }
  }

  async removeByProduct(productId: string, customerId: string) {
    const items = await this.listWishlistItems({ product_id: productId, customer_id: customerId })
    if (!items?.length) return { deleted: false }
    await this.deleteWishlistItems(items[0].id)
    return { id: items[0].id, deleted: true }
  }

  async isInWishlist(productId: string, customerId: string) {
    const items = await this.listWishlistItems({ product_id: productId, customer_id: customerId })
    return !!items?.length
  }

  async toggle(productId: string, customerId: string) {
    const items = await this.listWishlistItems({ product_id: productId, customer_id: customerId })
    if (items?.length) {
      await this.deleteWishlistItems(items[0].id)
      return { status: "removed" as const, id: items[0].id }
    }
    const created = await this.createWishlistItems({ product_id: productId, customer_id: customerId } as any)
    return { status: "added" as const, item: created }
  }
}

export default WishlistModuleService
