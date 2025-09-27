"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreResetPasswordSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
const password_reset_1 = require("../../../../../utils/password-reset");
const otp_1 = require("../../../../../utils/otp");
exports.PostStoreResetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(10),
    password: zod_1.z.string().min(6),
});
const POST = async (req, res) => {
    const { provider } = req.params;
    const body = req.validatedBody || req.body;
    const { token, password } = body;
    // Validate provider
    const authProvider = provider || "emailpass";
    try {
        const token_hash = (0, password_reset_1.hashToken)(token);
        const verificationModule = req.scope.resolve("verification");
        const [record] = await verificationModule.listCustomerPasswordResetTokens({ token_hash }, { order: { created_at: "DESC" } });
        if (!record) {
            return res.status(400).json({ success: false, message: "Invalid or already used token" });
        }
        if (record.used_at) {
            return res.status(400).json({ success: false, message: "Token already used" });
        }
        if ((0, otp_1.isExpired)(record.expires_at)) {
            // mark used to prevent reuse
            await verificationModule.updateCustomerPasswordResetTokens([{ id: record.id, used_at: new Date() }]);
            return res.status(400).json({ success: false, message: "Token expired" });
        }
        const email = record.email;
        if (!email) {
            return res.status(400).json({ success: false, message: "Token not linked to an email" });
        }
        // Update password via Auth module
        const authModule = req.scope.resolve(utils_1.Modules.AUTH);
        const result = await authModule.updateProvider(authProvider, {
            entity_id: email,
            password,
        });
        if (!result?.success) {
            return res.status(400).json({ success: false, message: result?.error || "Failed to reset password" });
        }
        // Mark token used
        await verificationModule.updateCustomerPasswordResetTokens([{ id: record.id, used_at: new Date() }]);
        return res.json({ success: true, message: "Password has been reset successfully" });
    }
    catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvcmVzZXQtcGFzc3dvcmQvW3Byb3ZpZGVyXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBbUQ7QUFDbkQsNkJBQXVCO0FBQ3ZCLHdFQUErRDtBQUMvRCxrREFBb0Q7QUFFdkMsUUFBQSw0QkFBNEIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ25ELEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUN6QixRQUFRLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDNUIsQ0FBQyxDQUFBO0FBSUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUE2QyxFQUM3QyxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFhLENBQUE7SUFDdEMsTUFBTSxJQUFJLEdBQUksR0FBVyxDQUFDLGFBQWEsSUFBSyxHQUFHLENBQUMsSUFBa0MsQ0FBQTtJQUNsRixNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQTtJQUVoQyxvQkFBb0I7SUFDcEIsTUFBTSxZQUFZLEdBQUcsUUFBUSxJQUFJLFdBQVcsQ0FBQTtJQUU1QyxJQUFJLENBQUM7UUFDSCxNQUFNLFVBQVUsR0FBRyxJQUFBLDBCQUFTLEVBQUMsS0FBSyxDQUFDLENBQUE7UUFFbkMsTUFBTSxrQkFBa0IsR0FBUSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFxQixDQUFDLENBQUE7UUFFeEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sa0JBQWtCLENBQUMsK0JBQStCLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFNUgsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQTtRQUMzRixDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtRQUNoRixDQUFDO1FBRUQsSUFBSSxJQUFBLGVBQVMsRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNqQyw2QkFBNkI7WUFDN0IsTUFBTSxrQkFBa0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDcEcsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUE7UUFDM0UsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUE7UUFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1gsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFLENBQUMsQ0FBQTtRQUMxRixDQUFDO1FBRUQsa0NBQWtDO1FBQ2xDLE1BQU0sVUFBVSxHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxJQUFXLENBQUMsQ0FBQTtRQUM5RCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO1lBQzNELFNBQVMsRUFBRSxLQUFLO1lBQ2hCLFFBQVE7U0FDVCxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxJQUFJLDBCQUEwQixFQUFFLENBQUMsQ0FBQTtRQUN2RyxDQUFDO1FBRUQsa0JBQWtCO1FBQ2xCLE1BQU0sa0JBQWtCLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRXBHLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLENBQUMsQ0FBQTtJQUNyRixDQUFDO0lBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzNDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxJQUFJLHVCQUF1QixFQUFFLENBQUMsQ0FBQTtJQUNsRyxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBeERZLFFBQUEsSUFBSSxRQXdEaEIifQ==