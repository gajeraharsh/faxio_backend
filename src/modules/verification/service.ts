import { MedusaService } from "@medusajs/framework/utils"
import CustomerEmailVerification from "./models/customer-email-verification"

class VerificationService extends MedusaService({
  CustomerEmailVerification,
}) {}

export default VerificationService
