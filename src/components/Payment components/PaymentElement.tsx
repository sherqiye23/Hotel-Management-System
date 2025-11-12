"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentFormWrapper } from "./PaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentElement() {
    const reservationId = "yourReservationId";
    const totalPrice = 100;

    return (
        <Elements stripe={stripePromise}>
            <PaymentFormWrapper reservationId={reservationId} totalPrice={totalPrice} />
        </Elements>
    );
}
