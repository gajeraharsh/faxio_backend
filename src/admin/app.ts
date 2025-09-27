import { defineAppConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, DocumentText } from "@medusajs/icons"

export default defineAppConfig({
  sidebar: {
    sections: [
      {
        label: "Extensions",
        items: [
          { label: "Reviews", to: "/reviews", icon: ChatBubbleLeftRight },
          { label: "Blogs", to: "/blogs", icon: DocumentText },
          { label: "Reels", to: "/reels", icon: ChatBubbleLeftRight },
          { label: "Contacts", to: "/contacts", icon: ChatBubbleLeftRight },
          { label: "Banners", to: "/banners", icon: DocumentText },
        ],
      },
    ],
  },
})
