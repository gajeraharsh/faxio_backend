import { model } from "@medusajs/framework/utils"

const CustomerPasswordResetToken = model.define("customer_password_reset_token", {
  id: model.id().primaryKey(),

  customer_id: model.text().nullable(),
  email: model.text(),
  token_hash: model.text(),
  expires_at: model.dateTime(),
  used_at: model.dateTime().nullable(),
})

export default CustomerPasswordResetToken
