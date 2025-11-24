import User from "@/src/models/userModel";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;
        if (!refreshToken) return NextResponse.json({ error: "No Refresh Token" }, { status: 401 });

        const user = await User.findOne({ refreshToken });
        if (!user) {
            const res = NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
            res.cookies.set("refreshToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 0,
            });
            return res;
        }

        // if user and refresh token founded, created new access token
        const payload = {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1m",
        });

        const res = NextResponse.json({ success: true });

        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60,
        });
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
    }
}