/**
 * Stripe Server Configuration (Backend)
 * 
 * Este arquivo configura o Stripe para uso no BACKEND.
 * Usa a chave SECRETA que NUNCA deve ser exposta no frontend.
 * 
 * ⚠️ IMPORTANTE: Este arquivo só deve ser importado em API routes/serverless functions
 */

import Stripe from 'stripe';

// Obter chave secreta do ambiente
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Validar que a chave está configurada
if (!stripeSecretKey) {
    throw new Error(
        '❌ STRIPE_SECRET_KEY não está configurada.\n' +
        'Configure em .env.local ou nas variáveis de ambiente do Vercel.\n' +
        'Esta variável NÃO deve ter o prefixo VITE_ (é apenas para backend).'
    );
}

// Validar formato da chave
if (!stripeSecretKey.startsWith('sk_')) {
    throw new Error(
        '❌ STRIPE_SECRET_KEY inválida.\n' +
        'Deve começar com "sk_test_" (teste) ou "sk_live_" (produção).'
    );
}

// Inicializar Stripe com a chave secreta
export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
});

// Log para debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    console.log('✅ Stripe Server inicializado com chave:', stripeSecretKey.substring(0, 15) + '...');
}
