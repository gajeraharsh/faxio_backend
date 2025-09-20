import { AbstractPaymentProvider, BigNumber, Modules } from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
  PaymentSessionStatus,
} from "@medusajs/framework/types"

import crypto from "node:crypto"

// Razorpay provider options
export type RazorpayOptions = {
  key_id: string
  key_secret: string
  webhook_secret?: string
  auto_capture?: boolean
  display_name?: string
}

/**
 * Razorpay Custom Payment Provider for Medusa v2
 *
 * initiatePayment: creates a Razorpay Order and returns public data needed by the storefront
 * authorizePayment: verifies the signature from Razorpay Checkout success
 * capturePayment: optional explicit capture if auto_capture is false
 * getWebhookActionAndData: verify webhook signature and derive action (optional basic implementation)
 */
class RazorpayProviderService extends AbstractPaymentProvider<RazorpayOptions> {
  static identifier = "razorpay"

  protected options_: RazorpayOptions

  constructor(container: Record<string, unknown>, options: RazorpayOptions) {
    super(container, options)
    this.options_ = options || ({} as RazorpayOptions)
  }

  private get baseAuthHeader() {
    const creds = Buffer.from(`${this.options_.key_id}:${this.options_.key_secret}`).toString("base64")
    return `Basic ${creds}`
  }

  // Convert to minor units (e.g., paise for INR) for Razorpay
  // Many Medusa setups pass amounts in major units (e.g., 190.00 for ₹190),
  // while others pass minor units (e.g., 19000 paise).
  // To avoid undercharging (e.g., ₹190.00 showing as ₹1.90), we use a safer heuristic:
  // - For 2-decimal currencies (INR, USD, ...), if amount is reasonably small (< 1e6),
  //   assume it's in major units and multiply by 100.
  // - If it's already huge (>= 1e6), we assume it's already in minor units and keep as-is.
  // This guards typical orders (<= ₹10,000) and prevents accidental divide-by-100.
  private toMinorUnits(amount: number | string, currency_code?: string): number {
    const code = (currency_code || "").toUpperCase()
    const a = Number(amount)
    if (!Number.isFinite(a) || a <= 0) return Math.round(a)
    const twoDecimal = new Set(["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "SAR"]) // extend as needed
    if (twoDecimal.has(code)) {
      // Treat values under 1,000,000 as major units and convert to minor units
      // Example: 190 -> 19000 paise; 1999.99 -> 199999; 19000 (already minor) stays 19000 if >= 1e6 threshold is not met
      if (a < 1_000_000) return Math.round(a * 100)
      return Math.round(a)
    }
    return Math.round(a)
  }

  // Create a Razorpay Order and return public, non-sensitive data for the storefront
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input
    // Convert BigNumberInput -> number safely
    const amountNum = Number(amount as any)

    // Ensure Razorpay receives minor units (e.g., paise for INR)
    const minorAmount = this.toMinorUnits(amountNum, currency_code)
    if ((currency_code || '').toUpperCase() === 'INR' && minorAmount < 100) {
      throw new Error("Minimum payable amount for INR is ₹1.00 (100 paise)")
    }

    const orderPayload = {
      amount: minorAmount,
      currency: currency_code.toUpperCase(),
      receipt: (context as any)?.cart_id || (context as any)?.order_id || `receipt_${Date.now()}`,
      payment_capture: this.options_.auto_capture ? 1 : 0,
    }

    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: this.baseAuthHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`Razorpay order create failed: ${resp.status} ${text}`)
    }

    const order = (await resp.json()) as any
    // order.id -> razorpay_order_id

    const id = `razorpay_${Date.now()}`

    return {
      id,
      data: {
        id,
        method: "razorpay",
        status: "pending",
        amount,
        currency_code,
        key_id: this.options_.key_id,
        order_id: order.id,
        // Any storefront-safe details only
        notes: order.notes,
      },
    }
  }

  // Verify the signature returned by Razorpay Checkout
  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const { data, context } = input

    const paymentId = (context as any)?.razorpay_payment_id || (data as any)?.razorpay_payment_id
    const orderId = (context as any)?.razorpay_order_id || (data as any)?.razorpay_order_id || (data as any)?.order_id
    const signature = (context as any)?.razorpay_signature || (data as any)?.razorpay_signature

    // If no signature provided, leave as pending (webhook may confirm later)
    if (!paymentId || !orderId || !signature) {
      return {
        data: {
          ...data,
          status: (data as any)?.status || "pending",
          pending_reason: "awaiting_signature_or_webhook",
        },
        status: "pending",
      }
    }

    const hmac = crypto
      .createHmac("sha256", this.options_.key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")

    const verified = hmac === signature

    const nextData = {
      ...data,
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
      verified,
      authorized_at: verified ? new Date().toISOString() : undefined,
      status: verified ? "authorized" : "pending",
    }

    return {
      data: nextData,
      status: verified ? "authorized" : "pending",
    }
  }

  // If auto-capture is true, we can mark as captured; otherwise, capture via API using payment_id
  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const current = input.data as any

    if (this.options_.auto_capture) {
      const data = {
        ...input.data,
        status: "captured",
        captured_at: new Date().toISOString(),
      }
      return { data }
    }

    const paymentId = current?.razorpay_payment_id
    if (!paymentId) {
      // cannot capture without payment id; keep as pending
      return { data: { ...input.data, status: (current?.status as string) || "pending" } }
    }

    // Capture requires amount in smallest unit and currency
    const captureAmount = this.toMinorUnits(current?.amount ?? 0, current?.currency_code)
    const capturePayload = new URLSearchParams({
      amount: String(captureAmount),
      currency: (current?.currency_code || "INR").toUpperCase(),
    })

    const resp = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
      method: "POST",
      headers: {
        Authorization: this.baseAuthHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: capturePayload,
    })

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`Razorpay capture failed: ${resp.status} ${text}`)
    }

    const data = {
      ...input.data,
      status: "captured",
      captured_at: new Date().toISOString(),
    }

    return { data }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const data = {
      ...input.data,
      status: "canceled",
      canceled_at: new Date().toISOString(),
    }

    return { data }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const status = (input.data as any)?.status as PaymentSessionStatus | undefined

    switch (status) {
      case "authorized":
        return { status: "authorized" }
      case "captured":
        return { status: "captured" }
      case "canceled":
        return { status: "canceled" }
      default:
        return { status: "pending" }
    }
  }

  // Basic webhook handler: verify signature and infer an action
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const headers = (payload as any)?.headers || {}
      const rawBody: string = (payload as any)?.rawBody || ""
      const signature: string | undefined =
        headers["x-razorpay-signature"] || headers["X-Razorpay-Signature"]

      if (!this.options_.webhook_secret || !signature || !rawBody) {
        return {
          action: "not_supported",
          data: { session_id: "", amount: new BigNumber(0) },
        }
      }

      const expected = crypto
        .createHmac("sha256", this.options_.webhook_secret)
        .update(rawBody)
        .digest("hex")

      if (expected !== signature) {
        return {
          action: "not_supported",
          data: { session_id: "", amount: new BigNumber(0) },
        }
      }

      const body = JSON.parse(rawBody)
      const event = body?.event as string | undefined

      // You will likely map razorpay_order_id back to the payment session via your own store
      const razorpayOrderId = body?.payload?.payment?.entity?.order_id || body?.payload?.order?.entity?.id
      const amount = body?.payload?.payment?.entity?.amount || 0

      // Resolve the Medusa Payment module and try to find the real payment session id
      // by matching the stored session.data.order_id === razorpayOrderId (set in initiatePayment)
      let sessionId: string | undefined
      try {
        const paymentModule: any = (this as any)?.container?.resolve?.(Modules.PAYMENT)
        if (paymentModule) {
          // Attempt 1: listPaymentSessions with a selector (supported in recent versions)
          if (typeof paymentModule.listPaymentSessions === 'function') {
            try {
              const res = await paymentModule.listPaymentSessions({
                provider_id: RazorpayProviderService.identifier,
                // Some implementations allow nested filters using dot notation
                "data.order_id": razorpayOrderId,
                limit: 5,
              })
              const sessions = Array.isArray(res?.payment_sessions)
                ? res.payment_sessions
                : Array.isArray(res)
                  ? res
                  : []
              const found = sessions.find((s: any) => s?.data?.order_id === razorpayOrderId)
              sessionId = found?.id || sessionId
            } catch (_) {
              // ignore and try next strategy
            }
          }

          // Attempt 2: if there is a generic list method
          if (!sessionId && typeof paymentModule.list === 'function') {
            try {
              const res = await paymentModule.list({
                entity: 'payment_session',
                provider_id: RazorpayProviderService.identifier,
                "data.order_id": razorpayOrderId,
                limit: 5,
              })
              const sessions = Array.isArray(res) ? res : []
              const found = sessions.find((s: any) => s?.data?.order_id === razorpayOrderId)
              sessionId = found?.id || sessionId
            } catch (_) { }
          }

          // Attempt 3: brute-force fallback if we only have retrieve and we suspect orderId might already be session id
          if (!sessionId && typeof paymentModule.retrievePaymentSession === 'function') {
            try {
              const maybe = await paymentModule.retrievePaymentSession(razorpayOrderId)
              if (maybe?.id) sessionId = maybe.id
            } catch (_) { }
          }
        }
      } catch (_) {
        // Soft failure: leave sessionId undefined; Medusa will ignore if we can't map
      }

      if (event === "payment.authorized") {
        return {
          action: "authorized",
          data: {
            session_id: sessionId || razorpayOrderId || "",
            amount: new BigNumber(amount),
          },
        }
      }

      if (event === "payment.captured" || event === "order.paid") {
        return {
          action: "captured",
          data: {
            session_id: sessionId || razorpayOrderId || "",
            amount: new BigNumber(amount),
          },
        }
      }

      // Refund events can be handled in a custom flow; default to not_supported to avoid type issues

      return {
        action: "not_supported",
        data: { session_id: razorpayOrderId || "", amount: new BigNumber(amount) },
      }
    } catch (e) {
      return {
        action: "not_supported",
        data: { session_id: "", amount: new BigNumber(0) },
      }
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const data = {
      ...input.data,
      last_refund_amount: input.amount,
      refunded_at: new Date().toISOString(),
    }

    return { data }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return (input.data || {}) as RetrievePaymentOutput
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const { amount, currency_code, context } = input
    const data = {
      ...input.data,
      amount,
      currency_code,
      context,
      updated_at: new Date().toISOString(),
    }

    return { data }
  }

  static validateOptions(options: Record<string, any>) {
    if (!options?.key_id || !options?.key_secret) {
      throw new Error("Razorpay provider requires key_id and key_secret")
    }
  }
}

export default RazorpayProviderService
