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
        <div className="container-custom py-10 sm:py-14 lg:py-16">
          <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-[#FFF200]"><ArrowLeft className="h-4 w-4" />Voltar aos serviços</Link>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <BlackFridaySeal className="h-24 w-auto sm:h-32 lg:h-36" />
              <p className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]"><FileText className="h-4 w-4" />Campanha OrientoHub · 2026</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">Regulamento da <span className="text-[#FFF200]">Black Friday.</span></h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">Oferta, serviços participantes e prazo para garantir sua condição especial.</p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex max-w-full rounded-2xl bg-gradient-to-r from-[#b89b00] via-[#fff9a6] to-[#b89b00] p-px shadow-[0_10px_35px_rgba(0,0,0,0.45)]">
                <div className="inline-flex items-center gap-3 rounded-[15px] bg-gradient-to-br from-[#2a2a2a] via-[#080808] to-[#1b1b1b] px-4 py-3 sm:gap-4 sm:px-5">
                  <span className="text-left text-2xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-3xl">50% OFF<br /><span className="text-sm tracking-normal text-[#FFF200] sm:text-base">em diversos serviços</span></span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <div className="flex items-center gap-3 text-[#FFF200]"><CalendarDays className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-[0.18em]">Período de contratação</span></div>
                <p className="mt-3 text-2xl font-black sm:text-3xl">1º a 30 de novembro</p>
                <p className="mt-1 text-sm font-semibold text-white/55">Formalize até 30/11/2026, às 23h59 (horário de Brasília).</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container-custom py-9 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <article className="rounded-2xl border border-[#FFF200]/30 bg-gradient-to-br from-[#171600] to-[#0a0a0a] p-6 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF200] text-black"><CheckCircle2 className="h-6 w-6" /></div>
              <h2 className="mt-5 text-2xl font-black">A oferta</h2>
              <p className="mt-3 leading-relaxed text-white/70">São <strong className="font-black text-[#FFF200]">50% de desconto</strong> nos serviços e opções participantes sinalizados com o selo Black Friday nas respectivas páginas.</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Serviços participantes</h2>
              <div className="mt-4 flex flex-wrap gap-2">{participatingServices.map((service) => <span key={service} className="rounded-full border border-[#FFF200]/20 bg-[#FFF200]/[0.06] px-3 py-1.5 text-sm font-bold text-white/85">{service}</span>)}</div>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/55"><strong className="font-bold text-white/75">Não participantes:</strong> Estratégia, Inovação, Marketing, Design e Domínio. Custos externos, como verba de anúncios, tarifas de plataformas e taxas de terceiros, não recebem o desconto.</p>
            </article>
          </div>

          <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/35 p-5 sm:flex-row sm:items-center sm:p-6">
            <div><h2 className="text-lg font-black">Confira os valores promocionais</h2><p className="mt-1 text-sm text-white/55">O selo identifica os serviços e preços cobertos pelo regulamento.</p></div>
            <Link to="/servicos" className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFF200] px-5 py-3 text-sm font-black text-black transition hover:bg-white">Ver serviços <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default BlackFridayRegulationPage;
