import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateDrawer } from '../components/CreateDrawer';
import { SaleCelebration } from '../components/SaleCelebration';
import { crm } from '../services/crm';
import type { Deal, DealStage } from '../types/crm';

const stages: { id: DealStage; label: string }[] = [{ id: 'novo', label: 'Sem contato' }, { id: 'qualificando', label: 'Contato feito' }, { id: 'proposta', label: 'Proposta' }, { id: 'negociação', label: 'Negociação' }, { id: 'ganho', label: 'Ganhos' }, { id: 'perdido', label: 'Perdidos' }];
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const PipelinePage = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState('');
  const [dragged, setDragged] = useState<Deal | null>(null);
  const [creating, setCreating] = useState(false);
  const [expandedStages, setExpandedStages] = useState<DealStage[]>([]);
  const [wonDeal, setWonDeal] = useState<Deal | null>(null);
  const load = () => crm.listDeals().then(setDeals).catch(console.error);
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => deals.filter((deal) => `${deal.name} ${deal.company || ''}`.toLowerCase().includes(query.toLowerCase())), [deals, query]);
  const move = async (stage: DealStage) => {
    if (!dragged || dragged.stage === stage) return setDragged(null);
    const movedDeal = dragged;
    const updated = await crm.moveDeal(dragged.id, stage);
    setDeals((all) => all.map((item) => item.id === updated.id ? { ...item, ...updated, company: item.company } : item));
    setDragged(null);
    if (stage === 'ganho') setWonDeal(movedDeal);
  };
  return <>
    <header className="page-header"><div><p className="eyebrow">Pipeline</p><h1>Negociações</h1></div><button className="primary" onClick={() => setCreating(true)}><Plus size={17} />Criar negociação</button></header>
    <div className="toolbar"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar negociação ou empresa" /></div>
    <div className="kanban">{stages.map((stage) => {
      const items = filtered.filter((deal) => deal.stage === stage.id);
      const expanded = expandedStages.includes(stage.id);
      const visibleItems = expanded ? items : items.slice(0, 4);
      const hiddenCount = items.length - visibleItems.length;
      return <section className="kanban-column" key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={() => move(stage.id)}><header><div><strong>{stage.label}</strong><span>{items.length}</span></div><small>{money.format(items.reduce((sum, deal) => sum + Number(deal.estimated_value || 0), 0))}</small></header><div className="card-list">{visibleItems.map((deal) => <article draggable key={deal.id} onDragStart={() => setDragged(deal)} onDragEnd={() => setDragged(null)} onClick={() => navigate(`/negociacoes/${deal.id}`)} className="deal-card" role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/negociacoes/${deal.id}`); }}><span>{deal.stage === 'ganho' ? 'Venda ganha' : deal.stage === 'perdido' ? 'Encerrada' : 'Em andamento'}</span><strong>{deal.name}</strong><p>{deal.company || 'Sem empresa vinculada'}</p>{deal.next_step && <small>Próximo: {deal.next_step}</small>}</article>)}{!items.length && <div className="empty">Arraste uma negociação para cá</div>}</div>{items.length > 4 && <button className="stage-more" onClick={() => setExpandedStages((current) => expanded ? current.filter((id) => id !== stage.id) : [...current, stage.id])}>{expanded ? 'Recolher etapa' : `Ver mais ${hiddenCount} ${hiddenCount === 1 ? 'negociação' : 'negociações'}`}</button>}</section>;
    })}</div>
    {creating && <CreateDrawer kind="deal" onClose={() => setCreating(false)} onCreated={load} />}
    {wonDeal && <SaleCelebration dealName={wonDeal.name} onDone={() => setWonDeal(null)} />}
  </>;
};
