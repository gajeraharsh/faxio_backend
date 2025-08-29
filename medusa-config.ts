import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
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
          ...(process.env.FILE_PROVIDER === "s3"
            ? [
                {
                  resolve: "@medusajs/file-s3",
                  id: "s3",
                  options: {
                    bucket: process.env.S3_BUCKET,
                    region: process.env.S3_REGION,
                    access_key_id: process.env.S3_ACCESS_KEY_ID,
                    secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                    // Optional custom domain for CDN/fronted access
                    // endpoint: process.env.S3_ENDPOINT, // for MinIO or custom endpoints
                  },
                },
              ]
            : [
                {
                  resolve: "@medusajs/file-local",
                  id: "local",
                  options: {
                    upload_dir: process.env.FILE_UPLOAD_DIR || "uploads",
                  },
                },
              ]),
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
      resolve: "./src/modules/wishlist",
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
        ],
      },
    },

  ]
})
