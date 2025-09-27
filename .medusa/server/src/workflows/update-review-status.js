"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewStatusWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const review_1 = require("../modules/review");
const updateStatusStep = (0, workflows_sdk_1.createStep)("update-review-status", async (input, { container }) => {
    const service = container.resolve(review_1.REVIEW_MODULE);
    const updated = await service.updateReviews({ id: input.id, status: input.status });
    return new workflows_sdk_1.StepResponse(updated);
});
exports.updateReviewStatusWorkflow = (0, workflows_sdk_1.createWorkflow)("update-review-status", (input) => {
    const updated = updateStatusStep(input);
    return new workflows_sdk_1.WorkflowResponse({ review: updated });
});
exports.default = exports.updateReviewStatusWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXJldmlldy1zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL3VwZGF0ZS1yZXZpZXctc3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUE4RztBQUU5Ryw4Q0FBaUQ7QUFPakQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLDBCQUFVLEVBQ2pDLHNCQUFzQixFQUN0QixLQUFLLEVBQUUsS0FBOEIsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdEQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBc0Isc0JBQWEsQ0FBQyxDQUFBO0lBQ3JFLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFTLENBQUMsQ0FBQTtJQUMxRixPQUFPLElBQUksNEJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNsQyxDQUFDLENBQ0YsQ0FBQTtBQUVZLFFBQUEsMEJBQTBCLEdBQUcsSUFBQSw4QkFBYyxFQUN0RCxzQkFBc0IsRUFDdEIsQ0FBQyxLQUE4QixFQUFFLEVBQUU7SUFDakMsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDdkMsT0FBTyxJQUFJLGdDQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDbEQsQ0FBQyxDQUNGLENBQUE7QUFFRCxrQkFBZSxrQ0FBMEIsQ0FBQSJ9