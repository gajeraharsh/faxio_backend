import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { REELS_MODULE } from "../modules/reels"

/**
 * Assign a product_id to existing reels (video + image).
 *
 * Usage:
 *   PRODUCT_ID=prod_xxx FORCE=false medusa exec ./src/scripts/assign-reels-product.ts
 * or via package script: npm run seed:reels:assign-product
 *
 * ENV:
 * - PRODUCT_ID: target product id (required unless DEFAULT below is acceptable)
 * - FORCE: if "true", overwrite existing product_id; otherwise only fill missing
 */
export default async function assignReelsProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const reelsService: any = container.resolve(REELS_MODULE as any)

  const DEFAULT_PRODUCT_ID = "prod_01K2J5EQ2S6C7Z4EHQVSX65YT0"
  const PRODUCT_ID = String(process.env.PRODUCT_ID || DEFAULT_PRODUCT_ID)
  const FORCE = String(process.env.FORCE || "false").toLowerCase() === "true"

  if (!PRODUCT_ID) {
    logger.error("PRODUCT_ID is required. Set env PRODUCT_ID or edit the script default.")
    return
  }

  logger.info(`Assigning product_id to reels: product=${PRODUCT_ID} (force=${FORCE})`)

  const PAGE_SIZE = 500
  let offset = 0
  let updated = 0
  let processed = 0

  while (true) {
    // list in pages using MedusaService signature: listReels(filters, config)
    const filters: any = {}
    const config: any = { take: PAGE_SIZE, skip: offset, order: { created_at: "DESC" } }

    let reels: any[] = []
    let count = 0
    try {
      if (typeof reelsService.listAndCountReels === "function") {
        const res = await reelsService.listAndCountReels(filters, config)
        if (Array.isArray(res) && res.length >= 2) {
          reels = Array.isArray(res[0]) ? res[0] : []
          count = typeof res[1] === "number" ? res[1] : 0
        }
      } else {
        const res = await reelsService.listReels(filters, config)
        if (Array.isArray(res)) {
          reels = res
        } else if (res && typeof res === "object") {
          reels = Array.isArray(res.data) ? res.data : []
          count = typeof res.metadata?.count === "number" ? res.metadata.count : 0
        }
      }
    } catch (e) {
      logger.error(`Failed to list reels at offset ${offset}: ${(e as any)?.message || e}`)
      break
    }

    if (!Array.isArray(reels) || reels.length === 0) break

    // prepare updates
    const toPatch: any[] = []
    for (const r of reels) {
      const has = r?.product_id && String(r.product_id).trim().length > 0
      if (FORCE) {
        toPatch.push({ id: r.id, product_id: PRODUCT_ID })
      } else if (!has) {
        toPatch.push({ id: r.id, product_id: PRODUCT_ID })
      }
    }

    if (toPatch.length) {
      await reelsService.updateReels(toPatch)
      updated += toPatch.length
      logger.info(`Updated ${toPatch.length} reels at offset ${offset}`)
    }

    processed += reels.length
    offset += reels.length

    if (count && processed >= count) break
  }

  logger.info(`Done. Processed ${processed} reels, updated ${updated}.`)
}
