"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedReviews;
const utils_1 = require("@medusajs/framework/utils");
const review_1 = require("../modules/review");
// Utility random helpers (no external deps)
const firstNames = [
    "Alex", "Jordan", "Taylor", "Sam", "Chris", "Pat", "Jamie", "Casey", "Morgan", "Riley",
    "Avery", "Cameron", "Drew", "Elliot", "Hayden", "Jesse", "Kai", "Logan", "Micah", "Noel",
];
const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];
const titles = [
    "Great quality!", "Exactly what I needed", "Highly recommend", "Worth the price", "Exceeded expectations",
    "Solid purchase", "Awesome product", "Five stars", "Would buy again", "Good value",
];
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
];
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function makeParagraph() {
    const n = randInt(2, 4);
    const parts = [];
    for (let i = 0; i < n; i++)
        parts.push(rand(sentences));
    return parts.join(" ");
}
async function seedReviews({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    // Resolve services from container
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    const reviewService = container.resolve(review_1.REVIEW_MODULE);
    logger.info("Seeding product reviews...");
    // Fetch all products (iterate in pages to be safe)
    const limit = 100;
    let offset = 0;
    const allProducts = [];
    while (true) {
        const page = await productModule.listProducts({}, { take: limit, skip: offset });
        if (!page?.length)
            break;
        allProducts.push(...page);
        offset += page.length;
        if (page.length < limit)
            break;
    }
    if (!allProducts.length) {
        logger.warn("No products found. Skipping review seeding.");
        return;
    }
    logger.info(`Found ${allProducts.length} products. Creating reviews...`);
    // For each product, create at least 50 reviews
    const TARGET_PER_PRODUCT = 50;
    for (const p of allProducts) {
        try {
            // Check how many reviews already exist for this product (optional)
            // If the review service exposes listing:
            let existingCount = 0;
            try {
                const existing = await reviewService.listReviews({
                    filters: { product_id: p.id },
                    take: 1,
                });
                // If list returns count, prefer it; otherwise do a quick fetch of many then length
                if (Array.isArray(existing)) {
                    // Unknown shape; fallback to 0 to avoid overcomplicating
                    existingCount = 0;
                }
                else if (existing?.count != null) {
                    existingCount = existing.count;
                }
            }
            catch (_) { }
            const toCreate = Math.max(0, TARGET_PER_PRODUCT - existingCount);
            if (!toCreate)
                continue;
            logger.info(`Product ${p.id}: creating ${toCreate} reviews`);
            // Create in batches
            const batchSize = 100;
            let remaining = toCreate;
            while (remaining > 0) {
                const size = Math.min(batchSize, remaining);
                const inputs = Array.from({ length: size }).map(() => {
                    const first_name = rand(firstNames);
                    const last_name = rand(lastNames);
                    const rating = randInt(3, 5);
                    const title = rand(titles);
                    const content = makeParagraph();
                    // Randomize status a bit, most approved
                    const status = Math.random() < 0.75 ? "approved" : (Math.random() < 0.5 ? "pending" : "rejected");
                    return {
                        product_id: p.id,
                        customer_id: null,
                        title,
                        content,
                        rating,
                        first_name,
                        last_name,
                        status,
                    };
                });
                // Bulk create
                await reviewService.createReviews(inputs);
                remaining -= size;
            }
        }
        catch (e) {
            logger.error(`Failed to create reviews for product ${p.id}: ${e.message}`);
        }
    }
    logger.info("Finished seeding product reviews.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1yZXZpZXdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2VlZC1yZXZpZXdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBdUNBLDhCQTJGQztBQWpJRCxxREFBOEU7QUFDOUUsOENBQWlEO0FBRWpELDRDQUE0QztBQUM1QyxNQUFNLFVBQVUsR0FBRztJQUNqQixNQUFNLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxPQUFPO0lBQzdFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU07Q0FDaEYsQ0FBQTtBQUNELE1BQU0sU0FBUyxHQUFHO0lBQ2hCLE9BQU8sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsV0FBVyxFQUFDLFVBQVU7SUFDN0YsV0FBVyxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsUUFBUTtDQUNoRyxDQUFBO0FBQ0QsTUFBTSxNQUFNLEdBQUc7SUFDYixnQkFBZ0IsRUFBQyx1QkFBdUIsRUFBQyxrQkFBa0IsRUFBQyxpQkFBaUIsRUFBQyx1QkFBdUI7SUFDckcsZ0JBQWdCLEVBQUMsaUJBQWlCLEVBQUMsWUFBWSxFQUFDLGlCQUFpQixFQUFDLFlBQVk7Q0FDL0UsQ0FBQTtBQUNELE1BQU0sU0FBUyxHQUFHO0lBQ2hCLHlDQUF5QztJQUN6Qyw4REFBOEQ7SUFDOUQscURBQXFEO0lBQ3JELCtDQUErQztJQUMvQyw0Q0FBNEM7SUFDNUMsa0RBQWtEO0lBQ2xELCtEQUErRDtJQUMvRCxzQ0FBc0M7SUFDdEMsZ0RBQWdEO0lBQ2hELDJDQUEyQztDQUM1QyxDQUFBO0FBRUQsU0FBUyxJQUFJLENBQUksR0FBUSxJQUFPLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNwRixTQUFTLE9BQU8sQ0FBQyxHQUFXLEVBQUUsR0FBVyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBLENBQUMsQ0FBQztBQUN2RyxTQUFTLGFBQWE7SUFDcEIsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN2QixNQUFNLEtBQUssR0FBYSxFQUFFLENBQUE7SUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQ3ZELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN4QixDQUFDO0FBRWMsS0FBSyxVQUFVLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUMvRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRWxFLGtDQUFrQztJQUNsQyxNQUFNLGFBQWEsR0FBUSxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFjLENBQUMsQ0FBQTtJQUNwRSxNQUFNLGFBQWEsR0FBUSxTQUFTLENBQUMsT0FBTyxDQUFDLHNCQUFvQixDQUFDLENBQUE7SUFFbEUsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0lBRXpDLG1EQUFtRDtJQUNuRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUE7SUFDakIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBQ2QsTUFBTSxXQUFXLEdBQVUsRUFBRSxDQUFBO0lBRTdCLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDWixNQUFNLElBQUksR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU07WUFBRSxNQUFLO1FBQ3hCLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtRQUN6QixNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUNyQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSztZQUFFLE1BQUs7SUFDaEMsQ0FBQztJQUVELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFBO1FBQzFELE9BQU07SUFDUixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLFdBQVcsQ0FBQyxNQUFNLGdDQUFnQyxDQUFDLENBQUE7SUFFeEUsK0NBQStDO0lBQy9DLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFBO0lBRTdCLEtBQUssTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDO1lBQ0gsbUVBQW1FO1lBQ25FLHlDQUF5QztZQUN6QyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUE7WUFDckIsSUFBSSxDQUFDO2dCQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQztvQkFDL0MsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQzdCLElBQUksRUFBRSxDQUFDO2lCQUNSLENBQUMsQ0FBQTtnQkFDRixtRkFBbUY7Z0JBQ25GLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO29CQUM1Qix5REFBeUQ7b0JBQ3pELGFBQWEsR0FBRyxDQUFDLENBQUE7Z0JBQ25CLENBQUM7cUJBQU0sSUFBSSxRQUFRLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO29CQUNuQyxhQUFhLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQTtnQkFDaEMsQ0FBQztZQUNILENBQUM7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztZQUVkLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxDQUFBO1lBQ2hFLElBQUksQ0FBQyxRQUFRO2dCQUFFLFNBQVE7WUFFdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLGNBQWMsUUFBUSxVQUFVLENBQUMsQ0FBQTtZQUU1RCxvQkFBb0I7WUFDcEIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFBO1lBQ3JCLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQTtZQUN4QixPQUFPLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDckIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUE7Z0JBQzNDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNuRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7b0JBQ25DLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFDakMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDNUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO29CQUMxQixNQUFNLE9BQU8sR0FBRyxhQUFhLEVBQUUsQ0FBQTtvQkFDL0Isd0NBQXdDO29CQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQkFDakcsT0FBTzt3QkFDTCxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUU7d0JBQ2hCLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixLQUFLO3dCQUNMLE9BQU87d0JBQ1AsTUFBTTt3QkFDTixVQUFVO3dCQUNWLFNBQVM7d0JBQ1QsTUFBTTtxQkFDUCxDQUFBO2dCQUNILENBQUMsQ0FBQyxDQUFBO2dCQUVGLGNBQWM7Z0JBQ2QsTUFBTSxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUN6QyxTQUFTLElBQUksSUFBSSxDQUFBO1lBQ25CLENBQUM7UUFDSCxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxFQUFFLEtBQU0sQ0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDdkYsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUE7QUFDbEQsQ0FBQyJ9