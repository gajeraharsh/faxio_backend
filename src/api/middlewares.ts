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
import { GetStoreBlogsSchema } from "./store/blogs/route"
import { GetStoreBlogCategoriesSchema } from "./store/blog-categories/route"
import path from "path"
import fs from "fs"


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
    // Static file server for uploads: maps /static/* to FILE_UPLOAD_DIR (default 'uploads')
    {
      matcher: "/static/:filePath*",
      methods: ["GET"],
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse) => {
          try {
            const rel = ((req as any).params?.filePath || "").toString()
            // prevent path traversal
            const safeRel = rel.replace(/\\\\/g, "/").replace(/\.{2,}/g, "")
            const uploadDir = process.env.FILE_UPLOAD_DIR || "uploads"
            const uploadDirAbs = path.isAbsolute(uploadDir)
              ? uploadDir
              : path.join(process.cwd(), uploadDir)

            // candidate locations to check (some providers nest inside folders like 'original' or 'static')
            const candidates = [
              path.join(uploadDirAbs, safeRel),
              path.join(uploadDirAbs, "original", safeRel),
              path.join(uploadDirAbs, "static", safeRel),
              path.join(uploadDirAbs, "uploads", safeRel),
            ]

            for (const p of candidates) {
              if (fs.existsSync(p) && fs.statSync(p).isFile()) {
                return res.sendFile(p)
              }
            }
            return res.status(404).json({ message: "File not found" })
          } catch (e) {
            return res.status(500).json({ message: "Failed to serve file" })
          }
        },
      ],
    },
    // Blog Storefront Routes
    {
      matcher: "/store/blogs",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreBlogsSchema, {
          isList: true,
          defaults: [
            "id",
            "category_id",
            "title",
            "image_url",
            "short_description",
            "read_time",
            "created_at",
          ],
        }),
      ],
    },
    {
      matcher: "/store/blogs/:id",
      methods: ["GET"],
      middlewares: [],
    },
    {
      matcher: "/store/blog-categories",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreBlogCategoriesSchema, {
          isList: true,
          defaults: ["id", "name", "created_at"],
        }),
      ],
    },
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
