import { model } from "@medusajs/framework/utils"

// Product Review model
// Follows Medusa v2 model.define API
// Includes basic fields used throughout the tutorial and typical review workflows
const Review = model.define("review", {
  id: model.id().primaryKey(),

  // Associations (stored as IDs for simplicity)
  product_id: model.text(),
  customer_id: model.text().nullable(),

  // Review details
  title: model.text().nullable(),
  content: model.text(),
  rating: model.number(), // expected 1..5; enforced in route schema/middlewares
  first_name: model.text(),
  last_name: model.text(),

  // Moderation status
  status: model.enum(["pending", "approved", "rejected"]),
})

export default Review
