import { Module } from "@medusajs/framework/utils"
import ReelsModuleService from "./service"

export const REELS_MODULE = "reels"

export default Module(REELS_MODULE, {
  service: ReelsModuleService,
})
