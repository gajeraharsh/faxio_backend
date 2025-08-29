import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

export const GetStoreBlogCategoriesSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  q: z.string().optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit = 50, offset = 0, q } = (req as any).validatedQuery || {}

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "blog_category",
    fields: ["id", "name", "created_at"],
    take: limit,
    skip: offset,
    ...qc,
  }

  if (q) args.q = q

  const {
    data,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  const categories = Array.isArray(data) ? data.filter(Boolean) : []
  res.json({ categories, count, limit: take, offset: skip })
}
