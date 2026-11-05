export type FollowupStatus = 'new' | 'contacted' | 'following' | 'resolved';
export interface TrackedUser {
  id: string; name: string; email: string | null; created_at: string; confirmed_at: string | null;
  last_sign_in_at: string | null; last_seen_at: string | null; last_screen: string | null;
  plan: string; billing_status: string; ideas: number | null; projects: number | null; solutions: number | null;
  followup_status: FollowupStatus; notes: string; follow_up_at: string | null;
}
export const followupLabels: Record<FollowupStatus, string> = { new: 'Novo cadastro', contacted: 'Contato realizado', following: 'Em acompanhamento', resolved: 'Concluído' };
export const normalizedSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const hasCreatedResource = (user: TrackedUser) => (user.ideas || 0) + (user.projects || 0) + (user.solutions || 0) > 0;
export const hasResourceData = (user: TrackedUser) => [user.ideas, user.projects, user.solutions].some(count => count !== null);
export const isRecentlyActive = (user: TrackedUser, days: number, now = Date.now()) => Boolean(user.last_seen_at && Date.parse(user.last_seen_at) >= now - days * 86400000);
export const trackingDate = (date: string | null) => date ? new Date(date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }) : 'Sem registro';
export function filterTrackedUsers(users: TrackedUser[], search: string, filter: string) {
  const query = normalizedSearch(search);
  return users.filter(user => normalizedSearch(`${user.name} ${user.email || ''}`).includes(query) && (
    filter === 'all' || (filter === 'unconfirmed' && !user.confirmed_at) || (filter === 'no_login' && !user.last_sign_in_at) ||
    (filter === 'not_started' && hasResourceData(user) && !hasCreatedResource(user)) || (filter === 'active' && isRecentlyActive(user, 7)) ||
    (filter === 'followup' && user.followup_status !== 'resolved' && Boolean(user.follow_up_at && user.follow_up_at <= new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })))
  ));
}

export function trackedUsersCsv(users: TrackedUser[]) {
  const cell = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return '\uFEFF' + [
    ['Nome', 'E-mail', 'Plano efetivo', 'Cobrança', 'Cadastro', 'E-mail confirmado', 'Último login', 'Última atividade', 'Ideias', 'Projetos', 'Soluções', 'Acompanhamento', 'Retorno'],
    ...users.map(user => [user.name, user.email, user.plan, user.billing_status, user.created_at, user.confirmed_at, user.last_sign_in_at, user.last_seen_at, user.ideas, user.projects, user.solutions, followupLabels[user.followup_status], user.follow_up_at]),
  ].map(row => row.map(cell).join(';')).join('\r\n');
}
