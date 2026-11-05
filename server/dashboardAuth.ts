// HTTP cookies are allowed only in the explicitly local development server.
export const localDevelopment = process.env.ORIENTOHUB_LOCAL_DEV === '1' && process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):5173$/.test(process.env.APP_URL || '');
export const cookieAttributes = `Path=/; HttpOnly; ${localDevelopment ? '' : 'Secure; '}SameSite=Lax`;
export const SESSION_COOKIE = localDevelopment ? 'orientohub-local-session' : '__Host-orientohub-session';
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' };

// Validate with the auth server, never trust decoded JWT claims or browser metadata.
export async function verifyUser(token: string) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Authentication unavailable');
  const result = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  if (result.status === 401 || result.status === 403) return null;
  if (!result.ok) throw new Error('Authentication unavailable');
  const user = await result.json();
  return typeof user.id === 'string' && user.role === 'authenticated' ? user : null;
}

export async function verifyFounder(token: string) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const result = await fetch(`${url}/rest/v1/rpc/is_orientohub_founder`, {
    method: 'POST', headers: { apikey: key!, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: '{}', cache: 'no-store',
  });
  if (!result.ok) throw new Error('Authorization unavailable');
  return (await result.json()) === true;
}
