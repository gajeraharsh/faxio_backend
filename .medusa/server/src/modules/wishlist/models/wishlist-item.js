"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
// Wishlist Item model
const WishlistItem = utils_1.model.define("wishlist_item", {
    id: utils_1.model.id().primaryKey(),
    // Associations (stored as IDs)
    product_id: utils_1.model.text(),
    customer_id: utils_1.model.text(), // logged-in only, non-null
    // Optional note
    notes: utils_1.model.text().nullable(),
});
exports.default = WishlistItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lzaGxpc3QtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3dpc2hsaXN0L21vZGVscy93aXNobGlzdC1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQWlEO0FBRWpELHNCQUFzQjtBQUN0QixNQUFNLFlBQVksR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtJQUNqRCxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUUzQiwrQkFBK0I7SUFDL0IsVUFBVSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDeEIsV0FBVyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSwyQkFBMkI7SUFFdEQsZ0JBQWdCO0lBQ2hCLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQy9CLENBQUMsQ0FBQTtBQUVGLGtCQUFlLFlBQVksQ0FBQSJ9