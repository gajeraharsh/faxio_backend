import WishlistModule from "../modules/wishlist"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    {
        linkable: ProductModule.linkable.product,
        isList: true,
    },
    WishlistModule.linkable.wishlistItem
)
