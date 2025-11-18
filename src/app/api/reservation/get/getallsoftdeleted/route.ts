import Reservation from "@/src/models/reservationModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const reservations = await Reservation.find({ isSoftDeleted: true }).sort({ createdAt: -1 });
        return NextResponse.json(reservations, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}
