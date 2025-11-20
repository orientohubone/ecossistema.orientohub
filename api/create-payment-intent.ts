/**
 * Vercel Serverless Function: Create Payment Intent
 * 
 * Endpoint: /api/create-payment-intent
 * Method: POST
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Mapeamento de planos
const PLAN_PRICES = {
    pro: {
        monthly: 97,
        annual: 970,
    },
    enterprise: {
        monthly: 0, // Custom
        annual: 0,
    },
};

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Inicializar Stripe dentro do handler
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
        console.error('❌ STRIPE_SECRET_KEY não configurada');
        return res.status(500).json({
            error: 'Configuration error',
            message: 'Stripe não está configurado. Configure STRIPE_SECRET_KEY no Vercel.'
        });
    }

    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2024-11-20.acacia',
    });

    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST para criar um PaymentIntent'
        });
    }

    try {
        const { plan, billing, email, name } = req.body;

        // Validações
        if (!plan || !billing || !email || !name) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'plan, billing, email e name são obrigatórios'
            });
        }

        // Calcular valor
        const planPrices = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
        if (!planPrices) {
            return res.status(400).json({
                error: 'Invalid plan',
                message: 'Plano inválido'
            });
        }

        const amount = planPrices[billing as 'monthly' | 'annual'];

        if (amount === 0) {
            return res.status(400).json({
                error: 'Custom pricing required',
                message: 'Entre em contato para pricing Enterprise'
            });
        }

        // Criar PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Centavos
            currency: 'brl',
            payment_method_types: ['card'],
            receipt_email: email,
            metadata: {
                plan,
                billing,
                customer_name: name,
                customer_email: email,
            },
            description: `Assinatura ${plan} - ${billing === 'annual' ? 'Anual' : 'Mensal'}`,
        });

        // Retornar clientSecret
        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error: any) {
        console.error('❌ Erro ao criar PaymentIntent:', error);

        return res.status(500).json({
            error: 'Payment intent creation failed',
            message: error.message || 'Erro ao processar pagamento',
        });
    }
}
