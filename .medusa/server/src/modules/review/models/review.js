"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
// Product Review model (Medusa v2 model.define API)
const Review = utils_1.model.define("review", {
    id: utils_1.model.id().primaryKey(),
    // Associations (stored as IDs)
    product_id: utils_1.model.text(),
    customer_id: utils_1.model.text().nullable(),
    // Review details
    title: utils_1.model.text().nullable(),
    content: utils_1.model.text(),
    rating: utils_1.model.number(),
    first_name: utils_1.model.text(),
    last_name: utils_1.model.text(),
    // Moderation status
    status: utils_1.model.enum(["pending", "approved", "rejected"]),
});
exports.default = Review;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcmV2aWV3L21vZGVscy9yZXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFFakQsb0RBQW9EO0FBQ3BELE1BQU0sTUFBTSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ3BDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBRTNCLCtCQUErQjtJQUMvQixVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN4QixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUVwQyxpQkFBaUI7SUFDakIsS0FBSyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDOUIsT0FBTyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDckIsTUFBTSxFQUFFLGFBQUssQ0FBQyxNQUFNLEVBQUU7SUFDdEIsVUFBVSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDeEIsU0FBUyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFFdkIsb0JBQW9CO0lBQ3BCLE1BQU0sRUFBRSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUN4RCxDQUFDLENBQUE7QUFFRixrQkFBZSxNQUFNLENBQUEifQ==