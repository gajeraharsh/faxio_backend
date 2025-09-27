"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const GET = async (req, res) => {
    const id = req.params.id;
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
            "content",
            "hashtags",
            "read_time",
            "created_at",
        ],
        filters: { id, ...(qc.filters || {}) },
        ...qc,
    };
    const { data } = await query.graph(args);
    const blog = Array.isArray(data) ? data[0] : data;
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ blog });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2Jsb2dzL1tpZF0vcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXFFO0FBRTlELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQVksQ0FBQTtJQUVsQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxpQ0FBaUMsQ0FBQyxLQUFLLENBQVEsQ0FBQTtJQUNoRixNQUFNLEVBQUUsR0FBSSxHQUFXLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQTtJQUV6QyxNQUFNLElBQUksR0FBUTtRQUNoQixNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRTtZQUNOLElBQUk7WUFDSixhQUFhO1lBQ2IsT0FBTztZQUNQLFdBQVc7WUFDWCxtQkFBbUI7WUFDbkIsU0FBUztZQUNULFVBQVU7WUFDVixXQUFXO1lBQ1gsWUFBWTtTQUNiO1FBQ0QsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFFO1FBQ3RDLEdBQUcsRUFBRTtLQUNOLENBQUE7SUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBRWpELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNWLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUNwQixDQUFDLENBQUE7QUEvQlksUUFBQSxHQUFHLE9BK0JmIn0=