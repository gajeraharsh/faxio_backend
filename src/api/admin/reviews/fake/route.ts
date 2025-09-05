import type { MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { z } from "zod"
import { REVIEW_MODULE } from "../../../../modules/review"
import type ReviewModuleService from "../../../../modules/review/service"

export const PostAdminFakeReviewSchema = z.object({
  product_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  content: z.string(),
  title: z.string().optional().nullable(),
  rating: z.preprocess(
    (val) => {
      if (val && typeof val === "string") {
        return parseInt(val)
      }
      return val
    },
    z.number().min(1).max(5)
  ),
  status: z.enum(["pending", "approved", "rejected"]).optional().default("approved"),
  customer_id: z.string().optional().nullable(),
})

export type PostAdminFakeReviewReq = z.infer<typeof PostAdminFakeReviewSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<PostAdminFakeReviewReq>,
  res: MedusaResponse
) => {
  const input = req.validatedBody || (req.body as PostAdminFakeReviewReq)

  const reviewService = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE)

  const review = await reviewService.createReviews({
    product_id: input.product_id,
    customer_id: input.customer_id ?? null,
    title: input.title ?? null,
    content: input.content,
    rating: input.rating,
    first_name: input.first_name,
    last_name: input.last_name,
    status: input.status ?? "approved",
  } as any)

  res.json({ review })
}
