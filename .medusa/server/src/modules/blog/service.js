"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const blog_1 = __importDefault(require("./models/blog"));
const blog_category_1 = __importDefault(require("./models/blog-category"));
class BlogModuleService extends (0, utils_1.MedusaService)({
    Blog: blog_1.default,
    BlogCategory: blog_category_1.default,
}) {
    // Helpers
    async listBlogsWithFilters(filters = {}, order = "-created_at") {
        return this.listBlogs({ filters, order });
    }
}
exports.default = BlogModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUF5RDtBQUN6RCx5REFBZ0M7QUFDaEMsMkVBQWlEO0FBRWpELE1BQU0saUJBQWtCLFNBQVEsSUFBQSxxQkFBYSxFQUFDO0lBQzVDLElBQUksRUFBSixjQUFJO0lBQ0osWUFBWSxFQUFaLHVCQUFZO0NBQ2IsQ0FBQztJQUNBLFVBQVU7SUFDVixLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBZSxFQUFFLEVBQUUsS0FBSyxHQUFHLGFBQWE7UUFDakUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDM0MsQ0FBQztDQUNGO0FBRUQsa0JBQWUsaUJBQWlCLENBQUEifQ==