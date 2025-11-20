/**
 * Vercel Serverless Function: Webhook Handler
 * 
 * Endpoint: /api/webhook
 * Method: POST
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const signature = req.headers['stripe-signature'];

    if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event: Stripe.Event;

    try {
        // Get raw body
        const rawBody = await getRawBody(req);

        // Verificar assinatura
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature as string,
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
                // TODO: Ativar assinatura
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('❌ Pagamento falhou:', paymentIntent.id);
                // TODO: Notificar usuário
                break;
            }

            default:
                console.log(`ℹ️ Evento não tratado: ${event.type}`);
        }

        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('❌ Erro ao processar webhook:', error);
        return res.status(500).json({
            error: 'Webhook processing failed',
            message: error.message
        });
    }
}

// Helper para obter raw body
async function getRawBody(req: VercelRequest): Promise<Buffer> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}
