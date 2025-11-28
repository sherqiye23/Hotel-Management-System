'use client'
import { useEffect, useState } from 'react';
import CheckoutForm from './Checkout';
import styles from './Checkout.module.css';
import { ResData } from '@/src/app/(main)/rooms/[roomname]/page';

interface PaymentPageProps {
    reservationData: ResData;
}

export default function PaymentPage({ reservationData }: PaymentPageProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const { depositPaid, reservationId } = reservationData;

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ depositPaid, reservationId }),
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, [depositPaid]);

    if (!clientSecret) return <div>Loading...</div>;

    return (
        <div className={styles.checkout}>
            <CheckoutForm clientSecret={clientSecret} depositPaid={depositPaid} reservationId={reservationId} />
        </div>
    );
}
