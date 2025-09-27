"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreForgotPasswordSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
const password_reset_1 = require("../../../../utils/password-reset");
const email_1 = require("../../../../utils/email");
exports.PostStoreForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const POST = async (req, res) => {
    const body = req.validatedBody || req.body;
    const { email } = body;
    // Always 200 to prevent email enumeration
    try {
        // Find customer if exists
        const customerModule = req.scope.resolve(utils_1.Modules.CUSTOMER);
        const [customer] = await customerModule.listCustomers({ email });
        // Generate token
        const { token, token_hash } = (0, password_reset_1.generateResetToken)();
        const expires_at = (0, password_reset_1.resetExpiry)(30);
        // Store token in verification module table
        const verificationModule = req.scope.resolve("verification");
        // Optional: clean up previous tokens for this email by marking used
        const existing = await verificationModule.listCustomerPasswordResetTokens({ email, used_at: null });
        if (existing?.length) {
            await verificationModule.updateCustomerPasswordResetTokens(existing.map((e) => ({ id: e.id, used_at: new Date() })));
        }
        await verificationModule.createCustomerPasswordResetTokens([
            {
                customer_id: customer?.id || null,
                email,
                token_hash,
                expires_at,
            },
        ]);
        // Build reset link to frontend
        const base = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const link = `${base.replace(/\/$/, "")}/auth/reset-password?token=${token}`;
        await (0, email_1.sendResetPasswordEmail)(email, link);
    }
    catch (e) {
        // swallow errors to avoid enumeration
    }
    return res.json({ success: true, message: "If an account exists, a reset email has been sent." });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvZm9yZ290LXBhc3N3b3JkL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUFtRDtBQUNuRCw2QkFBdUI7QUFDdkIscUVBQWtGO0FBQ2xGLG1EQUFnRTtBQUduRCxRQUFBLDZCQUE2QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDcEQsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Q0FDMUIsQ0FBQyxDQUFBO0FBSUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUE4QyxFQUM5QyxHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxJQUFJLEdBQUksR0FBVyxDQUFDLGFBQWEsSUFBSyxHQUFHLENBQUMsSUFBbUMsQ0FBQTtJQUNuRixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFBO0lBRXRCLDBDQUEwQztJQUMxQyxJQUFJLENBQUM7UUFDSCwwQkFBMEI7UUFDMUIsTUFBTSxjQUFjLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQWUsQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBRWhFLGlCQUFpQjtRQUNqQixNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUEsbUNBQWtCLEdBQUUsQ0FBQTtRQUNsRCxNQUFNLFVBQVUsR0FBRyxJQUFBLDRCQUFXLEVBQUMsRUFBRSxDQUFDLENBQUE7UUFFbEMsMkNBQTJDO1FBQzNDLE1BQU0sa0JBQWtCLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBcUIsQ0FBQyxDQUFBO1FBRXhFLG9FQUFvRTtRQUNwRSxNQUFNLFFBQVEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLCtCQUErQixDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ25HLElBQUksUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ3JCLE1BQU0sa0JBQWtCLENBQUMsaUNBQWlDLENBQ3hELFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDOUQsQ0FBQTtRQUNILENBQUM7UUFFRCxNQUFNLGtCQUFrQixDQUFDLGlDQUFpQyxDQUFDO1lBQ3pEO2dCQUNFLFdBQVcsRUFBRSxRQUFRLEVBQUUsRUFBRSxJQUFJLElBQUk7Z0JBQ2pDLEtBQUs7Z0JBQ0wsVUFBVTtnQkFDVixVQUFVO2FBQ1g7U0FDRixDQUFDLENBQUE7UUFFRiwrQkFBK0I7UUFDL0IsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsSUFBSSx1QkFBdUIsQ0FBQTtRQUNuRyxNQUFNLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyw4QkFBOEIsS0FBSyxFQUFFLENBQUE7UUFFNUUsTUFBTSxJQUFBLDhCQUFzQixFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNYLHNDQUFzQztJQUN4QyxDQUFDO0lBRUQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsb0RBQW9ELEVBQUUsQ0FBQyxDQUFBO0FBQ25HLENBQUMsQ0FBQTtBQS9DWSxRQUFBLElBQUksUUErQ2hCIn0=