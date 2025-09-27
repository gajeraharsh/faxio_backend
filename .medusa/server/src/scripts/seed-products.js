"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedProducts;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function seedProducts({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    logger.info("Seeding additional products (separate script)...");
    // Ensure there's at least one Sales Channel to attach products to
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!defaultSalesChannel.length) {
        // Fallback: try any sales channel
        const anySalesChannels = await salesChannelModuleService.listSalesChannels({});
        if (!anySalesChannels.length) {
            logger.error("No sales channels found. Please run the main seed first to create the Default Sales Channel.");
            return;
        }
        defaultSalesChannel = [anySalesChannels[0]];
    }
    // Ensure we have a default shipping profile
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" });
    const shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;
    if (!shippingProfile) {
        logger.error("No default shipping profile found. Please run the main seed first to create it.");
        return;
    }
    // Ensure we have at least one category (prefer Merch)
    let categoryId;
    try {
        const { data: categories } = await query.graph({
            entity: "product_category",
            fields: ["id", "name"],
        });
        const merch = Array.isArray(categories)
            ? categories.find((c) => c.name === "Merch")
            : undefined;
        const firstCategoryId = Array.isArray(categories) ? categories[0]?.id : undefined;
        categoryId = merch?.id ?? firstCategoryId;
    }
    catch (e) {
        // ignore and create below
    }
    if (!categoryId) {
        // Create a fallback category to avoid conflicts with other seed data
        const { result: createdCats } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
            input: {
                product_categories: [
                    {
                        name: "General",
                    },
                ],
            },
        });
        categoryId = createdCats[0].id;
    }
    const sizeValues = ["S", "M", "L", "XL"];
    const generatedProducts = Array.from({ length: 200 }, (_, i) => {
        const num = i + 1;
        const baseHandle = `generated-product-${num}`;
        const baseSku = `GEN-${num}`;
        const title = `Generated Product ${num}`;
        return {
            title,
            category_ids: [categoryId],
            description: "Auto-generated demo product with size variants only (no color).",
            handle: baseHandle,
            weight: 400,
            status: utils_1.ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [
                { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-forest-front.png" },
                { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-forest-back.png" },
            ],
            options: [
                {
                    title: "Size",
                    values: sizeValues,
                },
            ],
            variants: sizeValues.map((sz) => ({
                title: sz,
                sku: `${baseSku}-${sz}`,
                options: { Size: sz },
                prices: [
                    { amount: 10, currency_code: "eur" },
                    { amount: 15, currency_code: "usd" },
                ],
            })),
            sales_channels: [
                {
                    id: defaultSalesChannel[0].id,
                },
            ],
        };
    });
    await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: generatedProducts,
        },
    });
    logger.info("Finished creating 200 generated products (size-only variants).\nNote: Inventory levels are NOT seeded here to avoid conflicts. Run the main seed to seed inventory levels.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1wcm9kdWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQtcHJvZHVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFXQSwrQkE2R0M7QUF2SEQscURBSW1DO0FBQ25DLDREQUdxQztBQUV0QixLQUFLLFVBQVUsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2hFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSxNQUFNLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBRWhFLGtFQUFrRTtJQUNsRSxJQUFJLG1CQUFtQixHQUFHLE1BQU0seUJBQXlCLENBQUMsaUJBQWlCLENBQUM7UUFDMUUsSUFBSSxFQUFFLHVCQUF1QjtLQUM5QixDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEMsa0NBQWtDO1FBQ2xDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQyw4RkFBOEYsQ0FBQyxDQUFDO1lBQzdHLE9BQU87UUFDVCxDQUFDO1FBQ0QsbUJBQW1CLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFD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