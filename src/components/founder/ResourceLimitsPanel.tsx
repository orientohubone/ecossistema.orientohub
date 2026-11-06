import { useEffect, useState } from 'react';
import { CustomSelect } from '../CustomSelect';
import { CheckCircle, Loader2, RefreshCw, Save, Trash2 } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { limitLabel, parseResourceLimit, plans, resources, type Plan, type Resource } from '../../lib/resourceLimits';

type PlanLimits = { plan: Plan; max_ideas: number | null; max_projects: number | null; max_solutions: number | null };
type Override = { user_id: string; resource: Resource; max_items: number | null };
type UserOption = { id: string; name: string };
type Draft = Record<typeof resources[number]['column'], string>;
const fieldClass = 'w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm text-white outline-none focus:border-primary-400 disabled:opacity-50';
const errorMessage = (error: unknown) => {
  const code = (error as { code?: string })?.code;
  if (['42P01', '42703', 'PGRST204', 'PGRST205'].includes(code || '')) return 'Aplique a migração 20261105000001_configurable_resource_limits.sql e atualize este painel.';
  return (error as { message?: string })?.message || 'Não foi possível salvar os limites.';
};

export function ResourceLimitsPanel() {
  const [drafts, setDrafts] = useState<Partial<Record<Plan, Draft>>>({});
  const [users, setUsers] = useState<UserOption[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const [resource, setResource] = useState<Resource>('solutions');
  const [quantity, setQuantity] = useState('');
  const [unlimited, setUnlimited] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [entitlements, exceptions, companies] = await Promise.all([
        supabase.from('plan_entitlements').select('plan,max_ideas,max_projects,max_solutions'),
        supabase.from('user_resource_limits').select('user_id,resource,max_items'),
        supabase.rpc('get_founder_companies'),
      ]);
      if (entitlements.error) throw entitlements.error;
      if (exceptions.error) throw exceptions.error;
      if (companies.error) throw companies.error;
      const rows = entitlements.data as PlanLimits[];
      const next: Partial<Record<Plan, Draft>> = {};
      for (const row of rows) next[row.plan] = { max_ideas: row.max_ideas?.toString() ?? '', max_projects: row.max_projects?.toString() ?? '', max_solutions: row.max_solutions?.toString() ?? '' };
      setDrafts(next); setOverrides(exceptions.data || []); setUsers(companies.data || []);
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const savePlan = async (plan: Plan) => {
    if (busy || !drafts[plan]) return;
    setBusy(plan); setError(''); setSuccess('');
    try {
      const draft = drafts[plan]!;
      const payload = { max_ideas: parseResourceLimit(draft.max_ideas), max_projects: parseResourceLimit(draft.max_projects), max_solutions: parseResourceLimit(draft.max_solutions), updated_at: new Date().toISOString() };
      const result = await supabase.from('plan_entitlements').update(payload).eq('plan', plan).select('plan').single();
      if (result.error) throw result.error;
      setSuccess(`Limites do plano ${plan.toUpperCase()} atualizados.`);
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(null); }
  };
  const saveOverride = async () => {
    if (busy) return;
    setBusy('override'); setError(''); setSuccess('');
    try {
      if (!userId) throw new Error('Selecione o usuário que receberá a exceção.');
      if (!unlimited && !quantity.trim()) throw new Error('Informe uma quantidade ou marque “Sem limite”.');
      const row: Override = { user_id: userId, resource, max_items: unlimited ? null : parseResourceLimit(quantity) };
      const result = await supabase.from('user_resource_limits').upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'user_id,resource' }).select('user_id,resource,max_items').single();
      if (result.error) throw result.error;
      setOverrides(current => [...current.filter(item => item.user_id !== userId || item.resource !== resource), result.data]);
      setSuccess('Exceção salva. A quantidade substitui o limite do plano apenas para este usuário.');
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(null); }
  };
  const removeOverride = async (row: Override) => {
    if (busy) return;
    setBusy(`${row.user_id}:${row.resource}`); setError(''); setSuccess('');
    try {
      const result = await supabase.from('user_resource_limits').delete().eq('user_id', row.user_id).eq('resource', row.resource).select('user_id');
      if (result.error) throw result.error;
      if (!result.data?.length) throw new Error('Não foi possível remover a exceção. Verifique sua permissão.');
      setOverrides(current => current.filter(item => item.user_id !== row.user_id || item.resource !== row.resource));
      setSuccess('Exceção removida. O usuário volta a seguir o limite do plano.');
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(null); }
  };

  return <section className="space-y-6 rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6" aria-labelledby="resource-limits-title">
    <header className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Quantidades e capacidade</p><h3 id="resource-limits-title" className="mt-2 text-xl font-bold text-white">Limites de criação</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#9ba9bc]">Defina as cotas por plano ou crie uma exceção individual. Deixe o campo do plano vazio para não limitar. Zero bloqueia novas criações; reduzir a cota mantém os registros existentes.</p></div><button type="button" onClick={() => void load()} disabled={loading || Boolean(busy)} aria-label="Atualizar limites" className="rounded-xl border border-[#34455a] p-2.5 text-[#9ba9bc] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button></header>
    {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {success && <p role="status" className="flex gap-2 text-sm text-emerald-300"><CheckCircle className="h-4 w-4 shrink-0" />{success}</p>}
    {loading ? <p className="text-sm text-[#9ba9bc]">Carregando limites…</p> : <>
      <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-[#34455a] text-[#9ba9bc]"><th className="py-3 pr-4">Plano</th>{resources.map(item => <th key={item.key} className="px-2 py-3">{item.label}</th>)}<th className="py-3 pl-4">Aplicar</th></tr></thead><tbody>{plans.map(plan => <tr key={plan} className="border-b border-[#273548]"><th className="py-4 pr-4 font-bold uppercase text-white">{plan}</th>{resources.map(item => <td key={item.key} className="px-2 py-4"><input aria-label={`${item.label} no plano ${plan}`} inputMode="numeric" value={drafts[plan]?.[item.column] ?? ''} placeholder={drafts[plan] ? 'Sem limite' : 'Não configurado'} disabled={Boolean(busy) || !drafts[plan]} onChange={event => setDrafts(current => ({ ...current, [plan]: { ...current[plan]!, [item.column]: event.target.value } }))} className={fieldClass} /></td>)}<td className="py-4 pl-4"><button type="button" onClick={() => void savePlan(plan)} disabled={Boolean(busy) || !drafts[plan]} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-3 py-2.5 font-bold text-black disabled:opacity-40">{busy === plan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Salvar</button></td></tr>)}</tbody></table></div>
      <div className="border-t border-[#273548] pt-5"><h4 className="font-bold text-white">Exceção por usuário</h4><p className="mt-1 text-sm text-[#9ba9bc]">Para ampliar sua própria cota, selecione sua conta abaixo. As regras de acesso das funcionalidades continuam valendo.</p><div className="mt-4 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4"><label className="space-y-2 text-sm text-[#d7e0ea]"><span>Usuário</span><CustomSelect ariaLabel="Usuário" value={userId} onChange={setUserId} disabled={Boolean(busy)} placeholder="Selecione uma conta" options={[{value:'',label:'Selecione uma conta'},...users.map(user=>({value:user.id,label:user.name}))]} buttonClassName={fieldClass} /></label><label className="space-y-2 text-sm text-[#d7e0ea]"><span>Recurso</span><CustomSelect ariaLabel="Recurso" value={resource} onChange={value=>setResource(value as Resource)} disabled={Boolean(busy)} options={resources.map(item=>({value:item.key,label:item.label}))} buttonClassName={fieldClass} /></label><label className="space-y-2 text-sm text-[#d7e0ea]"><span>Quantidade</span><input inputMode="numeric" value={quantity} onChange={e => setQuantity(e.target.value)} disabled={unlimited || Boolean(busy)} className={fieldClass} placeholder={unlimited ? 'Sem limite' : 'Ex.: 10'} /></label><div className="space-y-3"><label className="flex items-center gap-2 text-sm text-[#d7e0ea]"><input type="checkbox" checked={unlimited} onChange={e => setUnlimited(e.target.checked)} disabled={Boolean(busy)} />Sem limite</label><button type="button" onClick={() => void saveOverride()} disabled={Boolean(busy) || !userId} className="w-full rounded-xl bg-primary-400 px-3 py-2.5 text-sm font-bold text-black disabled:opacity-40">{busy === 'override' ? 'Salvando…' : 'Salvar exceção'}</button></div></div>
      <ul className="mt-5 divide-y divide-[#273548]">{overrides.map(row => <li key={`${row.user_id}:${row.resource}`} className="flex items-center justify-between gap-3 py-3 text-sm"><div><span className="font-semibold text-white">{users.find(user => user.id === row.user_id)?.name || row.user_id}</span><span className="ml-2 text-[#9ba9bc]">{resources.find(item => item.key === row.resource)?.label} · {limitLabel(row.max_items)}</span></div><button type="button" disabled={Boolean(busy)} onClick={() => void removeOverride(row)} aria-label="Remover exceção e usar limite do plano" className="rounded-lg p-2 text-red-300 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button></li>)}</ul>{!overrides.length && <p className="mt-4 text-sm text-[#9ba9bc]">Nenhuma exceção individual. Todos seguem as quantidades do plano.</p>}</div>
    </>}
  </section>;
}
