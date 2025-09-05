import { defineAppConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, DocumentText, Film } from "@medusajs/icons"

export default defineAppConfig({
  sidebar: {
    sections: [
      {
        label: "Extensions",
        items: [
          { label: "Reviews", to: "/reviews", icon: ChatBubbleLeftRight },
          { label: "Blogs", to: "/blogs", icon: DocumentText },
          { label: "Reels", to: "/reels", icon: Film },
        ],
      },
    ],
  },
})
