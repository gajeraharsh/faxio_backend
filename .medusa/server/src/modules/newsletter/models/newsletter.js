"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
// Newsletter subscription model
const Newsletter = utils_1.model.define("newsletter", {
    id: utils_1.model.id().primaryKey(),
    email: utils_1.model.text(),
    customer_id: utils_1.model.text().nullable(),
});
exports.default = Newsletter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3c2xldHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL25ld3NsZXR0ZXIvbW9kZWxzL25ld3NsZXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFFakQsZ0NBQWdDO0FBQ2hDLE1BQU0sVUFBVSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO0lBQzVDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ25CLFdBQVcsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQ3JDLENBQUMsQ0FBQTtBQUVGLGtCQUFlLFVBQVUsQ0FBQSJ9