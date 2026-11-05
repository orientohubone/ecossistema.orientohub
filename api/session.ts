import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SESSION_COOKIE, cookieAttributes, privateHeaders, verifyUser } from '../server/dashboardAuth.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  for (const [key, value] of Object.entries(privateHeaders)) response.setHeader(key, value);
  if (!['POST', 'DELETE'].includes(request.method || '')) return response.status(405).end();
  // Cookie changes are same-origin only. Protected data APIs continue to use bearer JWTs + RLS.
  const origin = request.headers.origin;
  if (!origin || ![process.env.APP_URL?.replace(/\/$/, ''), `https://${request.headers.host}`].includes(origin)) {
    return response.status(403).json({ message: 'Origem não permitida.' });
  }
  const cookie = `${SESSION_COOKIE}=; ${cookieAttributes}; Max-Age=0`;
  if (request.method === 'DELETE') {
    response.setHeader('Set-Cookie', cookie);
    return response.status(204).end();
  }
  const token = request.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return response.status(401).json({ message: 'Autenticação necessária.' });
  try {
    if (!await verifyUser(token)) {
      response.setHeader('Set-Cookie', cookie);
      return response.status(401).json({ message: 'Sessão inválida.' });
    }
    response.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; ${cookieAttributes}; Max-Age=3600`);
    return response.status(204).end();
  } catch {
    return response.status(503).json({ message: 'Autenticação temporariamente indisponível.' });
  }
}
