import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Flag, Pencil, Plus, RefreshCw, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { ResourceLimitsPanel } from './ResourceLimitsPanel';

type FeatureFlag = { key: string; name: string; description: string | null; enabled: boolean };
type RuleState = 'enabled' | 'disabled' | 'maintenance' | 'development' | 'coming_soon';
type Rule = { id: string; feature_key: string; scope: 'global' | 'plan' | 'user' | 'screen'; target: string | null; state: RuleState; message: string | null };
type UserOption = { id: string; name: string };

const states: { value: RuleState; label: string }[] = [
  { value: 'enabled', label: 'Ativa' }, { value: 'disabled', label: 'Desativada' },
  { value: 'maintenance', label: 'Em manutenção' }, { value: 'development', label: 'Em desenvolvimento' }, { value: 'coming_soon', label: 'Em breve' },
];
const screens = ['dashboard', 'ideas', 'projects', 'solutions', 'insights', 'academy', 'community'];

export const FeatureFlagsPanel = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureKey, setFeatureKey] = useState('project_creation');
  const [scope, setScope] = useState<Rule['scope']>('global');
  const [target, setTarget] = useState('');
  const [state, setState] = useState<RuleState>('enabled');
  const [message, setMessage] = useState('');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'limits' | 'feature'>('overview');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true); setError(null);
    const [flagsResult, rulesResult, usersResult] = await Promise.all([
      supabase.from('feature_flags').select('key, name, description, enabled').order('name'),
      supabase.from('feature_flag_rules').select('id, feature_key, scope, target, state, message').order('created_at', { ascending: false }),
      supabase.rpc('get_founder_companies'),
    ]);
    if (flagsResult.error || rulesResult.error || usersResult.error) setError('Não foi possível carregar a configuração de funcionalidades.');
    setFlags(flagsResult.data || []); setRules((rulesResult.data || []) as Rule[]);
    setUsers(((usersResult.data || []) as { id: string; name: string }[]).map(({ id, name }) => ({ id, name })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const changeScope = (nextScope: Rule['scope']) => {
    setScope(nextScope);
    setTarget(nextScope === 'plan' ? 'free' : nextScope === 'screen' ? 'dashboard' : nextScope === 'user' ? users[0]?.id || '' : '');
  };

  const targetLabel = useMemo(() => (rule: Rule) => {
    if (rule.scope === 'global') return 'Toda a plataforma';
    if (rule.scope === 'plan') return `Plano ${rule.target}`;
    if (rule.scope === 'screen') return `Tela: ${rule.target}`;
    return users.find((user) => user.id === rule.target)?.name || `Usuário ${rule.target}`;
  }, [users]);

  const saveRule = async () => {
    if (!featureKey || (scope !== 'global' && !target)) return;
    setSaving(true); setError(null);
    const payload = { feature_key: featureKey, scope, target: scope === 'global' ? null : target, state, message: message || null, updated_at: new Date().toISOString() };
    const { error } = editingRuleId
      ? await supabase.from('feature_flag_rules').update(payload).eq('id', editingRuleId)
      : await supabase.from('feature_flag_rules').upsert(payload, { onConflict: 'feature_key,scope,target' });
    setSaving(false);
    if (error) { setError('Não foi possível salvar a regra.'); return; }
    setMessage(''); setEditingRuleId(null); await load();
  };
  const editRule = (rule: Rule) => { setFeatureKey(rule.feature_key); setScope(rule.scope); setTarget(rule.target || ''); setState(rule.state); setMessage(rule.message || ''); setEditingRuleId(rule.id); };
  const cancelEdit = () => { setEditingRuleId(null); setMessage(''); setScope('global'); setTarget(''); setState('enabled'); };
  const removeRule = async (id: string) => { const { error } = await supabase.from('feature_flag_rules').delete().eq('id', id); if (error) setError('Não foi possível remover a regra.'); else load(); };

  const fieldClassName = 'mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
  const labelForTarget = scope === 'plan' ? 'Qual plano?' : scope === 'user' ? 'Qual usuário?' : 'Qual tela?';
  const activeFeature = flags.find(flag => flag.key === featureKey);
  const featureRules = rules.filter(rule => rule.feature_key === featureKey);
  const filteredFlags = flags.filter(flag => `${flag.name} ${flag.description || ''}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  const backButton = <button type="button" onClick={() => setView('overview')} disabled={saving} className="inline-flex items-center gap-2 text-sm font-semibold text-[#9ba9bc] hover:text-primary-300 disabled:opacity-50"><ArrowLeft className="h-4 w-4" />Todas as configurações</button>;

  if (view === 'overview') return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Controle da plataforma</p><h3 className="mt-2 text-2xl font-bold tracking-tight text-white">Funcionalidades e limites</h3><p className="mt-2 text-sm text-[#9ba9bc]">Escolha uma área para consultar e ajustar suas configurações.</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 self-start rounded-xl border border-[#34455a] bg-[#151f2b] px-4 py-2.5 text-sm font-semibold text-[#c2cedd] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Atualizar</button></header>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <button type="button" onClick={() => setView('limits')} className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-primary-400/30 bg-[#151f2b] p-5 text-left transition hover:border-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-400 md:p-6"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-400/20 bg-primary-400/10 text-primary-300"><SlidersHorizontal className="h-6 w-6" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-300">Planos e exceções individuais</p><h4 className="mt-1 text-lg font-bold text-white">Limites de criação</h4><p className="mt-2 text-sm text-[#9ba9bc]">Quantidades de ideias, projetos e soluções por plano ou usuário.</p></div></div><ArrowUpRight className="h-5 w-5 shrink-0 text-primary-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h4 className="text-sm font-bold text-[#d7e0ea]">Funcionalidades <span className="ml-2 font-normal text-[#9ba9bc]">{flags.length}</span></h4><input type="search" aria-label="Buscar funcionalidade" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar funcionalidade…" className="w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-4 py-2.5 text-sm text-white outline-none focus:border-primary-400 sm:max-w-xs" /></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredFlags.map(flag => {
      const count = rules.filter(rule => rule.feature_key === flag.key).length;
      const globalRule = rules.find(rule => rule.feature_key === flag.key && rule.scope === 'global');
      const defaultState = globalRule?.state || (flag.enabled ? 'enabled' : 'disabled');
      return <button type="button" key={flag.key} onClick={() => { cancelEdit(); setError(null); setFeatureKey(flag.key); setView('feature'); }} className="group flex min-h-[238px] flex-col rounded-2xl border border-[#273548] bg-[#101722] p-5 text-left transition hover:border-primary-400/60 hover:bg-[#151f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-400"><div className="flex w-full items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b] text-primary-300"><Flag className="h-5 w-5" /></span><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${defaultState === 'enabled' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-200'}`}>{states.find(item => item.value === defaultState)?.label}</span></div><h5 className="mt-4 text-base font-bold text-white">{flag.name}</h5><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#9ba9bc]">{flag.description || 'Gerencie a disponibilidade e as regras de acesso deste recurso.'}</p><div className="mt-auto flex w-full items-center justify-between gap-3 pt-5"><span className="text-xs text-[#9ba9bc]">{count ? `${count} ${count === 1 ? 'regra configurada' : 'regras configuradas'}` : 'Sem regras adicionais'}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-primary-300">Configurar<ArrowUpRight className="h-4 w-4" /></span></div></button>;
    })}</div>
    {loading && <p role="status" className="text-sm text-[#9ba9bc]">Carregando funcionalidades…</p>}
    {!loading && !filteredFlags.length && <p className="rounded-xl border border-dashed border-[#34455a] px-5 py-8 text-center text-sm text-[#9ba9bc]">{flags.length ? 'Nenhuma funcionalidade encontrada para esta busca.' : 'Nenhuma funcionalidade disponível.'}</p>}
    <p className="text-xs text-[#9ba9bc]">O status dos cards mostra o padrão global. Regras por usuário, tela e plano podem definir acessos diferentes.</p>
  </div>;

  if (view === 'limits') return <div className="space-y-5">{backButton}<ResourceLimitsPanel /></div>;

  return <div className="space-y-6">
    {backButton}
    <div className="rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Controle de acesso</p><h3 className="text-xl font-bold text-white">{activeFeature?.name || featureKey}</h3><p className="mt-1 text-sm text-[#9ba9bc]">Defina o que cada pessoa pode acessar. Regras mais específicas têm prioridade.</p></div><button onClick={load} className="rounded-xl border border-[#34455a] bg-[#151f2b] p-2.5 text-[#9ba9bc] transition-colors hover:text-white" aria-label="Atualizar"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button></div>
      {editingRuleId && <div className="mb-5 flex items-center justify-between rounded-xl border border-primary-400/25 bg-primary-500/10 px-4 py-3 text-sm text-primary-200"><span>Você está editando uma regra existente.</span><button onClick={cancelEdit} className="inline-flex items-center gap-1 font-semibold hover:text-white"><X className="w-4 h-4" />Cancelar</button></div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="rounded-xl border border-[#273548] bg-[#151f2b] p-4 text-sm font-semibold text-[#d7e0ea]">Funcionalidade<span className="mt-1 block text-xs font-normal text-[#9ba9bc]">O recurso que esta regra controla.</span><select disabled value={featureKey} onChange={(e) => setFeatureKey(e.target.value)} className={fieldClassName}>{flags.map((flag) => <option key={flag.key} value={flag.key}>{flag.name}</option>)}</select></label>
        <label className="rounded-xl border border-[#273548] bg-[#151f2b] p-4 text-sm font-semibold text-[#d7e0ea]">Aplicar para<span className="mt-1 block text-xs font-normal text-[#9ba9bc]">Escolha a abrangência da regra.</span><select value={scope} onChange={(e) => changeScope(e.target.value as Rule['scope'])} className={fieldClassName}><option value="global">Toda a plataforma</option><option value="plan">Um plano</option><option value="user">Um usuário</option><option value="screen">Uma tela</option></select></label>
        {scope !== 'global' && <label className="rounded-xl border border-primary-400/20 bg-primary-500/5 p-4 text-sm font-semibold text-[#d7e0ea]">{labelForTarget}<span className="mt-1 block text-xs font-normal text-primary-200/70">Este é o destino que receberá a regra.</span><select value={target} onChange={(e) => setTarget(e.target.value)} className={fieldClassName}>{(scope === 'plan' ? ['free', 'pro', 'enterprise'] : scope === 'screen' ? screens : users.map((user) => user.id)).map((value) => <option key={value} value={value}>{scope === 'user' ? users.find((user) => user.id === value)?.name : value}</option>)}</select></label>}
        <label className="rounded-xl border border-[#273548] bg-[#151f2b] p-4 text-sm font-semibold text-[#d7e0ea]">Como ela deve aparecer?<span className="mt-1 block text-xs font-normal text-[#9ba9bc]">Define acesso, bloqueio ou comunicação da tela.</span><select value={state} onChange={(e) => setState(e.target.value as RuleState)} className={fieldClassName}>{states.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      </div>
      <div className="mt-4 rounded-xl border border-[#273548] bg-[#151f2b] p-4"><label className="text-sm font-semibold text-[#d7e0ea]">Mensagem para o usuário <span className="font-normal text-[#9ba9bc]">(opcional)</span></label><textarea value={message} onChange={(e) => setMessage(e.target.value)} spellCheck={false} rows={3} className={`${fieldClassName} resize-y`} placeholder="Ex.: Estamos melhorando nossa comunidade, em breve será liberado!" /><div className="mt-3 flex justify-end"><button disabled={saving} onClick={saveRule} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b] transition-colors hover:bg-primary-400 disabled:opacity-60">{editingRuleId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}{editingRuleId ? 'Salvar alterações' : 'Criar regra'}</button></div></div>
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </div>
    <div className="rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6"><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9ba9bc]">Configurações em vigor</p><h4 className="mt-1 font-bold text-white">Regras ativas</h4></div><div className="grid gap-4 lg:grid-cols-2">{featureRules.map((rule) => <div key={rule.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#273548] bg-[#151f2b] p-4"><div className="min-w-0"><p className="font-semibold text-white">{flags.find((flag) => flag.key === rule.feature_key)?.name || rule.feature_key}</p><p className="mt-1 text-sm text-[#9ba9bc]">{targetLabel(rule)} · <span className="font-medium text-primary-200">{states.find((item) => item.value === rule.state)?.label}</span></p>{rule.message && <p className="mt-2 text-sm text-[#d7e0ea]">{rule.message}</p>}</div><div className="flex flex-shrink-0 items-center gap-1"><button onClick={() => editRule(rule)} className="rounded-lg p-2 text-primary-300 transition-colors hover:bg-primary-500/10" aria-label="Editar regra"><Pencil className="w-4 h-4" /></button><button onClick={() => removeRule(rule.id)} className="rounded-lg p-2 text-red-300 transition-colors hover:bg-red-400/10" aria-label="Remover regra"><Trash2 className="w-4 h-4" /></button></div></div>)}{!loading && !featureRules.length && <div className="rounded-xl border border-dashed border-[#34455a] bg-[#151f2b] px-4 py-8 text-center text-sm text-[#9ba9bc]">Nenhuma regra adicional para esta funcionalidade. O padrão global continua valendo.</div>}</div></div>
  </div>;
};
