import { CheckCircle2 } from 'lucide-react';
import type { ServiceCatalogItem } from '../../data/serviceCatalog';

type ProposalService = { service: ServiceCatalogItem; hours: number };

interface ProposalDocumentProps {
  clientName: string;
  projectName: string;
  objective: string;
  durationMonths: number;
  monthlyPrice: string;
  totalPrice: string;
  services: ProposalService[];
}

const ProposalDocument = ({ clientName, projectName, objective, durationMonths, monthlyPrice, totalPrice, services }: ProposalDocumentProps) => (
  <article className="proposal-document mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col overflow-hidden bg-white text-slate-900 shadow-2xl">
    <header className="bg-[#101722] px-7 py-7 text-white sm:px-10 sm:py-8">
      <div><img src="/orientohub.png" alt="OrientoHub" className="h-7 w-auto" /><p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Estratégia, execução e evolução contínua</p><div className="mt-8 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-300">Proposta de serviços</p><h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{projectName || 'Proposta personalizada'}</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">Uma combinação sob medida de direção estratégica e execução para o momento atual do seu negócio.</p></div></div>
    </header>

    <div className="flex flex-1 flex-col space-y-6 px-7 py-7 sm:px-10 sm:py-8">
      <section className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Preparada para</p><p className="mt-1 text-lg font-bold">{clientName || 'Cliente a definir'}</p></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Período estimado</p><p className="mt-1 text-lg font-bold">{durationMonths} {durationMonths === 1 ? 'mês' : 'meses'}</p></div></section>

      <section><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Objetivo</p><p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-700">{objective || 'Direcionar estratégia e execução de acordo com o momento atual do negócio, transformando prioridades em resultados consistentes.'}</p></section>

      <section><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Escopo da parceria</p><h2 className="mt-1 text-xl font-bold">O que será construído</h2></div><p className="hidden text-xs text-slate-500 sm:block">Direção antes da execução.</p></div><div className="mt-4 space-y-5">{services.map(({ service, hours }, index) => <article key={service.slug} className="border-t border-slate-200 pt-4"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-[#101722]">{index + 1}</span><h3 className="text-lg font-bold">{service.title}</h3></div><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{service.description}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{hours}h/mês</span></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Entregáveis</p><ul className="mt-2 space-y-1.5">{service.deliverables.map((item) => <li key={item} className="flex gap-1.5 text-xs leading-relaxed text-slate-700"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-600" />{item}</li>)}</ul></div><div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Como funciona</p><ol className="mt-2 space-y-1.5">{service.process.map((step, stepIndex) => <li key={step.title} className="text-xs leading-relaxed text-slate-700"><span className="font-bold text-slate-900">{stepIndex + 1}. {step.title}:</span> {step.description}</li>)}</ol></div></div></article>)}</div></section>

      <section className="rounded-2xl bg-[#101722] p-5 text-white sm:p-6"><div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-300">Investimento da parceria</p><p className="mt-2 text-3xl font-bold">{monthlyPrice}<span className="ml-1 text-base font-medium text-slate-300">/mês</span></p><p className="mt-2 text-xs leading-relaxed text-slate-300">Acompanhamento orientado por prioridades, com evolução contínua do escopo ao longo da parceria.</p></div><div className="rounded-xl border border-white/15 bg-white/5 p-3 sm:text-right"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Total estimado do período</p><p className="mt-1 text-xl font-bold text-primary-300">{totalPrice}</p><p className="mt-1 text-[10px] text-slate-400">{durationMonths} {durationMonths === 1 ? 'mês' : 'meses'} de projeto</p></div></div></section>

      <footer className="mt-auto border-t border-slate-200 pt-6 text-sm text-slate-500"><p className="font-semibold text-slate-700">OrientoHub</p><p className="mt-1">Estratégia hoje. Resultados sempre.</p></footer>
    </div>
  </article>
);

export default ProposalDocument;
