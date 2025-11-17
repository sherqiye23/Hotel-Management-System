import { NextRequest, NextResponse } from "next/server";
import Reservation from "@/src/models/reservationModel";
import Room from "@/src/models/roomModel";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";
import { IReservation } from "@/src/types/modelTypes";
import { schemaRoomId } from "@/src/app/schemas/roomSchemas";
import { schemaUserId } from "@/src/app/schemas/userSchemas";
import { newReservationSchema } from "@/src/app/schemas/reservationSchema";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const roomId = await schemaRoomId.validate(reqBody.roomId, { abortEarly: false });
        const userId = await schemaUserId.validate(reqBody.userId, { abortEarly: false });
        const validatedData = await newReservationSchema.validate(reqBody, { abortEarly: false });
        const { startReservedTime, endReservedTime } = validatedData;

        const room = await Room.findById(roomId).populate("reservations");
        const user = await User.findById(userId);

        if (!room || !user) return NextResponse.json({ message: "Room or User not found" }, { status: 404 });

        const start = new Date(startReservedTime);
        const end = new Date(endReservedTime);

        const isOverlap = room.reservations?.some((res: IReservation) => {
            return (
                start < new Date(res.endReservedTime) && end > new Date(res.startReservedTime)
            );
        });

        if (isOverlap) {
            return NextResponse.json({
                success: false,
                message: "This room is already reserved for the selected dates.",
            }, { status: 400 });
        }

        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * room.pricePerNight;

        const reservation = await Reservation.create({
            roomId,
            userId,
            startReservedTime: start,
            endReservedTime: end,
            status: "pending",
            endingStatusTime: new Date(Date.now() + 15 * 60 * 1000),
        });

        setTimeout(async () => {
            const res = await Reservation.findById(reservation._id);
            if (res && res.status === "pending") {
                res.status = "cancelled";
                res.endingStatusTime = null;
                await res.save();
            }
        }, 15 * 60 * 1000);

        return NextResponse.json({ reservationId: reservation._id, totalPrice });

    } catch (error) {
        return handleError(error)
    }
}
