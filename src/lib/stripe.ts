/**
 * Stripe Client Configuration (Frontend)
 */

import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
    console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY não configurada');
}

export const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
