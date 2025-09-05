import { AbstractPaymentProvider, BigNumber } from "@medusajs/framework/utils"
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

// Cash on Delivery options (kept optional for future use)
type Options = {
  display_name?: string
}

class CashOnDeliveryProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "cod"

  protected options_: Options

  constructor(container: Record<string, unknown>, options: Options) {
    super(container, options)
    this.options_ = options || {}
  }

  // Create a simple session with minimal public data
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input

    const id = `cod_${Date.now()}`

    return {
      id,
      data: {
        id,
        method: "cash_on_delivery",
        status: "pending",
        amount,
        currency_code,
        // only store non-sensitive, storefront-safe information here
        instructions:
          (context as any)?.instructions ||
          "Pay with cash upon delivery. The courier will collect the amount.",
      },
    }
  }

  // For COD we consider the payment authorized at checkout to permit order placement
  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const data = {
      ...input.data,
      status: "authorized",
      authorized_at: new Date().toISOString(),
    }

    return {
      data,
      status: "authorized",
    }
  }

  // No external capture; treat capture as a bookkeeping step
  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const data = {
      ...input.data,
      status: "captured",
      captured_at: new Date().toISOString(),
    }

    return { data }
  }

  // Allow cancel before capture
  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const data = {
      ...input.data,
      status: "canceled",
      canceled_at: new Date().toISOString(),
    }

    return { data }
  }

  // COD session deletion is a no-op
  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  // Reflect status based on stored data; default to pending
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

  // COD has no webhooks; mark as not supported
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    return {
      action: "not_supported",
      data: {
        session_id: "",
        amount: new BigNumber(0),
      },
    }
  }

  // Refund is a bookkeeping operation; record last refund amount
  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const data = {
      ...input.data,
      last_refund_amount: input.amount,
      refunded_at: new Date().toISOString(),
    }

    return { data }
  }

  // Return the stored provider data
  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return (input.data || {}) as RetrievePaymentOutput
  }

  // Allow updating public details in the stored session data
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
    // No required options for COD, but keep hook for future validations
    return
  }
}

export default CashOnDeliveryProviderService
