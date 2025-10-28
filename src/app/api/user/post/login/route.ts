import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password, rememberMe } = reqBody;

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
            isAdmin: findedUser.isAdmin,
            firstname: findedUser.firstname,
            lastname: findedUser.lastname
        };
        try {
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
            const response = NextResponse.json({
                accessToken,
                success: true,
            });
            response.cookies.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60,
            });
            if (rememberMe) {
                response.cookies.set("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60,
                });
            }
            return response;
        } catch (error) {
            console.error('Error signing JWT:', error);
            return NextResponse.json({ message: 'Failed to generate token' }, { status: 500 });
        }

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