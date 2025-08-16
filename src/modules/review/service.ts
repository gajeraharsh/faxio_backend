import { MedusaService } from "@medusajs/framework/utils"
import Review from "./models/review"

class ReviewModuleService extends MedusaService({
  Review,
}) {
  // Convenience helpers (optional)
  async listApprovedByProduct(productId: string) {
    return this.listReviews({
      filters: { product_id: productId, status: "approved" },
      order: "-created_at",
    })
  }

  async createPending(input: {
    product_id: string
    customer_id?: string | null
    title?: string | null
    content: string
    rating: number
    first_name: string
    last_name: string
  }) {
    return this.createReviews({
      ...input,
      status: "pending",
    } as any)
  }
}

export default ReviewModuleService
