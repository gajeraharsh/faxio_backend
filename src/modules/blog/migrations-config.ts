import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import Blog from "./models/blog"
import BlogCategory from "./models/blog-category"
import { BLOG_MODULE } from "."

export default defineMikroOrmCliConfig(BLOG_MODULE, {
  entities: [Blog, BlogCategory] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
