import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import Contact from "./models/contact"
import { CONTACT_MODULE } from "."

export default defineMikroOrmCliConfig(CONTACT_MODULE, {
  entities: [Contact] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
