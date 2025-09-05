import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { REELS_MODULE } from "../../../modules/reels"
import type ReelsModuleService from "../../../modules/reels/service"

export const GetAdminReelsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
  type: z.enum(["video", "image"]).optional(),
  product_id: z.string().optional(),
  blog_id: z.string().optional(),
  q: z.string().optional(),
})

export const POSTAdminReelSchema = z.object({
  type: z.enum(["video", "image"]),
  name: z.string().min(1, "Name is required"),
  hashtags: z.array(z.string()).optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  video_url: z.string().url().nullable().optional(),
  product_id: z.string().nullable().optional(),
  blog_id: z.string().nullable().optional(),
  is_display_home: z.boolean().optional(),
})

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { limit = 50, offset = 0, order = "-created_at", type, product_id, blog_id, q } = (req as any).validatedQuery || {}

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "reel",
    fields: [
      "id",
      "type",
      "name",
      "hashtags",
      "is_display_home",
      "thumbnail_url",
      "video_url",
      "product_id",
      "blog_id",
      "uploader_type",
      "uploader_id",
      "created_at",
    ],
    order,
    take: limit,
    skip: offset,
    ...qc,
  }
  const filters: any = { ...(qc.filters || {}) }
  if (type) filters.type = type
  if (product_id) filters.product_id = product_id
  if (blog_id) filters.blog_id = blog_id
  if (Object.keys(filters).length) args.filters = filters
  if (q) args.q = q

  const {
    data,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  const reels = Array.isArray(data) ? data.filter(Boolean) : []
  res.json({ reels, count, limit: take, offset: skip })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<z.infer<typeof POSTAdminReelSchema>>, 
  res: MedusaResponse
) => {
  const input = (req as any).validatedBody || (req.body as any)
  const service = req.scope.resolve<ReelsModuleService>(REELS_MODULE)

  const payload: any = {
    ...input,
    hashtags: input.hashtags || [],
    uploader_type: "admin",
    uploader_id: (req as any).auth_user_id || null,
  }

  const created = await (service as any).createReels(payload)
  res.status(201).json({ reel: created })
}
