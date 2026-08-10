import { useEffect, useMemo, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Calculator, Clock3, Copy, Download, FileText, Plus, ReceiptText, Trash2 } from 'lucide-react';
import { serviceCatalog } from '../../data/serviceCatalog';
import ProposalDocument from './ProposalDocument';

type LineItem = { id: string; serviceSlug: string; hours: number; rate: number | null };
type CalculatorState = {
  hourlyRate: number;
  toolsCost: number;
  partnersCost: number;
  contingency: number;
  margin: number;
  tax: number;
  discount: number;
  durationMonths: number;
  clientName: string;
  projectName: string;
  objective: string;
  lines: LineItem[];
};

const initialState: CalculatorState = {
  hourlyRate: 180, toolsCost: 0, partnersCost: 0, contingency: 10, margin: 35, tax: 6, discount: 0, durationMonths: 1, clientName: '', projectName: '', objective: '',
  lines: [{ id: 'marketing-inicial', serviceSlug: 'marketing', hours: 20, rate: null }],
};

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const numberOrZero = (value: string) => Math.max(0, Number(value) || 0);

export const PricingCalculator = () => {
  const [config, setConfig] = useState<CalculatorState>(() => {
    try { return { ...initialState, ...JSON.parse(localStorage.getItem('orientohub-pricing-calculator') || '{}') }; } catch { return initialState; }
  });
  const [copied, setCopied] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('orientohub-pricing-calculator', JSON.stringify(config)); }, [config]);

  const totals = useMemo(() => {
    const labor = config.lines.reduce((sum, line) => sum + line.hours * (line.rate ?? config.hourlyRate), 0);
    const hours = config.lines.reduce((sum, line) => sum + line.hours, 0);
    const directCost = config.toolsCost + config.partnersCost;
    const contingencyValue = (labor + directCost) * (config.contingency / 100);
    const costBase = labor + directCost + contingencyValue;
    const denominator = 1 - ((config.margin + config.tax) / 100);
    const listPrice = denominator > 0 ? costBase / denominator : 0;
    const discountValue = listPrice * (config.discount / 100);
    const monthlyPrice = listPrice - discountValue;
    const taxValue = monthlyPrice * (config.tax / 100);
    const profit = monthlyPrice - taxValue - costBase;
    const effectiveHourly = hours ? monthlyPrice / hours : 0;
    const totalProject = monthlyPrice * config.durationMonths;
    const totalProfit = profit * config.durationMonths;
    return { labor, hours, directCost, contingencyValue, costBase, listPrice, discountValue, monthlyPrice, taxValue, profit, effectiveHourly, totalProject, totalProfit };
  }, [config]);

  const selectedServices = useMemo(() => {
    const grouped = new Map<string, { hours: number; rate: number | null }>();
    config.lines.forEach((line) => {
      const current = grouped.get(line.serviceSlug) || { hours: 0, rate: line.rate };
      grouped.set(line.serviceSlug, { hours: current.hours + line.hours, rate: line.rate ?? current.rate });
    });
    return [...grouped.entries()].map(([slug, details]) => ({ service: serviceCatalog.find((item) => item.slug === slug)!, ...details })).filter((item) => Boolean(item.service));
  }, [config.lines]);

  const update = <K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) => setConfig((current) => ({ ...current, [key]: value }));
  const updateLine = (id: string, updates: Partial<LineItem>) => update('lines', config.lines.map((line) => line.id === id ? { ...line, ...updates } : line));
  const addLine = () => update('lines', [...config.lines, { id: crypto.randomUUID(), serviceSlug: serviceCatalog[0].slug, hours: 1, rate: null }]);
  const removeLine = (id: string) => update('lines', config.lines.filter((line) => line.id !== id));

  const copyProposal = async () => {
    const serviceSummary = selectedServices.map(({ service, hours }) => `• ${service.title} — ${hours}h/mês\n  Entregáveis: ${service.deliverables.join('; ')}`).join('\n');
    await navigator.clipboard.writeText(`PROPOSTA ORIENTOHUB\n\nCliente: ${config.clientName || 'A definir'}\nProjeto: ${config.projectName || 'A definir'}\nObjetivo: ${config.objective || 'A definir'}\n\nSERVIÇOS\n${serviceSummary}\n\nPrazo estimado: ${config.durationMonths} mês(es)\nInvestimento mensal: ${money(totals.monthlyPrice)}\nInvestimento total estimado: ${money(totals.totalProject)}\n\nEscopo construído sob medida, combinando direção estratégica e execução.`);
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  const savePdf = async () => {
    if (!proposalRef.current || isSavingPdf) return;
    setIsSavingPdf(true);
    try {
      const canvas = await html2canvas(proposalRef.current, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
        logging: false,
      });
      const snapshotPdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const snapshotPageWidth = 210;
      const snapshotPageHeight = 297;
      const naturalHeight = (canvas.height * snapshotPageWidth) / canvas.width;
      const scale = Math.min(1, snapshotPageHeight / naturalHeight);
      const imageWidth = snapshotPageWidth * scale;
      const imageHeight = naturalHeight * scale;
      const snapshotX = (snapshotPageWidth - imageWidth) / 2;
      const snapshotY = (snapshotPageHeight - imageHeight) / 2;
      snapshotPdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', snapshotX, snapshotY, imageWidth, imageHeight, undefined, 'FAST');
      const snapshotFileName = (config.projectName || 'proposta-orientohub').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
      snapshotPdf.save(`${snapshotFileName.replace(/(^-|-$)/g, '') || 'proposta-orientohub'}.pdf`);
      return;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      const navy = '#101722';
      const yellow = '#eab308';
      let y = 16;

      let logoData: string | null = null;
      try {
        const response = await fetch('/orientohub.png');
        const blob = await response.blob();
        logoData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch {
        logoData = null;
      }

      pdf.setFillColor(navy);
      pdf.rect(0, 0, pageWidth, 48, 'F');
      if (logoData) {
        pdf.addImage(logoData, 'PNG', margin, 10, 49, 10);
      } else {
        pdf.setTextColor(yellow);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.text('ORIENTOHUB', margin, 15);
      }
      pdf.setTextColor('#d7e0ea');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.text('ESTRATÉGIA, EXECUÇÃO E EVOLUÇÃO CONTÍNUA', margin, 20);
      pdf.setTextColor('#facc15');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('PROPOSTA DE SERVIÇOS', margin, 29);
      pdf.setTextColor('#ffffff');
      pdf.setFontSize(20);
      pdf.text(config.projectName || 'Proposta personalizada', margin, 39, { maxWidth: 165 });
      y = 59;

      const writeLabel = (label: string, value: string, x: number, top: number, width: number) => {
        pdf.setTextColor('#64748b'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.5); pdf.text(label.toUpperCase(), x, top);
        pdf.setTextColor('#172033'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.text(pdf.splitTextToSize(value, width), x, top + 5);
      };
      writeLabel('Preparada para', config.clientName || 'Cliente a definir', margin, y, 80);
      writeLabel('Período estimado', `${config.durationMonths} ${config.durationMonths === 1 ? 'mês' : 'meses'}`, 112, y, 70);
      y += 19;
      pdf.setDrawColor('#e2e8f0'); pdf.line(margin, y, pageWidth - margin, y); y += 9;

      pdf.setTextColor('#b45309'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.5); pdf.text('OBJETIVO', margin, y);
      y += 5;
      pdf.setTextColor('#334155'); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8.5);
      const objective = pdf.splitTextToSize(config.objective || 'Direcionar estratégia e execução de acordo com o momento atual do negócio, transformando prioridades em resultados consistentes.', contentWidth);
      pdf.text(objective.slice(0, 3), margin, y); y += Math.min(objective.length, 3) * 4.1 + 7;

      pdf.setTextColor('#b45309'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.5); pdf.text('ESCOPO DA PARCERIA', margin, y);
      y += 5;
      pdf.setTextColor('#172033'); pdf.setFontSize(12); pdf.text('O que será construído', margin, y); y += 7;

      selectedServices.forEach(({ service, hours }, index) => {
        pdf.setDrawColor('#e2e8f0'); pdf.line(margin, y, pageWidth - margin, y); y += 6;
        pdf.setFillColor(yellow); pdf.circle(margin + 3, y - 1, 3, 'F');
        pdf.setTextColor(navy); pdf.setFontSize(6.5); pdf.text(String(index + 1), margin + 2.05, y + 1.2);
        pdf.setTextColor('#172033'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.text(service.title, margin + 9, y + 1);
        pdf.setTextColor('#475569'); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.text(`${hours}h/mês`, pageWidth - margin, y + 1, { align: 'right' });
        y += 7;
        pdf.setTextColor('#475569'); pdf.setFontSize(7.4); pdf.text(pdf.splitTextToSize(service.description, contentWidth), margin + 9, y); y += 7;
        pdf.setFillColor('#f8fafc'); pdf.roundedRect(margin + 9, y, 83, 27, 2, 2, 'F');
        pdf.setDrawColor('#e2e8f0'); pdf.roundedRect(112, y, 83, 27, 2, 2, 'S');
        pdf.setTextColor('#64748b'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(5.8); pdf.text('ENTREGÁVEIS', margin + 13, y + 5); pdf.text('COMO FUNCIONA', 116, y + 5);
        pdf.setTextColor('#334155'); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.3);
        const deliverables = service.deliverables.slice(0, 4).map((item) => `• ${item}`);
        pdf.text(deliverables, margin + 13, y + 10, { maxWidth: 74 });
        const process = service.process.map((step, stepIndex) => `${stepIndex + 1}. ${step.title}`).join('  ›  ');
        pdf.text(pdf.splitTextToSize(process, 74), 116, y + 10);
        y += 33;
      });

      const investmentHeight = 30;
      if (y + investmentHeight > 280) y = 250;
      pdf.setFillColor(navy); pdf.roundedRect(margin, y, contentWidth, investmentHeight, 3, 3, 'F');
      pdf.setTextColor('#facc15'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6.5); pdf.text('INVESTIMENTO DA PARCERIA', margin + 6, y + 8);
      pdf.setTextColor('#ffffff'); pdf.setFontSize(16); pdf.text(`${totals.monthlyPrice ? money(totals.monthlyPrice) : money(0)}/mês`, margin + 6, y + 18);
      pdf.setTextColor('#cbd5e1'); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5); pdf.text('Acompanhamento orientado por prioridades e evolução contínua.', margin + 6, y + 24);
      pdf.setDrawColor('#475569'); pdf.roundedRect(137, y + 6, 53, 18, 2, 2, 'S');
      pdf.setTextColor('#94a3b8'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(5.5); pdf.text('TOTAL DO PERÍODO', 163.5, y + 11, { align: 'center' });
      pdf.setTextColor('#facc15'); pdf.setFontSize(10); pdf.text(money(totals.totalProject), 163.5, y + 17, { align: 'center' });
      pdf.setTextColor('#94a3b8'); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(5.5); pdf.text(`${config.durationMonths} ${config.durationMonths === 1 ? 'mês' : 'meses'} de projeto`, 163.5, y + 21, { align: 'center' });

      pdf.setTextColor('#64748b'); pdf.setFontSize(6.5); pdf.text('OrientoHub', margin, 288); pdf.text('Estratégia hoje. Resultados sempre.', margin, 292);
      const fileName = (config.projectName || 'proposta-orientohub').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
      pdf.save(`${fileName.replace(/(^-|-$)/g, '') || 'proposta-orientohub'}.pdf`);
    } finally {
      setIsSavingPdf(false);
    }
  };

  const fieldClass = 'mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

  return <div className="space-y-6">
    <div className="rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Composição de proposta</p><h3 className="text-xl font-bold text-white">Calculadora de precificação</h3><p className="mt-1 max-w-2xl text-sm text-[#9ba9bc]">Monte o valor a partir do esforço real, custos e rentabilidade desejada — sem transformar a OrientoHub em uma agência de pacotes.</p></div><button onClick={copyProposal} className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-400/25 bg-primary-500/10 px-4 py-2.5 text-sm font-bold text-primary-200 transition hover:bg-primary-500/20"><Copy className="h-4 w-4" />{copied ? 'Resumo copiado' : 'Copiar resumo'}</button></div>
      <div className="mt-6 overflow-hidden rounded-xl border border-[#273548]"><div className="grid grid-cols-[minmax(145px,1fr)_92px_110px_42px] gap-3 border-b border-[#273548] bg-[#151f2b] px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#9ba9bc]"><span>Serviço</span><span>Horas/mês</span><span>R$/hora</span><span /></div><div className="divide-y divide-[#273548]">{config.lines.map((line) => <div key={line.id} className="grid grid-cols-[minmax(145px,1fr)_92px_110px_42px] items-center gap-3 bg-[#101722] px-3 py-3"><select value={line.serviceSlug} onChange={(event) => updateLine(line.id, { serviceSlug: event.target.value })} className="rounded-lg border border-[#34455a] bg-[#0c121b] px-2.5 py-2 text-sm text-white outline-none focus:border-primary-500">{serviceCatalog.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}</select><input aria-label="Horas mensais estimadas" type="number" min="0" value={line.hours} onChange={(event) => updateLine(line.id, { hours: numberOrZero(event.target.value) })} className="rounded-lg border border-[#34455a] bg-[#0c121b] px-2.5 py-2 text-sm text-white outline-none focus:border-primary-500" /><input aria-label="Valor hora específico" type="number" min="0" placeholder={`${config.hourlyRate}`} value={line.rate ?? ''} onChange={(event) => updateLine(line.id, { rate: event.target.value ? numberOrZero(event.target.value) : null })} className="rounded-lg border border-[#34455a] bg-[#0c121b] px-2.5 py-2 text-sm text-white outline-none focus:border-primary-500" /><button onClick={() => removeLine(line.id)} disabled={config.lines.length === 1} className="rounded-lg p-2 text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Remover serviço"><Trash2 className="h-4 w-4" /></button></div>)}</div><button onClick={addLine} className="flex w-full items-center justify-center gap-2 bg-[#151f2b] px-4 py-3 text-sm font-semibold text-primary-300 transition hover:bg-primary-500/10"><Plus className="h-4 w-4" />Adicionar serviço ao projeto</button></div>
      <div className="mt-5 grid gap-3 rounded-xl border border-[#273548] bg-[#151f2b] p-4 md:grid-cols-2"><label className="text-sm font-medium text-[#d7e0ea]">Cliente<input spellCheck={false} value={config.clientName} onChange={(event) => update('clientName', event.target.value)} className={fieldClass} placeholder="Nome da empresa ou responsável" /></label><label className="text-sm font-medium text-[#d7e0ea]">Nome do projeto<input spellCheck={false} value={config.projectName} onChange={(event) => update('projectName', event.target.value)} className={fieldClass} placeholder="Ex.: Direção de marketing" /></label><label className="text-sm font-medium text-[#d7e0ea] md:col-span-2">Objetivo da proposta<textarea spellCheck={false} value={config.objective} onChange={(event) => update('objective', event.target.value)} className={`${fieldClass} resize-y`} rows={2} placeholder="Qual resultado esta combinação de serviços deve ajudar a alcançar?" /></label></div>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6"><div className="rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6"><div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary-300" /><h4 className="font-bold text-white">Esforço e custos mensais</h4></div><p className="mt-1 text-sm text-[#9ba9bc]">Os valores abaixo representam a operação de cada mês da recorrência.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-[#d7e0ea]">Valor hora base<input type="number" min="0" value={config.hourlyRate} onChange={(event) => update('hourlyRate', numberOrZero(event.target.value))} className={fieldClass} /></label><label className="text-sm font-medium text-[#d7e0ea]">Duração estimada (meses)<input type="number" min="1" value={config.durationMonths} onChange={(event) => update('durationMonths', Math.max(1, numberOrZero(event.target.value)))} className={fieldClass} /></label><label className="text-sm font-medium text-[#d7e0ea]">Ferramentas e licenças/mês<input type="number" min="0" value={config.toolsCost} onChange={(event) => update('toolsCost', numberOrZero(event.target.value))} className={fieldClass} /></label><label className="text-sm font-medium text-[#d7e0ea]">Parceiros e fornecedores/mês<input type="number" min="0" value={config.partnersCost} onChange={(event) => update('partnersCost', numberOrZero(event.target.value))} className={fieldClass} /></label></div></div><div className="rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6"><div className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-primary-300" /><h4 className="font-bold text-white">Proteção de margem</h4></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-[#d7e0ea]">Reserva para risco (%)<input type="number" min="0" value={config.contingency} onChange={(event) => update('contingency', numberOrZero(event.target.value))} className={fieldClass} /></label><label className="text-sm font-medium text-[#d7e0ea]">Margem desejada (%)<input type="number" min="0" max="90" value={config.margin} onChange={(event) => update('margin', numberOrZero(event.target.value))} className={fieldClass} /></label><label className="text-sm font-medium text-[#d7e0ea]">Impostos previstos (%)<input type="number" min="0" max="90" value={config.tax} onChange={(event) => update('tax', numberOrZero(event.target.value))} className={fieldClass} /></label><label className="text-sm font-medium text-[#d7e0ea]">Desconto comercial (%)<input type="number" min="0" max="100" value={config.discount} onChange={(event) => update('discount', numberOrZero(event.target.value))} className={fieldClass} /></label></div></div></div>
      <aside className="rounded-2xl border border-primary-400/25 bg-primary-500/10 p-5 md:p-6"><div className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary-300" /><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Investimento mensal recomendado</p></div><p className="mt-3 text-4xl font-bold text-white">{money(totals.monthlyPrice)}<span className="ml-1 text-lg text-primary-100/70">/mês</span></p><p className="mt-1 text-sm text-primary-100/75">Total estimado para {config.durationMonths} mês(es): <strong>{money(totals.totalProject)}</strong></p><div className="mt-6 space-y-3 border-y border-primary-400/20 py-5 text-sm"><div className="flex justify-between gap-4 text-[#d7e0ea]"><span>{totals.hours}h de esforço por mês</span><strong>{money(totals.labor)}</strong></div><div className="flex justify-between gap-4 text-[#d7e0ea]"><span>Custos diretos/mês</span><strong>{money(totals.directCost)}</strong></div><div className="flex justify-between gap-4 text-[#d7e0ea]"><span>Reserva de risco/mês</span><strong>{money(totals.contingencyValue)}</strong></div><div className="flex justify-between gap-4 text-[#d7e0ea]"><span>Preço de tabela/mês</span><strong>{money(totals.listPrice)}</strong></div>{totals.discountValue > 0 && <div className="flex justify-between gap-4 text-amber-200"><span>Desconto mensal</span><strong>-{money(totals.discountValue)}</strong></div>}</div><div className="mt-5 space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-primary-100/75">Lucro após imposto/mês</span><span className={`font-bold ${totals.profit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{money(totals.profit)}</span></div><div className="flex items-center justify-between"><span className="text-sm text-primary-100/75">Lucro estimado no período</span><span className={`font-bold ${totals.totalProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{money(totals.totalProfit)}</span></div><div className="flex items-center justify-between"><span className="text-sm text-primary-100/75">Hora efetiva vendida</span><span className="font-bold text-white">{money(totals.effectiveHourly)}</span></div></div><p className="mt-6 rounded-xl border border-primary-400/20 bg-[#0c121b]/35 p-3 text-xs leading-relaxed text-primary-100/75">O preço de tabela considera custos, reserva, margem e impostos mensais. O desconto é aplicado depois para você enxergar seu impacto real na rentabilidade.</p></aside>
    </div>

    <section className="rounded-2xl border border-[#273548] bg-[#101722] p-5 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Escopo automático</p><h4 className="mt-1 font-bold text-white">Entregáveis da combinação selecionada</h4><p className="mt-1 text-sm text-[#9ba9bc]">A proposta puxa os entregáveis e o processo de cada serviço diretamente do catálogo.</p></div><button onClick={() => setShowProposal(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400"><FileText className="h-4 w-4" />Gerar proposta</button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{selectedServices.map(({ service, hours }) => <div key={service.slug} className="rounded-xl border border-[#273548] bg-[#151f2b] p-4"><div className="flex items-center justify-between gap-3"><h5 className="font-semibold text-white">{service.title}</h5><span className="text-xs font-medium text-primary-300">{hours}h/mês</span></div><ul className="mt-3 space-y-1.5 text-sm text-[#9ba9bc]">{service.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2"><span className="text-primary-300">•</span>{deliverable}</li>)}</ul></div>)}</div>
    </section>

    {showProposal && <section className="pricing-proposal-print rounded-3xl border border-primary-400/25 bg-[#101722] p-6 md:p-10"><div className="mb-5 flex items-center justify-between gap-3 print:hidden"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Prévia da proposta</p><p className="mt-1 text-sm text-[#9ba9bc]">Revise o documento antes de salvar.</p></div><div className="flex gap-2"><button onClick={() => setShowProposal(false)} className="rounded-xl border border-[#34455a] px-3 py-2 text-sm font-semibold text-[#d7e0ea] hover:bg-[#151f2b]">Fechar</button><button disabled={isSavingPdf} onClick={savePdf} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-3 py-2 text-sm font-bold text-[#0c121b] disabled:opacity-60"><Download className="h-4 w-4" />{isSavingPdf ? 'Gerando PDF...' : 'Salvar PDF'}</button></div></div><div ref={proposalRef} className="mx-auto w-full max-w-[210mm]"><ProposalDocument clientName={config.clientName} projectName={config.projectName} objective={config.objective} durationMonths={config.durationMonths} monthlyPrice={money(totals.monthlyPrice)} totalPrice={money(totals.totalProject)} services={selectedServices} /></div></section>}
  </div>;
};
