"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        // cookieOptions:{
        //   secure: true,
        //   httpOnly: true,
        //   sameSite: "none",
        // },
        databaseDriverOptions: {
            connection: {
                ssl: {
                    rejectUnauthorized: false,
                }
            }
        },
        http: {
            // Ensure CORS for all surfaces during local dev
            storeCors: process.env.STORE_CORS || "http://localhost:3000",
            adminCors: process.env.ADMIN_CORS || "http://localhost:3000",
            authCors: process.env.AUTH_CORS || "http://localhost:3000",
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        }
    },
    modules: [
        // File module (uploads): configurable provider via env
        // Defaults to local storage; switch to S3 by setting FILE_PROVIDER=s3 and the S3 envs.
        {
            resolve: "@medusajs/medusa/file",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/file-s3",
                        id: "s3",
                        options: {
                            file_url: process.env.S3_URL,
                            access_key_id: process.env.S3_ACCESS_KEY_ID,
                            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                            region: process.env.S3_REGION,
                            bucket: process.env.S3_BUCKET,
                            endpoint: "https://s3.ap-south-1.amazonaws.com",
                            prefix: process.env.S3_PREFIX
                        },
                    },
                ],
            },
        },
        {
            resolve: "./src/modules/review",
        },
        {
            resolve: "./src/modules/blog",
        },
        {
            resolve: "./src/modules/reels",
        },
        {
            resolve: "./src/modules/wishlist",
        },
        {
            resolve: "./src/modules/newsletter",
        },
        {
            resolve: "./src/modules/contact",
        },
        {
            resolve: "./src/modules/banner",
        },
        {
            resolve: "./src/modules/verification",
        },
        {
            resolve: "@medusajs/auth",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/auth-emailpass", // Path to your custom module
                        id: "emailpass",
                    },
                ],
            },
        },
        {
            resolve: "@medusajs/medusa/payment",
            options: {
                providers: [
                    {
                        resolve: "./src/modules/cod",
                        id: "cod",
                        options: {
                            display_name: "Cash on Delivery",
                        },
                    },
                    {
                        resolve: "./src/modules/razorpay",
                        id: "razorpay",
                        options: {
                            key_id: process.env.RAZORPAY_KEY_ID,
                            key_secret: process.env.RAZORPAY_KEY_SECRET,
                            webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
                            auto_capture: true,
                            display_name: "Razorpay",
                        },
                    },
                ],
            },
        },
    ],
    plugins: [
        {
            resolve: 'medusa-variant-images',
            options: {},
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBMEU7QUFFMUUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQzVCLGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFDckMsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQixvQkFBb0I7UUFDcEIsc0JBQXNCO1FBQ3RCLEtBQUs7UUFDTCxxQkFBcUIsRUFBQztZQUNwQixVQUFVLEVBQUM7Z0JBQ1QsR0FBRyxFQUFDO29CQUNGLGtCQUFrQixFQUFDLEtBQUs7aUJBQ3pCO2FBQ0Y7U0FDRjtRQUNELElBQUksRUFBRTtZQUNKLGdEQUFnRDtZQUNoRCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksdUJBQXVCO1lBQzVELFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSx1QkFBdUI7WUFDNUQsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLHVCQUF1QjtZQUMxRCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksYUFBYTtZQUNsRCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksYUFBYTtTQUN6RDtLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsdURBQXVEO1FBQ3ZELHVGQUF1RjtRQUN2RjtZQUNFLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDSDt3QkFDRSxPQUFPLEVBQUUsbUJBQW1CO3dCQUM1QixFQUFFLEVBQUUsSUFBSTt3QkFDUixPQUFPLEVBQUU7NEJBQ1AsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTTs0QkFDNUIsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCOzRCQUMzQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQjs0QkFDbkQsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUzs0QkFDN0IsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUzs0QkFDN0IsUUFBUSxFQUFDLHFDQUFxQzs0QkFDOUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUzt5QkFDN0I7cUJBQ0Y7aUJBQ1I7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsc0JBQXNCO1NBQ2hDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsb0JBQW9CO1NBQzlCO1FBQ0Q7WUFDRSxPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsd0JBQXdCO1NBQ2xDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsMEJBQTBCO1NBQ3BDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsdUJBQXVCO1NBQ2pDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsc0JBQXNCO1NBQ2hDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsNEJBQTRCO1NBQ3RDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLDZCQUE2Qjt3QkFDbEUsRUFBRSxFQUFFLFdBQVc7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsT0FBTyxFQUFFLDBCQUEwQjtZQUNuQyxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxtQkFBbUI7d0JBQzVCLEVBQUUsRUFBRSxLQUFLO3dCQUNULE9BQU8sRUFBRTs0QkFDUCxZQUFZLEVBQUUsa0JBQWtCO3lCQUNqQztxQkFDRjtvQkFDRDt3QkFDRSxPQUFPLEVBQUUsd0JBQXdCO3dCQUNqQyxFQUFFLEVBQUUsVUFBVTt3QkFDZCxPQUFPLEVBQUU7NEJBQ1AsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTs0QkFDbkMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1COzRCQUMzQyxjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUI7NEJBQ25ELFlBQVksRUFBRSxJQUFJOzRCQUNsQixZQUFZLEVBQUUsVUFBVTt5QkFDekI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUDtZQUNFLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsT0FBTyxFQUFFLEVBQUU7U0FDWjtLQUNGO0NBRUYsQ0FBQyxDQUFBIn0=