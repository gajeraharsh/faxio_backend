"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
// Product Review model
// Follows Medusa v2 model.define API
// Includes basic fields used throughout the tutorial and typical review workflows
const Review = utils_1.model.define("review", {
    id: utils_1.model.id().primaryKey(),
    // Associations (stored as IDs for simplicity)
    product_id: utils_1.model.text(),
    customer_id: utils_1.model.text().nullable(),
    // Review details
    title: utils_1.model.text().nullable(),
    content: utils_1.model.text(),
    rating: utils_1.model.number(), // expected 1..5; enforced in route schema/middlewares
    first_name: utils_1.model.text(),
    last_name: utils_1.model.text(),
    // Moderation status
    status: utils_1.model.enum(["pending", "approved", "rejected"]),
});
exports.default = Review;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcmV2aWV3L2VudGl0aWVzL3Jldmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFpRDtBQUVqRCx1QkFBdUI7QUFDdkIscUNBQXFDO0FBQ3JDLGtGQUFrRjtBQUNsRixNQUFNLE1BQU0sR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUUzQiw4Q0FBOEM7SUFDOUMsVUFBVSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDeEIsV0FBVyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFFcEMsaUJBQWlCO0lBQ2pCLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzlCLE9BQU8sRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3JCLE1BQU0sRUFBRSxhQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsc0RBQXNEO0lBQzlFLFVBQVUsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3hCLFNBQVMsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBRXZCLG9CQUFvQjtJQUNwQixNQUFNLEVBQUUsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7Q0FDeEQsQ0FBQyxDQUFBO0FBRUYsa0JBQWUsTUFBTSxDQUFBIn0=