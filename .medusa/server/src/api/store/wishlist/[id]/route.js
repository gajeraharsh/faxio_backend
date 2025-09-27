"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = void 0;
const wishlist_1 = require("../../../../modules/wishlist");
const DELETE = async (req, res) => {
    const customerId = req.auth_context?.actor_id;
    if (!customerId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
    const result = await wishlistService.removeById(id, customerId);
    res.json(result);
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3dpc2hsaXN0L1tpZF0vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkRBQThEO0FBR3ZELE1BQU0sTUFBTSxHQUFHLEtBQUssRUFDekIsR0FBK0IsRUFDL0IsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sVUFBVSxHQUFJLEdBQUcsQ0FBQyxZQUFvQixFQUFFLFFBQVEsQ0FBQTtJQUN0RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDaEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFDRCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQXdCLENBQUE7SUFFM0MsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQXdCLDBCQUFlLENBQUMsQ0FBQTtJQUNqRixNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQWUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQy9ELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEIsQ0FBQyxDQUFBO0FBYlksUUFBQSxNQUFNLFVBYWxCIn0=