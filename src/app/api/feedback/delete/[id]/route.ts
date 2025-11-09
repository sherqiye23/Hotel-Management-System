import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/src/models/feedbackModel";
import { feedbackIdSchema } from "@/src/app/schemas/feedbackSchemas";
import { handleError } from "@/src/utils/errorHandler";
import { verifyAdmin } from "@/src/utils/verifyAdmin";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await feedbackIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const deletedFeedback = await Feedback.findById(id)
        if (!deletedFeedback) {
            return NextResponse.json({ message: "Feedback is not found" }, { status: 404 });
        }
        await Feedback.findByIdAndDelete(id);
        return NextResponse.json({ message: `Feedback deleted` }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}