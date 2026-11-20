import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'node:crypto';
import { privateHeaders } from '../server/dashboardAuth.js';

type UserRecord = {
  id?: unknown;
  email?: unknown;
  created_at?: unknown;
  email_confirmed_at?: unknown;
  raw_user_meta_data?: { name?: unknown; full_name?: unknown } | null;
};

function sameSecret(actual: unknown, expected: string | undefined) {
  if (!expected || typeof actual !== 'string') return false;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]!);
}

function getRecord(body: any): UserRecord | null {
  // Supabase Database Webhooks send { type, table, schema, record, old_record }.
  const record = body?.record ?? body?.new;
  if (!record || typeof record.id !== 'string' || typeof record.created_at !== 'string') return null;
  return record as UserRecord;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  for (const [name, value] of Object.entries(privateHeaders)) response.setHeader(name, value);
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  if (!sameSecret(request.headers['x-orientohub-webhook-secret'], process.env.SUPABASE_AUTH_USER_WEBHOOK_SECRET)) {
    return response.status(401).json({ message: 'Webhook não autorizado.' });
  }

  const record = getRecord(request.body);
  if (!record) return response.status(400).json({ message: 'Evento de criação de usuário inválido.' });
  if (request.body?.type && request.body.type !== 'INSERT') return response.status(200).json({ ignored: true });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return response.status(503).json({ message: 'Telegram não configurado.' });

  const metadata = record.raw_user_meta_data ?? {};
  const name = [metadata.full_name, metadata.name].find((value) => typeof value === 'string' && value.trim()) as string | undefined;
  const email = typeof record.email === 'string' ? record.email : 'Não informado';
  const id = typeof record.id === 'string' ? record.id : 'Não informado';
  const createdAt = new Date(record.created_at as string);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? String(record.created_at)
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(createdAt);
  const lines = [
    '🆕 <b>Novo usuário no OrientoHub</b>',
    name ? `👤 <b>Nome:</b> ${escapeHtml(name)}` : null,
    `✉️ <b>E-mail:</b> ${escapeHtml(email)}`,
    `📅 <b>Cadastro:</b> ${escapeHtml(formattedDate)} (horário de Brasília)`,
    `🔐 <b>E-mail confirmado:</b> ${record.email_confirmed_at ? 'Sim' : 'Pendente'}`,
    `🆔 <b>ID:</b> <code>${escapeHtml(id)}</code>`,
  ].filter(Boolean);

  try {
    const result = await fetch(`https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) return response.status(502).json({ message: 'Telegram não aceitou a notificação.' });
    return response.status(200).json({ sent: true });
  } catch {
    return response.status(502).json({ message: 'Não foi possível enviar a notificação ao Telegram.' });
  }
}
