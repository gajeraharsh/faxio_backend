"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
// Contact Us model
const Contact = utils_1.model.define("contact", {
    id: utils_1.model.id().primaryKey(),
    name: utils_1.model.text(),
    email: utils_1.model.text(),
    phone: utils_1.model.text().nullable(),
    subject: utils_1.model.text(),
    message: utils_1.model.text(),
    status: utils_1.model.enum(["new", "in_progress", "resolved"]).default("new"),
});
exports.default = Contact;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbnRhY3QvbW9kZWxzL2NvbnRhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFFakQsbUJBQW1CO0FBQ25CLE1BQU0sT0FBTyxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0lBQ3RDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLElBQUksRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ2xCLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ25CLEtBQUssRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzlCLE9BQU8sRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3JCLE9BQU8sRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ3JCLE1BQU0sRUFBRSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Q0FDdEUsQ0FBQyxDQUFBO0FBRUYsa0JBQWUsT0FBTyxDQUFBIn0=