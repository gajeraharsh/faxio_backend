import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"

export const GetAdminContactsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
  status: z.enum(["new", "in_progress", "resolved"]).optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit = 15, offset = 0, order = "-created_at", status } = (req as any).validatedQuery || {}

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "contact",
    // Specify fields explicitly to avoid null graph nodes
    fields: [
      "id",
      "name",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "created_at",
    ],
    order,
    take: limit,
    skip: offset,
    ...qc,
  }
  if (status) {
    args.filters = { ...(qc.filters || {}), status }
  }

  const {
    data,
    metadata: { count = 0, take = limit, skip = offset } = {},
  } = await query.graph(args)

  const contacts = Array.isArray(data) ? data.filter(Boolean) : []
  res.json({ contacts, count, limit: take, offset: skip })
}
