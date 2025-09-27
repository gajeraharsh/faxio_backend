"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const Reel = utils_1.model.define("reel", {
    id: utils_1.model.id().primaryKey(),
    // Associations
    product_id: utils_1.model.text().nullable(),
    blog_id: utils_1.model.text().nullable(),
    // Ownership (future-proof for user uploads)
    uploader_type: utils_1.model.enum(["admin", "user"]).default("admin"),
    uploader_id: utils_1.model.text().nullable(),
    // Core fields
    type: utils_1.model.enum(["video", "image"]).default("image"),
    name: utils_1.model.text(),
    // Store tags as JSON (array or object); schema-agnostic JSON column
    hashtags: utils_1.model.json().nullable(),
    is_display_home: utils_1.model.boolean().default(false),
    // Media
    thumbnail_url: utils_1.model.text().nullable(),
    video_url: utils_1.model.text().nullable(), // only required when type = "video"
});
exports.default = Reel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3JlZWxzL21vZGVscy9yZWVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQWlEO0FBS2pELE1BQU0sSUFBSSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0lBQ2hDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBRTNCLGVBQWU7SUFDZixVQUFVLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNuQyxPQUFPLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUVoQyw0Q0FBNEM7SUFDNUMsYUFBYSxFQUFFLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBdUIsQ0FBQztJQUM3RSxXQUFXLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUVwQyxjQUFjO0lBQ2QsSUFBSSxFQUFFLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBbUIsQ0FBQztJQUNqRSxJQUFJLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRTtJQUNsQixvRUFBb0U7SUFDcEUsUUFBUSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDakMsZUFBZSxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBRS9DLFFBQVE7SUFDUixhQUFhLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUN0QyxTQUFTLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLG9DQUFvQztDQUN6RSxDQUFDLENBQUE7QUFFRixrQkFBZSxJQUFJLENBQUEifQ==