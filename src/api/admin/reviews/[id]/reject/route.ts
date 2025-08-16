import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { updateReviewStatusWorkflow } from "../../../../../workflows/update-review-status"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id as string

  const { result } = await updateReviewStatusWorkflow(req.scope).run({
    input: { id, status: "rejected" },
  })

  res.json(result)
}
