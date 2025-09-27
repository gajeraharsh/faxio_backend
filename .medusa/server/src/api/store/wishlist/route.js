"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = exports.PostStoreWishlistSchema = void 0;
const zod_1 = require("zod");
const wishlist_1 = require("../../../modules/wishlist");
const utils_1 = require("@medusajs/framework/utils");
const index_1 = require("@medusajs/medusa/api/utils/middlewares/index");
const helpers_1 = require("@medusajs/medusa/api/store/products/helpers");
const utils_2 = require("@medusajs/framework/utils");
const pg_1 = require("../../../lib/pg");
exports.PostStoreWishlistSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
    notes: zod_1.z.string().optional(),
});
const GET = async (req, res) => {
    const customerId = req.auth_context?.actor_id;
    if (!customerId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
    const items = await wishlistService.listByCustomer(customerId);
    if (!items?.length) {
        return res.json({ items: [] });
    }
    // Build pricing context similar to products endpoint
    const q = (req.validatedQuery || req.query || {});
    let region_id = q.region_id;
    let currency_code = q.currency_code;
    try {
        if (!currency_code && region_id) {
            const regionModule = req.scope.resolve(utils_2.Modules.REGION);
            const regions = await regionModule.listRegions({ id: region_id }, { take: 1 });
            if (regions?.length) {
                currency_code = regions[0].currency_code;
            }
        }
    }
    catch { }
    if (currency_code) {
        ;
        req.pricingContext = {
            currency_code,
            region_id,
            customer_id: customerId,
        };
    }
    // Collect product IDs from wishlist
    const productIds = items.map((it) => it.product_id);
    // Build a query to fetch products with pricing context similar to products list
    const remoteQuery = req.scope.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    // Minimal, but useful set of fields (extend as needed)
    const fields = [
        "id",
        "title",
        "subtitle",
        "handle",
        "description",
        "thumbnail",
        "images.id",
        "images.url",
        "variants.id",
        "variants.title",
        "variants.sku",
        "variants.inventory_quantity",
        "variants.calculated_price.calculated_amount",
        "variants.calculated_price.calculated_amount_type",
        "variants.calculated_price.original_amount",
        "variants.calculated_price.original_amount_type",
        "variants.calculated_price.currency_code",
    ];
    const context = {};
    if ((0, utils_2.isPresent)(req.pricingContext)) {
        context["variants.calculated_price"] = {
            context: req.pricingContext,
        };
    }
    const queryObject = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: "product",
        variables: {
            filters: { id: productIds },
            ...context,
            skip: 0,
            take: productIds.length,
        },
        fields,
    });
    const { rows: products } = await remoteQuery(queryObject);
    // Wrap with inventory quantity only if sales_channel_id context is present (otherwise skip)
    const hasSalesChannel = !!req?.filterableFields?.sales_channel_id;
    if (hasSalesChannel) {
        await (0, index_1.wrapVariantsWithInventoryQuantityForSalesChannel)(req, products.map((p) => p.variants).flat(1));
    }
    if ((0, utils_2.isPresent)(req.pricingContext?.currency_code)) {
        await (0, helpers_1.wrapProductsWithTaxPrices)(req, products);
    }
    // Annotate products with reviews (average rating and count)
    try {
        if (Array.isArray(products) && products.length) {
            const ids = products.map((p) => p.id).filter(Boolean);
            if (ids.length) {
                const pool = (0, pg_1.getPool)();
                const r = await pool.query(`
          SELECT
            r.product_id,
            COALESCE(AVG(r.rating)::numeric(10,2), 0) AS avg_rating,
            COUNT(r.id) AS review_count
          FROM review r
          WHERE r.product_id = ANY($1)
            AND (r.status IS NULL OR r.status = 'approved')
          GROUP BY r.product_id
          `, [ids]);
                const map = new Map();
                for (const row of r?.rows ?? []) {
                    const pid = String(row.product_id);
                    const avg = row.avg_rating != null ? Number(row.avg_rating) : 0;
                    const count = row.review_count != null ? Number(row.review_count) : 0;
                    map.set(pid, { avg, count });
                }
                for (const p of products) {
                    const pid = String(p.id);
                    const rec = map.get(pid) || { avg: 0, count: 0 };
                    const avg = Number.isFinite(rec.avg) ? rec.avg : 0;
                    const count = Number.isFinite(rec.count) ? rec.count : 0;
                    p.review_count = count;
                    p.rating = Math.round(avg * 10) / 10;
                }
            }
        }
    }
    catch (e) {
        for (const p of products ?? []) {
            p.review_count = p.review_count ?? 0;
            p.rating = p.rating ?? 0;
        }
    }
    // Map product by id for quick lookup
    const byId = new Map(products.map((p) => [p.id, p]));
    // Attach product and set is_wishlist flag
    const enriched = items.map((it) => ({
        ...it,
        product: byId.get(it.product_id) ?? null,
        is_wishlist: true,
    }));
    res.json({ items: enriched });
};
exports.GET = GET;
const POST = async (req, res) => {
    const input = req.validatedBody || req.body;
    const customerId = req.auth_context?.actor_id;
    if (!customerId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const wishlistService = req.scope.resolve(wishlist_1.WISHLIST_MODULE);
    const item = await wishlistService.addItem({
        product_id: input.product_id,
        customer_id: customerId,
        notes: input.notes,
    });
    res.json({ item });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3dpc2hsaXN0L3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZCQUF1QjtBQUN2Qix3REFBMkQ7QUFFM0QscURBQWtHO0FBQ2xHLHdFQUErRztBQUMvRyx5RUFBdUY7QUFDdkYscURBQThEO0FBQzlELHdDQUF5QztBQUU1QixRQUFBLHVCQUF1QixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUMsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDN0IsQ0FBQyxDQUFBO0FBSUssTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUErQixFQUMvQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxVQUFVLEdBQUksR0FBRyxDQUFDLFlBQW9CLEVBQUUsUUFBUSxDQUFBO0lBQ3RELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNoQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUF3QiwwQkFBZSxDQUFDLENBQUE7SUFDakYsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFlLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRTlELElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDbkIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUVELHFEQUFxRDtJQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFF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