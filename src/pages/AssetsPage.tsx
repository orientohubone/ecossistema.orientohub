import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Award,
  BarChart3,
  Briefcase,
  Code2,
  Globe2,
  Layers,
  MapPin,
  Megaphone,
  Network,
  Palette,
  Rocket,
  ShoppingCart,
  Sparkles,
  Tags,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { serviceCatalog } from '../data/serviceCatalog';
import type { ServiceCatalogItem } from '../data/serviceCatalog';

type ServiceAccent = ServiceCatalogItem['accent'];

const serviceIcons: Record<string, ComponentType<{ className?: string }>> = {
  estrategia: Briefcase,
  inovacao: Rocket,
  marketing: BarChart3,
  'midia-paga': Megaphone,
  'google-meu-negocio': MapPin,
  design: Palette,
  'vibe-coding': Code2,
  marcas: Award,
  naming: Tags,
  dominio: Globe2,
  sites: Target,
  'e-commerce': ShoppingCart,
};

const accentStyles: Record<ServiceAccent, { card: string; glow: string }> = {
  primary: { card: 'text-primary-300', glow: 'bg-primary-400/15' },
  orange: { card: 'text-orange-300', glow: 'bg-orange-400/15' },
  emerald: { card: 'text-emerald-300', glow: 'bg-emerald-400/15' },
  pink: { card: 'text-pink-300', glow: 'bg-pink-400/15' },
  violet: { card: 'text-violet-300', glow: 'bg-violet-400/15' },
  sky: { card: 'text-sky-300', glow: 'bg-sky-400/15' },
  amber: { card: 'text-amber-300', glow: 'bg-amber-400/15' },
  cyan: { card: 'text-cyan-300', glow: 'bg-cyan-400/15' },
  green: { card: 'text-green-300', glow: 'bg-green-400/15' },
};

const ecosystemLayers = [
  { title: 'Serviços', icon: Briefcase, iconClass: 'text-primary-300', glow: 'bg-primary-400/15' },
  { title: 'Plataforma', icon: Network, iconClass: 'text-blue-300', glow: 'bg-blue-400/15' },
  { title: 'MVPs', icon: Rocket, iconClass: 'text-green-300', glow: 'bg-green-400/15' },
  { title: 'Verticais', icon: TrendingUp, iconClass: 'text-purple-300', glow: 'bg-purple-400/15' },
];

const AssetsPage = () => (
  <>
    <Helmet>
      <title>Assets de serviços | OrientoHub</title>
      <meta name="description" content="Capa de serviços do ecossistema OrientoHub." />
    </Helmet>

    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-4 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #facc15 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <section className="relative mx-auto max-w-[390px]" aria-label="Serviços OrientoHub">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {serviceCatalog.map((service, index) => {
            const Icon = serviceIcons[service.slug] ?? Sparkles;
            const styles = accentStyles[service.accent];

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.025 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative flex min-h-28 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#101722]/90 p-4 text-center shadow-xl shadow-black/20 transition-colors hover:border-primary-400/40"
              >
                <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className={`pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full blur-2xl ${styles.glow}`} />
                <span className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/30 transition-transform group-hover:scale-110 ${styles.card}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="relative text-xs font-semibold leading-tight text-gray-300">{service.title}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto mt-56 max-w-3xl text-center" aria-labelledby="ecosystem-layers-title">
        <div className="mx-auto mb-8 flex w-fit items-center gap-2.5 rounded-full border border-primary-400/40 bg-black/30 px-3.5 py-2 shadow-[0_0_30px_rgba(255,215,0,0.08)] backdrop-blur-md">
          <Layers className="h-3.5 w-3.5 text-primary-400" />
          <span className="h-3 w-px bg-primary-400/40" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Arquitetura estratégica</span>
        </div>
        <h2 id="ecosystem-layers-title" className="mx-auto max-w-2xl text-xl font-semibold leading-relaxed text-gray-200 sm:text-2xl">
          Um ecossistema completo de inovação, aceleração e produtos conectados em 4 camadas estratégicas.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ecosystemLayers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <motion.div key={layer.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -4, scale: 1.02 }} className="group relative flex min-h-28 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#101722]/90 p-4 text-center shadow-xl shadow-black/20 transition-colors hover:border-white/20">
                <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className={`pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full blur-2xl ${layer.glow}`} />
                <span className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/30 transition-transform group-hover:scale-110 ${layer.iconClass}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="relative text-sm font-semibold text-gray-300">{layer.title}</span>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  </>
);

export default AssetsPage;
