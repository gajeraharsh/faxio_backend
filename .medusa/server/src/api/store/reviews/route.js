"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreReviewSchema = void 0;
const zod_1 = require("zod");
const review_1 = require("../../../modules/review");
exports.PostStoreReviewSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string(),
    rating: zod_1.z.preprocess((val) => {
        if (val && typeof val === "string") {
            return parseInt(val);
        }
        return val;
    }, zod_1.z.number().min(1).max(5)),
    product_id: zod_1.z.string(),
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
});
const POST = async (req, res) => {
    const input = req.validatedBody || req.body;
    const reviewService = req.scope.resolve(review_1.REVIEW_MODULE);
    const review = await reviewService.createPending({
        ...input,
        customer_id: req.auth_context?.actor_id ?? null,
    });
    res.json({ review });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkJBQXVCO0FBQ3ZCLG9EQUF1RDtBQUcxQyxRQUFBLHFCQUFxQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDNUMsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDNUIsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDbkIsTUFBTSxFQUFFLE9BQUMsQ0FBQyxVQUFVLENBQ2xCLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDTixJQUFJLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN0QixDQUFDO1FBQ0QsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDLEVBQ0QsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQ3pCO0lBQ0QsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7Q0FDdEIsQ0FBQyxDQUFBO0FBSUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUFtRCxFQUNuRCxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGFBQWEsSUFBSyxHQUFHLENBQUMsSUFBMkIsQ0FBQTtJQUVuRSxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBc0Isc0JBQWEsQ0FBQyxDQUFBO0lBRTNFLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLGFBQWEsQ0FBQztRQUMvQyxHQUFHLEtBQUs7UUFDUixXQUFXLEVBQUcsR0FBRyxDQUFDLFlBQW9CLEVBQUUsUUFBUSxJQUFJLElBQUk7S0FDekQsQ0FBQyxDQUFBO0lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDdEIsQ0FBQyxDQUFBO0FBZFksUUFBQSxJQUFJLFFBY2hCIn0=