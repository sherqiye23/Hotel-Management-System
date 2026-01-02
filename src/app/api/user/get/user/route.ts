import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/src/models/userModel";
import { MyJwtPayload } from "@/src/types/jwtType";
import { handleError } from "@/src/utils/errorHandler";

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get("accessToken")?.value;
        if (!accessToken) {
            return NextResponse.json(
                { message: "Token not found" },
                { status: 401 },
            );
        }
        let payload: MyJwtPayload;
        try {
            payload = jwt.verify(
                accessToken,
                process.env.JWT_SECRET!,
            ) as MyJwtPayload;
        } catch (error) {
            return NextResponse.json(
                { message: "Token is invalid" },
                { status: 401 },
            );
        }

        const user = await User.findById(payload.id)
            .select("-password")
            .select("-refreshToken")
            .select("-__v")
            .populate({
                path: "reservedRooms",
                populate: {
                    path: "roomId",
                    model: "Room"
                },
                options: {
                    sort: { 'createdAt': -1 }
                }
            })
            .populate({
                path: "ratings",
                populate: {
                    path: "roomId",
                    model: "Room"
                },
                options: {
                    sort: { 'createdAt': -1 }
                }
            });


        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        return NextResponse.json(user);
    } catch (error: unknown) {
        return handleError(error);
    }
}
