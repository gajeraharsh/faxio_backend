import { model } from "@medusajs/framework/utils"

// Contact Us model
const Contact = model.define("contact", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  subject: model.text(),
  message: model.text(),
  status: model.enum(["new", "in_progress", "resolved"]).default("new"),
})

export default Contact
