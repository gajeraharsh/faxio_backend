"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const contact_1 = __importDefault(require("./models/contact"));
class ContactModuleService extends (0, utils_1.MedusaService)({
    Contact: contact_1.default,
}) {
    async submit(input) {
        return this.createContacts({
            name: input.name,
            email: input.email.toLowerCase(),
            phone: input.phone || null,
            subject: input.subject,
            message: input.message,
            status: "new",
        });
    }
}
exports.default = ContactModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbnRhY3Qvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUF5RDtBQUN6RCwrREFBc0M7QUFFdEMsTUFBTSxvQkFBcUIsU0FBUSxJQUFBLHFCQUFhLEVBQUM7SUFDL0MsT0FBTyxFQUFQLGlCQUFPO0NBQ1IsQ0FBQztJQUNBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FNWjtRQUNDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUN6QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ2hDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUk7WUFDMUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixNQUFNLEVBQUUsS0FBSztTQUNQLENBQUMsQ0FBQTtJQUNYLENBQUM7Q0FDRjtBQUVELGtCQUFlLG9CQUFvQixDQUFBIn0=