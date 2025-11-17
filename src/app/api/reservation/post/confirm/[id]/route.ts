import { NextRequest, NextResponse } from "next/server";
import Reservation from "@/src/models/reservationModel";
import { reservationIdSchema } from "@/src/app/schemas/reservationSchema";
import Room from "@/src/models/roomModel";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: NextRequest,
    context: Context
) {
    try {
        // if user's payment successful, the status will be confirmed 
        const reqBody = await context.params;
        const validatedDataReservationId = await reservationIdSchema.validate(reqBody, { abortEarly: false });
        const { id: reservationId } = validatedDataReservationId;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation || reservation.status !== "pending") {
            return NextResponse.json({ message: "Reservation not found or already finalized" }, { status: 400 });
        }

        reservation.status = "confirmed";
        reservation.endingStatusTime = null;
        await reservation.save();

        await Room.findByIdAndUpdate(reservation.roomId, {
            $push: { reservations: reservation._id }
        });

        await User.findByIdAndUpdate(reservation.userId, {
            $push: { reservedRooms: reservation._id }
        });

        return NextResponse.json({ message: "Reservation confirmed" }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
