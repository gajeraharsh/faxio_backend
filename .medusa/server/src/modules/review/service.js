"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const review_1 = __importDefault(require("./models/review"));
class ReviewModuleService extends (0, utils_1.MedusaService)({
    Review: review_1.default,
}) {
    // Convenience helpers (optional)
    async listApprovedByProduct(productId) {
        return this.listReviews({
            filters: { product_id: productId, status: "approved" },
            order: "-created_at",
        });
    }
    async createPending(input) {
        return this.createReviews({
            ...input,
            status: "pending",
        });
    }
}
exports.default = ReviewModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Jldmlldy9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscURBQXlEO0FBQ3pELDZEQUFvQztBQUVwQyxNQUFNLG1CQUFvQixTQUFRLElBQUEscUJBQWEsRUFBQztJQUM5QyxNQUFNLEVBQU4sZ0JBQU07Q0FDUCxDQUFDO0lBQ0EsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxTQUFpQjtRQUMzQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdEIsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQ3RELEtBQUssRUFBRSxhQUFhO1NBQ3JCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLEtBUW5CO1FBQ0MsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ3hCLEdBQUcsS0FBSztZQUNSLE1BQU0sRUFBRSxTQUFTO1NBQ1gsQ0FBQyxDQUFBO0lBQ1gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsbUJBQW1CLENBQUEifQ==