import { roomIdSchema } from "@/src/app/schemas/roomSchemas";
import Room from "@/src/models/roomModel";
import { Context } from "@/src/types/contextTypes";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await roomIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const room = await Room.findById(id)
            .populate("reservations")
            .populate("ratings");

        if (!room) return NextResponse.json({ message: 'Room not found' }, { status: 404 });

        return NextResponse.json({
            name: room.name,
            description: room.description,
            images: room.images,
            pricePerNight: room.pricePerNight,
            reservations: room.reservations,
            ratings: room.ratings,
            averageRating: room.averageRating,
            ratingCount: room.ratingCount,
            isSoftDeleted: room.isSoftDeleted,
            createdAt: room.createdAt,
        }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
