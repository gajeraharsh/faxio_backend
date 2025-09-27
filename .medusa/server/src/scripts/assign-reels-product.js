"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = assignReelsProduct;
const utils_1 = require("@medusajs/framework/utils");
const reels_1 = require("../modules/reels");
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
async function assignReelsProduct({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const reelsService = container.resolve(reels_1.REELS_MODULE);
    const DEFAULT_PRODUCT_ID = "prod_01K2J5EQ2S6C7Z4EHQVSX65YT0";
    const PRODUCT_ID = String(process.env.PRODUCT_ID || DEFAULT_PRODUCT_ID);
    const FORCE = String(process.env.FORCE || "false").toLowerCase() === "true";
    if (!PRODUCT_ID) {
        logger.error("PRODUCT_ID is required. Set env PRODUCT_ID or edit the script default.");
        return;
    }
    logger.info(`Assigning product_id to reels: product=${PRODUCT_ID} (force=${FORCE})`);
    const PAGE_SIZE = 500;
    let offset = 0;
    let updated = 0;
    let processed = 0;
    while (true) {
        // list in pages using MedusaService signature: listReels(filters, config)
        const filters = {};
        const config = { take: PAGE_SIZE, skip: offset, order: { created_at: "DESC" } };
        let reels = [];
        let count = 0;
        try {
            if (typeof reelsService.listAndCountReels === "function") {
                const res = await reelsService.listAndCountReels(filters, config);
                if (Array.isArray(res) && res.length >= 2) {
                    reels = Array.isArray(res[0]) ? res[0] : [];
                    count = typeof res[1] === "number" ? res[1] : 0;
                }
            }
            else {
                const res = await reelsService.listReels(filters, config);
                if (Array.isArray(res)) {
                    reels = res;
                }
                else if (res && typeof res === "object") {
                    reels = Array.isArray(res.data) ? res.data : [];
                    count = typeof res.metadata?.count === "number" ? res.metadata.count : 0;
                }
            }
        }
        catch (e) {
            logger.error(`Failed to list reels at offset ${offset}: ${e?.message || e}`);
            break;
        }
        if (!Array.isArray(reels) || reels.length === 0)
            break;
        // prepare updates
        const toPatch = [];
        for (const r of reels) {
            const has = r?.product_id && String(r.product_id).trim().length > 0;
            if (FORCE) {
                toPatch.push({ id: r.id, product_id: PRODUCT_ID });
            }
            else if (!has) {
                toPatch.push({ id: r.id, product_id: PRODUCT_ID });
            }
        }
        if (toPatch.length) {
            await reelsService.updateReels(toPatch);
            updated += toPatch.length;
            logger.info(`Updated ${toPatch.length} reels at offset ${offset}`);
        }
        processed += reels.length;
        offset += reels.length;
        if (count && processed >= count)
            break;
    }
    logger.info(`Done. Processed ${processed} reels, updated ${updated}.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzaWduLXJlZWxzLXByb2R1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9hc3NpZ24tcmVlbHMtcHJvZHVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWVBLHFDQTBFQztBQXhGRCxxREFBcUU7QUFDckUsNENBQStDO0FBRS9DOzs7Ozs7Ozs7O0dBVUc7QUFDWSxLQUFLLFVBQVUsa0JBQWtCLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDdEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLFlBQVksR0FBUSxTQUFTLENBQUMsT0FBTyxDQUFDLG9CQUFtQixDQUFDLENBQUE7SUFFaEUsTUFBTSxrQkFBa0IsR0FBRyxpQ0FBaUMsQ0FBQTtJQUM1RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksa0JBQWtCLENBQUMsQ0FBQTtJQUN2RSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxDQUFBO0lBRTNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUE7UUFDdEYsT0FBTTtJQUNSLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxVQUFVLFdBQVcsS0FBSyxHQUFHLENBQUMsQ0FBQTtJQUVwRixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUE7SUFDckIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBQ2QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0lBRWpCLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDWiww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