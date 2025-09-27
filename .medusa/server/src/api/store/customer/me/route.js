"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const helpers_1 = require("@medusajs/medusa/api/store/customers/helpers");
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/core-flows");
const wishlist_1 = require("../../../../modules/wishlist");
const GET = async (req, res) => {
    const id = req.auth_context.actor_id;
    const customer = await (0, helpers_1.refetchCustomer)(id, req.scope, req.queryConfig.fields);
    if (!customer) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Customer with id: ${id} was not found`);
    }
    // Append wishlist_count (count only, no full fetch)
    let wishlist_count = 0;
    try {
        const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
        wishlist_count = await wishlistService.countWishlistItems({ customer_id: id });
    }
    catch (_) {
        wishlist_count = 0;
    }
    res.json({ customer, wishlist_count });
};
exports.GET = GET;
const POST = async (req, res) => {
    const customerId = req.auth_context.actor_id;
    await (0, core_flows_1.updateCustomersWorkflow)(req.scope).run({
        input: {
            selector: { id: customerId },
            update: req.validatedBody,
        },
    });
    const customer = await (0, helpers_1.refetchCustomer)(customerId, req.scope, req.queryConfig.fields);
    // Append wishlist_count (count only, no full fetch)
    let wishlist_count = 0;
    try {
        const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
        wishlist_count = await wishlistService.countWishlistItems({ customer_id: customerId });
    }
    catch (_) {
        wishlist_count = 0;
    }
    res.status(200).json({ customer, wishlist_count });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbWVyL21lL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVNFLDBFQUE4RTtBQUM5RSxxREFBdUQ7QUFDdkQscURBQThEO0FBRTlELDJEQUE4RDtBQUd2RCxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQ3RCLEdBQTJELEVBQzNELEdBQW9ELEVBQ3BELEVBQUU7SUFDRixNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQTtJQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEseUJBQWUsRUFBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRTdFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNkLE1BQU0sSUFBSSxtQkFBVyxDQUNuQixtQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQzNCLHFCQUFxQixFQUFFLGdCQUFnQixDQUN4QyxDQUFBO0lBQ0gsQ0FBQztJQUNELG9EQUFvRDtJQUNwRCxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7SUFDdEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQXdCLDBCQUFlLENBQUMsQ0FBQTtRQUNqRixjQUFjLEdBQUcsTUFBTyxlQUF1QixDQUFDLGtCQUFrQixDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDekYsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxjQUFjLEdBQUcsQ0FBQyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBUyxDQUFDLENBQUE7QUFDL0MsQ0FBQyxDQUFBO0FBdkJZLFFBQUEsR0FBRyxPQXVCZjtBQUVNLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBd0QsRUFDeEQsR0FBb0QsRUFDcEQsRUFBRTtJQUNGLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFBO0lBQzVDLE1BQU0sSUFBQSxvQ0FBdUIsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzNDLEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUU7WUFDNUIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxhQUFhO1NBQzFCO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHlCQUFlLEVBQ3BDLFVBQVUsRUFDVixHQUFHLENBQUMsS0FBSyxFQUNULEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUN2QixDQUFBO0lBQ0Qsb0RBQW9EO0lBQ3BELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQTtJQUN0QixJQUFJLENBQUM7UUFDSCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBd0IsMEJBQWUsQ0FBQyxDQUFBO1FBQ2pGLGNBQWMsR0FBRyxNQUFPLGVBQXVCLENBQUMsa0JBQWtCLENBQUMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUNqRyxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLGNBQWMsR0FBRyxDQUFDLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBUyxDQUFDLENBQUE7QUFDM0QsQ0FBQyxDQUFBO0FBM0JZLFFBQUEsSUFBSSxRQTJCaEIifQ==