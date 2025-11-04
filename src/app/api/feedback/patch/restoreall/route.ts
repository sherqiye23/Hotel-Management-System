import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "@/src/types/jwtType";
import Feedback from "@/src/models/feedbackModel";

const SECRET = process.env.JWT_SECRET!;

export async function PATCH() {
    try {
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