"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.GetAdminContactsSchema = void 0;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
exports.GetAdminContactsSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().optional(),
    offset: zod_1.z.coerce.number().optional(),
    order: zod_1.z.string().optional(),
    status: zod_1.z.enum(["new", "in_progress", "resolved"]).optional(),
});
const GET = async (req, res) => {
    const { limit = 15, offset = 0, order = "-created_at", status } = req.validatedQuery || {};
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const qc = req.queryConfig || {};
    const args = {
        entity: "contact",
        // Specify fields explicitly to avoid null graph nodes
        fields: [
            "id",
            "name",
            "email",
            "phone",
            "subject",
            "message",
            "status",
            "created_at",
        ],
        order,
        take: limit,
        skip: offset,
        ...qc,
    };
    if (status) {
        args.filters = { ...(qc.filters || {}), status };
    }
    const { data, metadata: { count = 0, take = limit, skip = offset } = {}, } = await query.graph(args);
    const contacts = Array.isArray(data) ? data.filter(Boolean) : [];
    res.json({ contacts, count, limit: take, offset: skip });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2NvbnRhY3RzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUFxRTtBQUNyRSw2QkFBdUI7QUFFVixRQUFBLHNCQUFzQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDN0MsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ25DLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUNwQyxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUM1QixNQUFNLEVBQUUsT0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FDOUQsQ0FBQyxDQUFBO0FBRUssTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLGFBQWEsRUFBRSxNQUFNLEVBQUUsR0FBSSxHQUFXLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQTtJQUVuRyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxpQ0FBaUMsQ0FBQyxLQUFLLENBQVEsQ0FBQTtJQUNoRixNQUFNLEVBQUUsR0FBSSxHQUFXLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQTtJQUV6QyxNQUFNLElBQUksR0FBUTtRQUNoQixNQUFNLEVBQUUsU0FBUztRQUNqQixzREFBc0Q7UUFDdEQsTUFBTSxFQUFFO1lBQ04sSUFBSTtZQUNKLE1BQU07WUFDTixPQUFPO1lBQ1AsT0FBTztZQUNQLFNBQVM7WUFDVCxTQUFTO1lBQ1QsUUFBUTtZQUNSLFlBQVk7U0FDYjtRQUNELEtBQUs7UUFDTCxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osR0FBRyxFQUFFO0tBQ04sQ0FBQTtJQUNELElBQUksTUFBTSxFQUFFLENBQUM7UUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUE7SUFDbEQsQ0FBQztJQUVELE1BQU0sRUFDSixJQUFJLEVBQ0osUUFBUSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQzFELEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRTNCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNoRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQzFELENBQUMsQ0FBQTtBQW5DWSxRQUFBLEdBQUcsT0FtQ2YifQ==