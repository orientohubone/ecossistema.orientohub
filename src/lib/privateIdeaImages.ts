export function privateIdeaImagePath(value: string, ownerId: string, supabaseUrl: string) {
  let path = value;
  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.origin !== new URL(supabaseUrl).origin) return null;
      const match = url.pathname.match(/^\/storage\/v1\/(?:object|render\/image)\/(?:public|sign|authenticated)\/idea-images\/(.+)$/);
      if (!match) return null;
      path = decodeURIComponent(match[1]);
    }
    if (!path.startsWith(`${ownerId}/`) || path.split('/').some(segment => segment === '..' || segment === '.')) return null;
    return path;
  } catch { return null; }
}
