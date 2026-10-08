import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, Copy, Plus, RotateCcw, Trash2, TrendingUp } from 'lucide-react';
import { crm } from '../services/crm';
import type { Deal } from '../types/crm';
import { CustomSelect } from './CustomSelect';

type Line = { id: string; service: string; hours: number; rate: number | null };
type Config = { dealId: string; project: string; objective: string; hourlyRate: number; tools: number; partners: number; contingency: number; margin: number; tax: number; discount: number; months: number; lines: Line[] };
const services = ['Estratégia', 'Inovação', 'Marketing', 'Mídia paga', 'Google Meu Negócio', 'Design', 'Sistemas inteligentes', 'Marcas', 'Naming', 'Domínio', 'Sites', 'E-commerce'];
const initial: Config = { dealId: '', project: '', objective: '', hourlyRate: 180, tools: 0, partners: 0, contingency: 10, margin: 35, tax: 6, discount: 0, months: 1, lines: [{ id: 'initial', service: 'Marketing', hours: 20, rate: null }] };
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const safeNumber = (value: string) => Math.max(0, Number(value) || 0);

export const PricingCalculator = () => {
  const [config, setConfig] = useState<Config>(() => { try { return { ...initial, ...JSON.parse(localStorage.getItem('crm-pricing-calculator') || '{}') }; } catch { return initial; } });
  const [deals, setDeals] = useState<Deal[]>([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => { crm.listDeals().then(setDeals).catch(console.error); }, []);
  useEffect(() => { localStorage.setItem('crm-pricing-calculator', JSON.stringify(config)); }, [config]);
  const update = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((current) => ({ ...current, [key]: value }));
  const selectedDeal = deals.find((deal) => deal.id === config.dealId);
  const selectDeal = (id: string) => { const deal = deals.find((item) => item.id === id); setConfig((current) => ({ ...current, dealId: id, project: deal?.name || current.project, objective: deal?.next_step || current.objective })); };
  const updateLine = (id: string, changes: Partial<Line>) => update('lines', config.lines.map((line) => line.id === id ? { ...line, ...changes } : line));
  const addLine = () => update('lines', [...config.lines, { id: crypto.randomUUID(), service: services[0], hours: 1, rate: null }]);
  const removeLine = (id: string) => update('lines', config.lines.filter((line) => line.id !== id));
  const totals = useMemo(() => {
    const hours = config.lines.reduce((sum, line) => sum + line.hours, 0);
    const labor = config.lines.reduce((sum, line) => sum + line.hours * (line.rate ?? config.hourlyRate), 0);
    const direct = config.tools + config.partners;
    const contingency = (labor + direct) * config.contingency / 100;
    const cost = labor + direct + contingency;
    const denominator = 1 - (config.margin + config.tax) / 100;
    const list = denominator > 0 ? cost / denominator : 0;
    const monthly = list * (1 - config.discount / 100);
    const tax = monthly * config.tax / 100;
    const profit = monthly - tax - cost;
    return { hours, labor, direct, contingency, cost, list, monthly, tax, profit, total: monthly * config.months, effectiveRate: hours ? monthly / hours : 0, effectiveMargin: monthly ? profit / monthly * 100 : 0 };
  }, [config]);
  const copyProposal = async () => {
    const lines = config.lines.map((line) => `• ${line.service}: ${line.hours}h`).join('\n');
    await navigator.clipboard.writeText(`PROPOSTA ORIENTOHUB\n\nCliente: ${selectedDeal?.company || 'A definir'}\nProjeto: ${config.project || selectedDeal?.name || 'A definir'}\nObjetivo: ${config.objective || 'A definir'}\n\nSERVIÇOS\n${lines}\n\nPrazo: ${config.months} mês(es)\nInvestimento mensal: ${money(totals.monthly)}\nInvestimento total: ${money(totals.total)}\n\nEscopo construído sob medida, combinando direção estratégica e execução.`);
    setCopied(true); window.setTimeout(() => setCopied(false), 1700);
  };
  const reset = () => { if (window.confirm('Limpar os dados desta simulação?')) setConfig(initial); };
  const healthy = totals.effectiveMargin >= 20 && config.margin + config.tax < 100;

  return <div className="pricing-calculator">
    <header className="pricing-header"><div><p className="eyebrow">Composição de proposta</p><h2>Calculadora inteligente</h2><p>Construa o preço a partir do esforço real, custos e rentabilidade desejada.</p></div><div><button className="secondary" onClick={reset}><RotateCcw size={15} />Limpar</button><button className="primary" onClick={copyProposal}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Resumo copiado' : 'Copiar proposta'}</button></div></header>
    <div className="pricing-grid">
      <main className="pricing-form">
        <section className="pricing-section"><div className="pricing-section-title"><span>1</span><div><h3>Cliente e projeto</h3><p>Use uma negociação existente ou monte uma simulação livre.</p></div></div><div className="pricing-fields"><FieldSelect label="Negociação" value={config.dealId} onChange={selectDeal} options={deals.map((deal) => [deal.id, deal.company ? `${deal.company} · ${deal.name}` : deal.name])} empty="Simulação sem cliente" /><Field label="Nome do projeto" value={config.project} onChange={(value) => update('project', value)} /><label className="pricing-field wide">Objetivo<textarea value={config.objective} onChange={(event) => update('objective', event.target.value)} placeholder="Resultado esperado pelo cliente" /></label></div></section>
        <section className="pricing-section"><div className="pricing-section-title"><span>2</span><div><h3>Serviços e esforço</h3><p>Informe as horas mensais previstas para cada frente.</p></div></div><div className="pricing-lines">{config.lines.map((line) => <article key={line.id}><CustomSelect value={line.service} onChange={(service) => updateLine(line.id, { service })} options={services.map((service) => ({ value: service, label: service }))} /><label><span>Horas/mês</span><input type="number" min="0" value={line.hours} onChange={(event) => updateLine(line.id, { hours: safeNumber(event.target.value) })} /></label><label><span>Valor/hora específico</span><input type="number" min="0" placeholder={String(config.hourlyRate)} value={line.rate ?? ''} onChange={(event) => updateLine(line.id, { rate: event.target.value ? safeNumber(event.target.value) : null })} /></label><button onClick={() => removeLine(line.id)} disabled={config.lines.length === 1} aria-label="Remover serviço"><Trash2 size={16} /></button></article>)}</div><button className="pricing-add" onClick={addLine}><Plus size={15} />Adicionar serviço</button></section>
        <section className="pricing-section"><div className="pricing-section-title"><span>3</span><div><h3>Custos e estratégia</h3><p>Ajuste a estrutura financeira da proposta.</p></div></div><div className="pricing-fields financial"><NumberField label="Valor/hora padrão" value={config.hourlyRate} onChange={(value) => update('hourlyRate', value)} prefix="R$" /><NumberField label="Ferramentas" value={config.tools} onChange={(value) => update('tools', value)} prefix="R$" /><NumberField label="Parceiros" value={config.partners} onChange={(value) => update('partners', value)} prefix="R$" /><NumberField label="Contingência" value={config.contingency} onChange={(value) => update('contingency', value)} suffix="%" /><NumberField label="Margem desejada" value={config.margin} onChange={(value) => update('margin', value)} suffix="%" /><NumberField label="Impostos" value={config.tax} onChange={(value) => update('tax', value)} suffix="%" /><NumberField label="Desconto" value={config.discount} onChange={(value) => update('discount', value)} suffix="%" /><NumberField label="Duração" value={config.months} onChange={(value) => update('months', Math.max(1, value))} suffix="meses" /></div></section>
      </main>
      <aside className="pricing-results"><div className={`pricing-health ${healthy ? 'healthy' : 'warning'}`}>{healthy ? <TrendingUp /> : <AlertTriangle />}<div><span>{healthy ? 'Proposta saudável' : 'Revise a rentabilidade'}</span><strong>Margem efetiva: {totals.effectiveMargin.toFixed(1)}%</strong></div></div><Result label="Investimento mensal" value={money(totals.monthly)} featured /><Result label="Total do projeto" value={money(totals.total)} /><div className="result-divider" /><Result label="Horas mensais" value={`${totals.hours}h`} /><Result label="Custo de mão de obra" value={money(totals.labor)} /><Result label="Custos diretos" value={money(totals.direct)} /><Result label="Reserva de contingência" value={money(totals.contingency)} /><Result label="Custo total mensal" value={money(totals.cost)} /><Result label="Impostos estimados" value={money(totals.tax)} /><div className="result-divider" /><Result label="Lucro mensal estimado" value={money(totals.profit)} positive={totals.profit >= 0} /><Result label="Valor/hora efetivo" value={money(totals.effectiveRate)} /><small>Simulação gerencial. Confirme impostos e custos antes de enviar a proposta.</small></aside>
    </div>
  </div>;
};

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => <label className="pricing-field">{label}<input value={value} onChange={(event) => onChange(event.target.value)} /></label>;
const FieldSelect = ({ label, value, onChange, options, empty }: { label: string; value: string; onChange: (value: string) => void; options: string[][]; empty: string }) => <label className="pricing-field">{label}<CustomSelect value={value} onChange={onChange} placeholder={empty} options={[{ value: '', label: empty }, ...options.map(([id, text]) => ({ value: id, label: text }))]} /></label>;
const NumberField = ({ label, value, onChange, prefix, suffix }: { label: string; value: number; onChange: (value: number) => void; prefix?: string; suffix?: string }) => <label className="pricing-field">{label}<div>{prefix && <span>{prefix}</span>}<input type="number" min="0" value={value} onChange={(event) => onChange(safeNumber(event.target.value))} />{suffix && <span>{suffix}</span>}</div></label>;
const Result = ({ label, value, featured, positive }: { label: string; value: string; featured?: boolean; positive?: boolean }) => <div className={`pricing-result ${featured ? 'featured' : ''} ${positive === false ? 'negative' : ''}`}><span>{label}</span><strong>{value}</strong></div>;
