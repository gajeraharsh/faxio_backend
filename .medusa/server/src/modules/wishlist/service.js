"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const wishlist_item_1 = __importDefault(require("./models/wishlist-item"));
class WishlistModuleService extends (0, utils_1.MedusaService)({
    WishlistItem: wishlist_item_1.default,
}) {
    async listByCustomer(customerId) {
        return this.listWishlistItems({ customer_id: customerId });
    }
    async addItem(input) {
        // enforce uniqueness by (customer_id, product_id)
        const existing = await this.listWishlistItems({ customer_id: input.customer_id, product_id: input.product_id });
        if (existing?.length)
            return existing[0];
        return this.createWishlistItems({ ...input });
    }
    async removeById(id, customerId) {
        // ensure ownership
        const items = await this.listWishlistItems({ id, customer_id: customerId });
        if (!items?.length)
            return { id, deleted: false };
        await this.deleteWishlistItems(id);
        return { id, deleted: true };
    }
    async removeByProduct(productId, customerId) {
        const items = await this.listWishlistItems({ product_id: productId, customer_id: customerId });
        if (!items?.length)
            return { deleted: false };
        await this.deleteWishlistItems(items[0].id);
        return { id: items[0].id, deleted: true };
    }
    async isInWishlist(productId, customerId) {
        const items = await this.listWishlistItems({ product_id: productId, customer_id: customerId });
        return !!items?.length;
    }
    async toggle(productId, customerId) {
        const items = await this.listWishlistItems({ product_id: productId, customer_id: customerId });
        if (items?.length) {
            await this.deleteWishlistItems(items[0].id);
            return { status: "removed", id: items[0].id };
        }
        const created = await this.createWishlistItems({ product_id: productId, customer_id: customerId });
        return { status: "added", item: created };
    }
}
exports.default = WishlistModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3dpc2hsaXN0L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBeUQ7QUFDekQsMkVBQWlEO0FBRWpELE1BQU0scUJBQXNCLFNBQVEsSUFBQSxxQkFBYSxFQUFDO0lBQ2hELFlBQVksRUFBWix1QkFBWTtDQUNiLENBQUM7SUFDQSxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQWtCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7SUFDNUQsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBeUU7UUFDckYsa0RBQWtEO1FBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQy9HLElBQUksUUFBUSxFQUFFLE1BQU07WUFBRSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4QyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEdBQUcsS0FBSyxFQUFTLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFVLEVBQUUsVUFBa0I7UUFDN0MsbUJBQW1CO1FBQ25CLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTTtZQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFBO1FBQ2pELE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLE9BQU8sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQWlCLEVBQUUsVUFBa0I7UUFDekQsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQzlGLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTTtZQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7UUFDN0MsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDM0MsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBaUIsRUFBRSxVQUFrQjtRQUN0RCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDOUYsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQTtJQUN4QixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFpQixFQUFFLFVBQWtCO1FBQ2hELE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtRQUM5RixJQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFrQixFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUE7UUFDeEQsQ0FBQztRQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFTLENBQUMsQ0FBQTtRQUN6RyxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQWdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFBO0lBQ3BELENBQUM7Q0FDRjtBQUVELGtCQUFlLHFCQUFxQixDQUFBIn0=