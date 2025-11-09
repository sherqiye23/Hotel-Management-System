import { feedbackIdSchema } from "@/src/app/schemas/feedbackSchemas";
import Feedback from "@/src/models/feedbackModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await feedbackIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return NextResponse.json({ message: 'Feedback not found' }, { status: 404 });
        }
        return NextResponse.json(feedback, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
