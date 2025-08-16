import { model } from "@medusajs/framework/utils"

// Product Review model (Medusa v2 model.define API)
const Review = model.define("review", {
  id: model.id().primaryKey(),

  // Associations (stored as IDs)
  product_id: model.text(),
  customer_id: model.text().nullable(),

  // Review details
  title: model.text().nullable(),
  content: model.text(),
  rating: model.number(),
  first_name: model.text(),
  last_name: model.text(),

  // Moderation status
  status: model.enum(["pending", "approved", "rejected"]),
})

export default Review
