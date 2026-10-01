import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

type BillingCycle = 'monthly' | 'annual';

const PRODUCTS: Record<BillingCycle, { externalId: string; name: string; description: string; price: number; cycle: 'MONTHLY' | 'ANNUALLY' }> = {
  monthly: {
    externalId: 'orientohub-pro-monthly-v1',
    name: 'OrientoHub Pro Mensal',
    description: 'Assinatura mensal do plano OrientoHub Pro',
    price: 9700,
    cycle: 'MONTHLY',
  },
  annual: {
    externalId: 'orientohub-pro-annual-v1',
    name: 'OrientoHub Pro Anual',
    description: 'Assinatura anual do plano OrientoHub Pro',
    price: 97000,
    cycle: 'ANNUALLY',
  },
};

const getOrigin = (request: VercelRequest) => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const protocol = request.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${request.headers.host}`;
};

const parseResponse = async (response: Response) => {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    return { error: body };
  }
};

const findProduct = async (apiKey: string, externalId: string) => {
  const response = await fetch(`https://api.abacatepay.com/v2/products/list?externalId=${encodeURIComponent(externalId)}&status=ACTIVE`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const result = await parseResponse(response);
  if (!response.ok || !result.success) throw new Error(result.error || 'Não foi possível consultar os produtos na AbacatePay.');
  return result.data?.find((product: { externalId?: string }) => product.externalId === externalId) ?? null;
};

const getOrCreateProduct = async (apiKey: string, billing: BillingCycle) => {
  const definition = PRODUCTS[billing];
  const existing = await findProduct(apiKey, definition.externalId);
  if (existing?.id) return existing.id as string;

  const response = await fetch('https://api.abacatepay.com/v2/products/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...definition, currency: 'BRL' }),
  });
  const result = await parseResponse(response);
  if (response.ok && result.success && result.data?.id) return result.data.id as string;

  // Outra requisição pode ter criado o mesmo produto entre a consulta e o POST.
  const concurrentProduct = await findProduct(apiKey, definition.externalId);
  if (concurrentProduct?.id) return concurrentProduct.id as string;
  throw new Error(result.error || 'Não foi possível criar o produto na AbacatePay.');
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  const apiKey = process.env.ABACATEPAY_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { plan, billing } = request.body ?? {};
  if (plan !== 'pro' || !['monthly', 'annual'].includes(billing)) {
    return response.status(400).json({ message: 'Plano ou ciclo de cobrança inválido.' });
  }

  const missing = [
    !apiKey && 'ABACATEPAY_API_KEY',
    !supabaseUrl && 'SUPABASE_URL',
    !supabaseAnonKey && 'SUPABASE_ANON_KEY',
    !serviceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean);
  if (missing.length) return response.status(500).json({ message: `Configuração de cobrança incompleta: ${missing.join(', ')}.` });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  let userId: string | null = null;
  if (token) {
    const authClient = createClient(supabaseUrl!, supabaseAnonKey!, { auth: { persistSession: false } });
    const { data: authData } = await authClient.auth.getUser(token);
    userId = authData.user?.id ?? null;
  }

  const externalReference = `orientohub:${userId || 'guest'}:${plan}:${Date.now()}`;
  const origin = getOrigin(request);

  try {
    const productId = await getOrCreateProduct(apiKey!, billing as BillingCycle);
    const checkoutResponse = await fetch('https://api.abacatepay.com/v2/subscriptions/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: productId, quantity: 1 }],
        methods: ['CARD'],
        externalId: externalReference,
        returnUrl: `${origin}/checkout?plan=pro&billing=${billing}&cancelled=1`,
        completionUrl: `${origin}/checkout/success?plan=pro&billing=${billing}`,
        metadata: { ...(userId ? { userId } : {}), plan, billing, source: 'pricing-page' },
      }),
    });
    const checkout = await parseResponse(checkoutResponse);
    if (!checkoutResponse.ok || !checkout.success || !checkout.data?.url || !checkout.data?.id) {
      console.error('Erro da AbacatePay:', checkout);
      return response.status(checkoutResponse.status >= 400 && checkoutResponse.status < 500 ? checkoutResponse.status : 502).json({
        message: checkout.error || 'A AbacatePay não retornou um checkout válido.',
      });
    }

    const admin = createClient(supabaseUrl!, serviceRoleKey!, { auth: { persistSession: false } });
    const { error: databaseError } = await admin.from('billing_subscriptions').insert({
      user_id: userId,
      plan,
      status: 'pending',
      billing_cycle: billing,
      provider: 'abacatepay',
      provider_checkout_id: checkout.data.id,
      external_reference: externalReference,
    });
    if (databaseError) throw databaseError;

    return response.status(200).json({ checkoutUrl: checkout.data.url });
  } catch (error) {
    console.error('Erro ao criar checkout AbacatePay:', error);
    return response.status(500).json({ message: error instanceof Error ? error.message : 'Erro inesperado ao iniciar o pagamento.' });
  }
}
