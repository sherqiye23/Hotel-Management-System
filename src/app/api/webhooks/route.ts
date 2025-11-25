import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/src/lib/stripe'

export async function POST(req: NextRequest) {
    let event: Stripe.Event

    try {
        const payload = await req.text()
        const signature = (await headers()).get('stripe-signature')!
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.log(err)
        return NextResponse.json(
            { message: `Webhook Error: ${err?.message || 'Unknown error'}` },
            { status: 400 }
        )
    }

    const permittedEvents: string[] = ['payment_intent.succeeded']

    if (permittedEvents.includes(event.type)) {
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const data = event.data.object as Stripe.PaymentIntent
                    console.log(`Payment status: ${data.status}`)
                    break
                default:
                    throw new Error(`Unhandled event: ${event.type}`)
            }
        } catch (error) {
            console.log(error)
            return NextResponse.json(
                { message: 'Webhook handler failed' },
                { status: 500 }
            )
        }
    }

    return NextResponse.json({ message: 'Received' }, { status: 200 })
}
