import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { CONTACT_MODULE } from "../../../modules/contact"
import type ContactModuleService from "../../../modules/contact/service"

export const PostStoreContactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().optional().nullable(),
  subject: z.string().trim().min(1),
  message: z.string().trim().min(1),
})

export type PostStoreContactReq = z.infer<typeof PostStoreContactSchema>

export const POST = async (
  req: MedusaRequest<PostStoreContactReq>,
  res: MedusaResponse
) => {
  const body = (req as any).validatedBody || (req.body as PostStoreContactReq)
  const { name, email, phone, subject, message } = body

  const svc = req.scope.resolve<ContactModuleService>(CONTACT_MODULE)

  const contact = await svc.submit({ name, email, phone, subject, message })

  res.json({ contact })
}
