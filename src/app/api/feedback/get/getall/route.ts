import { connect } from "@/src/dbConfig/dbConfig";
import Feedback from "@/src/models/feedbackModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connect()
        const feedbacks = await Feedback.find({ isSoftDeleted: false }).sort({ createdAt: -1 });
        return NextResponse.json(feedbacks, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => {
                if (el instanceof mongoose.Error.ValidatorError) {
                    return el.message;
                }
                return 'Validation error';
            });
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}
