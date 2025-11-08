import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { forgotPasswordSendOtpSchema, resetPasswordSchema } from "@/src/app/schemas/userSchemas";
import { handleError } from "@/src/utils/errorHandler";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const validatedDataEmail = await forgotPasswordSendOtpSchema.validate(
            reqBody,
            { abortEarly: false }
        )
        const validatedDataPassword = await resetPasswordSchema.validate(
            reqBody,
            { abortEarly: false }
        )
        const { email } = validatedDataEmail;
        const { newpassword } = validatedDataPassword;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // hash password if the user follows all the rules
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(String(newpassword), salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword })
        return NextResponse.json({
            message: 'Password updated successfully!',
            success: true,
        })
    } catch (error: unknown) {
        return handleError(error)
    }
}