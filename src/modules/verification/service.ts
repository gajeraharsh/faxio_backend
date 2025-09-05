import { MedusaService } from "@medusajs/framework/utils"
import CustomerEmailVerification from "./models/customer-email-verification"
import CustomerPasswordResetToken from "./models/customer-password-reset-token"

class VerificationService extends MedusaService({
  CustomerEmailVerification,
  CustomerPasswordResetToken,
}) {}

export default VerificationService
