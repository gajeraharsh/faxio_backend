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
    // Append wishlist_count (count-only; no full fetch)
    let wishlist_count = 0;
    try {
        const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
        // Prefer count; fallback to listAndCount if needed
        if (typeof wishlistService.countWishlistItems === "function") {
            wishlist_count = await wishlistService.countWishlistItems({ customer_id: id });
        }
        else if (typeof wishlistService.listAndCountWishlistItems === "function") {
            const [, count] = await wishlistService.listAndCountWishlistItems({ customer_id: id });
            wishlist_count = count || 0;
        }
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
    // Append wishlist_count (count-only; no full fetch)
    let wishlist_count = 0;
    try {
        const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
        if (typeof wishlistService.countWishlistItems === "function") {
            wishlist_count = await wishlistService.countWishlistItems({ customer_id: customerId });
        }
        else if (typeof wishlistService.listAndCountWishlistItems === "function") {
            const [, count] = await wishlistService.listAndCountWishlistItems({ customer_id: customerId });
            wishlist_count = count || 0;
        }
    }
    catch (_) {
        wishlist_count = 0;
    }
    res.status(200).json({ customer, wishlist_count });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbWVycy9tZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFTQSwwRUFBOEU7QUFDOUUscURBQXVEO0FBQ3ZELHFEQUE4RDtBQUU5RCwyREFBOEQ7QUFHdkQsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUEyRCxFQUMzRCxHQUFvRCxFQUNwRCxFQUFFO0lBQ0YsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUE7SUFDcEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHlCQUFlLEVBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUU3RSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxNQUFNLElBQUksbUJBQVcsQ0FDbkIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUMzQixxQkFBcUIsRUFBRSxnQkFBZ0IsQ0FDeEMsQ0FBQTtJQUNILENBQUM7SUFFRCxvREFBb0Q7SUFDcEQsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFBO0lBQ3RCLElBQUksQ0FBQztRQUNILE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUF3QiwwQkFBZSxDQUFDLENBQUE7UUFDakYsbURBQW1EO1FBQ25ELElBQUksT0FBUSxlQUF1QixDQUFDLGtCQUFrQixLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ3RFLGNBQWMsR0FBRyxNQUFPLGVBQXVCLENBQUMsa0JBQWtCLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN6RixDQUFDO2FBQU0sSUFBSSxPQUFRLGVBQXVCLENBQUMseUJBQXlCLEtBQUssVUFBVSxFQUFFLENBQUM7WUFDcEYsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTyxlQUF1QixDQUFDLHlCQUF5QixDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDL0YsY0FBYyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUE7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1gsY0FBYyxHQUFHLENBQUMsQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQVMsQ0FBQyxDQUFBO0FBQy9DLENBQUMsQ0FBQTtBQTlCWSxRQUFBLEdBQUcsT0E4QmY7QUFFTSxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQXdELEVBQ3hELEdBQW9ELEVBQ3BELEVBQUU7SUFDRixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQTtJQUM1QyxNQUFNLElBQUEsb0NBQXVCLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMzQyxLQUFLLEVBQUU7WUFDTCxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFO1lBQzVCLE1BQU0sRUFBRSxHQUFHLENBQUMsYUFBYTtTQUMxQjtLQUNGLENBQUMsQ0FBQTtJQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSx5QkFBZSxFQUNwQyxVQUFVLEVBQ1YsR0FBRyxDQUFDLEtBQUssRUFDVCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FDdkIsQ0FBQTtJQUVELG9EQUFvRDtJQUNwRCxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7SUFDdEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQXdCLDBCQUFlLENBQUMsQ0FBQTtRQUNqRixJQUFJLE9BQVEsZUFBdUIsQ0FBQyxrQkFBa0IsS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUN0RSxjQUFjLEdBQUcsTUFBTyxlQUF1QixDQUFDLGtCQUFrQixDQUFDLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDakcsQ0FBQzthQUFNLElBQUksT0FBUSxlQUF1QixDQUFDLHlCQUF5QixLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ3BGLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU8sZUFBdUIsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1lBQ3ZHLGNBQWMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFBO1FBQzdCLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLGNBQWMsR0FBRyxDQUFDLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBUyxDQUFDLENBQUE7QUFDM0QsQ0FBQyxDQUFBO0FBakNZLFFBQUEsSUFBSSxRQWlDaEIifQ==