"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const node_crypto_1 = __importDefault(require("node:crypto"));
/**
 * Razorpay Custom Payment Provider for Medusa v2
 *
 * initiatePayment: creates a Razorpay Order and returns public data needed by the storefront
 * authorizePayment: verifies the signature from Razorpay Checkout success
 * capturePayment: optional explicit capture if auto_capture is false
 * getWebhookActionAndData: verify webhook signature and derive action (optional basic implementation)
 */
class RazorpayProviderService extends utils_1.AbstractPaymentProvider {
    constructor(container, options) {
        super(container, options);
        this.options_ = options || {};
    }
    get baseAuthHeader() {
        const creds = Buffer.from(`${this.options_.key_id}:${this.options_.key_secret}`).toString("base64");
        return `Basic ${creds}`;
    }
    // Convert to minor units (e.g., paise for INR) for Razorpay
    // Many Medusa setups pass amounts in major units (e.g., 190.00 for ₹190),
    // while others pass minor units (e.g., 19000 paise).
    // To avoid undercharging (e.g., ₹190.00 showing as ₹1.90), we use a safer heuristic:
    // - For 2-decimal currencies (INR, USD, ...), if amount is reasonably small (< 1e6),
    //   assume it's in major units and multiply by 100.
    // - If it's already huge (>= 1e6), we assume it's already in minor units and keep as-is.
    // This guards typical orders (<= ₹10,000) and prevents accidental divide-by-100.
    toMinorUnits(amount, currency_code) {
        const code = (currency_code || "").toUpperCase();
        const a = Number(amount);
        if (!Number.isFinite(a) || a <= 0)
            return Math.round(a);
        const twoDecimal = new Set(["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "SAR"]); // extend as needed
        if (twoDecimal.has(code)) {
            // Treat values under 1,000,000 as major units and convert to minor units
            // Example: 190 -> 19000 paise; 1999.99 -> 199999; 19000 (already minor) stays 19000 if >= 1e6 threshold is not met
            if (a < 1_000_000)
                return Math.round(a * 100);
            return Math.round(a);
        }
        return Math.round(a);
    }
    // Create a Razorpay Order and return public, non-sensitive data for the storefront
    async initiatePayment(input) {
        const { amount, currency_code, context } = input;
        // Convert BigNumberInput -> number safely
        const amountNum = Number(amount);
        // Ensure Razorpay receives minor units (e.g., paise for INR)
        const minorAmount = this.toMinorUnits(amountNum, currency_code);
        if ((currency_code || '').toUpperCase() === 'INR' && minorAmount < 100) {
            throw new Error("Minimum payable amount for INR is ₹1.00 (100 paise)");
        }
        const orderPayload = {
            amount: minorAmount,
            currency: currency_code.toUpperCase(),
            receipt: context?.cart_id || context?.order_id || `receipt_${Date.now()}`,
            payment_capture: this.options_.auto_capture ? 1 : 0,
        };
        const resp = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                Authorization: this.baseAuthHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Razorpay order create failed: ${resp.status} ${text}`);
        }
        const order = (await resp.json());
        // order.id -> razorpay_order_id
        const id = `razorpay_${Date.now()}`;
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
        };
    }
    // Verify the signature returned by Razorpay Checkout
    async authorizePayment(input) {
        const { data, context } = input;
        const paymentId = context?.razorpay_payment_id || data?.razorpay_payment_id;
        const orderId = context?.razorpay_order_id || data?.razorpay_order_id || data?.order_id;
        const signature = context?.razorpay_signature || data?.razorpay_signature;
        // If no signature provided, leave as pending (webhook may confirm later)
        if (!paymentId || !orderId || !signature) {
            return {
                data: {
                    ...data,
                    status: data?.status || "pending",
                    pending_reason: "awaiting_signature_or_webhook",
                },
                status: "pending",
            };
        }
        const hmac = node_crypto_1.default
            .createHmac("sha256", this.options_.key_secret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
        const verified = hmac === signature;
        const nextData = {
            ...data,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: signature,
            verified,
            authorized_at: verified ? new Date().toISOString() : undefined,
            status: verified ? "authorized" : "pending",
        };
        return {
            data: nextData,
            status: verified ? "authorized" : "pending",
        };
    }
    // If auto-capture is true, we can mark as captured; otherwise, capture via API using payment_id
    async capturePayment(input) {
        const current = input.data;
        if (this.options_.auto_capture) {
            const data = {
                ...input.data,
                status: "captured",
                captured_at: new Date().toISOString(),
            };
            return { data };
        }
        const paymentId = current?.razorpay_payment_id;
        if (!paymentId) {
            // cannot capture without payment id; keep as pending
            return { data: { ...input.data, status: current?.status || "pending" } };
        }
        // Capture requires amount in smallest unit and currency
        const captureAmount = this.toMinorUnits(current?.amount ?? 0, current?.currency_code);
        const capturePayload = new URLSearchParams({
            amount: String(captureAmount),
            currency: (current?.currency_code || "INR").toUpperCase(),
        });
        const resp = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
            method: "POST",
            headers: {
                Authorization: this.baseAuthHeader,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: capturePayload,
        });
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Razorpay capture failed: ${resp.status} ${text}`);
        }
        const data = {
            ...input.data,
            status: "captured",
            captured_at: new Date().toISOString(),
        };
        return { data };
    }
    async cancelPayment(input) {
        const data = {
            ...input.data,
            status: "canceled",
            canceled_at: new Date().toISOString(),
        };
        return { data };
    }
    async deletePayment(input) {
        return { data: input.data };
    }
    async getPaymentStatus(input) {
        const status = input.data?.status;
        switch (status) {
            case "authorized":
                return { status: "authorized" };
            case "captured":
                return { status: "captured" };
            case "canceled":
                return { status: "canceled" };
            default:
                return { status: "pending" };
        }
    }
    // Basic webhook handler: verify signature and infer an action
    async getWebhookActionAndData(payload) {
        try {
            const headers = payload?.headers || {};
            const rawBody = payload?.rawBody || "";
            const signature = headers["x-razorpay-signature"] || headers["X-Razorpay-Signature"];
            if (!this.options_.webhook_secret || !signature || !rawBody) {
                return {
                    action: "not_supported",
                    data: { session_id: "", amount: new utils_1.BigNumber(0) },
                };
            }
            const expected = node_crypto_1.default
                .createHmac("sha256", this.options_.webhook_secret)
                .update(rawBody)
                .digest("hex");
            if (expected !== signature) {
                return {
                    action: "not_supported",
                    data: { session_id: "", amount: new utils_1.BigNumber(0) },
                };
            }
            const body = JSON.parse(rawBody);
            const event = body?.event;
            // You will likely map razorpay_order_id back to the payment session via your own store
            const razorpayOrderId = body?.payload?.payment?.entity?.order_id || body?.payload?.order?.entity?.id;
            const amount = body?.payload?.payment?.entity?.amount || 0;
            // Resolve the Medusa Payment module and try to find the real payment session id
            // by matching the stored session.data.order_id === razorpayOrderId (set in initiatePayment)
            let sessionId;
            try {
                const paymentModule = this?.container?.resolve?.(utils_1.Modules.PAYMENT);
                if (paymentModule) {
                    // Attempt 1: listPaymentSessions with a selector (supported in recent versions)
                    if (typeof paymentModule.listPaymentSessions === 'function') {
                        try {
                            const res = await paymentModule.listPaymentSessions({
                                provider_id: RazorpayProviderService.identifier,
                                // Some implementations allow nested filters using dot notation
                                "data.order_id": razorpayOrderId,
                                limit: 5,
                            });
                            const sessions = Array.isArray(res?.payment_sessions)
                                ? res.payment_sessions
                                : Array.isArray(res)
                                    ? res
                                    : [];
                            const found = sessions.find((s) => s?.data?.order_id === razorpayOrderId);
                            sessionId = found?.id || sessionId;
                        }
                        catch (_) {
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
                            });
                            const sessions = Array.isArray(res) ? res : [];
                            const found = sessions.find((s) => s?.data?.order_id === razorpayOrderId);
                            sessionId = found?.id || sessionId;
                        }
                        catch (_) { }
                    }
                    // Attempt 3: brute-force fallback if we only have retrieve and we suspect orderId might already be session id
                    if (!sessionId && typeof paymentModule.retrievePaymentSession === 'function') {
                        try {
                            const maybe = await paymentModule.retrievePaymentSession(razorpayOrderId);
                            if (maybe?.id)
                                sessionId = maybe.id;
                        }
                        catch (_) { }
                    }
                }
            }
            catch (_) {
                // Soft failure: leave sessionId undefined; Medusa will ignore if we can't map
            }
            if (event === "payment.authorized") {
                return {
                    action: "authorized",
                    data: {
                        session_id: sessionId || razorpayOrderId || "",
                        amount: new utils_1.BigNumber(amount),
                    },
                };
            }
            if (event === "payment.captured" || event === "order.paid") {
                return {
                    action: "captured",
                    data: {
                        session_id: sessionId || razorpayOrderId || "",
                        amount: new utils_1.BigNumber(amount),
                    },
                };
            }
            // Refund events can be handled in a custom flow; default to not_supported to avoid type issues
            return {
                action: "not_supported",
                data: { session_id: razorpayOrderId || "", amount: new utils_1.BigNumber(amount) },
            };
        }
        catch (e) {
            return {
                action: "not_supported",
                data: { session_id: "", amount: new utils_1.BigNumber(0) },
            };
        }
    }
    async refundPayment(input) {
        const data = {
            ...input.data,
            last_refund_amount: input.amount,
            refunded_at: new Date().toISOString(),
        };
        return { data };
    }
    async retrievePayment(input) {
        return (input.data || {});
    }
    async updatePayment(input) {
        const { amount, currency_code, context } = input;
        const data = {
            ...input.data,
            amount,
            currency_code,
            context,
            updated_at: new Date().toISOString(),
        };
        return { data };
    }
    static validateOptions(options) {
        if (!options?.key_id || !options?.key_secret) {
            throw new Error("Razorpay provider requires key_id and key_secret");
        }
    }
}
RazorpayProviderService.identifier = "razorpay";
exports.default = RazorpayProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Jhem9ycGF5L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBdUY7QUF5QnZGLDhEQUFnQztBQVdoQzs7Ozs7OztHQU9HO0FBQ0gsTUFBTSx1QkFBd0IsU0FBUSwrQkFBd0M7SUFLNUUsWUFBWSxTQUFrQyxFQUFFLE9BQXdCO1FBQ3RFLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLElBQUssRUFBc0IsQ0FBQTtJQUNwRCxDQUFDO0lBRUQsSUFBWSxjQUFjO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ25HLE9BQU8sU0FBUyxLQUFLLEVBQUUsQ0FBQTtJQUN6QixDQUFDO0lBRUQsNERBQTREO0lBQzVELDBFQUEwRTtJQUMxRSxxREFBcUQ7SUFDckQscUZBQXFGO0lBQ3JGLHFGQUFxRjtJQUNyRixvREFBb0Q7SUFDcEQseUZBQXlGO0lBQ3pGLGlGQUFpRjtJQUN6RSxZQUFZLENBQUMsTUFBdUIsRUFBRSxhQUFzQjtRQUNsRSxNQUFNLElBQUksR0FBRyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNoRCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkQs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