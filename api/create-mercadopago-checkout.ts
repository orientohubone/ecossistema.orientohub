import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

type BillingCycle = 'monthly' | 'annual';

const OFFERS: Record<BillingCycle, { reason: string; amount: number; frequency: number }> = {
  monthly: { reason: 'OrientoHub Pro Mensal', amount: 97, frequency: 1 },
  annual: { reason: 'OrientoHub Pro Anual', amount: 970, frequency: 12 },
};

const getOrigin = (request: VercelRequest) => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const protocol = request.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${request.headers.host}`;
};

const parseResponse = async (response: Response) => {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { message: text }; }
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { plan, billing, email, newUserId } = request.body ?? {};

  if (plan !== 'pro' || !['monthly', 'annual'].includes(billing)) {
    return response.status(400).json({ message: 'Plano ou ciclo de cobrança inválido.' });
  }
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return response.status(400).json({ message: 'Informe um e-mail válido para continuar.' });
  }

  const missing = [
    !accessToken && 'MERCADOPAGO_ACCESS_TOKEN',
    !supabaseUrl && 'SUPABASE_URL',
    !supabaseAnonKey && 'SUPABASE_ANON_KEY',
    !serviceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean);
  if (missing.length) return response.status(500).json({ message: `Configuração de cobrança incompleta: ${missing.join(', ')}.` });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  let userId: string | null = null;
  if (token) {
    const auth = createClient(supabaseUrl!, supabaseAnonKey!, { auth: { persistSession: false } });
    const { data } = await auth.auth.getUser(token);
    userId = data.user?.id ?? null;
  }
  if (!userId && typeof newUserId === 'string') {
    const admin = createClient(supabaseUrl!, serviceRoleKey!, { auth: { persistSession: false } });
    const { data, error } = await admin.auth.admin.getUserById(newUserId);
    if (error || data.user?.email?.toLowerCase() !== email.trim().toLowerCase()) {
      return response.status(401).json({ message: 'Não foi possível validar a conta criada.' });
    }
    userId = data.user.id;
  }
  if (!userId) return response.status(401).json({ message: 'Crie sua conta ou faça login antes de continuar.' });

  const cycle = billing as BillingCycle;
  const offer = OFFERS[cycle];
  const externalReference = `orientohub:${userId}:pro:${cycle}:${Date.now()}`;
  const origin = getOrigin(request);

  try {
    const mercadoPagoResponse = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': randomUUID(),
      },
      body: JSON.stringify({
        reason: offer.reason,
        external_reference: externalReference,
        payer_email: email.trim().toLowerCase(),
        status: 'pending',
        back_url: `${origin}/checkout/success?plan=pro&billing=${cycle}`,
        notification_url: `${origin}/api/mercadopago-webhook`,
        auto_recurring: {
          frequency: offer.frequency,
          frequency_type: 'months',
          transaction_amount: offer.amount,
          currency_id: 'BRL',
        },
      }),
    });
    const checkout = await parseResponse(mercadoPagoResponse);
    if (!mercadoPagoResponse.ok || !checkout.id || !checkout.init_point) {
      console.error('Erro do Mercado Pago:', checkout);
      const detail = checkout.message || checkout.cause?.[0]?.description;
      return response.status(502).json({ message: detail || 'O Mercado Pago não retornou um checkout válido.' });
    }

    const admin = createClient(supabaseUrl!, serviceRoleKey!, { auth: { persistSession: false } });
    const { error } = await admin.from('billing_subscriptions').insert({
      user_id: userId,
      plan: 'pro',
      status: 'pending',
      billing_cycle: cycle,
      provider: 'mercadopago',
      provider_checkout_id: checkout.id,
      provider_subscription_id: checkout.id,
      external_reference: externalReference,
    });
    if (error) throw error;

    return response.status(200).json({ checkoutUrl: checkout.init_point });
  } catch (error) {
    console.error('Erro ao criar checkout Mercado Pago:', error);
    return response.status(500).json({ message: error instanceof Error ? error.message : 'Erro inesperado ao iniciar o pagamento.' });
  }
}
