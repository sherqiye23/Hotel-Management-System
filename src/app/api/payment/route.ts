import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { totalPrice, reservationId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), 
      currency: "usd",
      metadata: { reservationId },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Stripe PaymentIntent creation failed" }, { status: 500 });
  }
}
