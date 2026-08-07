import { useEffect, useMemo, useState } from 'react';
import { Flag, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { supabase } from '../../config/supabase';

type FeatureFlag = { key: string; name: string; description: string | null; enabled: boolean };
type RuleState = 'enabled' | 'disabled' | 'maintenance' | 'development' | 'coming_soon';
type Rule = { id: string; feature_key: string; scope: 'global' | 'plan' | 'user' | 'screen'; target: string | null; state: RuleState; message: string | null };
type UserOption = { id: string; name: string };

const states: { value: RuleState; label: string }[] = [
  { value: 'enabled', label: 'Ativa' }, { value: 'disabled', label: 'Desativada' },
  { value: 'maintenance', label: 'Em manutenção' }, { value: 'development', label: 'Em desenvolvimento' }, { value: 'coming_soon', label: 'Em breve' },
];
const screens = ['dashboard', 'projects', 'solutions', 'insights', 'academy', 'community'];

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
  useEffect(() => { setTarget(scope === 'plan' ? 'free' : scope === 'screen' ? 'dashboard' : scope === 'user' ? users[0]?.id || '' : ''); }, [scope, users]);

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
  const editRule = (rule: Rule) => { setFeatureKey(rule.feature_key); setScope(rule.scope); setTarget(rule.target || ''); setState(rule.state); setMessage(rule.message || ''); setEditingRuleId(rule.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEdit = () => { setEditingRuleId(null); setMessage(''); setScope('global'); setTarget(''); setState('enabled'); };
  const removeRule = async (id: string) => { const { error } = await supabase.from('feature_flag_rules').delete().eq('id', id); if (error) setError('Não foi possível remover a regra.'); else load(); };

  return <div className="space-y-6">
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 mb-6"><div><h3 className="text-xl font-bold text-gray-900 dark:text-white">Feature Flags</h3><p className="text-sm text-gray-500 mt-1">Aplique regras globais, por plano, usuário ou tela. A regra mais específica prevalece.</p></div><button onClick={load} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700" aria-label="Atualizar"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button></div>
      {editingRuleId && <div className="mb-4 flex items-center justify-between rounded-lg border border-primary-500/30 bg-primary-500/10 px-3 py-2 text-sm text-primary-700 dark:text-primary-300"><span>Editando regra existente</span><button onClick={cancelEdit} className="inline-flex items-center gap-1 font-medium"><X className="w-4 h-4" />Cancelar</button></div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium">Funcionalidade<select value={featureKey} onChange={(e) => setFeatureKey(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 dark:bg-gray-800">{flags.map((flag) => <option key={flag.key} value={flag.key}>{flag.name}</option>)}</select></label>
        <label className="text-sm font-medium">Aplicar para<select value={scope} onChange={(e) => setScope(e.target.value as Rule['scope'])} className="mt-1 w-full rounded-lg border p-2.5 dark:bg-gray-800"><option value="global">Toda a plataforma</option><option value="plan">Um plano</option><option value="user">Um usuário</option><option value="screen">Uma tela</option></select></label>
        {scope !== 'global' && <label className="text-sm font-medium">{scope === 'plan' ? 'Plano' : scope === 'user' ? 'Usuário' : 'Tela'}<select value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 dark:bg-gray-800">{(scope === 'plan' ? ['free', 'pro', 'enterprise'] : scope === 'screen' ? screens : users.map((user) => user.id)).map((value) => <option key={value} value={value}>{scope === 'user' ? users.find((user) => user.id === value)?.name : value}</option>)}</select></label>}
        <label className="text-sm font-medium">Estado<select value={state} onChange={(e) => setState(e.target.value as RuleState)} className="mt-1 w-full rounded-lg border p-2.5 dark:bg-gray-800">{states.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={message} onChange={(e) => setMessage(e.target.value)} spellCheck={false} className="flex-1 rounded-lg border p-2.5 dark:bg-gray-800" placeholder="Mensagem mostrada ao usuário (opcional)" /><button disabled={saving} onClick={saveRule} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 font-semibold text-black disabled:opacity-60">{editingRuleId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}{editingRuleId ? 'Salvar alterações' : 'Salvar regra'}</button></div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6"><h4 className="font-bold text-gray-900 dark:text-white mb-4">Regras ativas</h4><div className="space-y-3">{rules.map((rule) => <div key={rule.id} className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60"><div className="min-w-0"><p className="font-semibold">{flags.find((flag) => flag.key === rule.feature_key)?.name || rule.feature_key}</p><p className="text-sm text-gray-500">{targetLabel(rule)} · <span className="font-medium">{states.find((item) => item.value === rule.state)?.label}</span></p>{rule.message && <p className="text-xs text-gray-400 mt-1">{rule.message}</p>}</div><div className="flex items-center gap-1"><button onClick={() => editRule(rule)} className="p-2 text-primary-600 dark:text-primary-400" aria-label="Editar regra"><Pencil className="w-4 h-4" /></button><button onClick={() => removeRule(rule.id)} className="p-2 text-red-500" aria-label="Remover regra"><Trash2 className="w-4 h-4" /></button></div></div>)}{!loading && !rules.length && <p className="text-sm text-gray-500">Sem regras adicionais. As flags globais usam o padrão cadastrado.</p>}</div></div>
  </div>;
};
