import { postFeedbacksDescSchema, postFeedbacksMailSchema } from "@/src/app/schemas/feedbackSchemas";
import Feedback from "@/src/models/feedbackModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const validatedDataMail = await postFeedbacksMailSchema.validate(reqBody, { abortEarly: false });
        const validatedDataDesc = await postFeedbacksDescSchema.validate(reqBody, { abortEarly: false });
        const { fromMail } = validatedDataMail;
        const { description } = validatedDataDesc;

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
        return handleError(error)
    }
}
