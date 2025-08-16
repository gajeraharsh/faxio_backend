import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import path from "path"
import Review from "./models/review"
import { REVIEW_MODULE } from "."

export default defineMikroOrmCliConfig(REVIEW_MODULE, {
  entities: [Review] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
})
