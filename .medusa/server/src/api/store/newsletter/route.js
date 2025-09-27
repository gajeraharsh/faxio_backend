"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreNewsletterSchema = void 0;
const zod_1 = require("zod");
const newsletter_1 = require("../../../modules/newsletter");
exports.PostStoreNewsletterSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email(),
});
const POST = async (req, res) => {
    const body = req.validatedBody || req.body;
    const { email } = body;
    const svc = req.scope.resolve(newsletter_1.NEWSLETTER_MODULE);
    const customerId = req?.auth_context?.actor_id ?? null;
    const subscription = await svc.subscribe(email, customerId);
    res.json({ subscription });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL25ld3NsZXR0ZXIvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkJBQXVCO0FBQ3ZCLDREQUErRDtBQUdsRCxRQUFBLHlCQUF5QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDaEQsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Q0FDL0MsQ0FBQyxDQUFBO0FBSUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUEwQyxFQUMxQyxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxJQUFJLEdBQUksR0FBVyxDQUFDLGFBQWEsSUFBSyxHQUFHLENBQUMsSUFBK0IsQ0FBQTtJQUMvRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFBO0lBRXRCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUEwQiw4QkFBaUIsQ0FBQyxDQUFBO0lBQ3pFLE1BQU0sVUFBVSxHQUFJLEdBQVcsRUFBRSxZQUFZLEVBQUUsUUFBUSxJQUFJLElBQUksQ0FBQTtJQUUvRCxNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBRTNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFBO0FBQzVCLENBQUMsQ0FBQTtBQWJZLFFBQUEsSUFBSSxRQWFoQiJ9