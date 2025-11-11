import { NextRequest, NextResponse } from "next/server";
import Reservation from "@/src/models/reservationModel";
import Room from "@/src/models/roomModel";
import User from "@/src/models/userModel";
import { handleError } from "@/src/utils/errorHandler";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { roomId, userId, startReservedTime, endReservedTime } = reqBody;

        const room = await Room.findById(roomId);
        const user = await User.findById(userId);

        if (!room || !user) return NextResponse.json({ message: "Room or User not found" }, { status: 404 });

        const start = new Date(startReservedTime);
        const end = new Date(endReservedTime);
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
