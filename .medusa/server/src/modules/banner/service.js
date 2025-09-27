"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const banner_1 = __importDefault(require("./models/banner"));
class BannerModuleService extends (0, utils_1.MedusaService)({
    Banner: banner_1.default,
}) {
    async listSorted(limit = 100) {
        return this.listBanners({
            order: ["position", "-created_at"],
            take: limit,
        });
    }
}
exports.default = BannerModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jhbm5lci9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscURBQXlEO0FBQ3pELDZEQUFvQztBQUVwQyxNQUFNLG1CQUFvQixTQUFRLElBQUEscUJBQWEsRUFBQztJQUM5QyxNQUFNLEVBQU4sZ0JBQU07Q0FDUCxDQUFDO0lBQ0EsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRztRQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdEIsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztZQUNsQyxJQUFJLEVBQUUsS0FBSztTQUNMLENBQUMsQ0FBQTtJQUNYLENBQUM7Q0FDRjtBQUVELGtCQUFlLG1CQUFtQixDQUFBIn0=