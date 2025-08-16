import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { REVIEW_MODULE } from "../../../../modules/review"
import type ReviewModuleService from "../../../../modules/review/service"

export const PatchAdminReviewSchema = z.object({
  product_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  title: z.string().nullable().optional(),
  content: z.string().optional(),
  rating: z
    .preprocess((val) => (typeof val === "string" && val !== "" ? parseInt(val) : val), z.number().min(1).max(5))
    .optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
})

export type PatchAdminReviewReq = z.infer<typeof PatchAdminReviewSchema>

export const PATCH = async (
  req: AuthenticatedMedusaRequest<PatchAdminReviewReq>,
  res: MedusaResponse
) => {
  const { id } = (req as any).params as { id: string }
  const input = (req as any).validatedBody || ((req.body || {}) as PatchAdminReviewReq)

  const reviewService = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE)

  const updated = await (reviewService as any).updateReviews({ id, ...input } as any)

  res.json({ review: updated })
}
