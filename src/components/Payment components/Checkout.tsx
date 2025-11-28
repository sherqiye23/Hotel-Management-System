"use client";
import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
    Elements,
    PaymentElementProps
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Appearance } from '@stripe/stripe-js';
import styles from './Checkout.module.css'
import { useConfirmReservationMutation } from "@/src/lib/features/reservation/reservationSlice";
import { useMyContext } from "@/src/context/UserInfoContext";
import { handleFormError } from "@/src/utils/handleFormError";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ depositPaid, reservationId }: { depositPaid: number, reservationId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const { userInfo } = useMyContext()

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmReservation] = useConfirmReservationMutation()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?reservationId=${reservationId}`,
            }
        });

        if (error?.type === "card_error" || error?.type === "validation_error") {
            setMessage(error.message || null);
            setIsLoading(false);
            return;
        } else if (error) {
            setMessage("An unexpected error occurred.");
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    };

    const paymentElementOptions: PaymentElementProps['options'] = {
        layout: "accordion",
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <PaymentElement className={styles.paymentElement} options={paymentElementOptions} />
            <button className={styles.button} disabled={isLoading || !stripe || !elements}>
                <span>
                    {isLoading ? <div className={styles.spinner}></div> : `Pay now ${depositPaid}$`}
                </span>
            </button>
            {message && <div className={styles.paymentMessage}>{message}</div>}
        </form>
    );
}

interface CheckoutFormProps {
    clientSecret: string;
    depositPaid: number;
    reservationId: string;
}

export default function CheckoutForm({ clientSecret, depositPaid, reservationId }: CheckoutFormProps) {
    const appearance: Appearance = {
        theme: "stripe",
    };

    return (
        <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
            <PaymentForm depositPaid={depositPaid} reservationId={reservationId} />
        </Elements>
    );
}
