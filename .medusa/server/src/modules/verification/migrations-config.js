"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const path_1 = __importDefault(require("path"));
const customer_email_verification_1 = __importDefault(require("./models/customer-email-verification"));
const customer_password_reset_token_1 = __importDefault(require("./models/customer-password-reset-token"));
const _1 = require(".");
exports.default = (0, utils_1.defineMikroOrmCliConfig)(_1.VERIFICATION_MODULE, {
    entities: [customer_email_verification_1.default, customer_password_reset_token_1.default],
    migrations: {
        path: path_1.default.join(__dirname, "migrations"),
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9ucy1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy92ZXJpZmljYXRpb24vbWlncmF0aW9ucy1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBbUU7QUFDbkUsZ0RBQXVCO0FBQ3ZCLHVHQUE0RTtBQUM1RSwyR0FBK0U7QUFDL0Usd0JBQXVDO0FBRXZDLGtCQUFlLElBQUEsK0JBQXVCLEVBQUMsc0JBQW1CLEVBQUU7SUFDMUQsUUFBUSxFQUFFLENBQUMscUNBQXlCLEVBQUUsdUNBQTBCLENBQVU7SUFDMUUsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztLQUN6QztDQUNGLENBQUMsQ0FBQSJ9