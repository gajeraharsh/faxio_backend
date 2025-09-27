"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.GetStoreBlogsSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
exports.GetStoreBlogsSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().optional(),
    offset: zod_1.z.coerce.number().optional(),
    order: zod_1.z.string().optional(),
    category_id: zod_1.z.string().optional(),
    q: zod_1.z.string().optional(),
});
const GET = async (req, res) => {
    const { limit = 12, offset = 0, order = "-created_at", category_id, q } = req.validatedQuery || {};
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const qc = req.queryConfig || {};
    const args = {
        entity: "blog",
        fields: [
            "id",
            "category_id",
            "title",
            "image_url",
            "short_description",
            "read_time",
            "created_at",
        ],
        order,
        take: limit,
        skip: offset,
        ...qc,
    };
    const filters = { ...(qc.filters || {}) };
    if (category_id)
        filters.category_id = category_id;
    if (Object.keys(filters).length)
        args.filters = filters;
    if (q)
        args.q = q;
    const { data, metadata: { count = 0, take = limit, skip = offset } = {}, } = await query.graph(args);
    const blogs = Array.isArray(data) ? data.filter(Boolean) : [];
    res.json({ blogs, count, limit: take, offset: skip });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2Jsb2dzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUFxRTtBQUNyRSw2QkFBdUI7QUFFVixRQUFBLG1CQUFtQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDMUMsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ25DLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM1QixXQUFXLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNsQyxDQUFDLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUN6QixDQUFDLENBQUE7QUFFSyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsYUFBYSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsR0FBSSxHQUFXLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQTtJQUUzRyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxpQ0FBaUMsQ0FBQyxLQUFLLENBQVEsQ0FBQTtJQUNoRixNQUFNLEVBQUUsR0FBSSxHQUFXLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQTtJQUV6QyxNQUFNLElBQUksR0FBUTtRQUNoQixNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRTtZQUNOLElBQUk7WUFDSixhQUFhO1lBQ2IsT0FBTztZQUNQLFdBQVc7WUFDWCxtQkFBbUI7WUFDbkIsV0FBVztZQUNYLFlBQVk7U0FDYjtRQUNELEtBQUs7UUFDTCxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osR0FBRyxFQUFFO0tBQ04sQ0FBQTtJQUVELE1BQU0sT0FBTyxHQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQTtJQUM5QyxJQUFJLFdBQVc7UUFBRSxPQUFPLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtJQUNsRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTTtRQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3ZELElBQUksQ0FBQztRQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRWpCLE1BQU0sRUFDSixJQUFJLEVBQ0osUUFBUSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQzFELEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTNCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUM3RCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZELENBQUMsQ0FBQTtBQW5DWSxRQUFBLEdBQUcsT0FtQ2YifQ==