/**
 * API Route: Create Payment Intent
 * 
 * Endpoint: POST /api/create-payment-intent
 * 
 * Cria um PaymentIntent no Stripe para processar o pagamento.
 * Suporta múltiplos métodos de pagamento: cartão, PIX e boleto.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './lib/stripe-server';

// Tipos
interface CreatePaymentIntentRequest {
    amount: number;
    currency?: string;
    plan: string;
    billing: 'monthly' | 'annual';
    email: string;
    name: string;
}

// Mapeamento de planos para valores
const PLAN_PRICES = {
    pro: {
        monthly: 97,
        annual: 970,
    },
    enterprise: {
        monthly: 0, // Custom pricing
        annual: 0,
    },
};

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST para criar um PaymentIntent'
        });
    }

    try {
        const {
            plan,
            billing,
            email,
            name,
            currency = 'brl'
        }: CreatePaymentIntentRequest = req.body;

        // Validações
        if (!plan || !billing || !email || !name) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'plan, billing, email e name são obrigatórios'
            });
        }

        // Calcular valor baseado no plano
        const planPrices = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
        if (!planPrices) {
            return res.status(400).json({
                error: 'Invalid plan',
                message: 'Plano inválido. Use "pro" ou "enterprise"'
            });
        }

        const amount = planPrices[billing];

        // Enterprise é custom pricing
        if (amount === 0) {
            return res.status(400).json({
                error: 'Custom pricing required',
                message: 'Entre em contato para pricing Enterprise'
            });
        }

        // Criar PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe usa centavos
            currency,
            payment_method_types: ['card', 'boleto'], // PIX será adicionado via dashboard
            receipt_email: email,
            metadata: {
                plan,
                billing,
                customer_name: name,
                customer_email: email,
            },
            description: `Assinatura ${plan} - ${billing === 'annual' ? 'Anual' : 'Mensal'}`,
        });

        // Retornar clientSecret para o frontend
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error: any) {
        console.error('❌ Erro ao criar PaymentIntent:', error);

        res.status(500).json({
            error: 'Payment intent creation failed',
            message: error.message || 'Erro ao processar pagamento',
        });
    }
}
