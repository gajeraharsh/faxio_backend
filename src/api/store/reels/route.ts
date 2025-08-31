import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import { REELS_MODULE } from "../../../modules/reels"
import type ReelsModuleService from "../../../modules/reels/service"

export const GetStoreReelsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.string().optional(),
  type: z.enum(["video", "image"]).optional(),
  product_id: z.string().optional(),
  blog_id: z.string().optional(),
  is_display_home: z.coerce.boolean().optional(),
  q: z.string().optional(),
})

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const raw: any = (req as any).validatedQuery ?? (req as any).query ?? {}
  const limit = raw.limit != null ? Number(raw.limit) : 12
  const offset = raw.offset != null ? Number(raw.offset) : 0
  const order = typeof raw.order === "string" && raw.order.length ? raw.order : "-created_at"
  const type = typeof raw.type === "string" ? raw.type : undefined
  const product_id = typeof raw.product_id === "string" ? raw.product_id : undefined
  const blog_id = typeof raw.blog_id === "string" ? raw.blog_id : undefined
  const is_display_home =
    typeof raw.is_display_home === "boolean"
      ? raw.is_display_home
      : typeof raw.is_display_home === "string"
      ? ["true", "1", "yes"].includes(raw.is_display_home.toLowerCase())
      : undefined
  const q = typeof raw.q === "string" ? raw.q : undefined

  try {
    const service = req.scope.resolve<ReelsModuleService>(REELS_MODULE) as any

    const filters: any = {}
    if (type) filters.type = type
    if (typeof is_display_home !== "undefined") filters.is_display_home = is_display_home
    if (product_id) filters.product_id = product_id
    if (blog_id) filters.blog_id = blog_id
    // Note: free-text q is not supported on service filters; omit to avoid errors

    // Build MedusaService list config
    let orderObj: any | undefined
    if (order && typeof order === "string") {
      const desc = order.startsWith("-")
      const field = desc ? order.slice(1) : order
      if (field) orderObj = { [field]: desc ? "DESC" : "ASC" }
    }
    const config: any = { take: limit, skip: offset }
    if (orderObj) config.order = orderObj

    const result = await (service.listReels ? service.listReels(filters, config) : service.listReelsWithFilters(filters, order))
    let reels = Array.isArray(result) ? result.filter(Boolean) : (result?.data || []).filter(Boolean)
    const meta = Array.isArray(result) ? {} : (result?.metadata || {})

    // Compute accurate total count
    let totalCount: number | undefined = typeof meta.count === "number" ? meta.count : undefined
    if (typeof totalCount !== "number") {
      try {
        if (typeof service.countReels === "function") {
          totalCount = await service.countReels(filters)
        } else if (typeof service.listAndCountReels === "function") {
          const [, cnt] = await service.listAndCountReels(filters, config)
          totalCount = typeof cnt === "number" ? cnt : undefined
        }
      } catch {
        // swallow and fallback below
      }
    }

    // Defensive post-filter to guarantee correctness (normalize strings)
    if (type) {
      const wantType = String(type).trim().toLowerCase()
      reels = reels.filter((r: any) => String(r?.type || "").trim().toLowerCase() === wantType)
    }
    if (typeof is_display_home !== "undefined") {
      const want = Boolean(is_display_home)
      reels = reels.filter((r: any) => Boolean(r?.is_display_home) === want)
    }
    // Compute is_like if authenticated
    const customerId = (req as any)?.auth_context?.actor_id
    const toPlain = (x: any) => (x && typeof x.toJSON === 'function' ? x.toJSON() : { ...(x || {}) })
    const ids = reels.map((r: any) => r.id).filter(Boolean)
    // like_count enrichment
    let countsMap: Map<string, number> | undefined
    try {
      countsMap = await (service as any).getLikeCountsForReels(ids)
    } catch {}

    if (customerId && reels.length) {
      try {
        const likedSet = await (service as any).listLikedReelIdsForCustomer(customerId, ids)
        reels = reels.map((r: any) => ({
          ...toPlain(r),
          is_like: likedSet?.has?.(r.id) || false,
          like_count: countsMap?.get?.(r.id) ?? 0,
        }))
      } catch {
        // ignore like enrichment failures; still ensure fields present
        reels = reels.map((r: any) => ({ ...toPlain(r), is_like: false, like_count: countsMap?.get?.(r.id) ?? 0 }))
      }
    } else {
      reels = reels.map((r: any) => ({ ...toPlain(r), is_like: false, like_count: countsMap?.get?.(r.id) ?? 0 }))
    }

    const count = typeof totalCount === "number" ? totalCount : (typeof meta.count === "number" ? meta.count : reels.length)
    const take = typeof meta.take === "number" ? meta.take : limit
    const skip = typeof meta.skip === "number" ? meta.skip : offset
    res.json({ reels, count, limit: take, offset: skip })
  } catch (e: any) {
    const message = e?.message || "Failed to list reels"
    res.status(500).json({ message })
  }
}
