"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostAdminFakeReviewSchema = void 0;
const zod_1 = require("zod");
const review_1 = require("../../../../modules/review");
exports.PostAdminFakeReviewSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    content: zod_1.z.string(),
    title: zod_1.z.string().optional().nullable(),
    rating: zod_1.z.preprocess((val) => {
        if (val && typeof val === "string") {
            return parseInt(val);
        }
        return val;
    }, zod_1.z.number().min(1).max(5)),
    status: zod_1.z.enum(["pending", "approved", "rejected"]).optional().default("approved"),
    customer_id: zod_1.z.string().optional().nullable(),
});
const POST = async (req, res) => {
    const input = req.validatedBody || req.body;
    const reviewService = req.scope.resolve(review_1.REVIEW_MODULE);
    const review = await reviewService.createReviews({
        product_id: input.product_id,
        customer_id: input.customer_id ?? null,
        title: input.title ?? null,
        content: input.content,
        rating: input.rating,
        first_name: input.first_name,
        last_name: input.last_name,
        status: input.status ?? "approved",
    });
    res.json({ review });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3MvZmFrZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBdUI7QUFDdkIsdURBQTBEO0FBRzdDLFFBQUEseUJBQXlCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNoRCxVQUFVLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUN0QixVQUFVLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUN0QixTQUFTLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNyQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNuQixLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUN2QyxNQUFNLEVBQUUsT0FBQyxDQUFDLFVBQVUsQ0FDbEIsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNOLElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ25DLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3RCLENBQUM7UUFDRCxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUMsRUFDRCxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDekI7SUFDRCxNQUFNLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ2xGLFdBQVcsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQzlDLENBQUMsQ0FBQTtBQUlLLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBdUQsRUFDdkQsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxhQUFhLElBQUssR0FBRyxDQUFDLElBQStCLENBQUE7SUFFdkUsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQXNCLHNCQUFhLENBQUMsQ0FBQTtJQUUzRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxhQUFhLENBQUM7UUFDL0MsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1FBQzVCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUk7UUFDdEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSTtRQUMxQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDdEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1FBQ3BCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtRQUM1QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7UUFDMUIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLElBQUksVUFBVTtLQUM1QixDQUFDLENBQUE7SUFFVCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUN0QixDQUFDLENBQUE7QUFwQlksUUFBQSxJQUFJLFFBb0JoQiJ9