import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { paymentReservationSchema, schemaReservationId } from "../../schemas/reservationSchema";
import Reservation from "@/src/models/reservationModel";
import { handleError } from "@/src/utils/errorHandler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const reservationId = await schemaReservationId.validate(reqBody.reservationId, { abortEarly: false });

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
    }
    if (reservation.status !== "pending") {
      return NextResponse.json({ message: "Reservation cannot be paid", status: 400 });
    }

    const validatedData = await paymentReservationSchema.validate(reqBody, { abortEarly: false });
    const { totalPrice } = validatedData;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      metadata: { reservationId },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
