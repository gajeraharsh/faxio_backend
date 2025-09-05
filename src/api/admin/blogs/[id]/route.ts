import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { BLOG_MODULE } from "../../../../modules/blog"
import type BlogModuleService from "../../../../modules/blog/service"

export const PatchAdminBlogSchema = z.object({
  category_id: z.string().optional(),
  title: z.string().optional(),
  image_url: z.string().url().nullable().optional(),
  short_description: z.string().max(200).nullable().optional(),
  content: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  read_time: z.coerce.number().min(0).nullable().optional(),
})

export type PatchAdminBlogReq = z.infer<typeof PatchAdminBlogSchema>

export const PATCH = async (
  req: AuthenticatedMedusaRequest<PatchAdminBlogReq>,
  res: MedusaResponse
) => {
  const { id } = (req as any).params as { id: string }
  const input = (req as any).validatedBody || ((req.body || {}) as PatchAdminBlogReq)
  const service = req.scope.resolve<BlogModuleService>(BLOG_MODULE)
  const updated = await (service as any).updateBlogs({ id, ...input } as any)
  res.json({ blog: updated })
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = (req as any).params as { id: string }
  const service = req.scope.resolve<BlogModuleService>(BLOG_MODULE)
  await (service as any).deleteBlogs(id)
  res.status(204).send()
}
