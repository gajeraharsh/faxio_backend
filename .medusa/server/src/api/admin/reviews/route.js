"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.GetAdminReviewsSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
exports.GetAdminReviewsSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().optional(),
    offset: zod_1.z.coerce.number().optional(),
    order: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "approved", "rejected"]).optional(),
});
const GET = async (req, res) => {
    const { limit = 15, offset = 0, order = "-created_at", status } = req.validatedQuery || {};
    // Use Query API to avoid requiring a request-scoped MikroORM manager
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const qc = req.queryConfig || {};
    const args = {
        entity: "review",
        ...qc,
    };
    if (status) {
        args.filters = { ...(qc.filters || {}), status };
    }
    const { data: reviews, metadata: { count = 0, take = limit, skip = offset } = {}, } = await query.graph(args);
    res.json({ reviews, count, limit: take, offset: skip });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXFFO0FBQ3JFLDZCQUF1QjtBQUVWLFFBQUEscUJBQXFCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1QyxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDbkMsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3BDLEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzVCLE1BQU0sRUFBRSxPQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtDQUMvRCxDQUFDLENBQUE7QUFFSyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsYUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFJLEdBQVcsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFBO0lBRW5HLHFFQUFxRTtJQUNyRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxpQ0FBaUMsQ0FBQyxLQUFLLENBQVEsQ0FBQTtJQUNoRixNQUFNLEVBQUUsR0FBSSxHQUFXLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQTtJQUV6QyxNQUFNLElBQUksR0FBUTtRQUNoQixNQUFNLEVBQUUsUUFBUTtRQUNoQixHQUFHLEVBQUU7S0FDTixDQUFBO0lBQ0QsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQTtJQUNsRCxDQUFDO0lBRUQsTUFBTSxFQUNKLElBQUksRUFBRSxPQUFPLEVBQ2IsUUFBUSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQzFELEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDekQsQ0FBQyxDQUFBO0FBckJZLFFBQUEsR0FBRyxPQXFCZiJ9