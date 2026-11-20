import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { privateHeaders, verifyUser } from '../server/dashboardAuth.js';

const uuidPattern = /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

async function admin(path: string, method = 'GET', body?: unknown, representation = false) {
  const base = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('Server configuration missing');
  const result = await fetch(`${base.replace(/\/$/, '')}/rest/v1/${path}`, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: representation ? 'return=representation' : (method === 'POST' && path.includes('?on_conflict=') ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal') },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store', signal: AbortSignal.timeout(8000),
  });
  if (!result.ok) throw new Error('Database request failed');
  return result.status === 204 ? null : result.json();
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  for (const [name, value] of Object.entries(privateHeaders)) response.setHeader(name, value);
  if (request.method !== 'POST' && request.method !== 'GET') return response.status(405).json({ message: 'Método não permitido.' });

  // Webhook delivery from a solution app.
  if (request.method === 'POST' && typeof request.headers['x-solution-webhook-token'] === 'string') {
    const token = request.headers['x-solution-webhook-token'] as string;
    if (!/^\w{40,100}$/.test(token)) return response.status(401).json({ message: 'Webhook não autorizado.' });
    const solutionId = request.body?.solution_id;
    if (typeof solutionId !== 'string' || !uuidPattern.test(solutionId)) return response.status(400).json({ message: 'solution_id inválido.' });
    try {
      const keys = await admin(`solution_market_growth_webhook_keys?solution_id=eq.${solutionId}&select=token_hash&limit=1`);
      const expected = keys?.[0]?.token_hash;
      const actualHash = hashToken(token);
      if (typeof expected !== 'string' || !timingSafeEqual(Buffer.from(actualHash), Buffer.from(expected))) return response.status(401).json({ message: 'Webhook não autorizado.' });
      const { active_audience, mrr, valuation, currency = 'BRL', source = null } = request.body;
      if (!Number.isSafeInteger(active_audience) || active_audience < 0 || typeof mrr !== 'number' || !Number.isFinite(mrr) || mrr < 0 || (valuation !== null && valuation !== undefined && (typeof valuation !== 'number' || !Number.isFinite(valuation) || valuation < 0)) || !['BRL', 'USD', 'EUR'].includes(currency) || (source !== null && (typeof source !== 'string' || source.length > 100))) {
        return response.status(400).json({ message: 'Payload inválido. Informe active_audience, mrr, valuation, currency e source válidos.' });
      }
      const row = { solution_id: solutionId, active_audience, mrr, valuation: valuation ?? null, currency, source, received_at: new Date().toISOString() };
      await admin('solution_market_growth?on_conflict=solution_id', 'POST', row);
      return response.status(200).json({ received: true, received_at: row.received_at });
    } catch {
      return response.status(503).json({ message: 'Não foi possível registrar os indicadores.' });
    }
  }

  const authToken = request.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!authToken) return response.status(401).json({ message: 'Autenticação necessária.' });
  try {
    const user = await verifyUser(authToken);
    if (!user) return response.status(401).json({ message: 'Sessão inválida ou expirada.' });
    const solutionId = typeof request.query.solutionId === 'string' ? request.query.solutionId : request.body?.solution_id;
    if (typeof solutionId !== 'string' || !uuidPattern.test(solutionId)) return response.status(400).json({ message: 'Identificador de solução inválido.' });
    const owned = await admin(`solutions?id=eq.${solutionId}&user_id=eq.${user.id}&select=id&limit=1`);
    if (!owned?.length) return response.status(404).json({ message: 'Solução não encontrada.' });

    if (request.method === 'GET') {
      const rows = await admin(`solution_market_growth?solution_id=eq.${solutionId}&select=solution_id,active_audience,mrr,valuation,currency,source,received_at&limit=1`);
      return response.status(200).json(rows?.[0] ?? null);
    }

    const token = randomBytes(32).toString('hex');
    await admin('solution_market_growth_webhook_keys?on_conflict=solution_id', 'POST', { solution_id: solutionId, token_hash: hashToken(token), created_at: new Date().toISOString() });
    const origin = process.env.APP_URL || `https://${request.headers.host}`;
    return response.status(200).json({ token, webhook_url: `${origin.replace(/\/$/, '')}/api/solution-market-growth`, solution_id: solutionId });
  } catch {
    return response.status(503).json({ message: 'Integração de indicadores temporariamente indisponível.' });
  }
}
