"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const ReelLike = utils_1.model.define("reel_like", {
    id: utils_1.model.id().primaryKey(),
    reel_id: utils_1.model.text(),
    customer_id: utils_1.model.text(),
});
exports.default = ReelLike;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVlbF9saWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcmVlbHMvbW9kZWxzL3JlZWxfbGlrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFpRDtBQUVqRCxNQUFNLFFBQVEsR0FBRyxhQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtJQUN6QyxFQUFFLEVBQUUsYUFBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUMzQixPQUFPLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNyQixXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtDQUMxQixDQUFDLENBQUE7QUFFRixrQkFBZSxRQUFRLENBQUEifQ==