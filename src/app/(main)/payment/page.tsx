import CheckoutForm from "@/src/components/Payment components/Checkout";
import { stripe } from "@/src/lib/stripe";
import { JSX } from "react";
import styles from '../../../components/Payment components/Checkout.module.css'

interface Item {
    id: string;
}

export default async function IndexPage(): Promise<JSX.Element> {

    const calculateOrderAmount = (items: Item[]): number => {
        return 1400;
    };

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount([{ id: 'xl-tshirt' }]),
        currency: 'eur',
        automatic_payment_methods: {
            enabled: true,
        },
    });

    const clientSecret: string = paymentIntent.client_secret!;

    return (
        <div className={styles.checkout}>
            <CheckoutForm clientSecret={clientSecret} />
        </div>
    );
}
