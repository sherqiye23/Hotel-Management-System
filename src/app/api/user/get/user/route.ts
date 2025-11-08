import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/src/models/userModel";
import { MyJwtPayload } from "@/src/types/jwtType";
import { handleError } from "@/src/utils/errorHandler";

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
        return handleError(error)
    }
}