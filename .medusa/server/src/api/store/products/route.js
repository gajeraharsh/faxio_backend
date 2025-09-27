"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const framework_1 = require("@medusajs/framework");
const utils_1 = require("@medusajs/framework/utils");
const index_engine_1 = __importDefault(require("@medusajs/medusa/loaders/feature-flags/index-engine"));
const index_1 = require("@medusajs/medusa/api/utils/middlewares/index");
const helpers_1 = require("@medusajs/medusa/api/store/products/helpers");
const pg_1 = require("../../../lib/pg");
const GET = async (req, res) => {
    if (framework_1.featureFlagRouter.isFeatureEnabled(index_engine_1.default.key)) {
        // TODO: These filters are not supported by the index engine yet
        if ((0, utils_1.isPresent)(req.filterableFields.tags) ||
            (0, utils_1.isPresent)(req.filterableFields.categories)) {
            return await getProducts(req, res);
        }
        return await getProductsWithIndexEngine(req, res);
    }
    return await getProducts(req, res);
};
exports.GET = GET;
async function getProductsWithIndexEngine(req, res) {
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const context = {};
    const withInventoryQuantity = req.queryConfig.fields.some((field) => field.includes("variants.inventory_quantity"));
    if (withInventoryQuantity) {
        req.queryConfig.fields = req.queryConfig.fields.filter((field) => !field.includes("variants.inventory_quantity"));
    }
    if ((0, utils_1.isPresent)(req.pricingContext)) {
        context["variants"] ??= {};
        context["variants"]["calculated_price"] = (0, utils_1.QueryContext)(req.pricingContext);
    }
    const filters = req.filterableFields;
    if ((0, utils_1.isPresent)(filters.sales_channel_id)) {
        const salesChannelIds = filters.sales_channel_id;
        filters["sales_channels"] ??= {};
        filters["sales_channels"]["id"] = salesChannelIds;
        delete filters.sales_channel_id;
    }
    const { data: products = [], metadata } = await query.index({
        entity: "product",
        fields: req.queryConfig.fields,
        filters,
        pagination: req.queryConfig.pagination,
        context,
    });
    if (withInventoryQuantity) {
        await (0, index_1.wrapVariantsWithInventoryQuantityForSalesChannel)(req, products.map((product) => product.variants).flat(1));
    }
    await (0, helpers_1.wrapProductsWithTaxPrices)(req, products);
    await annotateProductsWithWishlist(req, products);
    await annotateProductsWithReviews(req, products);
    res.json({
        products,
        count: metadata.estimate_count,
        estimate_count: metadata.estimate_count,
        offset: metadata.skip,
        limit: metadata.take,
    });
}
async function getProducts(req, res) {
    const remoteQuery = req.scope.resolve(utils_1.ContainerRegistrationKeys.REMOTE_QUERY);
    const context = {};
    const withInventoryQuantity = req.queryConfig.fields.some((field) => field.includes("variants.inventory_quantity"));
    if (withInventoryQuantity) {
        req.queryConfig.fields = req.queryConfig.fields.filter((field) => !field.includes("variants.inventory_quantity"));
    }
    if ((0, utils_1.isPresent)(req.pricingContext)) {
        context["variants.calculated_price"] = {
            context: req.pricingContext,
        };
    }
    const queryObject = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: "product",
        variables: {
            filters: req.filterableFields,
            ...req.queryConfig.pagination,
            ...context,
        },
        fields: req.queryConfig.fields,
    });
    const { rows: products, metadata } = await remoteQuery(queryObject);
    if (withInventoryQuantity) {
        await (0, index_1.wrapVariantsWithInventoryQuantityForSalesChannel)(req, products.map((product) => product.variants).flat(1));
    }
    await (0, helpers_1.wrapProductsWithTaxPrices)(req, products);
    await annotateProductsWithWishlist(req, products);
    await annotateProductsWithReviews(req, products);
    res.json({
        products,
        count: metadata.count,
        offset: metadata.skip,
        limit: metadata.take,
    });
}
async function annotateProductsWithWishlist(req, products) {
    try {
        const customerId = req?.auth_context?.actor_id;
        if (!customerId || !Array.isArray(products) || products.length === 0) {
            // unauthenticated or no products; mark false (optional)
            for (const p of products ?? []) {
                ;
                p.is_wishlist = false;
            }
            return;
        }
        // Use a single SQL query to fetch wishlist product_ids for this customer
        const ids = products.map((p) => p.id).filter(Boolean);
        if (ids.length === 0) {
            for (const p of products ?? []) {
                ;
                p.is_wishlist = false;
            }
            return;
        }
        const pool = (0, pg_1.getPool)();
        const res = await pool.query(`SELECT wi.product_id FROM wishlist_item wi WHERE wi.customer_id = $1 AND wi.product_id = ANY($2)`, [customerId, ids]);
        const set = new Set((res?.rows || []).map((r) => String(r.product_id)));
        for (const p of products) {
            ;
            p.is_wishlist = set.has(String(p.id));
        }
    }
    catch (e) {
        // Fail-safe: never block product listing due to wishlist
        for (const p of products ?? []) {
            ;
            p.is_wishlist = false;
        }
    }
}
async function annotateProductsWithReviews(req, products) {
    try {
        if (!Array.isArray(products) || products.length === 0) {
            return;
        }
        const ids = products.map((p) => p.id).filter(Boolean);
        if (ids.length === 0) {
            return;
        }
        // Use external Postgres pool to aggregate like the product details API
        const pool = (0, pg_1.getPool)();
        const res = await pool.query(`
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
        for (const row of res?.rows ?? []) {
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
            // Also attach detailed stats like the details endpoint
        }
    }
    catch (e) {
        // Fail-safe defaults
        for (const p of products ?? []) {
            ;
            p.review_count = 0;
            p.rating = 0;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3RzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1EQUF1RDtBQUd2RCxxREFLa0M7QUFDbEMsdUdBQXdGO0FBQ3hGLHdFQUErRztBQUMvRyx5RUFBMkc7QUFLM0csd0NBQXlDO0FBRWxDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBeUQsRUFDekQsR0FBdUQsRUFDdkQsRUFBRTtJQUNGLElBQUksNkJBQWlCLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNuRSxnRUFBZ0U7UUFDaEUsSUFDRSxJQUFBLGlCQUFTLEVBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUNwQyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUMxQyxDQUFDO1lBQ0QsT0FBTyxNQUFNLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDcEMsQ0FBQztRQUVELE9BQU8sTUFBTSwwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELE9BQU8sTUFBTSxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3BDLENBQUMsQ0FBQTtBQWpCWSxRQUFBLEdBQUcsT0FpQmY7QUFFRCxLQUFLLFVBQVUsMEJBQTBCLENBQ3ZDLEdBQXlELEVBQ3pELEdBQXVEO0lBRXZELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhFLE1BQU0sT0FBTyxHQUFxQixFQUFFLENBQUE7SUFDcEMsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FB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