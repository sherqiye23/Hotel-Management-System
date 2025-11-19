import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Reservation from "@/src/models/reservationModel";
import { handleError } from "@/src/utils/errorHandler";
import { schemaReservationId } from "@/src/app/schemas/reservationSchema";
import { Context } from "@/src/types/contextTypes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

export async function POST(
    req: NextRequest,
    context: Context
) {
    try {
        const reqBody = await context.params;
        const reservationId = await schemaReservationId.validate(reqBody.id, { abortEarly: false });

        const reservation = await Reservation.findById(reservationId).populate("roomId");
        if (!reservation) {
            return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
        }

        if (reservation.status !== "pending") {
            return NextResponse.json({ message: "Reservation cannot be paid" }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(reservation.depositPaid * 100),
            currency: "usd",
            metadata: { reservationId },
        });

        return NextResponse.json(
            { clientSecret: paymentIntent.client_secret },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}

