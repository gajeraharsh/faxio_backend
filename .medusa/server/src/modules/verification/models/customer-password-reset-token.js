"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const CustomerPasswordResetToken = utils_1.model.define("customer_password_reset_token", {
    id: utils_1.model.id().primaryKey(),
    customer_id: utils_1.model.text().nullable(),
    email: utils_1.model.text(),
    token_hash: utils_1.model.text(),
    expires_at: utils_1.model.dateTime(),
    used_at: utils_1.model.dateTime().nullable(),
});
exports.default = CustomerPasswordResetToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItcGFzc3dvcmQtcmVzZXQtdG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy92ZXJpZmljYXRpb24vbW9kZWxzL2N1c3RvbWVyLXBhc3N3b3JkLXJlc2V0LXRva2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQWlEO0FBRWpELE1BQU0sMEJBQTBCLEdBQUcsYUFBSyxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsRUFBRTtJQUMvRSxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUUzQixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxLQUFLLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNuQixVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUN4QixVQUFVLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRTtJQUM1QixPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUNyQyxDQUFDLENBQUE7QUFFRixrQkFBZSwwQkFBMEIsQ0FBQSJ9