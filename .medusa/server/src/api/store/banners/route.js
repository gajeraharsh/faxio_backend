"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.GetStoreBannersSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
exports.GetStoreBannersSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().optional(),
    offset: zod_1.z.coerce.number().optional(),
});
const GET = async (req, res) => {
    const { limit = 50, offset = 0 } = req.validatedQuery || {};
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const qc = req.queryConfig || {};
    const args = {
        entity: "banner",
        fields: [
            "id",
            "name",
            "desktop_image_url",
            "mobile_image_url",
            "link_url",
            "position",
            "created_at",
        ],
        order: "position",
        take: limit,
        skip: offset,
        ...qc,
    };
    const { data, metadata: { count = 0, take = limit, skip = offset } = {}, } = await query.graph(args);
    const banners = Array.isArray(data) ? data.filter(Boolean) : [];
    res.json({ banners, count, limit: take, offset: skip });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2Jhbm5lcnMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXFFO0FBQ3JFLDZCQUF1QjtBQUVWLFFBQUEscUJBQXFCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1QyxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDbkMsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQ3JDLENBQUMsQ0FBQTtBQUVLLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLEdBQUksR0FBVyxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUE7SUFFcEUsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsaUNBQWlDLENBQUMsS0FBSyxDQUFRLENBQUE7SUFDaEYsTUFBTSxFQUFFLEdBQUksR0FBVyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUE7SUFFekMsTUFBTSxJQUFJLEdBQVE7UUFDaEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFO1lBQ04sSUFBSTtZQUNKLE1BQU07WUFDTixtQkFBbUI7WUFDbkIsa0JBQWtCO1lBQ2xCLFVBQVU7WUFDVixVQUFVO1lBQ1YsWUFBWTtTQUNiO1FBQ0QsS0FBSyxFQUFFLFVBQVU7UUFDakIsSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLEdBQUcsRUFBRTtLQUNOLENBQUE7SUFFRCxNQUFNLEVBQ0osSUFBSSxFQUNKLFFBQVEsRUFBRSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRSxJQUFJLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUMxRCxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUUzQixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN6RCxDQUFDLENBQUE7QUE5QlksUUFBQSxHQUFHLE9BOEJmIn0=