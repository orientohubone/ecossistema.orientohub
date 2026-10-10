import { Lightbulb, Target } from 'lucide-react';

const comparisonRows = [
  ['Define prioridades e direcionamento', 'Investiga oportunidades e hipóteses'],
  ['Organiza decisões e planos táticos', 'Desenha experimentos e protótipos'],
  ['Busca clareza para executar', 'Busca evidências para decidir'],
  ['Entrega um plano estratégico', 'Entrega aprendizados e um plano de evolução'],
];

const StrategyInnovationComparison = () => (
  <section className="relative z-10 border-y border-white/10 bg-black/55">
    <div className="container-custom py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FFF200]">Papéis complementares</p>
        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">O ponto que diferencia Inovação de Estratégia.</h2>
        <p className="mt-5 text-base leading-relaxed text-white/50 sm:text-lg">Cada serviço responde a uma necessidade diferente do negócio. Entender esse limite evita sobreposição e melhora a escolha do próximo movimento.</p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gray-900/75 shadow-2xl shadow-black/20">
        <div className="grid grid-cols-2 border-b border-white/10">
          <div className="flex items-center gap-3 border-r border-white/10 bg-[#FFF200]/[0.06] p-4 sm:p-6"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF200] text-black"><Target className="h-4 w-4" /></span><div><span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">Direção</span><h3 className="text-sm font-black text-white sm:text-lg">Estratégia</h3></div></div>
          <div className="flex items-center gap-3 bg-[#FFF200]/[0.06] p-4 sm:p-6"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#FFF200]/40 bg-[#FFF200]/10 text-[#FFF200]"><Lightbulb className="h-4 w-4" /></span><div><span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">Descoberta</span><h3 className="text-sm font-black text-white sm:text-lg">Inovação</h3></div></div>
        </div>
        <div>{comparisonRows.map(([strategy, innovation], index) => <div key={strategy} className="grid grid-cols-2 border-b border-white/[0.07] last:border-0">
          <div className="flex gap-3 border-r border-white/[0.07] p-4 text-xs font-semibold leading-relaxed text-white/75 sm:p-6 sm:text-base"><span className="mt-0.5 text-[10px] font-black text-[#FFF200]">0{index + 1}</span><span>{strategy}</span></div>
          <div className="flex gap-3 p-4 text-xs font-semibold leading-relaxed text-white/75 sm:p-6 sm:text-base"><span className="mt-0.5 text-[10px] font-black text-[#FFF200]">0{index + 1}</span><span>{innovation}</span></div>
        </div>)}</div>
      </div>

      <p className="mt-6 border-l-2 border-[#FFF200] pl-4 text-sm font-semibold leading-relaxed text-white/65 sm:text-base">Essa distinção é importante para evitar sobreposição comercial entre os serviços.</p>
    </div>
  </section>
);

export default StrategyInnovationComparison;
