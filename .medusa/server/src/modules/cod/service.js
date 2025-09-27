"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
class CashOnDeliveryProviderService extends utils_1.AbstractPaymentProvider {
    constructor(container, options) {
        super(container, options);
        this.options_ = options || {};
    }
    // Create a simple session with minimal public data
    async initiatePayment(input) {
        const { amount, currency_code, context } = input;
        const id = `cod_${Date.now()}`;
        return {
            id,
            data: {
                id,
                method: "cash_on_delivery",
                status: "pending",
                amount,
                currency_code,
                // only store non-sensitive, storefront-safe information here
                instructions: context?.instructions ||
                    "Pay with cash upon delivery. The courier will collect the amount.",
            },
        };
    }
    // For COD we consider the payment authorized at checkout to permit order placement
    async authorizePayment(input) {
        const data = {
            ...input.data,
            status: "authorized",
            authorized_at: new Date().toISOString(),
        };
        return {
            data,
            status: "authorized",
        };
    }
    // No external capture; treat capture as a bookkeeping step
    async capturePayment(input) {
        const data = {
            ...input.data,
            status: "captured",
            captured_at: new Date().toISOString(),
        };
        return { data };
    }
    // Allow cancel before capture
    async cancelPayment(input) {
        const data = {
            ...input.data,
            status: "canceled",
            canceled_at: new Date().toISOString(),
        };
        return { data };
    }
    // COD session deletion is a no-op
    async deletePayment(input) {
        return { data: input.data };
    }
    // Reflect status based on stored data; default to pending
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
    // COD has no webhooks; mark as not supported
    async getWebhookActionAndData(payload) {
        return {
            action: "not_supported",
            data: {
                session_id: "",
                amount: new utils_1.BigNumber(0),
            },
        };
    }
    // Refund is a bookkeeping operation; record last refund amount
    async refundPayment(input) {
        const data = {
            ...input.data,
            last_refund_amount: input.amount,
            refunded_at: new Date().toISOString(),
        };
        return { data };
    }
    // Return the stored provider data
    async retrievePayment(input) {
        return (input.data || {});
    }
    // Allow updating public details in the stored session data
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
        // No required options for COD, but keep hook for future validations
        return;
    }
}
CashOnDeliveryProviderService.identifier = "cod";
exports.default = CashOnDeliveryProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvZC9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQThFO0FBOEI5RSxNQUFNLDZCQUE4QixTQUFRLCtCQUFnQztJQUsxRSxZQUFZLFNBQWtDLEVBQUUsT0FBZ0I7UUFDOUQsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUE7SUFDL0IsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQTJCO1FBQy9DLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQTtRQUVoRCxNQUFNLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFBO1FBRTlCLE9BQU87WUFDTCxFQUFFO1lBQ0YsSUFBSSxFQUFFO2dCQUNKLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFLGtCQUFrQjtnQkFDMUIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLE1BQU07Z0JBQ04sYUFBYTtnQkFDYiw2REFBNkQ7Z0JBQzdELFlBQVksRUFDVCxPQUFlLEVBQUUsWUFBWTtvQkFDOUIsbUVBQW1FO2FBQ3RFO1NBQ0YsQ0FBQTtJQUNILENBQUM7SUFFRCxtRkFBbUY7SUFDbkYsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQTRCO1FBQ2pELE1BQU0sSUFBSSxHQUFHO1lBQ1gsR0FBRyxLQUFLLENBQUMsSUFBSTtZQUNiLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLGFBQWEsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtTQUN4QyxDQUFBO1FBRUQsT0FBTztZQUNMLElBQUk7WUFDSixNQUFNLEVBQUUsWUFBWTtTQUNyQixDQUFBO0lBQ0gsQ0FBQztJQUVELDJEQUEy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