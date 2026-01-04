import { NextResponse } from "next/server";
import mongoose from "mongoose";

export function handleError(error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map(
            (err) => err.message
        );

        return NextResponse.json(
            { message: messages.join(", "), success: false },
            { status: 400 }
        );
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === 11000
    ) {
        return NextResponse.json(
            { message: "Duplicate key error", success: false },
            { status: 409 }
        );
    }

    if (error instanceof Error) {
        return NextResponse.json(
            { message: error.message, success: false },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { message: "Server Error", success: false },
        { status: 500 }
    );
}
