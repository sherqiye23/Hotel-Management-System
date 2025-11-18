import { reservationIdSchema } from "@/src/app/schemas/reservationSchema";
import Reservation from "@/src/models/reservationModel";
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
        const validatedData = await reservationIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const reservation = await Reservation.findById(id)
            .populate("roomId")
            .populate("userId");

        if (!reservation) return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });

        return NextResponse.json({
            roomId: reservation.roomId,
            userId: reservation.userId,
            startReservedTime: reservation.startReservedTime,
            endReservedTime: reservation.endReservedTime,
            status: reservation.status,
            isSoftDeleted: reservation.isSoftDeleted,
            createdAt: reservation.createdAt,
        }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}