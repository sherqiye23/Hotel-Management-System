import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "@/src/types/jwtType";
import Feedback from "@/src/models/feedbackModel";

const SECRET = process.env.JWT_SECRET!;

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { id, description } = reqBody;

        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token is not found" }, { status: 404 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET) as MyJwtPayload;
        } catch (err) {
            return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
        }

        if (!decoded.isAdmin) {
            return NextResponse.json({ message: "You are not admin" }, { status: 403 });
        }

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return NextResponse.json({ message: "Feedback is not found" }, { status: 404 });
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