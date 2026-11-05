// Local Vite has no server functions. Production must establish the HttpOnly cookie
// before navigating to server-protected pages.
export async function syncServerSession(accessToken?: string) {
  if (import.meta.env.DEV) return;
  const result = await fetch('/api/session', {
    method: accessToken ? 'POST' : 'DELETE', credentials: 'same-origin',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!result.ok) throw new Error('Não foi possível validar a sessão no servidor.');
}
