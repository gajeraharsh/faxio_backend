"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreRegisterSchema = void 0;
const zod_1 = require("zod");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const utils_1 = require("@medusajs/framework/utils");
const otp_1 = require("../../../../utils/otp");
const email_1 = require("../../../../utils/email");
exports.PostStoreRegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    first_name: zod_1.z.string().optional(),
    last_name: zod_1.z.string().optional(),
});
const POST = async (req, res) => {
    try {
        const body = req.validatedBody || req.body;
        const { email, password, first_name, last_name } = body;
        // 1) Register auth identity (email + password) using Auth module
        const authModule = req.scope.resolve(utils_1.Modules.AUTH);
        const identity = await authModule.register("emailpass", {
            url: req.url,
            headers: req.headers,
            query: req.query,
            body: {
                email,
                password,
                first_name,
                last_name,
            },
            protocol: req.protocol,
        });
        console.log(identity, "identity");
        if (!identity || identity.success === false || !identity.authIdentity?.id) {
            return res.status(400).json({
                success: false,
                message: identity?.error || "Failed to create auth identity",
            });
        }
        const authIdentityId = identity.authIdentity.id;
        // 2) Create customer and attach to auth identity via workflow
        await (0, core_flows_1.createCustomerAccountWorkflow)(req.scope).run({
            input: {
                authIdentityId,
                customerData: { email, first_name, last_name },
            },
        });
        // 3) Generate OTP and save to verification table
        const otp = (0, otp_1.generateOtp)(6);
        const expires_at = (0, otp_1.expiryTimestamp)(10);
        const customerModule = req.scope.resolve(utils_1.Modules.CUSTOMER);
        const [customer] = await customerModule.listCustomers({ email });
        if (!customer) {
            return res.status(500).json({
                success: false,
                message: "Customer creation failed",
            });
        }
        const verificationModule = req.scope.resolve("verification");
        await verificationModule.createCustomerEmailVerifications([
            {
                customer_id: customer.id,
                email,
                code: otp,
                expires_at,
                verified: false,
            },
        ]);
        // 4) Send email with OTP
        await (0, email_1.sendOtpEmail)(email, otp);
        return res.json({
            success: true,
            message: "OTP sent to email. Please verify to complete registration.",
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error during registration",
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvcmVnaXN0ZXIvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkJBQXVCO0FBQ3ZCLDREQUEyRTtBQUMzRSxxREFBbUQ7QUFDbkQsK0NBQW9FO0FBQ3BFLG1EQUFzRDtBQUV6QyxRQUFBLHVCQUF1QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUMsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUU7SUFDekIsUUFBUSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNCLFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ2pDLFNBQVMsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQ2pDLENBQUMsQ0FBQTtBQUlLLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBd0MsRUFDeEMsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFJLEdBQVcsQ0FBQyxhQUFhLElBQUssR0FBRyxDQUFDLElBQTZCLENBQUE7UUFDN0UsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQTtRQUV2RCxpRUFBaUU7UUFDakUsTUFBTSxVQUFVLEdBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLElBQVcsQ0FBQyxDQUFBO1FBQzlELE1BQU0sUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDdEQsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ1osT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3BC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