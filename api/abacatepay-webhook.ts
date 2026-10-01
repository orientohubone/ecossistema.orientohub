import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const eventStatus: Record<string, 'active' | 'cancelled'> = {
  'subscription.completed': 'active',
  'subscription.renewed': 'active',
  'subscription.cancelled': 'cancelled',
};

const firstString = (...values: unknown[]) => values.find((value): value is string => typeof value === 'string' && value.length > 0);

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
  const receivedSecret = Array.isArray(request.query.webhookSecret) ? request.query.webhookSecret[0] : request.query.webhookSecret;
  if (!expectedSecret || receivedSecret !== expectedSecret) return response.status(401).json({ message: 'Webhook não autorizado.' });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return response.status(500).json({ message: 'Configuração de cobrança incompleta.' });

  const payload = request.body ?? {};
  const status = eventStatus[payload.event];
  if (!status) return response.status(204).end();

  const data = payload.data ?? {};
  const subscription = data.subscription ?? data;
  const checkout = data.checkout ?? subscription.checkout ?? {};
  const externalReference = firstString(subscription.externalId, checkout.externalId, data.externalId);
  const checkoutId = firstString(checkout.id, data.checkoutId, subscription.checkoutId);
  const subscriptionId = firstString(subscription.id, data.subscriptionId);
  const customerId = firstString(subscription.customerId, checkout.customerId, data.customerId);
  const paymentId = firstString(data.payment?.id, data.transaction?.id, data.paymentId);

  if (!externalReference && !checkoutId && !subscriptionId) return response.status(204).end();

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  let query = admin.from('billing_subscriptions').update({
    status,
    provider_subscription_id: subscriptionId ?? null,
    provider_customer_id: customerId ?? null,
    provider_payment_id: paymentId ?? null,
  }).eq('provider', 'abacatepay');

  if (externalReference) query = query.eq('external_reference', externalReference);
  else if (checkoutId) query = query.eq('provider_checkout_id', checkoutId);
  else query = query.eq('provider_subscription_id', subscriptionId!);

  const { error } = await query;
  if (error) {
    console.error('Erro ao sincronizar assinatura AbacatePay:', error);
    return response.status(500).json({ message: 'Erro ao sincronizar assinatura.' });
  }

  return response.status(204).end();
}
