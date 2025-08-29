import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id as string

  const query = req.scope.resolve((ContainerRegistrationKeys as any).QUERY) as any
  const qc = (req as any).queryConfig || {}

  const args: any = {
    entity: "blog",
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
    filters: { id, ...(qc.filters || {}) },
    ...qc,
  }

  const { data } = await query.graph(args)
  const blog = Array.isArray(data) ? data[0] : data

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" })
  }

  res.json({ blog })
}
