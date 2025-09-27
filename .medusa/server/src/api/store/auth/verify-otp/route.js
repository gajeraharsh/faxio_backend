"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.PostStoreVerifyOtpSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("@medusajs/framework/utils");
const otp_1 = require("../../../../utils/otp");
exports.PostStoreVerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().min(4).max(10),
});
const POST = async (req, res) => {
    const body = req.validatedBody || req.body;
    const { email, code } = body;
    const customerModule = req.scope.resolve(utils_1.Modules.CUSTOMER);
    const [customer] = await customerModule.listCustomers({ email });
    if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
    }
    const verificationModule = req.scope.resolve("verification");
    // Get latest unverified record for this email
    const verifications = await verificationModule.listCustomerEmailVerifications({
        email,
        verified: false,
    });
    const verification = (verifications || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (!verification) {
        return res.status(400).json({ success: false, message: "No OTP pending. Please register again." });
    }
    if ((0, otp_1.isExpired)(verification.expires_at)) {
        return res.status(400).json({ success: false, message: "OTP expired. Please register again." });
    }
    if (String(verification.code) !== String(code)) {
        return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }
    await verificationModule.updateCustomerEmailVerifications([
        {
            id: verification.id,
            verified: true,
            verified_at: new Date(),
            consumed_at: new Date(),
        },
    ]);
    return res.json({ success: true, message: "Email verified successfully" });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvdmVyaWZ5LW90cC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBdUI7QUFDdkIscURBQW1EO0FBQ25ELCtDQUFpRDtBQUVwQyxRQUFBLHdCQUF3QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0MsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUU7SUFDekIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztDQUNoQyxDQUFDLENBQUE7QUFJSyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQXlDLEVBQ3pDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLElBQUksR0FBSSxHQUFXLENBQUMsYUFBYSxJQUFLLEdBQUcsQ0FBQyxJQUE4QixDQUFBO0lBQzlFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFBO0lBRTVCLE1BQU0sY0FBYyxHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxRQUFlLENBQUMsQ0FBQTtJQUN0RSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUNoRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFBO0lBQ2hGLENBQUM7SUFFRCxNQUFNLGtCQUFrQixHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQXFCLENBQUMsQ0FBQTtJQUN4RSw4Q0FBOEM7SUFDOUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyw4QkFBOEIsQ0FBQztRQUM1RSxLQUFLO1FBQ0wsUUFBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQyxDQUFBO0lBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDO1NBQ3ZDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FDN0YsQ0FBQyxDQUFDLENBQUE7SUFDTCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLHdDQUF3QyxFQUFFLENBQUMsQ0FBQTtJQUNwRyxDQUFDO0lBRUQsSUFBSSxJQUFBLGVBQVMsRUFBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN2QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUscUNBQXFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2pHLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDL0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtJQUM5RSxDQUFDO0lBRUQsTUFBTSxrQkFBa0IsQ0FBQyxnQ0FBZ0MsQ0FBQztRQUN4RDtZQUNFLEVBQUUsRUFBRSxZQUFZLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsSUFBSTtZQUNkLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRTtZQUN2QixXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUU7U0FDeEI7S0FDRixDQUFDLENBQUE7SUFFRixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxDQUFDLENBQUE7QUFDNUUsQ0FBQyxDQUFBO0FBN0NZLFFBQUEsSUFBSSxRQTZDaEIifQ==