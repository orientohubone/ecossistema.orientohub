import { ReactNode, useEffect, useState } from 'react';
import { ArrowLeft, Construction, LockKeyhole, Rocket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';

type FeatureState = 'enabled' | 'disabled' | 'maintenance' | 'development' | 'coming_soon';
type Access = { state: FeatureState; message: string | null };

const content: Record<Exclude<FeatureState, 'enabled'>, { eyebrow: string; title: string; description: string; icon: typeof Construction; accent: string }> = {
  disabled: { eyebrow: 'ACESSO RESTRITO', title: 'Este espaço ainda não está no seu plano.', description: 'Faça upgrade para desbloquear a experiência completa.', icon: LockKeyhole, accent: 'from-violet-500 to-fuchsia-500' },
  maintenance: { eyebrow: 'MANUTENÇÃO PROGRAMADA', title: 'Estamos deixando tudo melhor por aqui.', description: 'A funcionalidade volta em breve. Obrigado pela paciência.', icon: Construction, accent: 'from-amber-400 to-orange-500' },
  development: { eyebrow: 'EM DESENVOLVIMENTO', title: 'Algo novo está tomando forma.', description: 'Estamos construindo esta experiência com cuidado.', icon: Construction, accent: 'from-sky-400 to-blue-600' },
  coming_soon: { eyebrow: 'EM BREVE', title: 'Uma nova possibilidade está chegando.', description: 'Fique de olho: esta funcionalidade será liberada em breve.', icon: Rocket, accent: 'from-primary-400 to-yellow-500' },
};

const FeatureRoute = ({ feature, screen, children }: { feature: string; screen: string; children: ReactNode }) => {
  const [access, setAccess] = useState<Access | null>(null);
  useEffect(() => {
    supabase.rpc('get_feature_access', { feature, screen_name: screen }).then(({ data }) => {
      const result = Array.isArray(data) ? data[0] : data;
      setAccess((result || { state: 'disabled', message: null }) as Access);
    });
  }, [feature, screen]);

  if (!access) return <div className="min-h-[50vh] flex items-center justify-center"><div className="h-9 w-9 rounded-full border-2 border-primary-500/25 border-t-primary-500 animate-spin" /></div>;
  if (access.state === 'enabled') return <>{children}</>;
  const item = content[access.state]; const Icon = item.icon;
  const statusLabel = access.state === 'maintenance' ? 'Em manutenção' : access.state === 'development' ? 'Em desenvolvimento' : access.state === 'coming_soon' ? 'Em breve' : 'Acesso restrito';
  return <section className="flex min-h-screen items-center justify-center bg-gray-900 px-6 py-16">
    <div className="w-full max-w-md text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/15 text-primary-400"><Icon className="h-8 w-8" /></div>
      <h1 className="mt-7 text-xl font-bold tracking-tight text-white">{statusLabel}</h1>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-gray-400">{access.message || item.description}</p>
      <div className="mt-9 flex justify-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300"><Zap className="h-3.5 w-3.5" />{statusLabel}</span><Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-700"><ArrowLeft className="h-3.5 w-3.5" />Voltar ao Dashboard</Link></div>
      {access.state === 'disabled' && <Link to="/planos" className="mt-3 inline-flex text-xs font-semibold text-primary-400 hover:text-primary-300">Conhecer opções de plano</Link>}
      <p className="mt-7 text-xs leading-5 text-gray-500">{access.state === 'maintenance' ? 'Estamos trabalhando para normalizar esta funcionalidade.' : 'Acompanhe as novidades para saber quando esta funcionalidade será liberada.'}</p>
    </div>
  </section>;
};

export default FeatureRoute;
