import { NextRequest, NextResponse } from "next/server";
import Reservation from "@/src/models/reservationModel";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: NextRequest,
    context: Context
) {
    const reqBody = await context.params;
    const { id: reservationId } = reqBody;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation || reservation.status !== "pending") {
        return NextResponse.json({ message: "Reservation not found or already finalized" }, { status: 400 });
    }

    reservation.status = "confirmed";
    reservation.endingStatusTime = null;
    await reservation.save();

    return NextResponse.json({ message: "Reservation confirmed" });
}
