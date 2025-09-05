import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

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
  let categoryId: string | undefined;
  try {
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
    });
    const merch = Array.isArray(categories)
      ? categories.find((c: any) => c.name === "Merch")
      : undefined;
    const firstCategoryId = Array.isArray(categories) ? categories[0]?.id : undefined;
    categoryId = merch?.id ?? firstCategoryId;
  } catch (e) {
    // ignore and create below
  }

  if (!categoryId) {
    // Create a fallback category to avoid conflicts with other seed data
    const { result: createdCats } = await createProductCategoriesWorkflow(container).run({
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
      category_ids: [categoryId!],
      description: "Auto-generated demo product with size variants only (no color).",
      handle: baseHandle,
      weight: 400,
      status: ProductStatus.PUBLISHED,
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

  await createProductsWorkflow(container).run({
    input: {
      products: generatedProducts,
    },
  });

  logger.info("Finished creating 200 generated products (size-only variants).\nNote: Inventory levels are NOT seeded here to avoid conflicts. Run the main seed to seed inventory levels.");
}
