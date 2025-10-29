import User from "@/src/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;

        const deletedUser = await User.findById(id);
        if (!deletedUser) {
            return NextResponse.json({ message: "User is not found" }, { status: 404 });
        }
        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: `User deleted` }, { status: 200 });

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