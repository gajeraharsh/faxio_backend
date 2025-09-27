"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = generateResetToken;
exports.hashToken = hashToken;
exports.resetExpiry = resetExpiry;
const crypto_1 = __importDefault(require("crypto"));
const otp_1 = require("./otp");
function generateResetToken() {
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const token_hash = hashToken(token);
    return { token, token_hash };
}
function hashToken(token) {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
}
function resetExpiry(minutes = 30) {
    return (0, otp_1.expiryTimestamp)(minutes);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3dvcmQtcmVzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbHMvcGFzc3dvcmQtcmVzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxnREFJQztBQUVELDhCQUVDO0FBRUQsa0NBRUM7QUFmRCxvREFBMkI7QUFDM0IsK0JBQXVDO0FBRXZDLFNBQWdCLGtCQUFrQjtJQUNoQyxNQUFNLEtBQUssR0FBRyxnQkFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDcEQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUE7QUFDOUIsQ0FBQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxLQUFhO0lBQ3JDLE9BQU8sZ0JBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNoRSxDQUFDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLE9BQU8sR0FBRyxFQUFFO0lBQ3RDLE9BQU8sSUFBQSxxQkFBZSxFQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2pDLENBQUMifQ==