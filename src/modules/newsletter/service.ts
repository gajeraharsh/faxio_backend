import { MedusaService } from "@medusajs/framework/utils"
import Newsletter from "./models/newsletter"

class NewsletterModuleService extends MedusaService({
  Newsletter,
}) {
  async subscribe(email: string, customer_id?: string | null) {
    const existing = await this.listNewsletters(
      { email: email.toLowerCase() },
      { take: 1 }
    )
    if (existing?.length) return existing[0]

    return this.createNewsletters({
      email: email.toLowerCase(),
      customer_id: customer_id || null,
    } as any)
  }
}

export default NewsletterModuleService
