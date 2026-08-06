import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const PLANS = {
  pro: { value: 97, name: 'OrientoHub Pro' },
} as const;

const getOrigin = (request: VercelRequest) => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const protocol = request.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${request.headers.host}`;
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  const asaasApiKey = process.env.ASAAS_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missingConfiguration = [
    !asaasApiKey && 'ASAAS_API_KEY',
    !supabaseUrl && 'SUPABASE_URL',
    !supabaseAnonKey && 'SUPABASE_ANON_KEY',
    !supabaseServiceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean);
  if (missingConfiguration.length) {
    return response.status(500).json({ message: `Configuração de cobrança incompleta: ${missingConfiguration.join(', ')}.` });
  }

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ message: 'Faça login para continuar.' });

  const authClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) return response.status(401).json({ message: 'Sessão inválida.' });

  const { plan, billing } = request.body ?? {};
  const product = PLANS[plan as keyof typeof PLANS];
  if (!product || !['monthly', 'annual'].includes(billing)) {
    return response.status(400).json({ message: 'Plano ou ciclo de cobrança inválido.' });
  }

  const origin = getOrigin(request);
  const externalReference = `orientohub:${authData.user.id}:${plan}:${Date.now()}`;
  const asaasBaseUrl = process.env.ASAAS_API_URL || 'https://api-sandbox.asaas.com/v3';
  const today = new Date().toISOString().slice(0, 10);
  const cycle = billing === 'annual' ? 'YEARLY' : 'MONTHLY';
  const amount = billing === 'annual' ? 970 : product.value;

  try {
    const asaasResponse = await fetch(`${asaasBaseUrl.replace(/\/$/, '')}/checkouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: asaasApiKey },
      body: JSON.stringify({
        billingTypes: ['CREDIT_CARD'],
        chargeTypes: ['RECURRENT'],
        minutesToExpire: 60,
        externalReference,
        callback: {
          successUrl: `${origin}/checkout/success?plan=${plan}&billing=${billing}`,
          cancelUrl: `${origin}/checkout?plan=${plan}&billing=${billing}&cancelled=1`,
          expiredUrl: `${origin}/checkout?plan=${plan}&billing=${billing}&expired=1`,
        },
        items: [{ name: product.name, description: `Assinatura ${billing === 'annual' ? 'anual' : 'mensal'} do ${product.name}`, quantity: 1, value: amount }],
        subscription: { cycle, nextDueDate: today },
      }),
    });
    const asaasData = await asaasResponse.json();
    if (!asaasResponse.ok || !asaasData.url) {
      return response.status(asaasResponse.status || 502).json({ message: asaasData.errors?.[0]?.description || asaasData.message || 'Não foi possível criar o checkout.' });
    }

    const admin = createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } });
    const { error: databaseError } = await admin.from('billing_subscriptions').insert({
      user_id: authData.user.id,
      plan,
      status: 'pending',
      billing_cycle: billing,
      asaas_checkout_id: asaasData.id,
      external_reference: externalReference,
    });
    if (databaseError) throw databaseError;

    return response.status(200).json({ checkoutUrl: asaasData.url });
  } catch (error) {
    console.error('Erro ao criar checkout Asaas:', error);
    return response.status(500).json({ message: 'Não foi possível iniciar o checkout. Tente novamente.' });
  }
}
