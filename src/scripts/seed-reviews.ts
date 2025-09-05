import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../modules/review"

// Utility random helpers (no external deps)
const firstNames = [
  "Alex","Jordan","Taylor","Sam","Chris","Pat","Jamie","Casey","Morgan","Riley",
  "Avery","Cameron","Drew","Elliot","Hayden","Jesse","Kai","Logan","Micah","Noel",
]
const lastNames = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
]
const titles = [
  "Great quality!","Exactly what I needed","Highly recommend","Worth the price","Exceeded expectations",
  "Solid purchase","Awesome product","Five stars","Would buy again","Good value",
]
const sentences = [
  "The material feels premium and durable.",
  "Shipping was fast and the item arrived in perfect condition.",
  "Customer support was helpful when I had a question.",
  "The fit is true to size and very comfortable.",
  "I love the design and attention to detail.",
  "Works exactly as described, super happy with it.",
  "After a week of use, I'm very satisfied with the performance.",
  "Packaging was neat and eco-friendly.",
  "I was skeptical at first but this won me over.",
  "A fantastic addition to my daily routine.",
]

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function makeParagraph(): string {
  const n = randInt(2, 4)
  const parts: string[] = []
  for (let i = 0; i < n; i++) parts.push(rand(sentences))
  return parts.join(" ")
}

export default async function seedReviews({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // Resolve services from container
  const productModule: any = container.resolve(Modules.PRODUCT as any)
  const reviewService: any = container.resolve(REVIEW_MODULE as any)

  logger.info("Seeding product reviews...")

  // Fetch all products (iterate in pages to be safe)
  const limit = 100
  let offset = 0
  const allProducts: any[] = []

  while (true) {
    const page = await productModule.listProducts({},{ take: limit, skip: offset })
    if (!page?.length) break
    allProducts.push(...page)
    offset += page.length
    if (page.length < limit) break
  }

  if (!allProducts.length) {
    logger.warn("No products found. Skipping review seeding.")
    return
  }

  logger.info(`Found ${allProducts.length} products. Creating reviews...`)

  // For each product, create at least 50 reviews
  const TARGET_PER_PRODUCT = 50

  for (const p of allProducts) {
    try {
      // Check how many reviews already exist for this product (optional)
      // If the review service exposes listing:
      let existingCount = 0
      try {
        const existing = await reviewService.listReviews({
          filters: { product_id: p.id },
          take: 1,
        })
        // If list returns count, prefer it; otherwise do a quick fetch of many then length
        if (Array.isArray(existing)) {
          // Unknown shape; fallback to 0 to avoid overcomplicating
          existingCount = 0
        } else if (existing?.count != null) {
          existingCount = existing.count
        }
      } catch (_) {}

      const toCreate = Math.max(0, TARGET_PER_PRODUCT - existingCount)
      if (!toCreate) continue

      logger.info(`Product ${p.id}: creating ${toCreate} reviews`)

      // Create in batches
      const batchSize = 100
      let remaining = toCreate
      while (remaining > 0) {
        const size = Math.min(batchSize, remaining)
        const inputs = Array.from({ length: size }).map(() => {
          const first_name = rand(firstNames)
          const last_name = rand(lastNames)
          const rating = randInt(3, 5)
          const title = rand(titles)
          const content = makeParagraph()
          // Randomize status a bit, most approved
          const status = Math.random() < 0.75 ? "approved" : (Math.random() < 0.5 ? "pending" : "rejected")
          return {
            product_id: p.id,
            customer_id: null,
            title,
            content,
            rating,
            first_name,
            last_name,
            status,
          }
        })

        // Bulk create
        await reviewService.createReviews(inputs)
        remaining -= size
      }
    } catch (e) {
      logger.error(`Failed to create reviews for product ${p.id}: ${(e as Error).message}`)
    }
  }

  logger.info("Finished seeding product reviews.")
}
