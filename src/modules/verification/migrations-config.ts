import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import CustomerEmailVerification from "./models/customer-email-verification"
import { VERIFICATION_MODULE } from "."

export default defineMikroOrmCliConfig(VERIFICATION_MODULE, {
  entities: [CustomerEmailVerification] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
