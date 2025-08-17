import { model } from "@medusajs/framework/utils"

// Wishlist Item model
const WishlistItem = model.define("wishlist_item", {
  id: model.id().primaryKey(),

  // Associations (stored as IDs)
  product_id: model.text(),
  customer_id: model.text(), // logged-in only, non-null

  // Optional note
  notes: model.text().nullable(),
})

export default WishlistItem
