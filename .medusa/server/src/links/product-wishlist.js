"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wishlist_1 = __importDefault(require("../modules/wishlist"));
const product_1 = __importDefault(require("@medusajs/medusa/product"));
const utils_1 = require("@medusajs/framework/utils");
exports.default = (0, utils_1.defineLink)({
    linkable: product_1.default.linkable.product,
    isList: true,
}, wishlist_1.default.linkable.wishlistItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC13aXNobGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saW5rcy9wcm9kdWN0LXdpc2hsaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUVBQWdEO0FBQ2hELHVFQUFvRDtBQUNwRCxxREFBc0Q7QUFFdEQsa0JBQWUsSUFBQSxrQkFBVSxFQUNyQjtJQUNJLFFBQVEsRUFBRSxpQkFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPO0lBQ3hDLE1BQU0sRUFBRSxJQUFJO0NBQ2YsRUFDRCxrQkFBYyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQ3ZDLENBQUEifQ==