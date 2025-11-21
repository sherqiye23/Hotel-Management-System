import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/src/utils/errorHandler";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "@/src/types/jwtType";
import { userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";

export async function POST(request: NextRequest) {
    try {
        const accessToken = request.cookies.get("accessToken")?.value;
        if (!accessToken)
            return NextResponse.json(
                { message: "No tokens found" },
                { status: 404 },
            );

        let decoded: MyJwtPayload;
        try {
            decoded = jwt.verify(
                accessToken,
                process.env.JWT_SECRET!,
            ) as MyJwtPayload;
        } catch {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 },
            );
        }

        const validatedData = await userIdSchema.validate(
            { id: decoded.id },
            { abortEarly: false },
        );
        const { id } = validatedData;

        const user = await User.findById(id);
        if (!user)
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        if (!user.refreshToken)
            return NextResponse.json(
                { message: "Refresh token not found" },
                { status: 404 },
            );

        user.refreshToken = null;
        await user.save();

        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 },
        );
        response.cookies.set("accessToken", "", {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error: unknown) {
        return handleError(error);
    }
}
