"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedReels;
const utils_1 = require("@medusajs/framework/utils");
const reels_1 = require("../modules/reels");
// Helpers
const TAG_POOL = [
    "fashion", "style", "ootd", "trend", "viral", "reels", "shopping", "sale",
    "new", "outfit", "look", "aesthetic", "streetwear", "luxury", "minimal",
];
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function makeHashtags() {
    const n = randInt(2, 6);
    const set = new Set();
    while (set.size < n)
        set.add(pick(TAG_POOL));
    return Array.from(set);
}
// Public sample videos (small mp4s)
const VIDEO_POOL = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
];
function thumb(i) {
    // Deterministic placeholder thumbnail per index
    return `https://picsum.photos/seed/reel_${i}/640/360`;
}
function makeVideo(i) {
    return {
        type: "video",
        name: `Demo Reel Video #${i}`,
        hashtags: makeHashtags(),
        is_display_home: Math.random() < 0.2,
        thumbnail_url: thumb(i),
        video_url: pick(VIDEO_POOL),
    };
}
function makeImage(i) {
    return {
        type: "image",
        name: `Demo Reel Image #${i}`,
        hashtags: makeHashtags(),
        is_display_home: Math.random() < 0.2,
        thumbnail_url: thumb(100000 + i),
        // video_url should be null/undefined for images
    };
}
async function seedReels({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const reelsService = container.resolve(reels_1.REELS_MODULE);
    const VIDEO_COUNT = Number(process.env.REELS_VIDEO_COUNT || 500);
    const IMAGE_COUNT = Number(process.env.REELS_IMAGE_COUNT || 500);
    const BATCH = Number(process.env.REELS_BATCH || 100);
    logger.info(`Seeding reels: ${VIDEO_COUNT} videos and ${IMAGE_COUNT} images (batch ${BATCH})`);
    // Seed videos
    {
        let created = 0;
        const total = VIDEO_COUNT;
        const batches = Math.ceil(total / BATCH);
        for (let b = 0; b < batches; b++) {
            const size = Math.min(BATCH, total - created);
            if (size <= 0)
                break;
            const data = Array.from({ length: size }, (_, idx) => makeVideo(created + idx + 1));
            // eslint-disable-next-line no-await-in-loop
            await reelsService.createReels(data);
            created += size;
            logger.info(`Reels (video) batch ${b + 1}/${batches}: +${size} (total ${created})`);
        }
    }
    // Seed images
    {
        let created = 0;
        const total = IMAGE_COUNT;
        const batches = Math.ceil(total / BATCH);
        for (let b = 0; b < batches; b++) {
            const size = Math.min(BATCH, total - created);
            if (size <= 0)
                break;
            const data = Array.from({ length: size }, (_, idx) => makeImage(created + idx + 1));
            // eslint-disable-next-line no-await-in-loop
            await reelsService.createReels(data);
            created += size;
            logger.info(`Reels (image) batch ${b + 1}/${batches}: +${size} (total ${created})`);
        }
    }
    logger.info(`Finished seeding reels.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1yZWVscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQtcmVlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE2REEsNEJBMkNDO0FBdkdELHFEQUFxRTtBQUNyRSw0Q0FBK0M7QUFFL0MsVUFBVTtBQUNWLE1BQU0sUUFBUSxHQUFHO0lBQ2YsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU07SUFDekUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsU0FBUztDQUN4RSxDQUFBO0FBRUQsU0FBUyxPQUFPLENBQUMsR0FBVyxFQUFFLEdBQVc7SUFDdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7QUFDMUQsQ0FBQztBQUVELFNBQVMsSUFBSSxDQUFJLEdBQVE7SUFDdkIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDcEQsQ0FBQztBQUVELFNBQVMsWUFBWTtJQUNuQixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUE7SUFDN0IsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUM7UUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQzVDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtB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