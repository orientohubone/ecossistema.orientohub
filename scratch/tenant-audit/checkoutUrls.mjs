// Provider callbacks need a public HTTPS origin, independently of local OAuth.
export function checkoutPublicOrigin() {
    let value = (process.env.CHECKOUT_PUBLIC_URL || process.env.APP_URL || '').trim();
    const local = process.env.ORIENTOHUB_LOCAL_DEV === '1' && process.env.NODE_ENV !== 'production';
    if (local && !process.env.CHECKOUT_PUBLIC_URL && (!value || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(value)))
        value = 'https://orientohub.com.br';
    let url;
    try {
        url = new URL(value);
    }
    catch {
        throw new Error('Configure CHECKOUT_PUBLIC_URL com a URL pública HTTPS da plataforma.');
    }
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || !url.hostname.includes('.') || /^(localhost|127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(url.hostname) || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.local'))
        throw new Error('CHECKOUT_PUBLIC_URL deve ser uma origem pública HTTPS, sem localhost, caminho ou parâmetros.');
    return url.origin;
}
