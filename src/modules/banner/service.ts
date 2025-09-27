import { MedusaService } from "@medusajs/framework/utils"
import Banner from "./models/banner"

class BannerModuleService extends MedusaService({
  Banner,
}) {
  async listSorted(limit = 100) {
    return this.listBanners({
      order: ["position", "-created_at"],
      take: limit,
    } as any)
  }
}

export default BannerModuleService
