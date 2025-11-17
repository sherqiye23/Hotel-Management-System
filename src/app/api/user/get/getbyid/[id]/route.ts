import { userIdSchema } from "@/src/app/schemas/userSchemas";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await userIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const user = await User.findById(id)
            .populate("reservations")
            .populate("ratings");

        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        return NextResponse.json(
            {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isAdmin: user.isAdmin,
                reservedRooms: user.reservations,
                ratings: user.ratings,
                createdAt: user.createdAt
            }
            , { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
