import { roomSlugSchema } from "@/src/app/schemas/roomSchemas";
import Rating from "@/src/models/ratingModel";
import Reservation from "@/src/models/reservationModel";
import Room from "@/src/models/roomModel";
import { ContextSlug } from "@/src/types/contextTypes";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: ContextSlug
) {
    try {
        const reqBody = await context.params;
        const validatedData = await roomSlugSchema.validate(reqBody, { abortEarly: false });
        const { slug } = validatedData;

        const room = await Room.findOne({ slug, isSoftDeleted: false });
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        const reservations = await Reservation.find({
            roomId: room._id,
            status: { $in: ["pending", "confirmed"] }
        }).lean();
        const ratings = await Rating.find({ roomId: room._id });

        return NextResponse.json({
            id: room._id.toString(),
            name: room.name,
            slug: room.slug,
            description: room.description,
            images: room.images,
            pricePerNight: room.pricePerNight,
            reservations,
            ratings,
            averageRating: room.averageRating,
            ratingCount: room.ratingCount,
            isSoftDeleted: room.isSoftDeleted,
            createdAt: room.createdAt,
        }, { status: 200 });

    } catch (error: unknown) {
        return handleError(error)
    }
}
