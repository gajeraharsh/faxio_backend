import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { createCustomerAccountWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { generateOtp, expiryTimestamp } from "../../../../utils/otp"
import { sendOtpEmail } from "../../../../utils/email"

export const PostStoreRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

type PostStoreRegisterReq = z.infer<typeof PostStoreRegisterSchema>

export const POST = async (
  req: MedusaRequest<PostStoreRegisterReq>,
  res: MedusaResponse
) => {
  try {
    const body = (req as any).validatedBody || (req.body as PostStoreRegisterReq)
    const { email, password, first_name, last_name } = body

    // 1) Register auth identity (email + password) using Auth module
    const authModule: any = req.scope.resolve(Modules.AUTH as any)
    const identity = await authModule.register("emailpass", {
      url: req.url,
      headers: req.headers,
      query: req.query as any,
      body: {
        email,
        password,
        first_name,
        last_name,
      },
      protocol: (req as any).protocol,
    } as any)

    console.log(identity, "identity")

    if (!identity || identity.success === false || !identity.authIdentity?.id) {
      return res.status(400).json({
        success: false,
        message: identity?.error || "Failed to create auth identity",
      })
    }

    const authIdentityId = identity.authIdentity.id

    // 2) Create customer and attach to auth identity via workflow
    await createCustomerAccountWorkflow(req.scope).run({
      input: {
        authIdentityId,
        customerData: { email, first_name, last_name },
      },
    })

    // 3) Generate OTP and save to verification table
    const otp = generateOtp(6)
    const expires_at = expiryTimestamp(10)

    const customerModule: any = req.scope.resolve(Modules.CUSTOMER as any)
    const [customer] = await customerModule.listCustomers({ email })

    if (!customer) {
      return res.status(500).json({
        success: false,
        message: "Customer creation failed",
      })
    }

    const verificationModule: any = req.scope.resolve("verification" as any)
    await verificationModule.createCustomerEmailVerifications([
      {
        customer_id: customer.id,
        email,
        code: otp,
        expires_at,
        verified: false,
      },
    ])

    // 4) Send email with OTP
    await sendOtpEmail(email, otp)

    return res.json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
    })
  } catch (err: any) {
    console.error("Registration error:", err)
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error during registration",
    })
  }
}
