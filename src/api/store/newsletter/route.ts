import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { NEWSLETTER_MODULE } from "../../../modules/newsletter"
import type NewsletterModuleService from "../../../modules/newsletter/service"

export const PostStoreNewsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

export type PostStoreNewsletterReq = z.infer<typeof PostStoreNewsletterSchema>

export const POST = async (
  req: MedusaRequest<PostStoreNewsletterReq>,
  res: MedusaResponse
) => {
  const body = (req as any).validatedBody || (req.body as PostStoreNewsletterReq)
  const { email } = body

  const svc = req.scope.resolve<NewsletterModuleService>(NEWSLETTER_MODULE)
  const customerId = (req as any)?.auth_context?.actor_id ?? null

  const subscription = await svc.subscribe(email, customerId)

  res.json({ subscription })
}
