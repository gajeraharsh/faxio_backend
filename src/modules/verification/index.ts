import { Module } from "@medusajs/framework/utils"
import VerificationService from "./service"

export const VERIFICATION_MODULE = "verification"

export default Module(VERIFICATION_MODULE, {
  service: VerificationService,
})
