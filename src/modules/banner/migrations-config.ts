import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import Banner from "./models/banner"
import { BANNER_MODULE } from "."

export default defineMikroOrmCliConfig(BANNER_MODULE, {
  entities: [Banner] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
