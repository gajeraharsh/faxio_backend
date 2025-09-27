"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreWishlistToggleSchema = void 0;
const zod_1 = require("zod");
const wishlist_1 = require("../../../../modules/wishlist");
exports.PostStoreWishlistToggleSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
});
const POST = async (req, res) => {
    const input = req.validatedBody || req.body;
    const customerId = req.auth_context?.actor_id;
    if (!customerId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
    const result = await wishlistService.toggle(input.product_id, customerId);
    res.json(result);
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3dpc2hsaXN0L3RvZ2dsZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBdUI7QUFDdkIsMkRBQThEO0FBR2pELFFBQUEsNkJBQTZCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNwRCxVQUFVLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtDQUN2QixDQUFDLENBQUE7QUFJSyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQTJELEVBQzNELEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsYUFBYSxJQUFLLEdBQUcsQ0FBQyxJQUFtQyxDQUFBO0lBQzNFLE1BQU0sVUFBVSxHQUFJLEdBQUcsQ0FBQyxZQUFvQixFQUFFLFFBQVEsQ0FBQTtJQUN0RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDaEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFFRCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBd0IsMEJBQWUsQ0FBQyxDQUFBO0lBQ2pGLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ3pFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEIsQ0FBQyxDQUFBO0FBYlksUUFBQSxJQUFJLFFBYWhCIn0=