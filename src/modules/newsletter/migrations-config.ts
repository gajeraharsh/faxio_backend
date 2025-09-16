import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import Newsletter from "./models/newsletter"
import { NEWSLETTER_MODULE } from "."

export default defineMikroOrmCliConfig(NEWSLETTER_MODULE, {
  entities: [Newsletter] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
