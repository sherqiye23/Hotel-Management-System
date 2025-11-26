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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ depositPaid }: { depositPaid: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            }
        });

        if (error?.type === "card_error" || error?.type === "validation_error") {
            setMessage(error.message || null);
        } else if (error) {
            setMessage("An unexpected error occurred.");
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
}

export default function CheckoutForm({ clientSecret, depositPaid }: CheckoutFormProps) {
    const appearance: Appearance = {
        theme: "stripe",
    };

    return (
        <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
            <PaymentForm depositPaid={depositPaid} />
        </Elements>
    );
}
