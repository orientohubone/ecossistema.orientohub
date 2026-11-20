import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'node:crypto';
import { privateHeaders } from '../server/dashboardAuth.js';

function sameSecret(actual: unknown, expected: string | undefined) {
  if (!expected || typeof actual !== 'string') return false;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]!);
}

function display(value: unknown, fallback = 'Não informado') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  for (const [name, value] of Object.entries(privateHeaders)) response.setHeader(name, value);
  if (request.method !== 'POST') return response.status(405).json({ message: 'Método não permitido.' });

  if (!sameSecret(request.headers['x-orientohub-lead-webhook-secret'], process.env.SUPABASE_CONTACT_WEBHOOK_SECRET)) {
    return response.status(401).json({ message: 'Webhook não autorizado.' });
  }

  if (request.body?.type && request.body.type !== 'INSERT') return response.status(200).json({ ignored: true });
  const record = request.body?.record ?? request.body?.new;
  if (!record || typeof record.id !== 'string' || typeof record.name !== 'string' || typeof record.message !== 'string') {
    return response.status(400).json({ message: 'Evento de contato inválido.' });
  }

  const botToken = process.env.TELEGRAM_LEADS_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEADS_CHAT_ID;
  if (!botToken || !chatId) return response.status(503).json({ message: 'Bot de leads não configurado.' });

  const source = record.source === 'chat_site' ? 'Chat guiado do site' : 'Formulário do site';
  const createdAt = typeof record.created_at === 'string' ? new Date(record.created_at) : null;
  const formattedDate = createdAt && !Number.isNaN(createdAt.getTime())
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(createdAt)
    : 'Não informado';
  const lines = [
    '📩 <b>Nova oportunidade no CRM OrientoHub</b>',
    `📍 <b>Origem:</b> ${source}`,
    `👤 <b>Nome:</b> ${escapeHtml(display(record.name))}`,
    `✉️ <b>E-mail:</b> ${escapeHtml(display(record.email))}`,
    `📞 <b>Telefone:</b> ${escapeHtml(display(record.phone))}`,
    `🏢 <b>Empresa:</b> ${escapeHtml(display(record.company))}`,
    `🧭 <b>Assunto:</b> ${escapeHtml(display(record.subject))}`,
    `📝 <b>Mensagem:</b> ${escapeHtml(display(record.message))}`,
    `📅 <b>Recebido:</b> ${escapeHtml(formattedDate)} (horário de Brasília)`,
  ];

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
