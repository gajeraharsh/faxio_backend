import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { REELS_MODULE } from "../../../../modules/reels"
import type ReelsModuleService from "../../../../modules/reels/service"

const ParamsSchema = z.object({
  id: z.string().min(1),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const params = ParamsSchema.safeParse((req as any).params || {})
    if (!params.success) {
      return res.status(400).json({ message: "Invalid reel id" })
    }
    const id = params.data.id

    const service = req.scope.resolve<ReelsModuleService>(REELS_MODULE) as any

    // Retrieve reel by id
    let reel = await (service.retrieveReel ? service.retrieveReel(id) : undefined)
    if (!reel) {
      const list = await (service.listReels ? service.listReels({ id }, { take: 1 }) : [])
      reel = Array.isArray(list) ? list[0] : undefined
    }
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" })
    }

    const toPlain = (x: any) => (x && typeof x.toJSON === "function" ? x.toJSON() : { ...(x || {}) })

    // Enrich with like_count and is_like
    let like_count = 0
    try {
      const map = await (service as any).getLikeCountsForReels([id])
      like_count = map?.get?.(id) ?? 0
    } catch {}

    const customerId = (req as any)?.auth_context?.actor_id
    let is_like = false
    if (customerId) {
      try {
        const set = await (service as any).listLikedReelIdsForCustomer(customerId, [id])
        is_like = !!set?.has?.(id)
      } catch {}
    }

    reel = { ...toPlain(reel), like_count, is_like }

    return res.json({ reel })
  } catch (e: any) {
    const message = e?.message || "Failed to retrieve reel"
    return res.status(500).json({ message })
  }
}
