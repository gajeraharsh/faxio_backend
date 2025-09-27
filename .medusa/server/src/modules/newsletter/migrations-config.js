"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const path_1 = __importDefault(require("path"));
const newsletter_1 = __importDefault(require("./models/newsletter"));
const _1 = require(".");
exports.default = (0, utils_1.defineMikroOrmCliConfig)(_1.NEWSLETTER_MODULE, {
    entities: [newsletter_1.default],
    migrations: {
        path: path_1.default.join(__dirname, "migrations"),
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9ucy1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXdzbGV0dGVyL21pZ3JhdGlvbnMtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscURBQW1FO0FBQ25FLGdEQUF1QjtBQUN2QixxRUFBNEM7QUFDNUMsd0JBQXFDO0FBRXJDLGtCQUFlLElBQUEsK0JBQXVCLEVBQUMsb0JBQWlCLEVBQUU7SUFDeEQsUUFBUSxFQUFFLENBQUMsb0JBQVUsQ0FBVTtJQUMvQixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0tBQ3pDO0NBQ0YsQ0FBQyxDQUFBIn0=