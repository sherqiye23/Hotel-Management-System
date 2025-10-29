import User from "@/src/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(
    request: NextRequest,
    context: Context
) {
    try {
        const { id } = await context.params;

        const userFind = await User.findById(id);
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }
        const role = userFind.isAdmin ? false : true;

        const updatedRole = await User.findByIdAndUpdate(id, {
            isAdmin: role,
        }, { new: true })

        return NextResponse.json(updatedRole, { status: 200 });
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