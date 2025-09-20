import { MedusaService } from "@medusajs/framework/utils"
import Contact from "./models/contact"

class ContactModuleService extends MedusaService({
  Contact,
}) {
  async submit(input: {
    name: string
    email: string
    phone?: string | null
    subject: string
    message: string
  }) {
    return this.createContacts({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      subject: input.subject,
      message: input.message,
      status: "new",
    } as any)
  }
}

export default ContactModuleService
