import { NextRequest, NextResponse } from "next/server";
import Reservation from "@/src/models/reservationModel";
import { reservationIdSchema, statusConfirmedMailSchema } from "@/src/app/schemas/reservationSchema";
import Room from "@/src/models/roomModel";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { sendMailforRes } from "@/src/utils/reservationSendMail";
import { Context } from "@/src/types/contextTypes";

export async function POST(
    req: NextRequest,
    context: Context
) {
    try {
        // if user's payment successful, the status will be confirmed and send mail
        const reqBody = await context.params;
        const reqBodyMail = await req.json();
        const validatedDataReservationId = await reservationIdSchema.validate(reqBody, { abortEarly: false });
        const validatedDataMail = await statusConfirmedMailSchema.validate(reqBodyMail, { abortEarly: false });
        const { id: reservationId } = validatedDataReservationId;
        const { email } = validatedDataMail;

        const reservation = await Reservation.findById(reservationId).populate("roomId");
        if (!reservation || reservation.status !== "pending") {
            return NextResponse.json({ message: "Reservation not found or already finalized" }, { status: 400 });
        }

        reservation.status = "confirmed";
        reservation.endingStatusTime = null;
        await reservation.save();

        try {
            await sendMailforRes(email, reservation);
        } catch (error) {
            return handleError(error)
        }

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
