import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/src/utils/errorHandler";
import { reservationIdSchema } from "@/src/app/schemas/reservationSchema";
import Reservation from "@/src/models/reservationModel";
import { Context } from "@/src/types/contextTypes";

export async function DELETE(
    request: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const validatedData = await reservationIdSchema.validate(reqBody, { abortEarly: false });
        const { id } = validatedData;

        const softdeletedReservation = await Reservation.findById(id)
        if (!softdeletedReservation) {
            return NextResponse.json({ message: "Reservation is not found" }, { status: 404 });
        }
        if (softdeletedReservation.isSoftDeleted) {
            return NextResponse.json({ message: "Reservation already soft deleted" }, { status: 400 });
        }

        softdeletedReservation.isSoftDeleted = true;
        await softdeletedReservation.save();
        return NextResponse.json({ message: `Reservation soft deleted` }, { status: 200 });

    } catch (error: unknown) {
        return handleError(error)
    }
}