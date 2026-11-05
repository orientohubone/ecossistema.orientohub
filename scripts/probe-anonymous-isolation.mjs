// Read-only production checks. Never print tokens, row identifiers or response data.
import fs from 'node:fs';
const env = {};
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (match) env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
}
const base = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
if (!base || !key) throw new Error('Supabase configuration unavailable');
const headers = { apikey: key, Authorization: `Bearer ${key}` };
const checks = [];
for (const table of ['projects','solutions','hypotheses','experiments','interviews','ideas','idea_hypotheses','events','user_activity','contact_messages','newsletter_subscriptions','crm_clients','crm_contacts','crm_companies','crm_deals','crm_deal_contacts','crm_notes','crm_tasks','billing_subscriptions','community_post_bookmarks','user_resource_limits','founder_user_followups']) {
  const response = await fetch(`${base}/rest/v1/${table}?select=*&limit=1`, { headers, signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  checks.push({ table, status: response.status, anonymousRowVisible: Array.isArray(body) && body.length > 0, code: !Array.isArray(body) ? body?.code : undefined });
}
for (const rpc of ['get_founder_companies', 'get_founder_metrics', 'get_founder_user_tracking']) {
  const response = await fetch(`${base}/rest/v1/rpc/${rpc}`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  checks.push({ rpc, status: response.status, anonymousDataVisible: response.ok && body !== null && (!Array.isArray(body) || body.length > 0), code: body?.code });
}
const result = { checkedAt: new Date().toISOString(), credentialScope: 'anonymous', githubBrowserTokenConfigured: Boolean(env.VITE_GITHUB_TOKEN), checks };
fs.mkdirSync('scratch/tenant-audit', { recursive: true });
fs.writeFileSync('scratch/tenant-audit/anonymous-probe.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
