import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from 'mongoose';
import User from "@/src/models/userModel";

interface MyJwtPayload extends JwtPayload {
    id: string;
    isAdmin: boolean;
    firstname: string;
    lastname: string;
}

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('accessToken')?.value;
        const refreshToken = request.cookies.get('refreshToken')?.value;
        const token = accessToken || refreshToken;

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        let payload: MyJwtPayload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
        } catch (error) {
            return NextResponse.json({ message: "Token is invalid" }, { status: 401 });
        }

        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);

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