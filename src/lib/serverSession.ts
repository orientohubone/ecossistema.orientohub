// Local Vite has no server functions. Production must establish the HttpOnly cookie
// before navigating to server-protected pages.
export async function syncServerSession(accessToken?: string) {
  if (import.meta.env.DEV) return;
  const result = await fetch('/api/session', {
    method: accessToken ? 'POST' : 'DELETE', credentials: 'same-origin',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!result.ok) {
    // Do not interpret a server outage as invalid Supabase credentials.
    if (result.status >= 500) throw new Error('O serviço de sessão está temporariamente indisponível. Tente novamente em instantes.');
    throw new Error('Não foi possível validar a sessão no servidor. Faça login novamente.');
  }
}
