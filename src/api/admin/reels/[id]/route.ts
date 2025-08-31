import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { REELS_MODULE } from "../../../../modules/reels"
import type ReelsModuleService from "../../../../modules/reels/service"

export const PATCHAdminReelSchema = z.object({
  type: z.enum(["video", "image"]).optional(),
  name: z.string().min(1).optional(),
  hashtags: z.array(z.string()).optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  video_url: z.string().url().nullable().optional(),
  product_id: z.string().nullable().optional(),
  blog_id: z.string().nullable().optional(),
  is_display_home: z.boolean().optional(),
})

export const PATCH = async (
  req: AuthenticatedMedusaRequest<z.infer<typeof PATCHAdminReelSchema>>,
  res: MedusaResponse
) => {
  const id = ((req as any).params?.id || (req.params as any)?.id || "").toString()
  if (!id) {
    return res.status(400).json({ message: "Missing reel id" })
  }

  const input = (req as any).validatedBody || (req.body as any) || {}
  const service = req.scope.resolve<ReelsModuleService>(REELS_MODULE) as any

  // MedusaService update* usually expects `{ id, ...fields }` (optionally array).
  const data = { id, ...input }
  const updated = await service.updateReels ? await service.updateReels(data) : null
  const reel = Array.isArray(updated) ? updated[0] : updated
  return res.status(200).json({ reel })
}
