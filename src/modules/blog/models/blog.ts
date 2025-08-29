import { model } from "@medusajs/framework/utils"

const Blog = model.define("blog", {
  id: model.id().primaryKey(),

  // Associations
  category_id: model.text(),

  // Core fields
  title: model.text(),
  image_url: model.text().nullable(),
  short_description: model.text().nullable(),
  content: model.text(),
  hashtags: model.json<{ tags: string[] } | string[] | null>().nullable(),
  read_time: model.number().nullable(),
})

export default Blog
