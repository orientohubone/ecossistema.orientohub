/**
 * API Route: Webhook Handler
 * 
 * Endpoint: POST /api/webhook
 * 
 * Recebe e processa eventos do Stripe via webhooks.
 * Importante para confirmar pagamentos e atualizar status de assinaturas.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './lib/stripe-server';
import Stripe from 'stripe';

// Webhook secret (obtido do dashboard Stripe)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obter assinatura do webhook
    const signature = req.headers['stripe-signature'];

    if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!webhookSecret) {
        console.error('❌ STRIPE_WEBHOOK_SECRET não configurado');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event: Stripe.Event;

    try {
        // Verificar assinatura do webhook
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );
    } catch (error: any) {
        console.error('❌ Erro ao verificar webhook:', error.message);
        return res.status(400).json({
            error: 'Webhook signature verification failed',
            message: error.message
        });
    }

    // Processar evento
    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('✅ Pagamento bem-sucedido:', paymentIntent.id);

                // TODO: Ativar assinatura do usuário no banco de dados
                // const { customer_email, plan, billing } = paymentIntent.metadata;
                // await activateSubscription(customer_email, plan, billing);

                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('❌ Pagamento falhou:', paymentIntent.id);

                // TODO: Notificar usuário sobre falha no pagamento
                // const { customer_email } = paymentIntent.metadata;
                // await sendPaymentFailedEmail(customer_email);

                break;
            }

            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('⚠️ Pagamento cancelado:', paymentIntent.id);
                break;
            }

            case 'charge.succeeded': {
                const charge = event.data.object as Stripe.Charge;
                console.log('✅ Cobrança bem-sucedida:', charge.id);
                break;
            }

            case 'charge.failed': {
                const charge = event.data.object as Stripe.Charge;
                console.log('❌ Cobrança falhou:', charge.id);
                break;
            }

            default:
                console.log(`ℹ️ Evento não tratado: ${event.type}`);
        }

        // Retornar sucesso
        res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('❌ Erro ao processar webhook:', error);
        res.status(500).json({
            error: 'Webhook processing failed',
            message: error.message
        });
    }
}

// Configuração especial para webhooks do Stripe
// O body precisa ser raw (não parseado como JSON)
export const config = {
    api: {
        bodyParser: false,
    },
};
