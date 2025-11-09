import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/src/models/feedbackModel";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { feedbackIdSchema, postFeedbacksDescSchema } from "@/src/app/schemas/feedbackSchemas";
import { handleError } from "@/src/utils/errorHandler";

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const validatedDataId = await feedbackIdSchema.validate(reqBody, { abortEarly: false });
        const validatedDataDesc = await postFeedbacksDescSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedDataId;
        const { description } = validatedDataDesc;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return NextResponse.json({ message: "Feedback is not found" }, { status: 404 });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { $set: { description } },
            { new: true }
        )
        return NextResponse.json({
            message: 'Feedback update successfully!',
            success: true,
            updatedFeedback
        })
    } catch (error: unknown) {
        return handleError(error)
    }
}