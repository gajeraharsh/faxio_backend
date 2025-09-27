"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const path_1 = __importDefault(require("path"));
const banner_1 = __importDefault(require("./models/banner"));
const _1 = require(".");
exports.default = (0, utils_1.defineMikroOrmCliConfig)(_1.BANNER_MODULE, {
    entities: [banner_1.default],
    migrations: {
        path: path_1.default.join(__dirname, "migrations"),
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9ucy1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9iYW5uZXIvbWlncmF0aW9ucy1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBbUU7QUFDbkUsZ0RBQXVCO0FBQ3ZCLDZEQUFvQztBQUNwQyx3QkFBaUM7QUFFakMsa0JBQWUsSUFBQSwrQkFBdUIsRUFBQyxnQkFBYSxFQUFFO0lBQ3BELFFBQVEsRUFBRSxDQUFDLGdCQUFNLENBQVU7SUFDM0IsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztLQUN6QztDQUNGLENBQUMsQ0FBQSJ9