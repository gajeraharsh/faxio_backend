"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const newsletter_1 = __importDefault(require("./models/newsletter"));
class NewsletterModuleService extends (0, utils_1.MedusaService)({
    Newsletter: newsletter_1.default,
}) {
    async subscribe(email, customer_id) {
        const existing = await this.listNewsletters({ email: email.toLowerCase() }, { take: 1 });
        if (existing?.length)
            return existing[0];
        return this.createNewsletters({
            email: email.toLowerCase(),
            customer_id: customer_id || null,
        });
    }
}
exports.default = NewsletterModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL25ld3NsZXR0ZXIvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUF5RDtBQUN6RCxxRUFBNEM7QUFFNUMsTUFBTSx1QkFBd0IsU0FBUSxJQUFBLHFCQUFhLEVBQUM7SUFDbEQsVUFBVSxFQUFWLG9CQUFVO0NBQ1gsQ0FBQztJQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBYSxFQUFFLFdBQTJCO1FBQ3hELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FDekMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQzlCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUNaLENBQUE7UUFDRCxJQUFJLFFBQVEsRUFBRSxNQUFNO1lBQUUsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFeEMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDMUIsV0FBVyxFQUFFLFdBQVcsSUFBSSxJQUFJO1NBQzFCLENBQUMsQ0FBQTtJQUNYLENBQUM7Q0FDRjtBQUVELGtCQUFlLHVCQUF1QixDQUFBIn0=