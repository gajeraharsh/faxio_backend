"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendOtpEmail = sendOtpEmail;
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function getTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
        return nodemailer_1.default.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
    }
    // Fallback transport that logs to console for local dev
    return {
        async sendMail(opts) {
            // eslint-disable-next-line no-console
            console.log("[DEV EMAIL]", {
                from: opts.from,
                to: opts.to,
                subject: opts.subject,
                text: opts.text,
                html: opts.html,
            });
            return { messageId: "dev-logged" };
        },
    };
}
async function sendEmail({ to, subject, text, html }) {
    const from = process.env.SMTP_FROM || "no-reply@localhost";
    const transporter = getTransport();
    await transporter.sendMail({ from, to, subject, text, html });
}
async function sendOtpEmail(to, code) {
    const subject = "Your verification code";
    const text = `Your OTP code is ${code}. It expires in 10 minutes.`;
    const html = `<p>Your OTP code is <b>${code}</b>.</p><p>It expires in 10 minutes.</p>`;
    await sendEmail({ to, subject, text, html });
}
async function sendResetPasswordEmail(to, link) {
    const subject = "Reset your password";
    const text = `We received a request to reset your password. Click the link to proceed: ${link}. If you didn't request this, you can ignore this email.`;
    const html = `<p>We received a request to reset your password.</p><p><a href="${link}">Click here to reset your password</a></p><p>If you didn't request this, you can ignore this email.</p>`;
    await sendEmail({ to, subject, text, html });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbHMvZW1haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFtQ0EsOEJBSUM7QUFFRCxvQ0FLQztBQUVELHdEQUtDO0FBckRELDREQUFtQztBQVNuQyxTQUFTLFlBQVk7SUFDbkIsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUE7SUFDbEUsSUFBSSxTQUFTLElBQUksU0FBUyxJQUFJLFNBQVMsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNyRCxPQUFPLG9CQUFVLENBQUMsZUFBZSxDQUFDO1lBQ2hDLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDdkIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO1lBQ2pDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtTQUMzQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0Qsd0RBQXdEO0lBQ3hELE9BQU87UUFDTCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQVM7WUFDdEIsc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFO2dCQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNYLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTthQUNoQixDQUFDLENBQUE7WUFDRixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFBO1FBQ3BDLENBQUM7S0FDSyxDQUFBO0FBQ1YsQ0FBQztBQUVNLEtBQUssVUFBVSxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQWdCO0lBQ3ZFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLG9CQUFvQixDQUFBO0lBQzFELE1BQU0sV0FBVyxHQUFHLFlBQVksRUFBRSxDQUFBO0lBQ2xDLE1BQU0sV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQy9ELENBQUM7QUFFTSxLQUFLLFVBQVUsWUFBWSxDQUFDLEVBQVUsRUFBRSxJQUFZO0lBQ3pELE1BQU0sT0FBTyxHQUFHLHdCQUF3QixDQUFBO0lBQ3hDLE1BQU0sSUFBSSxHQUFHLG9CQUFvQixJQUFJLDZCQUE2QixDQUFBO0lBQ2xFLE1BQU0sSUFBSSxHQUFHLDBCQUEwQixJQUFJLDJDQUEyQyxDQUFBO0lBQ3RGLE1BQU0sU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUM5QyxDQUFDO0FBRU0sS0FBSyxVQUFVLHNCQUFzQixDQUFDLEVBQVUsRUFBRSxJQUFZO0lBQ25FLE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFBO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLDRFQUE0RSxJQUFJLDBEQUEwRCxDQUFBO0lBQ3ZKLE1BQU0sSUFBSSxHQUFHLG1FQUFtRSxJQUFJLDBHQUEwRyxDQUFBO0lBQzlMLE1BQU0sU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUM5QyxDQUFDIn0=