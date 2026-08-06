import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const statusByEvent: Record<string, 'active' | 'past_due' | 'cancelled'> = {
  PAYMENT_RECEIVED: 'active',
  PAYMENT_CONFIRMED: 'active',
  PAYMENT_OVERDUE: 'past_due',
  PAYMENT_DELETED: 'cancelled',
  PAYMENT_REFUNDED: 'cancelled',
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });
  if (request.headers['asaas-access-token'] !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return response.status(401).json({ message: 'Webhook não autorizado.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return response.status(500).json({ message: 'Configuração de cobrança incompleta.' });

  const event = request.body;
  const subscriptionStatus = statusByEvent[event?.event];
  const payment = event?.payment;
  if (!subscriptionStatus || !payment) return response.status(204).end();

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  let query = admin
    .from('billing_subscriptions')
    .update({
      status: subscriptionStatus,
      asaas_payment_id: payment.id ?? null,
      asaas_subscription_id: payment.subscription ?? null,
    });

  if (payment.externalReference) {
    query = query.eq('external_reference', payment.externalReference);
  } else if (payment.checkoutSession) {
    // In Asaas Checkout recorrente, a referência pode ficar no checkout e não
    // ser copiada para a cobrança gerada pela assinatura.
    query = query.eq('asaas_checkout_id', payment.checkoutSession);
  } else if (payment.subscription) {
    query = query.eq('asaas_subscription_id', payment.subscription);
  } else {
    return response.status(204).end();
  }

  const { error } = await query;

  if (error) {
    console.error('Erro ao sincronizar assinatura Asaas:', error);
    return response.status(500).json({ message: 'Erro ao sincronizar assinatura.' });
  }
  return response.status(204).end();
}
