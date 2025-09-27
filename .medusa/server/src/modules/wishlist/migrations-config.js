"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const path_1 = __importDefault(require("path"));
const wishlist_item_1 = __importDefault(require("./models/wishlist-item"));
const _1 = require(".");
exports.default = (0, utils_1.defineMikroOrmCliConfig)(_1.WISHLIST_MODULE, {
    entities: [wishlist_item_1.default],
    migrations: {
        path: path_1.default.join(__dirname, "migrations"),
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9ucy1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy93aXNobGlzdC9taWdyYXRpb25zLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUFtRTtBQUNuRSxnREFBdUI7QUFDdkIsMkVBQWlEO0FBQ2pELHdCQUFtQztBQUVuQyxrQkFBZSxJQUFBLCtCQUF1QixFQUFDLGtCQUFlLEVBQUU7SUFDdEQsUUFBUSxFQUFFLENBQUMsdUJBQVksQ0FBVTtJQUNqQyxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0tBQ3pDO0NBQ0YsQ0FBQyxDQUFBIn0=