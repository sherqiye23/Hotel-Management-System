import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/src/models/feedbackModel";
import { feedbackIdSchema } from "@/src/app/schemas/feedbackSchemas";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { handleError } from "@/src/utils/errorHandler";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await feedbackIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const restoreFeedback = await Feedback.findById(id)
        if (!restoreFeedback) {
            return NextResponse.json({ message: "Feedback is not found" }, { status: 404 });
        }
        if (!restoreFeedback.isSoftDeleted) {
            return NextResponse.json({ message: "Feedback already restored" }, { status: 400 });
        }

        restoreFeedback.isSoftDeleted = false;
        await restoreFeedback.save();
        return NextResponse.json({ message: `Feedback restored` }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}