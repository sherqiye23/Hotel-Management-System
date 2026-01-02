import { userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";
import { Context } from "@/src/types/contextTypes";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await userIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const user = await User.findById(id)
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

        return NextResponse.json(
            {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isAdmin: user.isAdmin,
                reservedRooms: user.reservedRooms,
                ratings: user.ratings,
                createdAt: user.createdAt
            }
            , { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
