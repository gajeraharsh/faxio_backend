import { defineMiddlewares, authenticate, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework/http"
import { PostStoreReviewSchema } from "./store/reviews/route"
import { GetStoreReviewsSchema } from "./store/products/[id]/reviews/route"
import { GetAdminReviewsSchema } from "./admin/reviews/route"
import { PostAdminFakeReviewSchema } from "./admin/reviews/fake/route"
import { PatchAdminReviewSchema } from "./admin/reviews/[id]/route"

export default defineMiddlewares({
  routes: [
    {
      methods: ["POST"],
      matcher: "/store/reviews",
      middlewares: [
        // authenticate("customer", ["session", "bearer"]),
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
