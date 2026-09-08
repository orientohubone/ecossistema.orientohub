import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bot,
  Clock3,
  Smile,
  Users,
  Sparkles,
  Target,
} from 'lucide-react';
import founderPhoto from '../assets/fenando-ramalho.jpg';
import { serviceCatalog } from '../data/serviceCatalog';
import type { ServiceCatalogItem } from '../data/serviceCatalog';
import { Briefcase, Rocket, BarChart3, Megaphone, MapPin, Palette, Code2, Globe2, ShoppingCart, Tags } from 'lucide-react';
import type { ComponentType } from 'react';

const serviceIcons: Record<string, ComponentType<{ className?: string }>> = {
  estrategia: Briefcase, inovacao: Rocket, marketing: BarChart3, 'midia-paga': Megaphone,
  'google-meu-negocio': MapPin,
  design: Palette, 'vibe-coding': Code2, marcas: Award, naming: Tags, dominio: Globe2, sites: Target, 'e-commerce': ShoppingCart,
};

const serviceColors: Record<string, string> = {
  primary: 'text-primary-400 border-primary-500/40 bg-primary-500/10', orange: 'text-orange-400 border-orange-500/40 bg-orange-500/10', emerald: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', pink: 'text-pink-400 border-pink-500/40 bg-pink-500/10', violet: 'text-violet-400 border-violet-500/40 bg-violet-500/10', sky: 'text-sky-400 border-sky-500/40 bg-sky-500/10', amber: 'text-amber-400 border-amber-500/40 bg-amber-500/10', cyan: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', green: 'text-green-400 border-green-500/40 bg-green-500/10',
};

const authorityIndicators = [
  { value: '100+', label: 'Empresas atendidas', icon: Smile },
  { value: '200h+', label: 'De atendimento direto', icon: Clock3 },
  { value: '92%', label: 'De clientes satisfeitos', icon: Users },
];

const formatPrice = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getDiscountPercentage = (original: number, promotional: number) =>
  Math.round(((original - promotional) / original) * 100);

type ServicePricing = NonNullable<ServiceCatalogItem['pricing']>;
type ServiceAccent = ServiceCatalogItem['accent'];

const servicePriceColors: Record<ServiceAccent, { wrapper: string; glow: string; line: string; label: string; value: string }> = {
  primary: { wrapper: 'border-primary-400/30 from-primary-500/[0.16] group-hover:border-primary-400/60', glow: 'bg-primary-400/15', line: 'via-primary-300/80', label: 'text-primary-300/75', value: 'text-primary-300' },
  orange: { wrapper: 'border-orange-400/30 from-orange-500/[0.16] group-hover:border-orange-400/60', glow: 'bg-orange-400/15', line: 'via-orange-300/80', label: 'text-orange-300/75', value: 'text-orange-300' },
  emerald: { wrapper: 'border-emerald-400/30 from-emerald-500/[0.16] group-hover:border-emerald-400/60', glow: 'bg-emerald-400/15', line: 'via-emerald-300/80', label: 'text-emerald-300/75', value: 'text-emerald-300' },
  pink: { wrapper: 'border-pink-400/30 from-pink-500/[0.16] group-hover:border-pink-400/60', glow: 'bg-pink-400/15', line: 'via-pink-300/80', label: 'text-pink-300/75', value: 'text-pink-300' },
  violet: { wrapper: 'border-violet-400/30 from-violet-500/[0.16] group-hover:border-violet-400/60', glow: 'bg-violet-400/15', line: 'via-violet-300/80', label: 'text-violet-300/75', value: 'text-violet-300' },
  sky: { wrapper: 'border-sky-400/30 from-sky-500/[0.16] group-hover:border-sky-400/60', glow: 'bg-sky-400/15', line: 'via-sky-300/80', label: 'text-sky-300/75', value: 'text-sky-300' },
  amber: { wrapper: 'border-amber-400/30 from-amber-500/[0.16] group-hover:border-amber-400/60', glow: 'bg-amber-400/15', line: 'via-amber-300/80', label: 'text-amber-300/75', value: 'text-amber-300' },
  cyan: { wrapper: 'border-cyan-400/30 from-cyan-500/[0.16] group-hover:border-cyan-400/60', glow: 'bg-cyan-400/15', line: 'via-cyan-300/80', label: 'text-cyan-300/75', value: 'text-cyan-300' },
  green: { wrapper: 'border-green-400/30 from-green-500/[0.16] group-hover:border-green-400/60', glow: 'bg-green-400/15', line: 'via-green-300/80', label: 'text-green-300/75', value: 'text-green-300' },
};

const ServicePriceTag = ({ pricing, accent }: { pricing: ServicePricing; accent: ServiceAccent }) => {
  const colors = servicePriceColors[accent];

  return (
  <div className={`relative flex w-full shrink-0 flex-col justify-center overflow-hidden rounded-2xl border bg-gradient-to-br via-[#171b20] to-[#0c121b] p-4 shadow-[0_14px_35px_rgba(0,0,0,0.28)] transition duration-300 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:w-[180px] ${colors.wrapper}`}>
    <div className={`pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full blur-2xl ${colors.glow}`} />
    <span className={`absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${colors.line}`} />

    {pricing.customText ? (
      <>
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${colors.label}`}>Investimento</span>
        <strong className={`mt-1 text-2xl leading-tight ${colors.value}`}>{pricing.customText}</strong>
      </>
    ) : pricing.fixed !== undefined ? (
      <>
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${colors.label}`}>Investimento</span>
        <strong className={`mt-1 text-2xl leading-tight ${colors.value}`}>{formatPrice(pricing.fixed)}</strong>
      </>
    ) : pricing.startingAt !== undefined ? (
      <>
        <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${colors.label}`}>{pricing.startingAtLabel ?? 'A partir de'}</span>
        <strong className={`mt-1 whitespace-nowrap text-2xl leading-tight ${colors.value}`}>
          {formatPrice(pricing.startingAt)}
          {pricing.suffix && <small className={`mt-1 block text-xs font-bold uppercase tracking-[0.12em] ${colors.label}`}>{pricing.suffix}</small>}
        </strong>
      </>
    ) : pricing.original !== undefined && pricing.promotional !== undefined ? (
      <>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 line-through">{formatPrice(pricing.original)}</span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
            {getDiscountPercentage(pricing.original, pricing.promotional)}% OFF
          </span>
        </div>
        <span className={`mt-1 text-[10px] font-bold uppercase tracking-[0.14em] ${colors.label}`}>Por apenas</span>
        <strong className={`mt-0.5 text-2xl leading-tight ${colors.value}`}>{formatPrice(pricing.promotional)}</strong>
      </>
    ) : null}

    {pricing.alternative && (
      <div className="mt-3 border-t border-white/10 pt-3 text-xs text-gray-300">
        <span className="block">{pricing.alternative.label}</span>
        <strong className="mt-0.5 block text-base text-white">{formatPrice(pricing.alternative.value)}</strong>
      </div>
    )}
    {pricing.note && <p className="mt-3 border-t border-white/10 pt-3 text-[10px] font-medium leading-relaxed text-gray-400">{pricing.note}</p>}
  </div>
  );
};

const ServicesPage = () => (
  <>
    <Helmet>
      <title>Serviços | OrientoHub</title>
      <meta name="description" content="Estratégia, inovação, marketing, design, tecnologia e construção para fazer sua empresa crescer." />
    </Helmet>

    <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #facc15 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <section className="container-custom relative z-10 py-16 sm:py-20 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto max-w-6xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">
            <Sparkles className="h-3.5 w-3.5" /> Nossos serviços
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Tudo que sua empresa <span className="text-primary-400">precisa para crescer.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            Em um só lugar, gente experiente cuidando de cada detalhe para você focar no que faz de melhor.
          </p>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-primary-500 bg-primary-500/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3 text-base font-semibold sm:text-lg">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary-500 text-primary-400"><Bot className="h-4 w-4" /></span>
              Montamos seu plano de crescimento <span className="text-primary-400">totalmente personalizado.</span>
            </div>
            <Link to="/contato" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-primary-400">
              Falar sobre meu negócio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-2">
          {serviceCatalog.map((service, index) => {
            const Icon = serviceIcons[service.slug] || Sparkles;
            return (
              <motion.article key={service.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: index * 0.04 }} className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#131820] transition duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                <Link to={`/servicos/${service.slug}`} className="flex h-full flex-col gap-5 p-5 sm:flex-row sm:items-stretch sm:p-6">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${serviceColors[service.accent]}`}><Icon className="h-5 w-5" /></span>
                    <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="text-lg font-bold sm:text-xl">{service.title}</h2>
                    <p className="mt-1 text-base leading-relaxed text-gray-400">{service.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary-300 transition group-hover:gap-2">Conhecer serviço <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </div>
                  {service.pricing && <ServicePriceTag pricing={service.pricing} accent={service.accent} />}
                </Link>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {authorityIndicators.map((indicator) => {
            const Icon = indicator.icon;
            return (
              <div key={indicator.label} className="flex items-center justify-center gap-3 rounded-xl border border-primary-500/10 bg-primary-500/10 px-5 py-5 text-center sm:justify-start">
                <Icon className="h-6 w-6 shrink-0 text-primary-400" />
                <span className="text-3xl font-bold text-white">{indicator.value}</span>
                <span className="max-w-[130px] text-left text-sm leading-tight text-gray-300 sm:text-base">{indicator.label}</span>
              </div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[1fr_auto] lg:items-center rounded-2xl border border-white/10 bg-[#10141a] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img src={founderPhoto} alt="Fernando Ramalho" className="h-24 w-24 rounded-xl object-cover object-top ring-1 ring-primary-500/30" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400">Quem cuida do seu negócio</p>
              <h2 className="mt-1 text-2xl font-bold">Fernando Ramalho</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">Os serviços prestados são o mix do núcleo que construí, conectando estratégia e execução à minha visão de negócio.</p>
            </div>
          </div>
          <Link to="/contato" className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-500/50 px-5 py-3 text-sm font-bold text-primary-300 transition hover:bg-primary-500 hover:text-black">
            Vamos conversar <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  </>
);

export default ServicesPage;
