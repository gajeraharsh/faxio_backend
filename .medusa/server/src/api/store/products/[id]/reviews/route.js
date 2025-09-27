"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.GetStoreReviewsSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
exports.GetStoreReviewsSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().optional(),
    offset: zod_1.z.coerce.number().optional(),
    order: zod_1.z.string().optional(),
});
const GET = async (req, res) => {
    const productId = req.params.id;
    const { limit = 10, offset = 0 } = req.validatedQuery || {};
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const qc = req.queryConfig || {};
    const args = {
        entity: "review",
        ...qc,
        filters: {
            ...(qc.filters || {}),
            product_id: productId,
            status: "approved",
        },
    };
    const { data: reviews, metadata: { count = 0, take = limit, skip = offset } = {}, } = await query.graph(args);
    res.json({ reviews, count, limit: take, offset: skip });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3RzL1tpZF0vcmV2aWV3cy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBcUU7QUFDckUsNkJBQXVCO0FBSVYsUUFBQSxxQkFBcUIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQzVDLEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNuQyxNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDcEMsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDN0IsQ0FBQyxDQUFBO0FBRUssTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBWSxDQUFBO0lBQ3pDLE1BQU0sRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBSSxHQUFXLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQTtJQUVwRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxpQ0FBaUMsQ0FBQyxLQUFLLENBQVEsQ0FBQTtJQUNoRixNQUFNLEVBQUUsR0FBSSxHQUFXLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQTtJQUV6QyxNQUFNLElBQUksR0FBUTtRQUNoQixNQUFNLEVBQUUsUUFBUTtRQUNoQixHQUFHLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFDckIsVUFBVSxFQUFFLFNBQVM7WUFDckIsTUFBTSxFQUFFLFVBQVU7U0FDbkI7S0FDRixDQUFBO0lBRUQsTUFBTSxFQUNKLElBQUksRUFBRSxPQUFPLEVBQ2IsUUFBUSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQzFELEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDekQsQ0FBQyxDQUFBO0FBdkJZLFFBQUEsR0FBRyxPQXVCZiJ9