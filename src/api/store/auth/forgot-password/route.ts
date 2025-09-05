import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { z } from "zod"
import { generateResetToken, resetExpiry } from "../../../../utils/password-reset"
import { sendResetPasswordEmail } from "../../../../utils/email"
import { isExpired } from "../../../../utils/otp"

export const PostStoreForgotPasswordSchema = z.object({
  email: z.string().email(),
})

type PostStoreForgotPasswordReq = z.infer<typeof PostStoreForgotPasswordSchema>

export const POST = async (
  req: MedusaRequest<PostStoreForgotPasswordReq>,
  res: MedusaResponse
) => {
  const body = (req as any).validatedBody || (req.body as PostStoreForgotPasswordReq)
  const { email } = body

  // Always 200 to prevent email enumeration
  try {
    // Find customer if exists
    const customerModule: any = req.scope.resolve(Modules.CUSTOMER as any)
    const [customer] = await customerModule.listCustomers({ email })

    // Generate token
    const { token, token_hash } = generateResetToken()
    const expires_at = resetExpiry(30)

    // Store token in verification module table
    const verificationModule: any = req.scope.resolve("verification" as any)

    // Optional: clean up previous tokens for this email by marking used
    const existing = await verificationModule.listCustomerPasswordResetTokens({ email, used_at: null })
    if (existing?.length) {
      await verificationModule.updateCustomerPasswordResetTokens(
        existing.map((e: any) => ({ id: e.id, used_at: new Date() }))
      )
    }

    await verificationModule.createCustomerPasswordResetTokens([
      {
        customer_id: customer?.id || null,
        email,
        token_hash,
        expires_at,
      },
    ])

    // Build reset link to frontend
    const base = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const link = `${base.replace(/\/$/, "")}/auth/reset-password?token=${token}`

    await sendResetPasswordEmail(email, link)
  } catch (e) {
    // swallow errors to avoid enumeration
  }

  return res.json({ success: true, message: "If an account exists, a reset email has been sent." })
}
