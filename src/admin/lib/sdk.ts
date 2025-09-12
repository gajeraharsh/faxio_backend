import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: (import.meta as any).env?.VITE_MEDUSA_ADMIN_BASE_URL || "https://api.faxio.in/",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})
