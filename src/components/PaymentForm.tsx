"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
    reservationId: string;
    totalPrice: number;
}

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const clientSecret = (elements as any).clientSecret;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
        });

        if (result.error) {
            alert(result.error.message);
        } else if ((result as any).paymentIntent?.status === "succeeded") {
            alert("Payment successful!");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
            <PaymentElement />
            <button type="submit" disabled={!stripe || loading} style={{ marginTop: "20px" }}>
                {loading ? "Processing..." : `Pay`}
            </button>
        </form>
    );
};

export const PaymentFormWrapper = ({ reservationId, totalPrice }: PaymentFormProps) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reservationId, totalPrice }),
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, [reservationId, totalPrice]);

    if (!clientSecret) return <div>Loading payment...</div>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
};
