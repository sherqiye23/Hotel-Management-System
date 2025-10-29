import User from "@/src/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { id, firstname, lastname } = reqBody;

        const userFind = await User.findById(id);
        if (!userFind) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }
        // check firstname
        if (!firstname.trim()) {
            return NextResponse.json({
                message: 'First Name is required.',
                success: false
            }, { status: 400 });
        }
        if (firstname.trim().length > 15) {
            return NextResponse.json({
                message: 'First Name maximum 15 characters',
                success: false
            }, { status: 400 });
        }

        // check lastname
        if (!lastname.trim()) {
            return NextResponse.json({
                message: 'Last Name is required.',
                success: false
            }, { status: 400 });
        }
        if (lastname.trim().length > 15) {
            return NextResponse.json({
                message: 'Last Name maximum 15 characters',
                success: false
            }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            firstname: firstname.trim(),
            lastname: lastname.trim()
        }, {new: true})

        return NextResponse.json(updatedUser, { status: 200 });
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