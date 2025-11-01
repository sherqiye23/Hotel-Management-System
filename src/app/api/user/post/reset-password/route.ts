import User from "@/src/models/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, newPassword, confirmPassword } = reqBody;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // check password
        function validatePassword(password: string): string | null {
            if (password.trim().length < 8 && password.trim().length > 0) return 'Password must be at least 8 characters long';
            if (password.trim().length > 16) return 'Password must be at most 16 characters long';
            if (!/[A-Z]/.test(password)) return 'Password must include uppercase character';
            if (!/[a-z]/.test(password)) return 'Password must include lowercase character';
            if (!/\d/.test(password)) return 'Password must include number character';
            if (!/[\W_]/.test(password)) return 'Password must include special character';
            return null;
        }
        const errorNewP = validatePassword(newPassword);
        if (errorNewP) return NextResponse.json({ message: errorNewP, success: false }, { status: 400 });
        const errorConfirmP = validatePassword(confirmPassword);
        if (errorConfirmP) return NextResponse.json({ message: errorConfirmP, success: false }, { status: 400 });

        // check new and confirm match
        if (newPassword.trim() !== confirmPassword.trim()) {
            return NextResponse.json({ message: 'New password and confirm password do not match', success: false }, { status: 400 });
        }

        // hash password if the user follows all the rules
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(String(newPassword), salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword })
        return NextResponse.json({
            message: 'Password updated successfully!',
            success: true,
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