import Medusa from "@medusajs/js-sdk"

const fallbackBase = typeof window !== 'undefined' ? window.location.origin : (process as any).env?.MEDUSA_ADMIN_BASE_URL || "http://localhost:9000"

export const sdk = new Medusa({
  baseUrl: (import.meta as any).env?.VITE_MEDUSA_ADMIN_BASE_URL || fallbackBase,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})
