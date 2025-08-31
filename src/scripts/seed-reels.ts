import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { REELS_MODULE } from "../modules/reels"

// Helpers
const TAG_POOL = [
  "fashion", "style", "ootd", "trend", "viral", "reels", "shopping", "sale",
  "new", "outfit", "look", "aesthetic", "streetwear", "luxury", "minimal",
]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeHashtags(): string[] {
  const n = randInt(2, 6)
  const set = new Set<string>()
  while (set.size < n) set.add(pick(TAG_POOL))
  return Array.from(set)
}

// Public sample videos (small mp4s)
const VIDEO_POOL = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
]

function thumb(i: number) {
  // Deterministic placeholder thumbnail per index
  return `https://picsum.photos/seed/reel_${i}/640/360`
}

function makeVideo(i: number) {
  return {
    type: "video" as const,
    name: `Demo Reel Video #${i}`,
    hashtags: makeHashtags(),
    is_display_home: Math.random() < 0.2,
    thumbnail_url: thumb(i),
    video_url: pick(VIDEO_POOL),
  }
}

function makeImage(i: number) {
  return {
    type: "image" as const,
    name: `Demo Reel Image #${i}`,
    hashtags: makeHashtags(),
    is_display_home: Math.random() < 0.2,
    thumbnail_url: thumb(100000 + i),
    // video_url should be null/undefined for images
  }
}

export default async function seedReels({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const reelsService: any = container.resolve(REELS_MODULE as any)

  const VIDEO_COUNT = Number(process.env.REELS_VIDEO_COUNT || 500)
  const IMAGE_COUNT = Number(process.env.REELS_IMAGE_COUNT || 500)
  const BATCH = Number(process.env.REELS_BATCH || 100)

  logger.info(`Seeding reels: ${VIDEO_COUNT} videos and ${IMAGE_COUNT} images (batch ${BATCH})`)

  // Seed videos
  {
    let created = 0
    const total = VIDEO_COUNT
    const batches = Math.ceil(total / BATCH)
    for (let b = 0; b < batches; b++) {
      const size = Math.min(BATCH, total - created)
      if (size <= 0) break
      const data = Array.from({ length: size }, (_, idx) => makeVideo(created + idx + 1))
      // eslint-disable-next-line no-await-in-loop
      await reelsService.createReels(data)
      created += size
      logger.info(`Reels (video) batch ${b + 1}/${batches}: +${size} (total ${created})`)
    }
  }

  // Seed images
  {
    let created = 0
    const total = IMAGE_COUNT
    const batches = Math.ceil(total / BATCH)
    for (let b = 0; b < batches; b++) {
      const size = Math.min(BATCH, total - created)
      if (size <= 0) break
      const data = Array.from({ length: size }, (_, idx) => makeImage(created + idx + 1))
      // eslint-disable-next-line no-await-in-loop
      await reelsService.createReels(data)
      created += size
      logger.info(`Reels (image) batch ${b + 1}/${batches}: +${size} (total ${created})`)
    }
  }

  logger.info(`Finished seeding reels.`)
}
