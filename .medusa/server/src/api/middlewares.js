"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@medusajs/framework/http");
const route_1 = require("./store/reviews/route");
const route_2 = require("./store/products/[id]/reviews/route");
const route_3 = require("./admin/reviews/route");
const route_4 = require("./admin/reviews/fake/route");
const route_5 = require("./admin/reviews/[id]/route");
const route_6 = require("./store/auth/register/route");
const route_7 = require("./store/auth/verify-otp/route");
const utils_1 = require("@medusajs/framework/utils");
const cors_1 = __importDefault(require("cors"));
const route_8 = require("./store/blogs/route");
const route_9 = require("./store/blog-categories/route");
const route_10 = require("./store/newsletter/route");
// Block login if customer's email is not verified
async function verifyEmailBeforeLogin(req, res, next) {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const customerModule = req.scope.resolve(utils_1.Modules.CUSTOMER);
        const [customer] = await customerModule.listCustomers({ email });
        if (!customer) {
            // Let default auth handler decide invalid creds vs not found
            return next();
        }
        // Check verification module for verified record
        const verificationModule = req.scope.resolve("verification");
        const verifiedRecords = await verificationModule.listCustomerEmailVerifications({ email, verified: true }, { take: 1 });
        if (!verifiedRecords?.length) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }
        return next();
    }
    catch (e) {
        return res.status(500).json({ message: "Login check failed" });
    }
}
function corsMiddleware(origin) {
    return (req, res, next) => {
        return (0, cors_1.default)({
            origin,
            credentials: true,
        })(req, res, next);
    };
}
exports.default = (0, http_1.defineMiddlewares)({
    routes: [
        // Blog Storefront Routes
        {
            matcher: "/store/blogs",
            methods: ["GET"],
            middlewares: [
                (0, http_1.validateAndTransformQuery)(route_8.GetStoreBlogsSchema, {
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
                (0, http_1.validateAndTransformQuery)(route_9.GetStoreBlogCategoriesSchema, {
                    isList: true,
                    defaults: ["id", "name", "created_at"],
                }),
            ],
        },
        {
            methods: ["POST"],
            matcher: "/store/newsletter",
            middlewares: [(0, http_1.validateAndTransformBody)(route_10.PostStoreNewsletterSchema)],
        },
        {
            methods: ["POST"],
            matcher: "/store/auth/register",
            middlewares: [(0, http_1.validateAndTransformBody)(route_6.PostStoreRegisterSchema)],
        },
        {
            methods: ["POST"],
            matcher: "/store/auth/verify-otp",
            middlewares: [(0, http_1.validateAndTransformBody)(route_7.PostStoreVerifyOtpSchema)],
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
                (0, http_1.validateAndTransformBody)(route_1.PostStoreReviewSchema),
            ],
        },
        {
            matcher: "/store/products/:id/reviews",
            methods: ["GET"],
            middlewares: [
                (0, http_1.validateAndTransformQuery)(route_2.GetStoreReviewsSchema, {
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
                (0, http_1.validateAndTransformQuery)(route_3.GetAdminReviewsSchema, {
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
                (0, http_1.validateAndTransformBody)(route_4.PostAdminFakeReviewSchema),
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
                (0, http_1.validateAndTransformBody)(route_5.PatchAdminReviewSchema),
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbURBQStIO0FBQy9ILGlEQUE2RDtBQUM3RCwrREFBMkU7QUFDM0UsaURBQTZEO0FBQzdELHNEQUFzRTtBQUN0RSxzREFBbUU7QUFFbkUsdURBQXFFO0FBQ3JFLHlEQUF3RTtBQUN4RSxxREFBbUQ7QUFDbkQsZ0RBQXVCO0FBQ3ZCLCtDQUF5RDtBQUN6RCx5REFBNEU7QUFDNUUscURBQW9FO0FBS3BFLGtEQUFrRDtBQUNsRCxLQUFLLFVBQVUsc0JBQXNCLENBQ25DLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLElBQXdCO0lBRXhCLElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBSSxHQUFXLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUN6QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtRQUMvRCxDQUFDO1FBQ0QsTUFBTSxjQUFjLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQWUsQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNkLDZEQUE2RDtZQUM3RCxPQUFPLElBQUksRUFBRSxDQUFBO1FBQ2YsQ0FBQztRQUNELGdEQUFnRDtRQUNoRCxNQUFNLGtCQUFrQixHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQXFCLENBQUMsQ0FBQTtRQUN4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