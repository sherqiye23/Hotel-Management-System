import Feedback from "@/src/models/feedbackModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const feedbacks = await Feedback.find({ isSoftDeleted: true }).sort({ createdAt: -1 });
        return NextResponse.json(feedbacks, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}

