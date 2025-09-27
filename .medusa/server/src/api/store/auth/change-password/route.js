"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreChangePasswordSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
exports.PostStoreChangePasswordSchema = zod_1.z.object({
    current_password: zod_1.z.string().min(6, "Current password is required"),
    new_password: zod_1.z.string().min(6, "New password must be at least 6 characters"),
    confirm_password: zod_1.z.string().min(6, "Confirm password is required"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});
const POST = async (req, res) => {
    try {
        const body = (req.validatedBody || req.body);
        const { current_password, new_password } = body;
        const customerId = req.auth_context.actor_id;
        // Fetch customer to get email for the auth identity
        const customerModule = req.scope.resolve(utils_1.Modules.CUSTOMER);
        const customer = await customerModule.retrieveCustomer(customerId);
        if (!customer?.email) {
            return res.status(400).json({ success: false, message: "Customer email not found" });
        }
        const email = customer.email;
        // Verify current password by authenticating with provider
        const authModule = req.scope.resolve(utils_1.Modules.AUTH);
        const authResult = await authModule.authenticate("emailpass", {
            url: req.url,
            headers: req.headers,
            query: req.query,
            body: {
                email,
                password: current_password,
            },
            protocol: req.protocol,
        });
        if (!authResult || authResult.success === false) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }
        // Update password with provider
        const updateResult = await authModule.updateProvider("emailpass", {
            entity_id: email,
            password: new_password,
        });
        if (!updateResult?.success) {
            return res.status(400).json({ success: false, message: updateResult?.error || "Failed to change password" });
        }
        return res.json({ success: true, message: "Password updated successfully" });
    }
    catch (err) {
        console.error("Change password error:", err);
        return res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvY2hhbmdlLXBhc3N3b3JkL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLHFEQUFtRDtBQUNuRCw2QkFBdUI7QUFFVixRQUFBLDZCQUE2QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDcEQsZ0JBQWdCLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsOEJBQThCLENBQUM7SUFDbkUsWUFBWSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLDRDQUE0QyxDQUFDO0lBQzdFLGdCQUFnQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLDhCQUE4QixDQUFDO0NBQ3BFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFO0lBQy9ELE9BQU8sRUFBRSx3QkFBd0I7SUFDakMsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUM7Q0FDM0IsQ0FBQyxDQUFBO0FBSUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUEyRCxFQUMzRCxHQUFtQixFQUNuQixFQUFFO0lBQ0YsSUFBSSxDQUFDO1FBQ0gsTUFBTSxJQUFJLEdBQUcsQ0FBRSxHQUFXLENBQUMsYUFBYSxJQUFLLEdBQUcsQ0FBQyxJQUFtQyxDQUErQixDQUFBO1FBQ25ILE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFFL0MsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUE7UUFFNUMsb0RBQW9EO1FBQ3BELE1BQU0sY0FBYyxHQUFRLEdBQUcsQ0FB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