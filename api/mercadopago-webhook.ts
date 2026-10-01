import { createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const mapStatus = (status: string) => {
  if (status === 'authorized') return 'active';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'paused') return 'past_due';
  return 'pending';
};

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

const validSignature = (request: VercelRequest, dataId: string) => {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return false;
  const signature = first(request.headers['x-signature']);
  const requestId = first(request.headers['x-request-id']);
  if (!signature || !requestId) return false;
  const parts = Object.fromEntries(signature.split(',').map((part) => part.trim().split('=')));
  if (!parts.ts || !parts.v1) return false;
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');
  const receivedBuffer = Buffer.from(parts.v1);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  const dataId = String(first(request.query['data.id']) || request.body?.data?.id || '');
  if (!dataId || !validSignature(request, dataId)) return response.status(401).json({ message: 'Assinatura inválida.' });

  const topic = String(first(request.query.type) || request.body?.type || '');
  if (!['subscription_preapproval', 'preapproval'].includes(topic)) return response.status(204).end();

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!accessToken || !supabaseUrl || !serviceRoleKey) return response.status(500).json({ message: 'Configuração incompleta.' });

  const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(dataId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!mpResponse.ok) return response.status(502).json({ message: 'Não foi possível consultar a assinatura.' });
  const subscription = await mpResponse.json();
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { error } = await admin.from('billing_subscriptions').update({
    status: mapStatus(subscription.status),
    provider_subscription_id: subscription.id,
  }).eq('provider', 'mercadopago').eq('external_reference', subscription.external_reference);

  if (error) {
    console.error('Erro ao sincronizar assinatura Mercado Pago:', error);
    return response.status(500).json({ message: 'Erro ao sincronizar assinatura.' });
  }
  return response.status(204).end();
}
