import { connect } from "@/src/dbConfig/dbConfig";
import Feedback from "@/src/models/feedbackModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        connect()
        const reqBody = await request.json();
        const { fromMail, description } = reqBody;

        // check email and description
        if (!fromMail.trim()) {
            return NextResponse.json({
                message: 'Email address is required.',
                success: false
            }, { status: 400 });
        }
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(fromMail)) {
            return NextResponse.json({
                message: 'Please enter a valid email.',
                success: false
            }, { status: 400 });
        }

        if (!description.trim()) {
            return NextResponse.json({
                message: 'Feedback description is required.',
                success: false
            }, { status: 400 });
        }
        if (description.trim().length > 100) {
            return NextResponse.json({
                message: 'Feedback description maximum 100 characters',
                success: false
            }, { status: 400 });
        }

        // send (create) feedback
        const newFeedback = new Feedback({
            fromMail,
            description,
        });
        const savedFeedback = await newFeedback.save()
        return NextResponse.json({
            message: 'Feedback sent successfully!',
            success: true,
            savedFeedback
        })

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
