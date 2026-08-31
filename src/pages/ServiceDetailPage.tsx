import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BarChart3, Briefcase, CheckCircle2, Code2, Globe2, Megaphone, Palette, Rocket, ShoppingCart, Sparkles, Target, Award, Tags } from 'lucide-react';
import type { ComponentType } from 'react';
import { getServiceBySlug } from '../data/serviceCatalog';

const icons: Record<string, ComponentType<{ className?: string }>> = {
  estrategia: Briefcase, inovacao: Rocket, marketing: BarChart3, 'midia-paga': Megaphone,
  design: Palette, 'vibe-coding': Code2, marcas: Award, naming: Tags, dominio: Globe2, sites: Target, 'e-commerce': ShoppingCart,
};

const accentClasses = {
  primary: 'border-primary-400/30 bg-primary-500/10 text-primary-300',
  orange: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  pink: 'border-pink-400/30 bg-pink-400/10 text-pink-300',
  violet: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  sky: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  green: 'border-green-400/30 bg-green-400/10 text-green-300',
};

const formatPrice = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getDiscountPercentage = (original: number, promotional: number) =>
  Math.round(((original - promotional) / original) * 100);

const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const service = getServiceBySlug(serviceSlug);
  if (!service) return <Navigate to="/servicos" replace />;

  const Icon = icons[service.slug] || Sparkles;
  const accent = accentClasses[service.accent];

  return (
    <>
      <Helmet>
        <title>{service.title} | Serviços OrientoHub</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <main className="min-h-screen overflow-hidden bg-[#0c121b] text-white">
        <section className="relative border-b border-[#273548] bg-[#101722]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.09]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #facc15 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="container-custom relative py-14 sm:py-20 lg:py-24">
            <Link to="/servicos" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#9ba9bc] transition-colors hover:text-primary-300"><ArrowLeft className="h-4 w-4" /> Todos os serviços</Link>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.17em] ${accent}`}><Icon className="h-4 w-4" /> {service.eyebrow}</div>
                <h1 className="max-w-4xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{service.hero}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#9ba9bc] sm:text-xl">{service.outcome}</p>
                {service.pricing && (
                  <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-2 rounded-2xl border border-primary-400/25 bg-primary-500/10 p-4 sm:w-fit sm:px-5">
                    {service.pricing.customText ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-300">Investimento</p>
                        <p className="mt-1 text-3xl font-bold text-primary-300">{service.pricing.customText}</p>
                      </div>
                    ) : service.pricing.fixed !== undefined ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-300">Investimento</p>
                        <p className="mt-1 text-3xl font-bold text-primary-300">{formatPrice(service.pricing.fixed)}</p>
                      </div>
                    ) : service.pricing.startingAt !== undefined ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-300">Investimento</p>
                        <div className="mt-1 flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold text-white">{service.pricing.startingAtLabel ?? 'A partir de'}</span>
                          <span className="text-3xl font-bold text-primary-300">{formatPrice(service.pricing.startingAt)}{service.pricing.suffix}</span>
                        </div>
                      </div>
                    ) : service.pricing.original !== undefined && service.pricing.promotional !== undefined ? (
                      <>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-300">Oferta especial</p>
                          <div className="mt-1 flex flex-wrap items-baseline gap-2">
                            <span className="text-base text-[#9ba9bc] line-through">de {formatPrice(service.pricing.original)}</span>
                            <span className="text-sm font-semibold text-white">por apenas</span>
                            <span className="text-3xl font-bold text-primary-300">{formatPrice(service.pricing.promotional)}</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                          {getDiscountPercentage(service.pricing.original, service.pricing.promotional)}% OFF
                        </span>
                      </>
                    ) : null}
                    {service.pricing.note && (
                      <p className="w-full text-xs font-medium text-[#9ba9bc]">{service.pricing.note}</p>
                    )}
                    {service.pricing.alternative && (
                      <div className="w-full border-t border-primary-400/20 pt-3">
                        <span className="text-sm font-semibold text-white">{service.pricing.alternative.label}</span>
                        <span className="ml-2 text-xl font-bold text-primary-300">{formatPrice(service.pricing.alternative.value)}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to={`/contato?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(`Olá, gostaria de falar sobre ${service.title}. Podemos agendar uma conversa?`)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400">Quero falar sobre {service.title.toLowerCase()} <ArrowRight className="h-4 w-4" /></Link><a href="https://consultoria.orientohub.com.br" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b] px-5 py-3.5 text-sm font-semibold text-[#d7e0ea] transition hover:border-primary-400 hover:text-white">Conhecer a Orienta+</a></div>
              </div>
              <div className={`rounded-3xl border p-7 ${accent}`}><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0c121b]/50"><Icon className="h-8 w-8" /></div><p className="mt-7 text-sm font-semibold uppercase tracking-[0.15em] opacity-75">O foco</p><p className="mt-2 text-xl font-bold leading-snug text-white">{service.description}</p></div>
            </motion.div>
          </div>
        </section>

        <section className="container-custom py-12 sm:py-16">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">O que construímos</p><h2 className="mt-3 text-3xl font-bold">Uma frente integrada ao momento do seu negócio.</h2><p className="mt-4 leading-relaxed text-[#9ba9bc]">Cada projeto começa entendendo seu contexto. A entrega combina direção e execução, sem pacotes genéricos ou promessas desconectadas da realidade.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{service.deliverables.map((deliverable, index) => <motion.div key={deliverable} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex gap-3 rounded-2xl border border-[#273548] bg-[#151f2b] p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" /><p className="font-medium text-[#d7e0ea]">{deliverable}</p></motion.div>)}</div>
          </div>
        </section>

        {service.options && service.options.length > 0 && (
          <section className="border-y border-[#273548] bg-[#101722]">
            <div className="container-custom py-12 sm:py-16">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Opções disponíveis</p>
                <h2 className="mt-3 text-3xl font-bold">Escolha a entrega que faz sentido para o seu momento.</h2>
                <p className="mt-3 leading-relaxed text-[#9ba9bc]">O investimento varia conforme a complexidade e as necessidades de cada projeto.</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {service.options.map((option, index) => (
                  <motion.div key={option.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} className="group relative flex min-h-[285px] flex-col overflow-hidden rounded-2xl border border-[#34455a] bg-gradient-to-b from-[#151f2b] to-[#0c121b] p-5 transition-colors hover:border-primary-400/60">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-500/10 blur-2xl transition group-hover:bg-primary-500/20" />
                    <div className="relative flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-400/25 bg-primary-500/10 text-sm font-bold text-primary-300">0{index + 1}</span>
                      <span className="rounded-full border border-[#34455a] bg-[#0c121b]/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9ba9bc]">{option.suffix ? 'Por peça' : 'Projeto'}</span>
                    </div>
                    <h3 className="relative mt-5 text-xl font-bold text-white">{option.title}</h3>
                    {option.description && <p className="relative mt-2 text-sm leading-relaxed text-[#9ba9bc]">{option.description}</p>}
                    <div className="relative mt-auto border-t border-[#273548] pt-4">
                      {option.prefix && <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">{option.prefix}</p>}
                      <p className="mt-1 text-2xl font-bold text-primary-300">{formatPrice(option.price)}<span className="text-sm font-semibold text-primary-200/70">{option.suffix}</span></p>
                      <Link to={`/contato?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(`Olá, tenho interesse em ${option.title} do serviço de ${service.title}.`)}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-primary-300">Tenho interesse <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {service.plans && service.plans.length > 0 && (
          <section className="border-y border-[#273548] bg-[#101722]">
            <div className="container-custom py-12 sm:py-16">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Planos de marketing</p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Presença digital consistente em cada fase do negócio.</h2>
                <p className="mt-4 leading-relaxed text-[#9ba9bc]">Escolha o nível de estrutura, produção e acompanhamento ideal para o seu momento.</p>
              </div>
              <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
                {service.plans.map((plan, index) => (
                  <motion.article key={plan.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className={`relative flex flex-col rounded-2xl border p-5 ${plan.featured ? 'border-primary-400 bg-primary-500 text-[#0c121b] shadow-[0_18px_50px_rgba(250,204,21,0.14)]' : 'border-[#34455a] bg-gradient-to-b from-[#151f2b] to-[#0c121b] text-white'}`}>
                    {plan.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0c121b] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">Mais contratado</span>}
                    <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${plan.featured ? 'text-black/60' : 'text-primary-300'}`}>Plano</p>
                    <h3 className="mt-1 text-2xl font-bold">{plan.name}</h3>
                    <p className={`mt-2 text-sm font-bold uppercase tracking-wide ${plan.featured ? 'text-black/75' : 'text-primary-300'}`}>{plan.subtitle}</p>
                    <p className={`mt-5 min-h-[60px] text-sm leading-relaxed ${plan.featured ? 'text-black/75' : 'text-[#9ba9bc]'}`}>{plan.audience}</p>
                    <div className={`my-5 border-t ${plan.featured ? 'border-black/20' : 'border-[#34455a]'}`} />
                    <p className="text-xs font-bold uppercase tracking-[0.14em]">Inclui:</p>
                    <ul className="mt-4 flex-1 space-y-3">
                      {plan.features.map((feature) => <li key={feature} className={`flex gap-2 text-sm leading-snug ${plan.featured ? 'text-black/85' : 'text-[#d7e0ea]'}`}><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? 'text-black' : 'text-primary-300'}`} /><span>{feature}</span></li>)}
                    </ul>
                    <div className={`mt-6 border-t pt-5 ${plan.featured ? 'border-black/20' : 'border-[#34455a]'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${plan.featured ? 'text-black/60' : 'text-[#9ba9bc]'}`}>{plan.startingAt ? 'A partir de' : 'Investimento'}</p>
                      <p className="mt-1 text-3xl font-bold">{formatPrice(plan.price)}<span className="text-sm font-semibold opacity-70">/mês</span></p>
                      <Link to={`/contato?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(`Olá, tenho interesse no plano ${plan.name} de Marketing.`)}`} className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${plan.featured ? 'bg-[#0c121b] text-white hover:bg-black' : 'bg-primary-500 text-[#0c121b] hover:bg-primary-400'}`}>Quero este plano <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  </motion.article>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-[#9ba9bc]">* Investimento em mídia e desenvolvimento contratado separadamente.</p>
            </div>
          </section>
        )}

        <section className={`${service.options?.length || service.plans?.length ? '' : 'border-y border-[#273548] '}bg-[#101722]`}><div className="container-custom py-12 sm:py-16"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Como funciona</p><h2 className="mt-3 text-3xl font-bold">Direção antes da execução.</h2></div><div className="mt-8 grid gap-4 md:grid-cols-3">{service.process.map((step, index) => <div key={step.title} className="rounded-2xl border border-[#273548] bg-[#0c121b] p-6"><span className="text-sm font-bold text-primary-300">0{index + 1}</span><h3 className="mt-5 text-xl font-bold">{step.title}</h3><p className="mt-2 leading-relaxed text-[#9ba9bc]">{step.description}</p></div>)}</div></div></section>

        <section className="container-custom py-12 sm:py-16"><div className="rounded-3xl border border-primary-400/25 bg-primary-500/10 p-7 text-center sm:p-10"><Sparkles className="mx-auto h-7 w-7 text-primary-300" /><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold">Vamos desenhar a melhor próxima etapa para sua empresa?</h2><p className="mx-auto mt-3 max-w-xl text-[#d7e0ea]">Converse com a OrientoHub e entenda qual combinação de estratégia e execução faz sentido agora.</p><Link to={`/contato?service=${encodeURIComponent(service.title)}&message=${encodeURIComponent(`Olá, gostaria de conversar sobre ${service.title} e a melhor estratégia para meu negócio.`)}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400">Falar com a OrientoHub <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
    </>
  );
};

export default ServiceDetailPage;
