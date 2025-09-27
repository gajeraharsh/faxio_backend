import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { BANNER_MODULE } from "../../../modules/banner"
import type BannerModuleService from "../../../modules/banner/service"

export const GetAdminBannersSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
  q: z.string().optional(),
  position: z.coerce.number().optional(),
})

export const POSTAdminBannerSchema = z.object({
  name: z.string().min(1, "Banner name is required"),
  desktop_image_url: z.string().url().nullable().optional(),
  mobile_image_url: z.string().url().nullable().optional(),
  link_url: z.string().url().nullable().optional(),
  position: z.coerce.number().min(0).default(0).optional(),
})

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { limit = 100, offset = 0, order = "position", q, position } = (req as any).validatedQuery || {}

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "banner",
    fields: [
      "id",
      "name",
      "desktop_image_url",
      "mobile_image_url",
      "link_url",
      "position",
      "created_at",
    ],
    order,
    take: limit,
    skip: offset,
    ...qc,
  }
  const filters: any = { ...(qc.filters || {}) }
  if (typeof position === "number") filters.position = position
  if (Object.keys(filters).length) args.filters = filters
  if (q) args.q = q

  const {
    data,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  const banners = Array.isArray(data) ? data.filter(Boolean) : []
  res.json({ banners, count, limit: take, offset: skip })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<z.infer<typeof POSTAdminBannerSchema>>,
  res: MedusaResponse
) => {
  const input = (req as any).validatedBody || (req.body as any)
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)
  const created = await (service as any).createBanners({
    name: input.name,
    desktop_image_url: input.desktop_image_url ?? null,
    mobile_image_url: input.mobile_image_url ?? null,
    link_url: input.link_url ?? null,
    position: typeof input.position === "number" ? input.position : 0,
  })
  res.status(201).json({ banner: created })
}
