import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/src/utils/errorHandler";
import { patchRateRoomSchema, roomIdSchema } from "@/src/app/schemas/roomSchemas";
import Room from "@/src/models/roomModel";
import Rating from "@/src/models/ratingModel";
import { Context } from "@/src/types/contextTypes";
import getAuthorizedUser from "@/src/utils/getAuthorizedUser";

export async function PATCH(
    request: NextRequest,
    context: Context
) {
    try {
        const user = await getAuthorizedUser(request);
        if (user instanceof NextResponse) return user;

        const reqBodyRoomId = await context.params;
        const reqBody = await request.json();

        const validatedDataRoomId = await roomIdSchema.validate(reqBodyRoomId, { abortEarly: false });
        const validatedDataValue = await patchRateRoomSchema.validate(reqBody, { abortEarly: false });

        const { id: roomId } = validatedDataRoomId;
        const { value } = validatedDataValue;

        const room = await Room.findById(roomId);
        if (!room) return NextResponse.json({ message: "Room is not found" }, { status: 404 });

        const sameRating = await Rating.findOne({ roomId: roomId, userId: user.id });
        if (sameRating) {
            sameRating.value = Number(value);
            await sameRating.save();
            console.log("RAW value:", value);
            console.log("Number(value):", Number(value));
            console.log("isNaN:", Number.isNaN(Number(value)));

            return NextResponse.json(
                {
                    message: sameRating,
                },
                { status: 200 });
        } else {
            const newRating = await Rating.create({
                roomId,
                userId: user.id,
                value
            });
            return NextResponse.json(
                {
                    newRating
                },
                { status: 200 });
        }

        return NextResponse.json(
            {
                message: "Rating updated successfully",
                value
            },
            { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}