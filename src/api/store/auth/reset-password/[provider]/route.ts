import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { z } from "zod"
import { hashToken } from "../../../../../utils/password-reset"
import { isExpired } from "../../../../../utils/otp"

export const PostStoreResetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6),
})

type PostStoreResetPasswordReq = z.infer<typeof PostStoreResetPasswordSchema>

export const POST = async (
  req: MedusaRequest<PostStoreResetPasswordReq>,
  res: MedusaResponse
) => {
  const { provider } = req.params as any
  const body = (req as any).validatedBody || (req.body as PostStoreResetPasswordReq)
  const { token, password } = body

  // Validate provider
  const authProvider = provider || "emailpass"

  try {
    const token_hash = hashToken(token)

    const verificationModule: any = req.scope.resolve("verification" as any)

    const [record] = await verificationModule.listCustomerPasswordResetTokens({ token_hash }, { order: { created_at: "DESC" } })

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or already used token" })
    }

    if (record.used_at) {
      return res.status(400).json({ success: false, message: "Token already used" })
    }

    if (isExpired(record.expires_at)) {
      // mark used to prevent reuse
      await verificationModule.updateCustomerPasswordResetTokens([{ id: record.id, used_at: new Date() }])
      return res.status(400).json({ success: false, message: "Token expired" })
    }

    const email = record.email
    if (!email) {
      return res.status(400).json({ success: false, message: "Token not linked to an email" })
    }

    // Update password via Auth module
    const authModule: any = req.scope.resolve(Modules.AUTH as any)
    const result = await authModule.updateProvider(authProvider, {
      entity_id: email,
      password,
    })

    if (!result?.success) {
      return res.status(400).json({ success: false, message: result?.error || "Failed to reset password" })
    }

    // Mark token used
    await verificationModule.updateCustomerPasswordResetTokens([{ id: record.id, used_at: new Date() }])

    return res.json({ success: true, message: "Password has been reset successfully" })
  } catch (err: any) {
    console.error("Reset password error:", err)
    return res.status(500).json({ success: false, message: err.message || "Internal server error" })
  }
}
