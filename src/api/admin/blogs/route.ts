import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { BLOG_MODULE } from "../../../modules/blog"
import type BlogModuleService from "../../../modules/blog/service"

export const GetAdminBlogsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
  category_id: z.string().optional(),
  q: z.string().optional(),
})

export const POSTAdminBlogSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  image_url: z.string().url().nullable().optional(),
  short_description: z.string().max(200).nullable().optional(),
  content: z.string().min(1, "Content is required"),
  hashtags: z.array(z.string()).optional(),
  read_time: z.coerce.number().min(0).optional(),
})

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { limit = 50, offset = 0, order = "-created_at", category_id, q } = (req as any).validatedQuery || {}

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "blog",
    // Ensure we only fetch defined fields to avoid null records
    fields: [
      "id",
      "category_id",
      "title",
      "image_url",
      "short_description",
      "content",
      "hashtags",
      "read_time",
      "created_at",
    ],
    order,
    take: limit,
    skip: offset,
    ...qc,
  }
  const filters: any = { ...(qc.filters || {}) }
  if (category_id) filters.category_id = category_id
  if (Object.keys(filters).length) args.filters = filters
  if (q) args.q = q

  const {
    data,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  const blogs = Array.isArray(data) ? data.filter(Boolean) : []
  res.json({ blogs, count, limit: take, offset: skip })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<z.infer<typeof POSTAdminBlogSchema>>, 
  res: MedusaResponse
) => {
  const input = (req as any).validatedBody || (req.body as any)
  const service = req.scope.resolve<BlogModuleService>(BLOG_MODULE)
  const payload: any = {
    ...input,
    hashtags: input.hashtags || [],
  }
  const created = await (service as any).createBlogs(payload)
  res.status(201).json({ blog: created })
}
