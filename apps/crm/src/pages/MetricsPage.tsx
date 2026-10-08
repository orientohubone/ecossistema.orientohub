import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarClock, DollarSign, Target, TrendingUp } from 'lucide-react';
import { crm } from '../services/crm';
import type { Deal, DealStage } from '../types/crm';
import { CustomSelect } from '../components/CustomSelect';

const stages: { id: DealStage; label: string; color: string }[] = [
  { id: 'novo', label: 'Sem contato', color: '#38bdf8' }, { id: 'qualificando', label: 'Contato feito', color: '#a78bfa' },
  { id: 'proposta', label: 'Proposta', color: '#fbbf24' }, { id: 'negociação', label: 'Negociação', color: '#fb923c' },
  { id: 'ganho', label: 'Ganhos', color: '#34d399' }, { id: 'perdido', label: 'Perdidos', color: '#94a3b8' },
];
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });
const dateKey = (value: string | Date) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };

export const MetricsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [source, setSource] = useState('all');
  const [measure, setMeasure] = useState<'count' | 'value'>('count');
  useEffect(() => { crm.listDeals().then(setDeals).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => deals.filter((deal) => { const created = dateKey(deal.created_at); return (!start || created >= start) && (!end || created <= end) && (source === 'all' || deal.source === source); }), [deals, start, end, source]);
  const data = useMemo(() => stages.map((stage) => { const items = filtered.filter((deal) => deal.stage === stage.id); return { ...stage, count: items.length, value: items.reduce((sum, deal) => sum + Number(deal.estimated_value || 0), 0), valued: items.filter((deal) => deal.estimated_value != null).length }; }), [filtered]);
  const won = data.find((item) => item.id === 'ganho')!;
  const lost = data.find((item) => item.id === 'perdido')!;
  const open = filtered.filter((deal) => !['ganho', 'perdido'].includes(deal.stage));
  const closed = won.count + lost.count;
  const progressStages = data.filter((item) => item.id !== 'perdido');
  const progressTotal = progressStages.reduce((sum, item) => sum + item[measure], 0);
  const progress = progressTotal ? progressStages.reduce((sum, item, index) => sum + item[measure] * index / (progressStages.length - 1), 0) / progressTotal : 0;
  const cards = [
    ['Oportunidades abertas', String(open.length), `${money.format(open.reduce((sum, deal) => sum + Number(deal.estimated_value || 0), 0))} em potencial`, Target],
    ['Vendas ganhas', String(won.count), `${money.format(won.value)} vendido`, TrendingUp],
    ['Taxa de ganho', closed ? percent.format(won.count / closed) : '—', `${closed} oportunidades encerradas`, BarChart3],
    ['Ticket médio', won.valued ? money.format(won.value / won.valued) : '—', 'Considera vendas com valor', DollarSign],
  ] as const;

  return <div className="metrics-page">
    <header className="page-header"><div><p className="eyebrow">Inteligência comercial</p><h1>Métricas</h1></div></header>
    <section className="metrics-filters"><label>Cadastro a partir de<input type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label><label>Cadastro até<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label><label>Origem<CustomSelect value={source} onChange={setSource} options={[{ value: 'all', label: 'Todas as origens' }, ...Array.from(new Set(deals.map((deal) => deal.source))).sort().map((item) => ({ value: item, label: item }))]} /></label><button className="secondary" onClick={() => { setStart(''); setEnd(''); setSource('all'); }}>Limpar filtros</button></section>
    {loading ? <MetricsLoading /> : <>
      <div className="metrics-cards">{cards.map(([label, value, detail, Icon]) => <article key={label}><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div><Icon /></article>)}</div>
      <section className="modern-funnel"><header><div><p className="eyebrow">Funil moderno</p><h2>Distribuição por etapa</h2></div><div>{(['count', 'value'] as const).map((item) => <button key={item} className={measure === item ? 'active' : ''} onClick={() => setMeasure(item)}>{item === 'count' ? 'Quantidade' : 'Valor estimado'}</button>)}</div></header>
        <div className="funnel-progress"><div><span>Avanço médio até ganhos</span><strong>{progressTotal ? percent.format(progress) : '—'}</strong></div><p>{measure === 'count' ? 'Ponderado pela quantidade de negociações' : 'Ponderado pelo valor estimado'}</p><div className="progress-track"><i style={{ transform: `scaleX(${progress})` }} /></div><footer><span>Sem contato · 0%</span><span>Ganhos · 100%</span></footer></div>
        <div className="funnel-stage-cards">{progressStages.map((item, index) => <article key={item.id} style={{ '--stage-color': item.color } as React.CSSProperties}><header><b>{index + 1}</b><strong>{item.label}</strong></header><p>{measure === 'count' ? item.count : money.format(item.value)}</p><small>{progressTotal ? percent.format(item[measure] / progressTotal) : '—'} da distribuição</small></article>)}</div>
        <div className="funnel-shape">{data.filter((item) => !['ganho', 'perdido'].includes(item.id)).map((item, index) => <article key={item.id} style={{ width: `${100 - index * 12}%`, '--stage-color': item.color } as React.CSSProperties}><div><strong>{item.label}</strong><span>{filtered.length ? percent.format(item.count / filtered.length) : '—'} do total</span></div><footer><b>{item.count} negociações</b><strong>{money.format(item.value)}</strong></footer></article>)}</div>
        <div className="outcome-cards"><article className="won"><span>Ganhos</span><strong>{won.count} · {money.format(won.value)}</strong></article><article className="lost"><span>Perdidos</span><strong>{lost.count} · {money.format(lost.value)}</strong></article></div>
      </section>
      <section className="followup-metrics"><header><CalendarClock /><div><h2>Acompanhamento das oportunidades</h2><p>Qualidade da agenda comercial atual.</p></div></header><div><Metric label="Retornos atrasados" value={open.filter((deal) => deal.next_contact_on && dateKey(deal.next_contact_on) < dateKey(new Date())).length} /><Metric label="Retornos para hoje" value={open.filter((deal) => deal.next_contact_on && dateKey(deal.next_contact_on) === dateKey(new Date())).length} /><Metric label="Sem retorno agendado" value={open.filter((deal) => !deal.next_contact_on).length} /></div></section>
    </>}
  </div>;
};

const Metric = ({ label, value }: { label: string; value: number }) => <article><span>{label}</span><strong>{value}</strong></article>;
const MetricsLoading = () => <div className="metrics-loading">{[1, 2, 3, 4].map((item) => <span key={item} className="skeleton-line" />)}</div>;
