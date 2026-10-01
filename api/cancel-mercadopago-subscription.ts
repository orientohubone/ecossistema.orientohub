import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!accessToken || !supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return response.status(500).json({ message: 'Configuração de cobrança incompleta.' });
  }
  if (!token) return response.status(401).json({ message: 'Faça login para cancelar sua assinatura.' });

  const auth = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: authData } = await auth.auth.getUser(token);
  if (!authData.user) return response.status(401).json({ message: 'Sessão inválida ou expirada.' });

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: subscription, error: lookupError } = await admin
    .from('billing_subscriptions')
    .select('id, provider_subscription_id')
    .eq('user_id', authData.user.id)
    .eq('provider', 'mercadopago')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupError) return response.status(500).json({ message: 'Não foi possível consultar sua assinatura.' });
  if (!subscription?.provider_subscription_id) return response.status(404).json({ message: 'Assinatura ativa não encontrada.' });

  const mercadoPagoResponse = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(subscription.provider_subscription_id)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled' }),
  });
  const mercadoPagoBody = await mercadoPagoResponse.json().catch(() => ({}));
  if (!mercadoPagoResponse.ok || mercadoPagoBody.status !== 'cancelled') {
    console.error('Erro ao cancelar assinatura Mercado Pago:', mercadoPagoBody);
    return response.status(502).json({ message: mercadoPagoBody.message || 'O Mercado Pago não confirmou o cancelamento.' });
  }

  const { error: updateError } = await admin.from('billing_subscriptions').update({ status: 'cancelled' }).eq('id', subscription.id);
  if (updateError) return response.status(500).json({ message: 'A assinatura foi cancelada, mas o cadastro local ainda não foi atualizado.' });

  return response.status(200).json({ success: true, message: 'Assinatura cancelada. Não haverá novas cobranças.' });
}
