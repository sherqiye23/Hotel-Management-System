import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/src/models/feedbackModel";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { feedbackIdSchema } from "@/src/app/schemas/feedbackSchemas";
import { handleError } from "@/src/utils/errorHandler";

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

        const softdeletedFeedback = await Feedback.findById(id)
        if (!softdeletedFeedback) {
            return NextResponse.json({ message: "Feedback is not found" }, { status: 404 });
        }
        if (softdeletedFeedback.isSoftDeleted) {
            return NextResponse.json({ message: "Feedback already soft deleted" }, { status: 400 });
        }

        softdeletedFeedback.isSoftDeleted = true;
        await softdeletedFeedback.save();
        return NextResponse.json({ message: `Feedback soft deleted` }, { status: 200 });

    } catch (error: unknown) {
        return handleError(error)
    }
}