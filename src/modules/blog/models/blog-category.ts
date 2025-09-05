import { model } from "@medusajs/framework/utils"

const BlogCategory = model.define("blog_category", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default BlogCategory
