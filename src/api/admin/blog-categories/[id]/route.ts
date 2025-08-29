import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { BLOG_MODULE } from "../../../../modules/blog"
import type BlogModuleService from "../../../../modules/blog/service"

export const PatchAdminBlogCategorySchema = z.object({
  name: z.string().min(1).optional(),
})

export type PatchAdminBlogCategoryReq = z.infer<typeof PatchAdminBlogCategorySchema>

export const PATCH = async (
  req: AuthenticatedMedusaRequest<PatchAdminBlogCategoryReq>,
  res: MedusaResponse
) => {
  const { id } = (req as any).params as { id: string }
  const input = (req as any).validatedBody || ((req.body || {}) as PatchAdminBlogCategoryReq)
  const service = req.scope.resolve<BlogModuleService>(BLOG_MODULE)
  const updated = await (service as any).updateBlogCategories({ id, ...input } as any)
  res.json({ category: updated })
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = (req as any).params as { id: string }
  const service = req.scope.resolve<BlogModuleService>(BLOG_MODULE)
  await (service as any).deleteBlogCategories(id)
  res.status(204).send()
}
