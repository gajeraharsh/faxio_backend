import { model } from "@medusajs/framework/utils"

const ReelLike = model.define("reel_like", {
  id: model.id().primaryKey(),
  reel_id: model.text(),
  customer_id: model.text(),
})

export default ReelLike
