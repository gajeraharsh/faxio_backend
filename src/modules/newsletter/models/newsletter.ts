import { model } from "@medusajs/framework/utils"

// Newsletter subscription model
const Newsletter = model.define("newsletter", {
  id: model.id().primaryKey(),
  email: model.text(),
  customer_id: model.text().nullable(),
})

export default Newsletter
