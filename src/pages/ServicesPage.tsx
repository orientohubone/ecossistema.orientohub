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
import { Briefcase, Rocket, BarChart3, Megaphone, Palette, Code2, Globe2, ShoppingCart } from 'lucide-react';
import type { ComponentType } from 'react';

const serviceIcons: Record<string, ComponentType<{ className?: string }>> = {
  estrategia: Briefcase, inovacao: Rocket, marketing: BarChart3, 'midia-paga': Megaphone,
  design: Palette, 'vibe-coding': Code2, marcas: Award, dominio: Globe2, sites: Target, 'e-commerce': ShoppingCart,
};

const serviceColors: Record<string, string> = {
  primary: 'text-primary-400 border-primary-500/40 bg-primary-500/10', orange: 'text-orange-400 border-orange-500/40 bg-orange-500/10', emerald: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', pink: 'text-pink-400 border-pink-500/40 bg-pink-500/10', violet: 'text-violet-400 border-violet-500/40 bg-violet-500/10', sky: 'text-sky-400 border-sky-500/40 bg-sky-500/10', amber: 'text-amber-400 border-amber-500/40 bg-amber-500/10', cyan: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', green: 'text-green-400 border-green-500/40 bg-green-500/10',
};

const authorityIndicators = [
  { value: '60+', label: 'Empresas atendidas', icon: Smile },
  { value: '200h+', label: 'De atendimento direto', icon: Clock3 },
  { value: '92%', label: 'De clientes satisfeitos', icon: Users },
];

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

        <div className="mx-auto mt-5 grid max-w-6xl grid-cols-1 gap-3 md:grid-cols-2">
          {serviceCatalog.map((service, index) => {
            const Icon = serviceIcons[service.slug] || Sparkles;
            return (
              <motion.article key={service.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ delay: index * 0.04 }} className="group rounded-xl border border-white/5 bg-[#131820] transition hover:-translate-y-0.5 hover:border-primary-400/40">
                <Link to={`/servicos/${service.slug}`} className="block p-5 sm:p-6">
                <div className="flex gap-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${serviceColors[service.accent]}`}><Icon className="h-5 w-5" /></span>
                  <div>
                    <h2 className="text-lg font-bold sm:text-xl">{service.title}</h2>
                    <p className="mt-1 text-base leading-relaxed text-gray-400">{service.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-300 transition group-hover:gap-2">Conhecer serviço <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </div>
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
