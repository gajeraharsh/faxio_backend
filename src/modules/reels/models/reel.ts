import { model } from "@medusajs/framework/utils"

export type ReelType = "video" | "image"
export type UploaderType = "admin" | "user"

const Reel = model.define("reel", {
  id: model.id().primaryKey(),

  // Associations
  product_id: model.text().nullable(),
  blog_id: model.text().nullable(),

  // Ownership (future-proof for user uploads)
  uploader_type: model.enum(["admin", "user"]).default("admin" as UploaderType),
  uploader_id: model.text().nullable(),

  // Core fields
  type: model.enum(["video", "image"]).default("image" as ReelType),
  name: model.text(),
  // Store tags as JSON (array or object); schema-agnostic JSON column
  hashtags: model.json().nullable(),
  is_display_home: model.boolean().default(false),

  // Media
  thumbnail_url: model.text().nullable(),
  video_url: model.text().nullable(), // only required when type = "video"
})

export default Reel
