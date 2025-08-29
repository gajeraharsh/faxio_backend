import crypto from "crypto"
import { expiryTimestamp } from "./otp"

export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex")
  const token_hash = hashToken(token)
  return { token, token_hash }
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

export function resetExpiry(minutes = 30) {
  return expiryTimestamp(minutes)
}
