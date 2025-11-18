import { reservationIdSchema } from "@/src/app/schemas/reservationSchema";
import Reservation from "@/src/models/reservationModel";
import { handleError } from "@/src/utils/errorHandler";
import { verifyAdmin } from "@/src/utils/verifyAdmin";
import { NextRequest, NextResponse } from "next/server";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await reservationIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const adminCheck = await verifyAdmin();
        if (adminCheck instanceof NextResponse) return adminCheck;

        const deletedReservation = await Reservation.findById(id)
        if (!deletedReservation) {
            return NextResponse.json({ message: "Reservation is not found" }, { status: 404 });
        }
        await Reservation.findByIdAndDelete(id);
        return NextResponse.json({ message: `Reservation deleted` }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error)
    }
}