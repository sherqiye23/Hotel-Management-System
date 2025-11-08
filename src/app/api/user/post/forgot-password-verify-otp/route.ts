import { forgotPasswordSendOtpSchema, forgotPasswordVerifyOtpSchema } from '@/src/app/schemas/userSchemas';
import cache from '@/src/lib/cache';
import { handleError } from '@/src/utils/errorHandler';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const validatedDataEmail = await forgotPasswordSendOtpSchema.validate(
            reqBody,
            { abortEarly: false }
        )
        const validatedDataOtp = await forgotPasswordVerifyOtpSchema.validate(
            reqBody,
            { abortEarly: false }
        )
        const { email } = validatedDataEmail;
        const { otpCode } = validatedDataOtp;

        const cachedOtp = cache.get(email)
        if (!cachedOtp) {
            return NextResponse.json({ message: 'OTP expired or not found' }, { status: 400 });
        }
        if (otpCode !== cachedOtp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        cache.delete(email);

        return NextResponse.json({
            message: 'OTP verified! Go to reset password',
            success: true,
        })

    } catch (error: unknown) {
        return handleError(error)
    }
}