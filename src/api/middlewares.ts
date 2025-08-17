import { defineMiddlewares, authenticate, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework/http"
import { PostStoreReviewSchema } from "./store/reviews/route"
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route"
import { GetAdminReviewsSchema } from "./admin/reviews/route"
import { PostAdminFakeReviewSchema } from "./admin/reviews/fake/route"
import { PatchAdminReviewSchema } from "./admin/reviews/[id]/route"
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { PostStoreRegisterSchema } from "./store/auth/register/route"
import { PostStoreVerifyOtpSchema } from "./store/auth/verify-otp/route"
import { Modules } from "@medusajs/framework/utils"
import cors from "cors"


// Block login if customer's email is not verified
async function verifyEmailBeforeLogin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const { email } = (req as any).body || {}
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }
    const customerModule: any = req.scope.resolve(Modules.CUSTOMER as any)
    const [customer] = await customerModule.listCustomers({ email })
    if (!customer) {
      // Let default auth handler decide invalid creds vs not found
      return next()
    }
    // Check verification module for verified record
    const verificationModule: any = req.scope.resolve("verification" as any)
    const verifiedRecords = await verificationModule.listCustomerEmailVerifications(
      { email, verified: true },
      { take: 1 }
    )
    if (!verifiedRecords?.length) {
      return res.status(403).json({ message: "Please verify your email before logging in" })
    }
    return next()
  } catch (e) {
    return res.status(500).json({ message: "Login check failed" })
  }
}

function corsMiddleware(origin: string) {
  return (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
    return cors({
      origin,
      credentials: true,
    })(req, res, next)
  }
}


export default defineMiddlewares({
  routes: [
    {
      methods: ["POST"],
      matcher: "/store/auth/register",
      middlewares: [validateAndTransformBody(PostStoreRegisterSchema)],
    },
    {
      methods: ["POST"],
      matcher: "/store/auth/verify-otp",
      middlewares: [validateAndTransformBody(PostStoreVerifyOtpSchema)],
    },
    {
      methods: ["POST"],
      matcher: "/store/auth/customer/:auth_provider",
      middlewares: [verifyEmailBeforeLogin],
    },
    {
      methods: ["POST"],
      matcher: "/store/reviews",
      middlewares: [
        validateAndTransformBody(PostStoreReviewSchema),
  
      ],
    },
    {
      matcher: "/store/products/:id/reviews",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "rating",
            "title",
            "first_name",
            "last_name",
            "content",
            "created_at",
          ],
        }),
      ],
    },
    {
      matcher: "/admin/reviews",
      methods: ["GET"],
      middlewares: [
        // authenticate("admin", ["session", "bearer"]),
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "first_name",
            "last_name",
            "status",
            "created_at",
            "updated_at",
          ],
        }),
      ],
    },
    {
      matcher: "/admin/reviews/fake",
      methods: ["POST"],
      middlewares: [
        // authenticate("admin", ["session", "bearer"]),
        validateAndTransformBody(PostAdminFakeReviewSchema),
      ],
    },
    {
      matcher: "/admin/reviews/:id/approve",
      methods: ["POST"],
      // middlewares: [authenticate("admin", ["session", "bearer"])],
    },
    {
      matcher: "/admin/reviews/:id/reject",
      methods: ["POST"],
      // middlewares: [authenticate("admin", ["session", "bearer"])],
    },
    {
      matcher: "/admin/reviews/:id",
      methods: ["PATCH"],
      middlewares: [
        // authenticate("admin", ["session", "bearer"]),
        validateAndTransformBody(PatchAdminReviewSchema),
      ],
    },
  ],  
})
