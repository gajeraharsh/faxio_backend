import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { REVIEW_MODULE } from "../../../../../modules/review"
import type ReviewModuleService from "../../../../../modules/review/service"

export const GetStoreReviewsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productId = req.params.id as string
  const { limit = 10, offset = 0 } = (req as any).validatedQuery || {}

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "review",
    ...qc,
    filters: {
      ...(qc.filters || {}),
      product_id: productId,
      status: "approved",
    },
  }

  const {
    data: reviews,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  res.json({ reviews, count, limit: take, offset: skip })
}
