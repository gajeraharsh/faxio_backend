import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import {
  StoreGetCustomerParamsType,
  StoreUpdateCustomerType,
} from "@medusajs/medusa/api/store/customers/validators"
import { refetchCustomer } from "@medusajs/medusa/api/store/customers/helpers"
import { MedusaError } from "@medusajs/framework/utils"
import { updateCustomersWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { WISHLIST_MODULE } from "../../../../modules/wishlist"
import type WishlistModuleService from "../../../../modules/wishlist/service"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCustomerParamsType>,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const id = req.auth_context.actor_id
  const customer = await refetchCustomer(id, req.scope, req.queryConfig.fields)

  if (!customer) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Customer with id: ${id} was not found`
    )
  }

  // Append wishlist_count (count-only; no full fetch)
  let wishlist_count = 0
  try {
    const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
    // Prefer count; fallback to listAndCount if needed
    if (typeof (wishlistService as any).countWishlistItems === "function") {
      wishlist_count = await (wishlistService as any).countWishlistItems({ customer_id: id })
    } else if (typeof (wishlistService as any).listAndCountWishlistItems === "function") {
      const [, count] = await (wishlistService as any).listAndCountWishlistItems({ customer_id: id })
      wishlist_count = count || 0
    }
  } catch (_) {
    wishlist_count = 0
  }

  res.json({ customer, wishlist_count } as any)
}

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreUpdateCustomerType>,
  res: MedusaResponse<HttpTypes.StoreCustomerResponse>
) => {
  const customerId = req.auth_context.actor_id
  await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: customerId },
      update: req.validatedBody,
    },
  })

  const customer = await refetchCustomer(
    customerId,
    req.scope,
    req.queryConfig.fields
  )

  // Append wishlist_count (count-only; no full fetch)
  let wishlist_count = 0
  try {
    const wishlistService = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE)
    if (typeof (wishlistService as any).countWishlistItems === "function") {
      wishlist_count = await (wishlistService as any).countWishlistItems({ customer_id: customerId })
    } else if (typeof (wishlistService as any).listAndCountWishlistItems === "function") {
      const [, count] = await (wishlistService as any).listAndCountWishlistItems({ customer_id: customerId })
      wishlist_count = count || 0
    }
  } catch (_) {
    wishlist_count = 0
  }

  res.status(200).json({ customer, wishlist_count } as any)
}
