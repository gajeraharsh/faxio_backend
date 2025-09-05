import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { REVIEW_MODULE } from "../../../modules/review"
import type ReviewModuleService from "../../../modules/review/service"

export const PostStoreReviewSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  rating: z.preprocess(
    (val) => {
      if (val && typeof val === "string") {
        return parseInt(val)
      }
      return val
    },
    z.number().min(1).max(5)
  ),
  product_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
})

type PostStoreReviewReq = z.infer<typeof PostStoreReviewSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreReviewReq>,
  res: MedusaResponse
) => {
  const input = req.validatedBody || (req.body as PostStoreReviewReq)

  const reviewService = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE)

  const review = await reviewService.createPending({
    ...input,
    customer_id: (req.auth_context as any)?.actor_id ?? null,
  })

  res.json({ review })
}
