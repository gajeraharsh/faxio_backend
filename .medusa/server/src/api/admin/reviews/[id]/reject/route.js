"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const update_review_status_1 = require("../../../../../workflows/update-review-status");
const POST = async (req, res) => {
    const id = req.params.id;
    const { result } = await (0, update_review_status_1.updateReviewStatusWorkflow)(req.scope).run({
        input: { id, status: "rejected" },
    });
    res.json(result);
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Jldmlld3MvW2lkXS9yZWplY3Qvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0ZBQTBGO0FBRW5GLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBK0IsRUFDL0IsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBWSxDQUFBO0lBRWxDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsaURBQTBCLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNqRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRTtLQUNsQyxDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2xCLENBQUMsQ0FBQTtBQVhZLFFBQUEsSUFBSSxRQVdoQiJ9