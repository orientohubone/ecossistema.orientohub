import { useEffect, useState } from 'react';
import { Flag, RefreshCw } from 'lucide-react';
import { supabase } from '../../config/supabase';

type FeatureFlag = { key: string; name: string; description: string | null; enabled: boolean };

export const FeatureFlagsPanel = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlags = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('feature_flags').select('key, name, description, enabled').order('name');
    if (error) setError('Não foi possível carregar as flags.');
    else setFlags(data || []);
    setLoading(false);
  };

  useEffect(() => { loadFlags(); }, []);

  const toggleFlag = async (flag: FeatureFlag) => {
    const nextEnabled = !flag.enabled;
    setFlags((current) => current.map((item) => item.key === flag.key ? { ...item, enabled: nextEnabled } : item));
    const { error } = await supabase.from('feature_flags').update({ enabled: nextEnabled, updated_at: new Date().toISOString() }).eq('key', flag.key);
    if (error) {
      setError('Não foi possível atualizar a flag.');
      setFlags((current) => current.map((item) => item.key === flag.key ? flag : item));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div><h3 className="text-xl font-bold text-gray-900 dark:text-white">Feature Flags</h3><p className="text-sm text-gray-500 mt-1">Controle global das funcionalidades liberadas na plataforma.</p></div>
        <button onClick={loadFlags} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" aria-label="Atualizar flags"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="space-y-3">
        {flags.map((flag) => <div key={flag.key} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
          <div className="flex items-start gap-3"><Flag className={`w-5 h-5 mt-0.5 ${flag.enabled ? 'text-primary-500' : 'text-gray-400'}`} /><div><p className="font-semibold text-gray-900 dark:text-white">{flag.name}</p><p className="text-sm text-gray-500">{flag.description}</p><code className="text-xs text-gray-400">{flag.key}</code></div></div>
          <button onClick={() => toggleFlag(flag)} className={`relative w-12 h-7 rounded-full transition-colors ${flag.enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`} aria-label={`Alternar ${flag.name}`}><span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${flag.enabled ? 'translate-x-6' : 'translate-x-1'}`} /></button>
        </div>)}
        {!loading && !flags.length && <p className="text-sm text-gray-500">Nenhuma flag cadastrada.</p>}
      </div>
    </div>
  );
};
