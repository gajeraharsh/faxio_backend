"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const reel_1 = __importDefault(require("./models/reel"));
const reel_like_1 = __importDefault(require("./models/reel_like"));
class ReelsModuleService extends (0, utils_1.MedusaService)({
    Reel: reel_1.default,
    ReelLike: reel_like_1.default,
}) {
    async listReelsWithFilters(filters = {}, order = "-created_at") {
        return this.listReels({ filters, order });
    }
    async likeReel(reel_id, customer_id) {
        if (!reel_id || !customer_id)
            throw new Error("Missing reel_id or customer_id");
        // Ensure idempotent like using unique constraint (reel_id, customer_id)
        const existing = await this.listReelLikes({ reel_id, customer_id });
        if (Array.isArray(existing) && existing.length)
            return existing[0];
        return this.createReelLikes({ reel_id, customer_id });
    }
    async unlikeReel(reel_id, customer_id) {
        if (!reel_id || !customer_id)
            throw new Error("Missing reel_id or customer_id");
        const existing = await this.listReelLikes({ reel_id, customer_id });
        if (Array.isArray(existing) && existing.length) {
            await this.deleteReelLikes(existing.map((e) => e.id));
            return true;
        }
        return true;
    }
    async listLikedReelIdsForCustomer(customer_id, reel_ids) {
        if (!customer_id || !Array.isArray(reel_ids) || reel_ids.length === 0)
            return new Set();
        const likes = await this.listReelLikes({ customer_id, reel_id: reel_ids });
        const set = new Set();
        for (const l of likes) {
            if (l?.reel_id)
                set.add(String(l.reel_id));
        }
        return set;
    }
    async getLikeCountsForReels(reel_ids) {
        const map = new Map();
        if (!Array.isArray(reel_ids) || reel_ids.length === 0)
            return map;
        const likes = await this.listReelLikes({ reel_id: reel_ids });
        for (const l of likes) {
            const id = String(l.reel_id);
            map.set(id, (map.get(id) || 0) + 1);
        }
        return map;
    }
}
exports.default = ReelsModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3JlZWxzL3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBeUQ7QUFDekQseURBQWdDO0FBQ2hDLG1FQUF5QztBQUV6QyxNQUFNLGtCQUFtQixTQUFRLElBQUEscUJBQWEsRUFBQztJQUM3QyxJQUFJLEVBQUosY0FBSTtJQUNKLFFBQVEsRUFBUixtQkFBUTtDQUNULENBQUM7SUFDQSxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBZSxFQUFFLEVBQUUsS0FBSyxHQUFHLGFBQWE7UUFDakUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBZSxFQUFFLFdBQW1CO1FBQ2pELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBQy9FLHdFQUF3RTtRQUN4RSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtRQUNuRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU07WUFBRSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFlLEVBQUUsV0FBbUI7UUFDbkQsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVc7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFDL0UsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7UUFDbkUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDMUQsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsS0FBSyxDQUFDLDJCQUEyQixDQUFDLFdBQW1CLEVBQUUsUUFBa0I7UUFDdkUsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ3ZGLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUMxRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFBO1FBQzdCLEtBQUssTUFBTSxDQUFDLElBQUksS0FBYyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLEVBQUUsT0FBTztnQkFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUM1QyxDQUFDO1FBQ0QsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDO0lBRUQsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFFBQWtCO1FBQzVDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU8sR0FBRyxDQUFBO1FBQ2pFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzdELEtBQUssTUFBTSxDQUFDLElBQUksS0FBYyxFQUFFLENBQUM7WUFDL0IsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM1QixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDckMsQ0FBQztRQUNELE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQztDQUNGO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEifQ==