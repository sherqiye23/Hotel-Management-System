import { NextResponse } from "next/server";
import Feedback from "@/src/models/feedbackModel";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { handleError } from "@/src/utils/errorHandler";

export async function PATCH() {
    try {
        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const restoreFeedbacks = await Feedback.find({ isSoftDeleted: true })
        if (!restoreFeedbacks || restoreFeedbacks.length === 0) {
            return NextResponse.json({ message: "No soft deleted feedbacks found" }, { status: 404 });
        }

        const result = await Feedback.updateMany(
            { isSoftDeleted: true },
            { $set: { isSoftDeleted: false } }
        );
        return NextResponse.json({ message: `${result.modifiedCount} feedback restored` }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}