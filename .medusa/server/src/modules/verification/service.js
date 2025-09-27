"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const customer_email_verification_1 = __importDefault(require("./models/customer-email-verification"));
const customer_password_reset_token_1 = __importDefault(require("./models/customer-password-reset-token"));
class VerificationService extends (0, utils_1.MedusaService)({
    CustomerEmailVerification: customer_email_verification_1.default,
    CustomerPasswordResetToken: customer_password_reset_token_1.default,
}) {
}
exports.default = VerificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3ZlcmlmaWNhdGlvbi9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscURBQXlEO0FBQ3pELHVHQUE0RTtBQUM1RSwyR0FBK0U7QUFFL0UsTUFBTSxtQkFBb0IsU0FBUSxJQUFBLHFCQUFhLEVBQUM7SUFDOUMseUJBQXlCLEVBQXpCLHFDQUF5QjtJQUN6QiwwQkFBMEIsRUFBMUIsdUNBQTBCO0NBQzNCLENBQUM7Q0FBRztBQUVMLGtCQUFlLG1CQUFtQixDQUFBIn0=