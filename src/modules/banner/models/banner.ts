import { model } from "@medusajs/framework/utils"

// Banner model for homepage/carousel banners
const Banner = model.define("banner", {
  id: model.id().primaryKey(),
  name: model.text(),
  desktop_image_url: model.text().nullable(),
  mobile_image_url: model.text().nullable(),
  link_url: model.text().nullable(),
  position: model.number().default(0), // sort order: 0,1,2...
})

export default Banner
