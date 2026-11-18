import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, FileText } from 'lucide-react';
import BlackFridaySeal from '../bf-2026/BlackFridaySeal';

const participatingServices = ['Mídia Paga', 'Google Meu Negócio', 'Sistemas Inteligentes', 'Marcas', 'Naming', 'Sites', 'E-commerce'];

const BlackFridayRegulationPage = () => (
  <>
    <Helmet>
      <title>Regulamento Black Friday 2026 | OrientoHub</title>
      <meta name="description" content="Confira as condições da campanha Black Friday 2026 da OrientoHub e o prazo para contratar com 50% OFF." />
    </Helmet>

    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <header className="border-b border-white/10">
        <div className="container-custom py-6 sm:py-14 lg:py-16">
          <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Voltar aos serviços</Link>

          <div className="mt-5 grid items-center gap-5 lg:mt-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <div className="flex items-center gap-3 sm:gap-5 lg:block">
                <BlackFridaySeal className="h-14 w-auto shrink-0 sm:h-20 lg:h-32" />
                <div className="min-w-0 lg:mt-6">
                  <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#FFF200] sm:text-xs sm:tracking-[0.22em]"><FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Campanha OrientoHub · 2026</p>
                  <h1 className="mt-1.5 text-[clamp(1.2rem,5.8vw,2rem)] font-black leading-[1.02] tracking-[-0.045em] sm:mt-3 sm:text-4xl lg:text-6xl">Regulamento da <span className="text-[#FFF200]">Black Friday.</span></h1>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base lg:mt-4 lg:text-lg">Oferta, serviços participantes e prazo para garantir sua condição especial.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1 lg:gap-4">
              <div className="rounded-2xl bg-gradient-to-r from-[#b89b00] via-[#fff9a6] to-[#b89b00] p-px shadow-[0_10px_35px_rgba(0,0,0,0.3)]">
                <div className="flex h-full min-h-[94px] flex-col justify-center rounded-[15px] bg-gradient-to-br from-[#2a2a2a] via-[#080808] to-[#1b1b1b] px-3 py-3 sm:px-4 lg:min-h-0 lg:px-5">
                  <span className="text-left text-xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-2xl lg:text-3xl">50% OFF</span>
                  <span className="mt-1 text-left text-[10px] font-semibold leading-snug text-[#FFF200] sm:text-xs lg:text-base">em diversos serviços</span>
                </div>
              </div>
              <div className="flex min-h-[94px] flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:p-4 lg:min-h-0 lg:p-6">
                <div className="flex items-center gap-1.5 text-[#FFF200] sm:gap-2"><CalendarDays className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /><span className="text-[8px] font-black uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.16em] lg:text-xs lg:tracking-[0.18em]">Período de contratação</span></div>
                <p className="mt-2 text-sm font-black leading-tight sm:text-lg lg:mt-3 lg:text-3xl">1º a 30 de novembro</p>
                <p className="mt-1 text-[9px] leading-snug text-white/55 sm:text-[11px] lg:text-sm lg:font-semibold">Formalize até 30/11/2026, às 23h59 (horário de Brasília).</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container-custom py-9 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="hidden rounded-2xl border border-[#FFF200]/30 bg-gradient-to-br from-[#171600] to-[#0a0a0a] p-6 sm:p-8 lg:block">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF200] text-black"><CheckCircle2 className="h-6 w-6" /></div>
              <h2 className="mt-5 text-2xl font-black">A oferta</h2>
              <p className="mt-3 leading-relaxed text-white/70">São <strong className="font-black text-[#FFF200]">50% de desconto</strong> nos serviços e opções participantes sinalizados com o selo Black Friday nas respectivas páginas.</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-6 lg:p-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FFF200] sm:text-xs sm:tracking-[0.18em]">Serviços participantes</h2>
              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">{participatingServices.map((service) => <span key={service} className="rounded-full border border-[#FFF200]/20 bg-[#FFF200]/[0.06] px-2.5 py-1 text-xs font-bold text-white/85 sm:px-3 sm:py-1.5 sm:text-sm">{service}</span>)}</div>
              <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/55 sm:mt-5 sm:pt-4 sm:text-sm"><strong className="font-bold text-white/75">Não participantes:</strong> Estratégia, Inovação, Marketing, Design e Domínio. Custos externos, como verba de anúncios, tarifas de plataformas e taxas de terceiros, não recebem o desconto.</p>
            </article>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 p-4 sm:mt-5 sm:p-6">
            <div className="min-w-0"><h2 className="text-sm font-black sm:text-lg">Confira os valores promocionais</h2><p className="mt-1 text-[11px] leading-snug text-white/55 sm:text-sm">O selo identifica os serviços e preços cobertos pelo regulamento.</p></div>
            <Link to="/servicos" className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FFF200] px-3 py-2.5 text-xs font-black text-black transition hover:bg-white sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"><span className="sm:hidden">Ofertas</span><span className="hidden sm:inline">Ver serviços</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" /></Link>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default BlackFridayRegulationPage;
