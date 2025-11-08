import { forgotPasswordSendOtpSchema } from "@/src/app/schemas/userSchemas";
import cache from "@/src/lib/cache";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { sendMail } from "@/src/utils/mail";
import { NextRequest, NextResponse } from "next/server";

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const validatedData = await forgotPasswordSendOtpSchema.validate(
            reqBody,
            { abortEarly: false }
        )
        const { email } = validatedData;

        // find user
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // warning if sent otp code
        if (cache.has(email)) {
            cache.delete(email)
        }

        // otp send
        const otp = generateOtp();
        cache.set(email, otp);

        setTimeout(() => {
            cache.delete(email);
        }, 5 * 60 * 1000);

        try {
            // you can write web worker here
            await sendMail(email, otp);
        } catch (error) {
            return handleError(error)
        }

        return NextResponse.json({ message: "OTP sent. Validity period is 5 minutes" });

    } catch (error: unknown) {
        return handleError(error)
    }
}