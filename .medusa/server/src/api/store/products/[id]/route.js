"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const helpers_1 = require("@medusajs/medusa/api/store/products/helpers");
const index_1 = require("@medusajs/medusa/api/utils/middlewares/index");
const pg_1 = require("../../../../lib/pg");
const GET = async (req, res) => {
    const withInventoryQuantity = req.queryConfig.fields.some((field) => field.includes("variants.inventory_quantity"));
    if (withInventoryQuantity) {
        req.queryConfig.fields = req.queryConfig.fields.filter((field) => !field.includes("variants.inventory_quantity"));
    }
    const filters = {
        id: req.params.id,
        ...req.filterableFields,
    };
    if ((0, utils_1.isPresent)(req.pricingContext)) {
        filters["context"] = {
            "variants.calculated_price": { context: req.pricingContext },
        };
    }
    const product = await (0, helpers_1.refetchProduct)(filters, req.scope, req.queryConfig.fields);
    if (!product) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `Product with id: ${req.params.id} was not found`);
    }
    if (withInventoryQuantity) {
        await (0, index_1.wrapVariantsWithInventoryQuantityForSalesChannel)(req, product.variants || []);
    }
    await (0, helpers_1.wrapProductsWithTaxPrices)(req, [product]);
    // Annotate with is_wishlist for authenticated users using a minimal custom query
    try {
        const customerId = req?.auth_context?.actor_id;
        if (customerId) {
            const pool = (0, pg_1.getPool)();
            const existsRes = await pool.query(`SELECT 1 FROM wishlist_item wi WHERE wi.product_id = $1 AND wi.customer_id = $2 LIMIT 1`, [product.id, customerId]);
            product.is_wishlist = (existsRes?.rowCount || 0) > 0;
        }
        else {
            ;
            product.is_wishlist = false;
        }
    }
    catch (err) {
        console.log(err);
        product.is_wishlist = false;
    }
    // External Postgres connection (outside Medusa DI)
    const pool = (0, pg_1.getPool)();
    const aggRes = await pool.query(`
    SELECT
      COALESCE(AVG(r.rating)::numeric(10,2), 0) AS avg_rating,
      COUNT(r.id) AS review_count
    FROM review r
    WHERE r.product_id = $1
      AND (r.status IS NULL OR r.status = 'approved')
    `, [product.id]);
    const aggRow = aggRes?.rows?.[0] ?? {};
    const avgRating = aggRow.avg_rating != null ? Number(aggRow.avg_rating) : 0;
    const reviewCount = aggRow.review_count != null ? Number(aggRow.review_count) : 0;
    product.metadata = {
        ...product.metadata,
        review_stats: {
            average: Number(avgRating.toFixed(2)),
            count: reviewCount
        },
    };
    product.review_stats = product.metadata.review_stats;
    // Debug: ensure we log the correct path
    res.json({ product });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3RzL1tpZF0vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWtFO0FBRWxFLHlFQUlvRDtBQUVwRCx3RUFBK0c7QUFDL0csMkNBQTRDO0FBR3JDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBcUQsRUFDckQsR0FBbUQsRUFDbkQsRUFBRTtJQUNGLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDbEUsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUM5QyxDQUFBO0lBRUQsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FDcEQsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUMxRCxDQUFBO0lBQ0gsQ0FBQztJQUVELE1BQU0sT0FBTyxHQUFXO1FBQ3RCLEVBQUUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDakIsR0FBRyxHQUFHLENBQUMsZ0JBQWdCO0tBQ3hCLENBQUE7SUFFRCxJQUFJLElBQUEsaUJBQVMsRUFBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztRQUNsQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUc7WUFDbkIsMkJBQTJCLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRTtTQUM3RCxDQUFBO0lBQ0gsQ0FBQztJQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBQSx3QkFBYyxFQUNsQyxPQUFPLEVBQ1AsR0FBRyxDQUFDLEtB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