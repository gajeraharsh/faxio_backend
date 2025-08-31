import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { REELS_MODULE } from "../../../../../modules/reels"
import type ReelsModuleService from "../../../../../modules/reels/service"

export const PostStoreReelLikeSchema = z.object({})

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const reelId = (req.params as any)?.id as string
  const customerId = (req.auth_context as any)?.actor_id as string | undefined
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })
  if (!reelId) return res.status(400).json({ message: "Missing reel id" })

  const service = req.scope.resolve<ReelsModuleService>(REELS_MODULE) as any
  await service.likeReel(reelId, customerId)
  return res.json({ success: true })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const reelId = (req.params as any)?.id as string
  const customerId = (req.auth_context as any)?.actor_id as string | undefined
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })
  if (!reelId) return res.status(400).json({ message: "Missing reel id" })

  const service = req.scope.resolve<ReelsModuleService>(REELS_MODULE) as any
  await service.unlikeReel(reelId, customerId)
  return res.json({ success: true })
}
