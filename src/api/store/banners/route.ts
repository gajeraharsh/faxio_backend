import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

export const GetStoreBannersSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit = 50, offset = 0 } = (req as any).validatedQuery || {}

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
    order: "position",
    take: limit,
    skip: offset,
    ...qc,
  }

  const {
    data,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  const banners = Array.isArray(data) ? data.filter(Boolean) : []
  res.json({ banners, count, limit: take, offset: skip })
}
