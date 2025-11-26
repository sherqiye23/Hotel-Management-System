import { NextResponse } from 'next/server';
import { stripe } from '@/src/lib/stripe';

export async function POST(req: Request) {
    const { depositPaid, reservationId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(depositPaid * 100), 
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: { reservationId }, 
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
