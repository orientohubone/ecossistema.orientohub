import { SESSION_COOKIE, privateHeaders, verifyFounder, verifyUser } from './server/dashboardAuth';

export const config = { matcher: ['/dashboard/:path*', '/api/dashboard/:path*'] };

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const api = /^\/api\/dashboard(?:\/|$)/.test(url.pathname);
  if (!api && !/^\/dashboard(?:\/|$)/.test(url.pathname)) return new Response(null, { headers: { 'x-middleware-next': '1' } });
  const bearer = request.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1];
  const cookie = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  const token = bearer || cookie;
  const deny = () => api
    ? Response.json({ message: 'Autenticação necessária.' }, { status: 401, headers: privateHeaders })
    : new Response(null, { status: 302, headers: { ...privateHeaders, Location: '/entrar' } });
  if (!token) return deny();
  try {
    if (!await verifyUser(token)) return deny();
    if (/^\/(?:api\/)?dashboard\/(?:founder|pedagogico)(?:\/|$)/.test(url.pathname) && !await verifyFounder(token)) {
      return new Response('Acesso negado.', { status: 403, headers: privateHeaders });
    }
    return new Response(null, { headers: { ...privateHeaders, 'x-middleware-next': '1' } });
  } catch {
    return new Response('Autenticação temporariamente indisponível.', { status: 503, headers: privateHeaders });
  }
}
