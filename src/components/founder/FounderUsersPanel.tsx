import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { RefreshCw, Search, Users, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { filterTrackedUsers, followupLabels, hasCreatedResource, hasResourceData, isRecentlyActive, trackedUsersCsv, trackingDate, type FollowupStatus, type TrackedUser } from '../../lib/founderTracking';

type Event = { id: string; action: string; target: string; created_at: string };
const fieldClass = 'w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm text-white outline-none focus:border-primary-400';
const loadError = (failure: unknown) => ['PGRST202', '42P01'].includes((failure as { code?: string })?.code || '')
  ? 'Aplique a migração 20261105000002_founder_user_tracking.sql para habilitar o acompanhamento de usuários.'
  : 'Não foi possível atualizar o acompanhamento. Os dados anteriores foram mantidos.';

export function FounderUsersPanel({ refreshKey = 0 }: { refreshKey?: number }) {
  const [users, setUsers] = useState<TrackedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<TrackedUser | null>(null);
  const loadingRef = useRef(false);
  const load = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true; setLoading(true); setError('');
    try {
      const result = await supabase.rpc('get_founder_user_tracking');
      if (result.error) throw result.error;
      if (!result.data || !Array.isArray(result.data.users)) throw new Error('Invalid tracking response');
      setUsers(result.data.users); setUpdatedAt(result.data.generated_at);
    } catch (failure) { setError(loadError(failure)); }
    finally { loadingRef.current = false; setLoading(false); }
  }, []);
  useEffect(() => {
    void load();
    const refresh = () => { if (document.visibilityState === 'visible') void load(); };
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [load, refreshKey]);
  const filtered = filterTrackedUsers(users, search, filter);
  const pages = Math.max(1, Math.ceil(filtered.length / 20));
  const currentPage = Math.min(page, pages - 1);
  const exportUsers = () => {
    const url = URL.createObjectURL(new Blob([trackedUsersCsv(filtered)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'acompanhamento-usuarios.csv'; link.click(); URL.revokeObjectURL(url);
  };
  const summary = [
    ['Cadastros totais', users.length], ['E-mail pendente', users.filter(user => !user.confirmed_at).length],
    ['Sem primeiro login', users.filter(user => !user.last_sign_in_at).length],
    ['Criaram conteúdo', users.filter(hasCreatedResource).length], ['Ativos nos últimos 7 dias', users.filter(user => isRecentlyActive(user, 7)).length],
  ];
  return <section className="space-y-5" aria-labelledby="founder-users-title">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary-300">Cadastro → ativação → acompanhamento</p><h3 id="founder-users-title" className="mt-2 text-xl font-bold text-white">Usuários da plataforma</h3><p className="mt-2 text-sm text-[#9ba9bc]">Todos os cadastros, inclusive gratuitos e sem confirmação de e-mail.</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#34455a] px-4 py-2.5 text-sm text-white disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Atualizar usuários</button></header>
    {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{summary.map(([label, value]) => <div key={label} className="rounded-xl border border-[#273548] bg-[#101722] p-4"><p className="text-xs text-[#9ba9bc]">{label}</p><p className="mt-2 text-2xl font-bold text-white">{updatedAt ? value : '—'}</p></div>)}</div>
    <div className="flex justify-end"><button type="button" onClick={exportUsers} disabled={!updatedAt || !filtered.length} className="text-xs font-semibold text-primary-300 disabled:opacity-40">Exportar usuários do filtro (CSV)</button></div>
    <div className="rounded-2xl border border-[#273548] bg-[#101722] p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Buscar usuário por nome ou e-mail</span><Search className="absolute left-3 top-3 h-4 w-4 text-[#9ba9bc]" /><input type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} placeholder="Buscar por nome ou e-mail…" className={`${fieldClass} pl-10`} /></label><select aria-label="Filtrar acompanhamento" value={filter} onChange={event => { setFilter(event.target.value); setPage(0); }} className={`${fieldClass} sm:max-w-xs`}><option value="all">Todos os cadastros</option><option value="unconfirmed">E-mail não confirmado</option><option value="no_login">Ainda não fizeram login</option><option value="not_started">Ainda não criaram conteúdo</option><option value="active">Ativos nos últimos 7 dias</option><option value="followup">Retorno marcado para hoje ou atrasado</option></select></div>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[960px] text-left text-sm"><thead><tr className="border-b border-[#34455a] text-xs text-[#9ba9bc]">{['Usuário / cadastro', 'Plano / cobrança', 'Ativação', 'Ideias / projetos / soluções', 'Última atividade', 'Acompanhamento'].map(label => <th key={label} className="px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{filtered.slice(currentPage * 20, currentPage * 20 + 20).map(user => <tr key={user.id} className="border-b border-[#273548] align-top"><td className="px-3 py-4"><button type="button" onClick={() => setSelected(user)} className="font-bold text-primary-300 hover:underline">{user.name}</button><p className="mt-1 text-xs text-[#c2cedd]">{user.email || 'Sem e-mail'}</p><p className="mt-1 text-xs text-[#9ba9bc]">{trackingDate(user.created_at)}</p></td><td className="px-3 py-4"><p className="font-semibold uppercase text-white">{user.plan}</p><p className="mt-1 text-xs text-[#9ba9bc]">{user.billing_status === 'none' ? 'Sem assinatura' : user.billing_status}</p></td><td className="px-3 py-4 text-xs text-[#c2cedd]"><p>{user.confirmed_at ? 'E-mail confirmado' : 'Aguardando confirmação'}</p><p className="mt-1">{user.last_sign_in_at ? 'Login realizado' : 'Sem primeiro login'}</p><p className="mt-1">{hasCreatedResource(user) ? 'Já criou conteúdo' : hasResourceData(user) ? 'Sem criação registrada' : 'Uso indisponível'}</p></td><td className="px-3 py-4 text-white">{user.ideas ?? '—'} / {user.projects ?? '—'} / {user.solutions ?? '—'}</td><td className="px-3 py-4 text-xs text-[#c2cedd]"><p>{trackingDate(user.last_seen_at)}</p><p className="mt-1 text-[#9ba9bc]">{user.last_screen || 'Navegação ainda não registrada'}</p></td><td className="px-3 py-4"><button type="button" onClick={() => setSelected(user)} className="text-left text-xs font-semibold text-primary-300">{followupLabels[user.followup_status]}</button>{user.follow_up_at && <p className="mt-1 text-xs text-[#9ba9bc]">Retorno: {user.follow_up_at.split('-').reverse().join('/')}</p>}</td></tr>)}</tbody></table></div>
      {!filtered.length && <div className="py-10 text-center text-sm text-[#9ba9bc]"><Users className="mx-auto mb-3 h-6 w-6" />{loading ? 'Carregando cadastros…' : error ? 'A listagem está indisponível até a configuração ser corrigida.' : users.length ? 'Nenhum usuário encontrado. Revise a busca e o filtro.' : 'Nenhum cadastro encontrado no projeto Supabase conectado.'}</div>}
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9ba9bc]"><span>{filtered.length} de {users.length} usuários · Atualizado: {trackingDate(updatedAt)}</span><div className="flex items-center gap-3"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} className="disabled:opacity-30">Anterior</button><span>{currentPage + 1} / {pages}</span><button disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)} className="disabled:opacity-30">Próxima</button></div></footer>
    </div>
    <p className="text-xs leading-relaxed text-[#9ba9bc]">Atualização automática a cada minuto enquanto a aba está visível. A presença começa a ser registrada após esta atualização; não reconstrói a navegação passada. “—” indica uma fonte de dados ausente.</p>
    {selected && <UserFollowupDialog key={selected.id} user={selected} onClose={() => setSelected(null)} onSaved={updated => { setUsers(current => current.map(user => user.id === updated.id ? updated : user)); setSelected(updated); }} />}
  </section>;
}

function UserFollowupDialog({ user, onClose, onSaved }: { user: TrackedUser; onClose: () => void; onSaved: (user: TrackedUser) => void }) {
  const [status, setStatus] = useState(user.followup_status);
  const [notes, setNotes] = useState(user.notes);
  const [date, setDate] = useState(user.follow_up_at || '');
  const [events, setEvents] = useState<Event[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [timelineError, setTimelineError] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const result = await supabase.rpc('get_founder_user_timeline', { target_user: user.id });
        if (result.error) throw result.error;
        if (!cancelled) setEvents(result.data || []);
      } catch { if (!cancelled) setTimelineError('Não foi possível carregar o histórico.'); }
      finally { if (!cancelled) setTimelineLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [user.id]);
  const save = async () => {
    if (saving) return;
    setSaving(true); setError(''); setSaved(false);
    try {
      const result = await supabase.from('founder_user_followups').upsert({ user_id: user.id, status, notes, follow_up_at: date || null, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).select('user_id').single();
      if (result.error) throw result.error;
      onSaved({ ...user, followup_status: status, notes, follow_up_at: date || null }); setSaved(true);
    } catch { setError('Não foi possível salvar o acompanhamento. Suas anotações foram mantidas.'); }
    finally { setSaving(false); }
  };
  return <Dialog open onClose={() => { if (!saving) onClose(); }} className="relative z-[200]"><div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" /><div className="fixed inset-0 overflow-y-auto p-3 sm:p-6"><div className="flex min-h-full items-center justify-center"><Dialog.Panel className="w-full max-w-4xl rounded-2xl border border-[#34455a] bg-[#101722] p-5 text-white sm:p-7"><header className="flex justify-between gap-4"><div><Dialog.Title className="text-xl font-bold">{user.name}</Dialog.Title><Dialog.Description className="mt-2 text-sm text-[#9ba9bc]">{user.email} · {user.plan.toUpperCase()}</Dialog.Description><p className="mt-1 break-all text-xs text-[#9ba9bc]">ID: {user.id}</p></div><button type="button" onClick={onClose} disabled={saving} aria-label="Fechar acompanhamento"><X className="h-5 w-5" /></button></header><div className="mt-6 grid gap-7 md:grid-cols-2"><section className="space-y-4"><h4 className="font-bold">Acompanhamento</h4><label className="block space-y-2 text-sm"><span>Situação</span><select value={status} disabled={saving} onChange={e => { setStatus(e.target.value as FollowupStatus); setSaved(false); }} className={fieldClass}>{Object.entries(followupLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block space-y-2 text-sm"><span>Data para retorno</span><input type="date" value={date} disabled={saving} onChange={e => { setDate(e.target.value); setSaved(false); }} className={fieldClass} /></label><label className="block space-y-2 text-sm"><span>Anotações privadas do founder</span><textarea rows={5} value={notes} disabled={saving} onChange={e => { setNotes(e.target.value); setSaved(false); }} className={fieldClass} placeholder="Dificuldades, contexto e próximo contato…" /></label>{error && <p role="alert" className="text-sm text-red-300">{error}</p>}{saved && <p role="status" className="text-sm text-emerald-300">Acompanhamento salvo.</p>}<button type="button" onClick={() => void save()} disabled={saving} className="rounded-xl bg-primary-400 px-4 py-3 text-sm font-bold text-black disabled:opacity-50">{saving ? 'Salvando…' : 'Salvar acompanhamento'}</button></section><section><h4 className="font-bold">Histórico registrado</h4><p className="mt-2 text-xs text-[#9ba9bc]">Até 50 eventos. O histórico antigo depende do que já foi registrado.</p>{timelineLoading && <p className="mt-4 text-sm text-[#9ba9bc]">Carregando histórico…</p>}{timelineError && <p role="alert" className="mt-4 text-sm text-red-300">{timelineError}</p>}<ol className="mt-4 max-h-96 space-y-4 overflow-y-auto">{events.map(event => <li key={event.id} className="border-l border-[#34455a] pl-4"><p className="text-sm">{event.action} <span className="text-[#9ba9bc]">{event.target}</span></p><time className="mt-1 block text-xs text-[#9ba9bc]">{trackingDate(event.created_at)}</time></li>)}</ol></section></div></Dialog.Panel></div></div></Dialog>;
}
