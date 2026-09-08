import { useMemo, useState } from 'react';
import type { CrmClient } from '../../services/crmService';

const stages = [
  { id: 'novo', label: 'Novos', color: '#38bdf8' },
  { id: 'qualificando', label: 'Qualificando', color: '#a78bfa' },
  { id: 'proposta', label: 'Proposta', color: '#fbbf24' },
  { id: 'negociação', label: 'Negociação', color: '#fb923c' },
  { id: 'ganho', label: 'Ganhos', color: '#34d399' },
  { id: 'perdido', label: 'Perdidos', color: '#94a3b8' },
];
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 });
const valueOf = (client: CrmClient) => {
  const value = Number(client.estimated_value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};
const hasValue = (client: CrmClient) => client.estimated_value != null && Number.isFinite(Number(client.estimated_value)) && Number(client.estimated_value) >= 0;
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const panel = 'rounded-2xl border border-[#273548] bg-[#101722] p-4 sm:p-5';
const input = 'mt-1 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2 text-sm text-white';

export const CrmIndicators = ({ clients }: { clients: CrmClient[] }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [source, setSource] = useState('all');
  const [metric, setMetric] = useState<'count' | 'value'>('count');
  const today = dateKey(new Date());
  const invalidRange = Boolean(start && end && start > end);
  const filtered = useMemo(() => clients.filter((client) => {
    const created = dateKey(new Date(client.created_at));
    return (!start || created >= start) && (!end || created <= end) && (source === 'all' || client.source === source);
  }), [clients, start, end, source]);
  const data = useMemo(() => stages.map((stage) => {
    const items = filtered.filter((client) => client.stage === stage.id);
    const valued = items.filter(hasValue);
    return { ...stage, count: items.length, value: items.reduce((sum, client) => sum + valueOf(client), 0), valued: valued.length };
  }), [filtered]);
  const won = data.find((stage) => stage.id === 'ganho')!;
  const lost = data.find((stage) => stage.id === 'perdido')!;
  const open = filtered.filter((client) => client.stage !== 'ganho' && client.stage !== 'perdido');
  const closed = won.count + lost.count;
  const missing = filtered.filter((client) => !hasValue(client)).length;
  const progressStages = data.filter((item) => item.id !== 'perdido');
  const progressTotal = progressStages.reduce((sum, item) => sum + item[metric], 0);
  const progress = progressTotal > 0
    ? progressStages.reduce((sum, item, index) => sum + item[metric] * index / (progressStages.length - 1), 0) / progressTotal
    : 0;
  const metrics = [
    { label: 'Clientes cadastrados', value: filtered.length.toLocaleString('pt-BR'), detail: 'Total no recorte selecionado' },
    { label: 'Oportunidades abertas', value: open.length.toLocaleString('pt-BR'), detail: 'Novos até negociação' },
    { label: 'Vendas ganhas', value: won.count.toLocaleString('pt-BR'), detail: 'Clientes atualmente na etapa Ganhos' },
    { label: 'Valor das vendas ganhas', value: money.format(won.value), detail: 'Soma dos valores estimados dos ganhos' },
    { label: 'Valor em aberto', value: money.format(open.reduce((sum, client) => sum + valueOf(client), 0)), detail: 'Potencial estimado das oportunidades abertas' },
    { label: 'Valor perdido', value: money.format(lost.value), detail: `${lost.count} clientes na etapa Perdidos` },
    { label: 'Taxa de ganho', value: closed ? percent.format(won.count / closed) : '—', detail: 'Ganhos ÷ (ganhos + perdidos)' },
    { label: 'Ticket médio dos ganhos', value: won.valued ? money.format(won.value / won.valued) : '—', detail: `Considera ${won.valued} ganhos com valor informado` },
  ];

  return <section className="relative min-w-0 space-y-5" aria-label="Indicadores do CRM">
    <div className={panel}>
      <h4 className="text-lg font-bold text-white">Indicadores comerciais</h4>
      <p className="mt-1 text-sm text-[#9ba9bc]">Retrato das etapas atuais. Os valores são estimados e não representam pagamentos recebidos.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs text-[#9ba9bc]">Cadastro a partir de<input type="date" value={start} onChange={(event) => setStart(event.target.value)} className={input} /></label>
        <label className="text-xs text-[#9ba9bc]">Cadastro até<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} className={input} /></label>
        <label className="text-xs text-[#9ba9bc]">Origem<select value={source} onChange={(event) => setSource(event.target.value)} className={input}><option value="all">Todas as origens</option>{Array.from(new Set(clients.map((client) => client.source))).sort().map((item) => <option key={item} value={item}>{item === 'contato' ? 'Formulário' : item === 'manual' ? 'Manual' : item}</option>)}</select></label>
        <button type="button" onClick={() => { setStart(''); setEnd(''); setSource('all'); }} className="self-end rounded-xl border border-[#34455a] px-3 py-2 text-sm font-semibold text-[#d7e0ea]">Limpar filtros</button>
      </div>
      <p className="mt-3 text-xs text-[#9ba9bc]">O período filtra a data de cadastro do cliente, não a data da venda. A busca por nome também se aplica aos indicadores.</p>
    </div>
    {invalidRange ? <p role="alert" className="text-sm text-red-300">A data inicial deve ser anterior ou igual à data final.</p> : !filtered.length ? <p className={`${panel} text-center text-[#9ba9bc]`}>Nenhum cliente encontrado para os filtros selecionados.</p> : <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((item) => <article key={item.label} className={panel}><h5 className="text-sm text-[#9ba9bc]">{item.label}</h5><p className="mt-2 break-words text-2xl font-bold text-white">{item.value}</p><p className="mt-2 text-xs text-[#9ba9bc]">{item.detail}</p></article>)}</div>
      {missing > 0 && <p className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-sm text-amber-200">{missing} clientes sem valor estimado válido. Os totais financeiros incluem apenas os valores informados.</p>}
      <div className={panel}>
        <div className="flex flex-wrap items-center justify-between gap-3"><h4 className="font-bold text-white">Distribuição por etapa</h4><div className="flex gap-2" aria-label="Medida do gráfico">{(['count', 'value'] as const).map((item) => <button key={item} type="button" aria-pressed={metric === item} onClick={() => setMetric(item)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${metric === item ? 'border-primary-400 bg-primary-500/15 text-primary-200' : 'border-[#34455a] text-[#9ba9bc]'}`}>{item === 'count' ? 'Quantidade de clientes' : 'Valor estimado'}</button>)}</div></div>
        <div className="mt-5 rounded-2xl border border-[#34455a] bg-[#0c121b]/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-wider text-[#9ba9bc]">Avanço médio até Ganhos</p><p className="mt-2 text-3xl font-bold text-emerald-300">{progressTotal > 0 ? percent.format(progress) : '—'}</p></div>
            <p className="text-sm text-[#9ba9bc]">{metric === 'count' ? 'Ponderado pela quantidade de clientes' : 'Ponderado pelo valor estimado'}</p>
          </div>
          <div role="progressbar" aria-label="Avanço médio até Ganhos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-valuetext={progressTotal > 0 ? percent.format(progress) : 'Sem dados para calcular o avanço'} className="relative mt-5 h-7 overflow-hidden rounded-full border border-[#34455a] bg-[#151f2b]">
            <div className="absolute inset-0 origin-left rounded-full transition-transform duration-700 ease-out motion-reduce:transition-none" style={{ transform: `scaleX(${progress})`, background: 'linear-gradient(90deg, #38bdf8, #a78bfa 25%, #fbbf24 50%, #fb923c 75%, #34d399)' }} />
            <div aria-hidden="true" className="absolute inset-0 flex">{progressStages.slice(1).map((item) => <span key={item.id} className="flex-1 border-r border-[#0c121b]/50 last:border-r-0" />)}</div>
          </div>
          <div className="mt-2 flex justify-between text-xs font-semibold text-[#9ba9bc]"><span>Novos · 0%</span><span className="text-emerald-300">Ganhos · 100%</span></div>
          {progressTotal === 0 && <p className="mt-3 text-sm text-[#9ba9bc]">{metric === 'value' ? 'Sem valor estimado positivo nas oportunidades abertas ou ganhas.' : 'Sem clientes nas oportunidades abertas ou ganhas.'}</p>}
        </div>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Distribuição dos clientes no caminho até Ganhos">
          {progressStages.map((item, index) => (
            <li key={item.id} className="relative min-w-0 overflow-hidden rounded-2xl border p-4 transition-colors hover:bg-white/5 motion-reduce:transition-none" style={{ borderColor: `${item.color}50`, backgroundImage: `linear-gradient(135deg, ${item.color}20, transparent)` }}>
              <div className="flex items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${item.color}25`, color: item.color }}>{index + 1}</span><h5 className="text-sm font-bold" style={{ color: item.color }}>{item.label}</h5></div>
              <p className="mt-4 break-words text-xl font-bold text-white">{metric === 'count' ? item.count.toLocaleString('pt-BR') : money.format(item.value)}</p>
              <p className="mt-1 text-xs text-[#9ba9bc]">{metric === 'count' ? 'clientes' : 'valor estimado'}</p>
              <p className="mt-3 text-xs text-[#9ba9bc]">{progressTotal > 0 ? percent.format(item[metric] / progressTotal) : '—'} da distribuição sem perdas</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-400/25 bg-slate-400/5 p-3 text-sm text-slate-300"><span>Perdidos</span><strong>{metric === 'count' ? `${lost.count} clientes` : money.format(lost.value)}</strong></div>
        <p className="mt-3 text-xs leading-relaxed text-[#9ba9bc]">Cada etapa tem o mesmo peso de avanço: Novos 0%, Qualificando 25%, Proposta 50%, Negociação 75% e Ganhos 100%. Perdidos ficam fora da barra. Este avanço representa a posição atual das oportunidades, não a taxa de ganho.</p>
      </div>
      <section className={panel} aria-label="Detalhamento por etapa">
        <h4 className="font-bold text-white">Detalhamento por etapa</h4>
        <p className="mt-2 text-sm text-[#9ba9bc]">O formato representa a sequência das etapas. Os percentuais mostram a participação atual no total de clientes.</p>
        <ol className="mx-auto mt-6 max-w-4xl space-y-2" aria-label="Etapas abertas do funil">
          {data.filter((item) => item.id !== 'ganho' && item.id !== 'perdido').map((item, index) => (
            <li key={item.id} className="group relative isolate px-5 py-5 sm:px-10" style={{ marginInline: `${index * 4}%` }}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 transition-opacity group-hover:opacity-80 motion-reduce:transition-none" style={{ clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)', background: `linear-gradient(110deg, ${item.color}30, ${item.color}0d)`, borderTop: `2px solid ${item.color}` }} />
              <div className="flex flex-wrap items-center justify-between gap-2"><h5 className="text-sm font-bold" style={{ color: item.color }}>{item.label}</h5><span className="text-xs text-[#9ba9bc]">{percent.format(item.count / filtered.length)} do total</span></div>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <p className="text-sm text-[#9ba9bc]"><strong className="mr-1 text-2xl text-white">{item.count}</strong> clientes</p>
                <div><p className="text-xs text-[#9ba9bc]">Valor estimado</p><p className="break-all text-lg font-semibold text-white">{money.format(item.value)}</p></div>
              </div>
              <p className="mt-2 text-xs text-[#9ba9bc]">{item.count - item.valued} sem valor informado</p>
            </li>
          ))}
        </ol>
        <div className="mx-auto my-4 h-6 w-px bg-[#34455a]" aria-hidden="true" />
        <h5 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#9ba9bc]">Resultados das oportunidades</h5>
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {data.filter((item) => item.id === 'ganho' || item.id === 'perdido').map((item) => (
            <article key={item.id} className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: `${item.color}50`, backgroundImage: `linear-gradient(135deg, ${item.color}15, transparent)` }}>
              <div className="flex flex-wrap items-center justify-between gap-2"><h5 className="font-bold" style={{ color: item.color }}>{item.label}</h5><span className="text-xs text-[#9ba9bc]">{percent.format(item.count / filtered.length)} do total</span></div>
              <p className="mt-3 text-sm text-[#9ba9bc]"><strong className="mr-1 text-2xl text-white">{item.count}</strong> clientes</p>
              <p className="mt-2 text-xs text-[#9ba9bc]">Valor estimado</p><p className="break-all text-xl font-semibold text-white">{money.format(item.value)}</p>
              <p className="mt-2 text-xs text-[#9ba9bc]">{item.count - item.valued} sem valor informado</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#273548] pt-4 text-sm text-[#9ba9bc]">
          <p>{filtered.length} clientes · {missing} sem valor informado</p>
          <p>Total estimado <strong className="ml-2 inline-block text-white">{money.format(data.reduce((sum, item) => sum + item.value, 0))}</strong></p>
        </div>
      </section>
      <div className={panel}><h4 className="font-bold text-white">Acompanhamento das oportunidades abertas</h4><dl className="mt-4 grid gap-4 sm:grid-cols-3">{[
        ['Retornos atrasados', open.filter((client) => client.next_contact_on && client.next_contact_on < today).length],
        ['Retornos para hoje', open.filter((client) => client.next_contact_on === today).length],
        ['Sem retorno agendado', open.filter((client) => !client.next_contact_on).length],
      ].map(([label, value]) => <div key={label}><dt className="text-sm text-[#9ba9bc]">{label}</dt><dd className="mt-1 text-2xl font-bold text-white">{value}</dd></div>)}</dl></div>
    </>}
  </section>;
};
