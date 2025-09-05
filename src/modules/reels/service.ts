import { MedusaService } from "@medusajs/framework/utils"
import Reel from "./models/reel"
import ReelLike from "./models/reel_like"

class ReelsModuleService extends MedusaService({
  Reel,
  ReelLike,
}) {
  async listReelsWithFilters(filters: any = {}, order = "-created_at") {
    return this.listReels({ filters, order })
  }

  async likeReel(reel_id: string, customer_id: string) {
    if (!reel_id || !customer_id) throw new Error("Missing reel_id or customer_id")
    // Ensure idempotent like using unique constraint (reel_id, customer_id)
    const existing = await this.listReelLikes({ reel_id, customer_id })
    if (Array.isArray(existing) && existing.length) return existing[0]
    return this.createReelLikes({ reel_id, customer_id })
  }

  async unlikeReel(reel_id: string, customer_id: string) {
    if (!reel_id || !customer_id) throw new Error("Missing reel_id or customer_id")
    const existing = await this.listReelLikes({ reel_id, customer_id })
    if (Array.isArray(existing) && existing.length) {
      await this.deleteReelLikes(existing.map((e: any) => e.id))
      return true
    }
    return true
  }

  async listLikedReelIdsForCustomer(customer_id: string, reel_ids: string[]): Promise<Set<string>> {
    if (!customer_id || !Array.isArray(reel_ids) || reel_ids.length === 0) return new Set()
    const likes = await this.listReelLikes({ customer_id, reel_id: reel_ids })
    const set = new Set<string>()
    for (const l of likes as any[]) {
      if (l?.reel_id) set.add(String(l.reel_id))
    }
    return set
  }

  async getLikeCountsForReels(reel_ids: string[]): Promise<Map<string, number>> {
    const map = new Map<string, number>()
    if (!Array.isArray(reel_ids) || reel_ids.length === 0) return map
    const likes = await this.listReelLikes({ reel_id: reel_ids })
    for (const l of likes as any[]) {
      const id = String(l.reel_id)
      map.set(id, (map.get(id) || 0) + 1)
    }
    return map
  }
}

export default ReelsModuleService
