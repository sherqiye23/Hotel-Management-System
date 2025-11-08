import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { loginSchema } from "@/src/app/schemas/userSchemas";
import { handleError } from "@/src/utils/errorHandler";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const validatedData = await loginSchema.validate(
            reqBody,
            { abortEarly: false }
        )
        const { email, password, rememberMe } = validatedData;

        const findedUser = await User.findOne({ email });
        if (!findedUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 },
            );
        }

        // compare password
        const isPasswordCorrect = await bcryptjs.compare(password, findedUser.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: 'Password is wrong' },
                { status: 401 },
            );
        }

        // if password is correct:
        const payload = {
            id: findedUser._id,
            email: findedUser.email,
            isAdmin: findedUser.isAdmin,
            firstname: findedUser.firstname,
            lastname: findedUser.lastname
        };
        try {
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "3d" });
            const response = NextResponse.json({
                accessToken,
                success: true,
            });
            response.cookies.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 15 * 60,
            });
            if (rememberMe) {
                response.cookies.set("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3 * 24 * 60 * 60,
                });
            }
            return response;
        } catch (error) {
            return handleError(error)
        }

    } catch (error: unknown) {
        return handleError(error)
    }
}