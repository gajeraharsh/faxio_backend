import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import Reel from "./models/reel"
import { REELS_MODULE } from "."

export default defineMikroOrmCliConfig(REELS_MODULE, {
  entities: [Reel] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
