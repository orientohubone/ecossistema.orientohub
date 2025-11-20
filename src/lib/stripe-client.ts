/**
 * Stripe Client Configuration (Frontend)
 * 
 * Este arquivo configura o Stripe para uso no FRONTEND.
 * Usa a chave PÚBLICA que é segura para expor no navegador.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Obter chave pública do ambiente
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Validar que a chave está configurada
if (!stripePublicKey) {
    throw new Error(
        '❌ VITE_STRIPE_PUBLIC_KEY não está configurada.\n' +
        'Configure em .env.local ou nas variáveis de ambiente do Vercel.'
    );
}

// Validar formato da chave
if (!stripePublicKey.startsWith('pk_')) {
    throw new Error(
        '❌ VITE_STRIPE_PUBLIC_KEY inválida.\n' +
        'Deve começar com "pk_test_" (teste) ou "pk_live_" (produção).'
    );
}

// Inicializar Stripe (lazy loading)
export const stripePromise: Promise<Stripe | null> = loadStripe(stripePublicKey);

// Log para debug (apenas em desenvolvimento)
if (import.meta.env.DEV) {
    console.log('✅ Stripe inicializado com chave:', stripePublicKey.substring(0, 15) + '...');
}
