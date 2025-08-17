import { model } from "@medusajs/framework/utils"

const CustomerEmailVerification = model.define("customer_email_verification", {
  id: model.id().primaryKey(),

  customer_id: model.text().nullable(),
  email: model.text(),
  code: model.text(),
  expires_at: model.dateTime(),
  consumed_at: model.dateTime().nullable(),
  verified: model.boolean().default(false),
  verified_at: model.dateTime().nullable(),
})

export default CustomerEmailVerification
