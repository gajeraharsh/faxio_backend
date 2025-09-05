import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

export const GetAdminReviewsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit = 15, offset = 0, order = "-created_at", status } = (req as any).validatedQuery || {}

  // Use Query API to avoid requiring a request-scoped MikroORM manager
  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "review",
    ...qc,
  }
  if (status) {
    args.filters = { ...(qc.filters || {}), status }
  }

  const {
    data: reviews,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  res.json({ reviews, count, limit: take, offset: skip })
}
