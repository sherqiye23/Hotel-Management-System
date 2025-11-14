import { roomSlugSchema } from "@/src/app/schemas/roomSchemas";
import Rating from "@/src/models/ratingModel";
import Reservation from "@/src/models/reservationModel";
import Room from "@/src/models/roomModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await roomSlugSchema.validate(reqBody, { abortEarly: false });
        const { slug } = validatedData;

        const room = await Room.findOne({ slug, isSoftDeleted: false });
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }
        const ratings = await Rating.find({ roomId: room._id });
        const reservations = await Reservation.find({ roomId: room._id });

        return NextResponse.json(
            {
                name: room.name,
                slug: room.slug,
                description: room.description,
                images: room.images,
                pricePerNight: room.pricePerNight,
                reservations: reservations,
                ratings: ratings,
                averageRating: room.averageRating,
                ratingCount: room.ratingCount,
                isSoftDeleted: room.isSoftDeleted,
                createdAt: room.createdAt,
            }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
