import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { z } from "zod"

export const PostStoreChangePasswordSchema = z.object({
  current_password: z.string().min(6, "Current password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
  confirm_password: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
})

export type PostStoreChangePasswordReq = z.infer<typeof PostStoreChangePasswordSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreChangePasswordReq>,
  res: MedusaResponse
) => {
  try {
    const body = ((req as any).validatedBody || (req.body as PostStoreChangePasswordReq)) as PostStoreChangePasswordReq
    const { current_password, new_password } = body

    const customerId = req.auth_context.actor_id

    // Fetch customer to get email for the auth identity
    const customerModule: any = req.scope.resolve(Modules.CUSTOMER as any)
    const customer = await customerModule.retrieveCustomer(customerId)

    if (!customer?.email) {
      return res.status(400).json({ success: false, message: "Customer email not found" })
    }

    const email = customer.email

    // Verify current password by authenticating with provider
    const authModule: any = req.scope.resolve(Modules.AUTH as any)

    const authResult = await authModule.authenticate("emailpass", {
      url: req.url,
      headers: req.headers,
      query: req.query as any,
      body: {
        email,
        password: current_password,
      },
      protocol: (req as any).protocol,
    } as any)

    if (!authResult || authResult.success === false) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" })
    }

    // Update password with provider
    const updateResult = await authModule.updateProvider("emailpass", {
      entity_id: email,
      password: new_password,
    })

    if (!updateResult?.success) {
      return res.status(400).json({ success: false, message: updateResult?.error || "Failed to change password" })
    }

    return res.json({ success: true, message: "Password updated successfully" })
  } catch (err: any) {
    console.error("Change password error:", err)
    return res.status(500).json({ success: false, message: err.message || "Internal server error" })
  }
}
