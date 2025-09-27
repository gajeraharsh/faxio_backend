"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const CustomerEmailVerification = utils_1.model.define("customer_email_verification", {
    id: utils_1.model.id().primaryKey(),
    customer_id: utils_1.model.text().nullable(),
    email: utils_1.model.text(),
    code: utils_1.model.text(),
    expires_at: utils_1.model.dateTime(),
    consumed_at: utils_1.model.dateTime().nullable(),
    verified: utils_1.model.boolean().default(false),
    verified_at: utils_1.model.dateTime().nullable(),
});
exports.default = CustomerEmailVerification;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItZW1haWwtdmVyaWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvdmVyaWZpY2F0aW9uL21vZGVscy9jdXN0b21lci1lbWFpbC12ZXJpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFFakQsTUFBTSx5QkFBeUIsR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLDZCQUE2QixFQUFFO0lBQzVFLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBRTNCLFdBQVcsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3BDLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ25CLElBQUksRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ2xCLFVBQVUsRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFO0lBQzVCLFdBQVcsRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3hDLFFBQVEsRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUN4QyxXQUFXLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUN6QyxDQUFDLENBQUE7QUFFRixrQkFBZSx5QkFBeUIsQ0FBQSJ9