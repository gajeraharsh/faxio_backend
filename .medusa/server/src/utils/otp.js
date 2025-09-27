"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.expiryTimestamp = expiryTimestamp;
exports.isExpired = isExpired;
function generateOtp(length = 6) {
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
}
function expiryTimestamp(minutes = 10) {
    // ISO string for consistent storage
    const d = new Date(Date.now() + minutes * 60 * 1000);
    return d.toISOString();
}
function isExpired(input) {
    if (!input)
        return true;
    let expMs;
    if (input instanceof Date) {
        expMs = input.getTime();
    }
    else {
        const parsed = Date.parse(input);
        if (Number.isNaN(parsed))
            return true;
        expMs = parsed;
    }
    return Date.now() > expMs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL290cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtDQU9DO0FBRUQsMENBSUM7QUFFRCw4QkFXQztBQTFCRCxTQUFnQixXQUFXLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDcEMsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFBO0lBQzNCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQTtJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNoQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRCxTQUFnQixlQUFlLENBQUMsT0FBTyxHQUFHLEVBQUU7SUFDMUMsb0NBQW9DO0lBQ3BDLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQ3BELE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ3hCLENBQUM7QUFFRCxTQUFnQixTQUFTLENBQUMsS0FBNEI7SUFDcEQsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLElBQUksQ0FBQTtJQUN2QixJQUFJLEtBQWEsQ0FBQTtJQUNqQixJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUUsQ0FBQztRQUMxQixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3pCLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUE7UUFDckMsS0FBSyxHQUFHLE1BQU0sQ0FBQTtJQUNoQixDQUFDO0lBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFBO0FBQzNCLENBQUMifQ==