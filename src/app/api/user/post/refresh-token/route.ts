import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface RefreshToken {
    id: string;
    firstname: string;
    lastname: string;
    isAdmin: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "No Token" }, { status: 401 });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as RefreshToken;
        const payload = {
            id: decoded.id,
            isAdmin: decoded.isAdmin,
            firstname: decoded.firstname,
            lastname: decoded.lastname
        };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1m",
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60,
        });

        return res;
    } catch (error) {
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
    }
}