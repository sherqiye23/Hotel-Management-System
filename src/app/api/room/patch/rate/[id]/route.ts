import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/src/utils/errorHandler";
import { patchRateRoomSchema, roomIdSchema } from "@/src/app/schemas/roomSchemas";
import Room from "@/src/models/roomModel";
import { userIdSchema } from "@/src/app/schemas/userSchemas";
import Rating from "@/src/models/ratingModel";
import User from "@/src/models/userModel";

interface Context {
    params: Promise<{ id: string; }>;
}

export async function PATCH(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBodyRoomId = await context.params;
        const reqBody = await request.json();

        const validatedDataRoomId = await roomIdSchema.validate(reqBodyRoomId, { abortEarly: false });
        const validatedDataUserId = await userIdSchema.validate(reqBody, { abortEarly: false });
        const validatedDataValue = await patchRateRoomSchema.validate(reqBody, { abortEarly: false });

        const { id: roomId } = validatedDataRoomId;
        const { id: userId } = validatedDataUserId;
        const { value } = validatedDataValue;

        const room = await Room.findById(roomId);
        if (!room) return NextResponse.json({ message: "Room is not found" }, { status: 404 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: "User is not found" }, { status: 404 });

        const sameRating = await Rating.findOne({ roomId, userId });
        if (sameRating) {
            await Rating.findByIdAndUpdate(sameRating._id, { value }, { new: true });
        } else {
            const newRating = new Rating({ roomId, userId, value });
            await newRating.save();
        }

        return NextResponse.json(
            { message: "Rating updated successfully" },
            { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}