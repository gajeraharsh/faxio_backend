import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { Modules } from "@medusajs/framework/utils"
import { isExpired } from "../../../../utils/otp"

export const PostStoreVerifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(10),
})

type PostStoreVerifyOtpReq = z.infer<typeof PostStoreVerifyOtpSchema>

export const POST = async (
  req: MedusaRequest<PostStoreVerifyOtpReq>,
  res: MedusaResponse
) => {
  const body = (req as any).validatedBody || (req.body as PostStoreVerifyOtpReq)
  const { email, code } = body

  const customerModule: any = req.scope.resolve(Modules.CUSTOMER as any)
  const [customer] = await customerModule.listCustomers({ email })
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found" })
  }

  const verificationModule: any = req.scope.resolve("verification" as any)
  // Get latest unverified record for this email
  const verifications = await verificationModule.listCustomerEmailVerifications({
    email,
    verified: false,
  })

  const verification = (verifications || [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    [0]
  if (!verification) {
    return res.status(400).json({ success: false, message: "No OTP pending. Please register again." })
  }

  if (isExpired(verification.expires_at)) {
    return res.status(400).json({ success: false, message: "OTP expired. Please register again." })
  }

  if (String(verification.code) !== String(code)) {
    return res.status(400).json({ success: false, message: "Invalid OTP code" })
  }

  await verificationModule.updateCustomerEmailVerifications([
    {
      id: verification.id,
      verified: true,
      verified_at: new Date(),
      consumed_at: new Date(),
    },
  ])

  return res.json({ success: true, message: "Email verified successfully" })
}
