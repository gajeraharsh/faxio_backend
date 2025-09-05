import { createStep, createWorkflow, WorkflowResponse, StepResponse } from "@medusajs/framework/workflows-sdk"
import type ReviewModuleService from "../modules/review/service"
import { REVIEW_MODULE } from "../modules/review"

export type UpdateReviewStatusInput = {
  id: string
  status: "pending" | "approved" | "rejected"
}

const updateStatusStep = createStep(
  "update-review-status",
  async (input: UpdateReviewStatusInput, { container }) => {
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    const updated = await service.updateReviews({ id: input.id, status: input.status } as any)
    return new StepResponse(updated)
  }
)

export const updateReviewStatusWorkflow = createWorkflow(
  "update-review-status",
  (input: UpdateReviewStatusInput) => {
    const updated = updateStatusStep(input)
    return new WorkflowResponse({ review: updated })
  }
)

export default updateReviewStatusWorkflow
