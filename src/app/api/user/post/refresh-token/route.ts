import { userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";
import { MyJwtPayload } from "@/src/types/jwtType";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('accessToken')?.value;

        if (!accessToken) return NextResponse.json({ error: "No Token" }, { status: 401 });

        const decoded = jwt.decode(accessToken) as MyJwtPayload | null;
        if (!decoded || !decoded.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const validatedData = await userIdSchema.validate({ id: decoded.id }, { abortEarly: false })
        const { id } = validatedData;
        const user = await User.findById(id);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 },);
        if (!user.refreshToken) return NextResponse.json({ message: 'Refresh token not found' }, { status: 404 });

        // if user and refresh token founded
        const payload = {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "15m",
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 15 * 60,
        });

        return res;
    } catch (error) {
        return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
    }
}