import { MedusaService } from "@medusajs/framework/utils"
import Blog from "./models/blog"
import BlogCategory from "./models/blog-category"

class BlogModuleService extends MedusaService({
  Blog,
  BlogCategory,
}) {
  // Helpers
  async listBlogsWithFilters(filters: any = {}, order = "-created_at") {
    return this.listBlogs({ filters, order })
  }
}

export default BlogModuleService
