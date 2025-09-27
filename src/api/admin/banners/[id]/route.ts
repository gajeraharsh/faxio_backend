import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { BANNER_MODULE } from "../../../../modules/banner"
import type BannerModuleService from "../../../../modules/banner/service"

export const PatchAdminBannerSchema = z.object({
  name: z.string().optional(),
  desktop_image_url: z.string().url().nullable().optional(),
  mobile_image_url: z.string().url().nullable().optional(),
  link_url: z.string().url().nullable().optional(),
  position: z.coerce.number().min(0).nullable().optional(),
})

export type PatchAdminBannerReq = z.infer<typeof PatchAdminBannerSchema>

export const PATCH = async (
  req: AuthenticatedMedusaRequest<PatchAdminBannerReq>,
  res: MedusaResponse
) => {
  const { id } = (req as any).params as { id: string }
  const input = (req as any).validatedBody || ((req.body || {}) as PatchAdminBannerReq)
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)
  const payload: any = { id, ...input }
  const updated = await (service as any).updateBanners(payload)
  res.json({ banner: updated })
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { id } = (req as any).params as { id: string }
  const service = req.scope.resolve<BannerModuleService>(BANNER_MODULE)
  await (service as any).deleteBanners(id)
  res.status(204).send()
}
