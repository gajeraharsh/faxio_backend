"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
// Minimal verify endpoint: stores Razorpay success payload on the payment session's data
// so the Razorpay provider's authorizePayment can verify signature during completeCart.
const POST = async (req, res) => {
    try {
        const { payment_collection_id, session_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, data, } = (req.body || {});
        if (!payment_collection_id || !session_id) {
            return res.status(400).json({ ok: false, message: "payment_collection_id and session_id are required" });
        }
        const payload = data || {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        };
        if (!payload?.razorpay_payment_id || !payload?.razorpay_order_id || !payload?.razorpay_signature) {
            return res.status(400).json({
                ok: false,
                message: "Missing Razorpay fields: razorpay_payment_id, razorpay_order_id, razorpay_signature",
            });
        }
        // Resolve the Payment module service in Medusa v2
        const paymentModuleService = req.scope.resolve(utils_1.Modules.PAYMENT);
        // Retrieve existing session to preserve required fields like amount
        let existingSession = null;
        try {
            if (typeof paymentModuleService.retrievePaymentSession === 'function') {
                existingSession = await paymentModuleService.retrievePaymentSession(session_id);
            }
            else if (typeof paymentModuleService.retrievePaymentSessions === 'function') {
                // some versions expose plural form
                existingSession = await paymentModuleService.retrievePaymentSessions(session_id);
            }
        }
        catch (_) { }
        const amount = existingSession?.amount;
        const currency_code = existingSession?.currency_code || existingSession?.currency?.code;
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
        });
        return res.json({ ok: true, payment_collection: updated });
    }
    catch (e) {
        return res.status(500).json({ ok: false, message: e?.message || "Failed to verify Razorpay payment" });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jhem9ycGF5L3ZlcmlmeS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBbUQ7QUFFbkQseUZBQXlGO0FBQ3pGLHdGQUF3RjtBQUNqRixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDcEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUNKLHFCQUFxQixFQUNyQixVQUFVLEVBQ1YsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbEIsSUFBSSxHQUNMLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBUSxDQUFBO1FBRTNCLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxtREFBbUQsRUFBRSxDQUFDLENBQUE7UUFDMUcsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSTtZQUN0QixtQkFBbUI7WUFDbkIsaUJBQWlCO1lBQ2pCLGtCQUFrQjtTQUNuQixDQUFBO1FBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pHLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEVBQUUsRUFBRSxLQUFLO2dCQUNULE9BQU8sRUFBRSxxRkFBcUY7YUFDL0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUVELGtEQUFrRDtRQUNsRCxNQUFNLG9CQUFvQixHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVwRSxvRUFBb0U7UUFDcEUsSUFBSSxlQUFlLEdBQVEsSUFBSSxDQUFBO1FBQy9CLElBQUksQ0FBQztZQUNILElBQUksT0FBTyxvQkFBb0IsQ0FBQyxzQkFBc0IsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDdEUsZUFBZSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakYsQ0FBQztpQkFBTSxJQUFJLE9BQU8sb0JBQW9CLENBQUMsdUJBQXVCLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQzlFLG1DQUFtQztnQkFDbkMsZUFBZSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDbEYsQ0FBQztRQUNILENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztRQUVkLE1BQU0sTUFBTSxHQUFHLGVBQWUsRUFBRSxNQUFNLENBQUE7UUFDdEMsTUFBTSxhQUFhLEdBQUcsZUFBZSxFQUFFLGFBQWEsSUFBSSxlQUFlLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQTtRQUV2RixxRkFBcUY7UUFDckYscUVBQXFFO1FBQ3JFLE1BQU0sT0FBTyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsb0JBQW9CLENBQUM7WUFDOUQsRUFBRSxFQUFFLFVBQVU7WUFDZCxvQ0FBb0M7WUFDcEMsR0FBRyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2pELDJDQUEyQztZQUMzQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDM0Msd0ZBQXdGO1lBQ3hGLHFCQUFxQjtZQUNyQixJQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQTtRQUVGLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUM1RCxDQUFDO0lBQUMsT0FBTyxDQUFNLEVBQUUsQ0FBQztRQUNoQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sSUFBSSxtQ0FBbUMsRUFBRSxDQUFDLENBQUE7SUFDeEcsQ0FBQztBQUNILENBQUMsQ0FBQTtBQTlEWSxRQUFBLElBQUksUUE4RGhCIn0=