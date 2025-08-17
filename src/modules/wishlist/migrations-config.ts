import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import WishlistItem from "./models/wishlist-item"
import { WISHLIST_MODULE } from "."

export default defineMikroOrmCliConfig(WISHLIST_MODULE, {
  entities: [WishlistItem] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
