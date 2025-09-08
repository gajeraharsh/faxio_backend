import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

// Minimal verify endpoint: stores Razorpay success payload on the payment session's data
// so the Razorpay provider's authorizePayment can verify signature during completeCart.
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const {
      payment_collection_id,
      session_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      data,
    } = (req.body || {}) as any

    if (!payment_collection_id || !session_id) {
      return res.status(400).json({ ok: false, message: "payment_collection_id and session_id are required" })
    }

    const payload = data || {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }

    if (!payload?.razorpay_payment_id || !payload?.razorpay_order_id || !payload?.razorpay_signature) {
      return res.status(400).json({
        ok: false,
        message: "Missing Razorpay fields: razorpay_payment_id, razorpay_order_id, razorpay_signature",
      })
    }

    // Resolve the Payment module service in Medusa v2
    const paymentModuleService: any = req.scope.resolve(Modules.PAYMENT)

    // Retrieve existing session to preserve required fields like amount
    let existingSession: any = null
    try {
      if (typeof paymentModuleService.retrievePaymentSession === 'function') {
        existingSession = await paymentModuleService.retrievePaymentSession(session_id)
      } else if (typeof paymentModuleService.retrievePaymentSessions === 'function') {
        // some versions expose plural form
        existingSession = await paymentModuleService.retrievePaymentSessions(session_id)
      }
    } catch (_) {}

    const amount = existingSession?.amount
    const currency_code = existingSession?.currency_code || existingSession?.currency?.code

    // Update session data with Razorpay fields so provider.authorizePayment can validate
    // Medusa v2 Payment module expects the session identifier under 'id'
    const updated = await paymentModuleService.updatePaymentSession({
      id: session_id,
      // keep amount if module requires it
      ...(typeof amount === 'number' ? { amount } : {}),
      // keep currency_code if module requires it
      ...(currency_code ? { currency_code } : {}),
      // Some implementations accept payment_collection_id as context; keeping it if supported
      payment_collection_id,
      data: payload,
    })

    return res.json({ ok: true, payment_collection: updated })
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || "Failed to verify Razorpay payment" })
  }
}
