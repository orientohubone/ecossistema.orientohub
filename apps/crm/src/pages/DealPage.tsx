import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Building2, CalendarDays, CheckCircle2, ChevronDown, Circle, ExternalLink, Flag, GitBranch, GripVertical, Mail, MessageSquareText, Phone, Plus, RotateCcw, Send, UserRound, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { TaskDrawer } from '../components/TaskDrawer';
import { SaleCelebration } from '../components/SaleCelebration';
import { crm } from '../services/crm';
import type { Company, Contact, Deal, DealStage } from '../types/crm';

type Detail = Deal & { company: Company | null; primary_contact: Contact | null; demand?: string | null; campaign?: string | null; status: 'open' | 'won' | 'lost' };
type Note = { id: string; body: string; created_at: string };
type Task = { id: string; title: string; description?: string | null; completed: boolean; starts_at?: string | null; ends_at?: string | null; due_at?: string | null; sort_order?: number; created_at: string };

const stages: { id: DealStage; label: string }[] = [
  { id: 'novo', label: 'Sem contato' }, { id: 'qualificando', label: 'Contato feito' },
  { id: 'proposta', label: 'Proposta' }, { id: 'negociação', label: 'Negociação' }, { id: 'ganho', label: 'Ganho' },
];
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const DealPage = () => {
  const { dealId = '' } = useParams();
  const [deal, setDeal] = useState<Detail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [editingPeriod, setEditingPeriod] = useState<{ id: string; startsAt: string; endsAt: string } | null>(null);
  const [tasksCollapsed, setTasksCollapsed] = useState(true);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [noteBody, setNoteBody] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [stageSaving, setStageSaving] = useState<DealStage | null>(null);
  const [stageFeedback, setStageFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [outcomeDismissed, setOutcomeDismissed] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const load = async () => {
    try {
      const detail = await crm.getDeal(dealId);
      setDeal(detail); setError('');
      const [dealNotes, dealTasks] = await Promise.allSettled([crm.getDealNotes(dealId), crm.getDealTasks(dealId)]);
      setNotes(dealNotes.status === 'fulfilled' ? dealNotes.value as Note[] : []);
      setTasks(dealTasks.status === 'fulfilled' ? dealTasks.value as Task[] : []);
    } catch (caught) {
      console.error('Falha ao carregar negociação', caught);
      setError('Não foi possível carregar esta negociação.');
    }
  };
  useEffect(() => { load(); }, [dealId]);

  const changeStage = async (stage: DealStage) => {
    if (!deal || stageSaving) return;
    setStageSaving(stage); setStageFeedback(null);
    try {
      await crm.moveDeal(deal.id, stage);
      await load();
      if (stage === 'ganho') setCelebrating(true);
      if (stage === 'ganho' || stage === 'perdido') setOutcomeDismissed(false);
      else setOutcomeDismissed(true);
      setStageFeedback({ type: 'success', message: stage === 'ganho' ? 'Venda registrada com sucesso.' : stage === 'perdido' ? 'Perda registrada com sucesso.' : 'Etapa atualizada com sucesso.' });
      window.setTimeout(() => setStageFeedback(null), 3500);
    } catch (caught) {
      console.error('Falha ao atualizar etapa', caught);
      setStageFeedback({ type: 'error', message: caught instanceof Error ? caught.message : 'Não foi possível atualizar a negociação.' });
    } finally { setStageSaving(null); }
  };
  const toggleTask = async (task: Task) => { await crm.toggleTask(task.id, !task.completed); setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item)); };
  const persistTaskOrder = async (reordered: Task[], previous: Task[]) => {
    setTasks(reordered.map((task, position) => ({ ...task, sort_order: position })));
    try { await crm.reorderTasks(reordered.map((task) => task.id)); }
    catch (caught) { console.error('Falha ao reordenar tarefas', caught); setTasks(previous); setStageFeedback({ type: 'error', message: 'Não foi possível salvar a nova ordem das tarefas.' }); }
  };
  const moveTask = async (index: number, direction: -1 | 1) => {
    const target = index + direction; if (target < 0 || target >= tasks.length) return;
    const previous = tasks;
    const reordered = [...tasks];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await persistTaskOrder(reordered, previous);
  };
  const dropTask = async (targetId: string) => {
    if (!draggedTaskId || draggedTaskId === targetId) { setDraggedTaskId(null); setDragOverTaskId(null); return; }
    const from = tasks.findIndex((task) => task.id === draggedTaskId);
    const to = tasks.findIndex((task) => task.id === targetId);
    if (from < 0 || to < 0) return;
    const previous = tasks; const reordered = [...tasks]; const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved); setDraggedTaskId(null); setDragOverTaskId(null);
    await persistTaskOrder(reordered, previous);
  };
  const editPeriod = (task: Task) => setEditingPeriod({ id: task.id, startsAt: toInputDate(task.starts_at), endsAt: toInputDate(task.ends_at || task.due_at) });
  const savePeriod = async () => {
    if (!editingPeriod) return;
    const startsAt = editingPeriod.startsAt ? new Date(editingPeriod.startsAt).toISOString() : null;
    const endsAt = editingPeriod.endsAt ? new Date(editingPeriod.endsAt).toISOString() : null;
    await crm.updateTaskPeriod(editingPeriod.id, startsAt, endsAt);
    setTasks((current) => current.map((item) => item.id === editingPeriod.id ? { ...item, starts_at: startsAt, ends_at: endsAt, due_at: endsAt } : item));
    setEditingPeriod(null);
  };
  const saveNote = async () => {
    const body = noteBody.trim();
    if (!body || savingNote) return;
    setSavingNote(true);
    try { const note = await crm.addDealNote(dealId, body); setNotes((current) => [note as Note, ...current]); setNoteBody(''); }
    finally { setSavingNote(false); }
  };

  if (error) return <section className="detail-error"><p>{error}</p><Link to="/">Voltar ao funil</Link></section>;
  if (!deal) return <div className="detail-loading">Carregando negociação…</div>;
  const currentIndex = stages.findIndex((stage) => stage.id === deal.stage);
  const activities = [...notes.map((note) => ({ ...note, kind: note.body.startsWith('Etapa alterada') ? 'stage' as const : note.body === 'Negociação criada' ? 'created' as const : 'note' as const })), ...(notes.some((note) => note.body === 'Negociação criada') ? [] : [{ id: `created-${deal.id}`, body: 'Negociação criada', created_at: deal.created_at, kind: 'created' as const }])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return <div className="deal-detail">
    <header className="deal-heading">
      <div><Link to="/"><ArrowLeft size={17} />Voltar ao funil</Link><p className="eyebrow">Negociação</p><h1>{deal.name}</h1><span>{deal.company?.name || 'Sem empresa vinculada'}</span></div>
      <div className="deal-actions"><button disabled={Boolean(stageSaving)} onClick={() => changeStage('perdido')} className="danger-outline">{stageSaving === 'perdido' ? 'Registrando…' : 'Marcar perda'}</button><button disabled={Boolean(stageSaving)} onClick={() => changeStage('ganho')} className="primary">{stageSaving === 'ganho' ? 'Registrando…' : 'Marcar venda'}</button></div>
    </header>
    {stageFeedback && <div className={`stage-feedback ${stageFeedback.type}`} role="status">{stageFeedback.message}</div>}
    {!outcomeDismissed && (deal.stage === 'ganho' || deal.stage === 'perdido') && <div className={`deal-outcome ${deal.stage === 'ganho' ? 'won' : 'lost'}`}><div><strong>{deal.stage === 'ganho' ? 'Negociação ganha' : 'Negociação perdida'}</strong><span>{deal.stage === 'ganho' ? 'Esta oportunidade foi concluída como venda.' : 'Esta oportunidade foi encerrada como perda.'}</span></div><div className="outcome-actions"><button onClick={() => changeStage('negociação')}><RotateCcw size={14} />Reabrir</button><button onClick={() => setOutcomeDismissed(true)} aria-label="Fechar aviso"><X size={15} /></button></div></div>}
    <nav className="deal-progress">{stages.map((stage, index) => <button key={stage.id} onClick={() => changeStage(stage.id)} className={`${stage.id === deal.stage ? 'current' : ''} ${index < currentIndex ? 'passed' : ''}`}>{stage.label}</button>)}</nav>
    <div className="deal-layout">
      <aside className="deal-aside">
        <section><h2>Negociação</h2><Info label="Valor estimado" value={money.format(Number(deal.estimated_value || 0))} /><Info label="Origem" value={deal.source} /><Info label="Campanha" value={deal.campaign || 'Não informada'} /><Info label="Criada em" value={new Date(deal.created_at).toLocaleDateString('pt-BR')} /></section>
        <section><h2><Building2 size={17} />Empresa</h2><Info label="Nome" value={deal.company?.name || 'Não vinculada'} /><div className="cnpj-row"><span>CNPJ</span><div><strong>{deal.company?.cnpj || 'Não informado'}</strong><div className="registry-links"><a href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/" target="_blank" rel="noopener noreferrer">REDESIM <ExternalLink size={11} /></a><a href="https://www.cadesp.fazenda.sp.gov.br/Pages/Cadastro/Consultas/ConsultaPublica/ConsultaPublica.aspx" target="_blank" rel="noopener noreferrer">CADESP <ExternalLink size={11} /></a></div></div></div><Info label="Segmento" value={deal.company?.segment || 'Não informado'} /><Info label="Site" value={deal.company?.website || 'Não informado'} /><Info label="Endereço" value={deal.company?.address || 'Não informado'} /></section>
        <section><h2><UserRound size={17} />Contato</h2><Info label="Nome" value={deal.primary_contact?.name || 'Não vinculado'} /><Info label="Cargo" value={deal.primary_contact?.role || 'Não informado'} />{deal.primary_contact?.email && <p className="contact-line"><Mail size={14} />{deal.primary_contact.email}</p>}{deal.primary_contact?.phone && <p className="contact-line"><Phone size={14} />{deal.primary_contact.phone}</p>}</section>
      </aside>
      <main className="deal-main">
        <section className="next-step"><div><p className="eyebrow">Próximo avanço</p><h2>{deal.next_step || 'Defina o próximo passo desta negociação'}</h2></div><CalendarDays /></section>
        {Boolean(deal.services?.length) && <section className="detail-panel"><div className="panel-title"><div><h2>Serviços de interesse</h2><p>Informações preservadas do cadastro anterior.</p></div></div><div className="service-tags">{deal.services?.map((service) => <span key={service}>{service}</span>)}</div></section>}
        <section className={`detail-panel tasks-panel ${tasksCollapsed ? 'collapsed' : ''}`}>
          <div className="panel-title"><div><h2>Próximas tarefas</h2><p>{tasks.filter((task) => !task.completed).length} pendentes · {tasks.filter((task) => task.completed).length} concluídas</p></div><div className="panel-actions"><button className="secondary compact" onClick={() => setTaskDrawerOpen(true)}><Plus size={15} />Criar tarefa</button><button className="collapse-button" onClick={() => setTasksCollapsed((current) => !current)} aria-expanded={!tasksCollapsed}><span>{tasksCollapsed ? 'Expandir' : 'Recolher'}</span><ChevronDown className={tasksCollapsed ? '' : 'rotated'} size={17} /></button></div></div>
          {!tasksCollapsed && <div className="task-list">{tasks.map((task, index) => <article draggable key={task.id} onDragStart={(event) => { setDraggedTaskId(task.id); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', task.id); }} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setDragOverTaskId(task.id); }} onDragLeave={() => setDragOverTaskId((current) => current === task.id ? null : current)} onDrop={(event) => { event.preventDefault(); dropTask(task.id); }} onDragEnd={() => { setDraggedTaskId(null); setDragOverTaskId(null); }} className={`${task.completed ? 'completed' : ''} ${draggedTaskId === task.id ? 'dragging' : ''} ${dragOverTaskId === task.id && draggedTaskId !== task.id ? 'drag-over' : ''}`}><div className="task-order" title="Arraste para mudar a posição"><GripVertical size={14} /><b>{index + 1}</b></div><button className="task-check" onClick={() => toggleTask(task)} aria-label={task.completed ? 'Reabrir tarefa' : 'Concluir tarefa'}>{task.completed ? <CheckCircle2 className="done" /> : <Circle />}</button><div className="task-content"><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}{editingPeriod?.id === task.id ? <div className="period-editor"><label>Início<input type="datetime-local" value={editingPeriod.startsAt} onChange={(event) => setEditingPeriod({ ...editingPeriod, startsAt: event.target.value })} /></label><label>Fim<input type="datetime-local" value={editingPeriod.endsAt} onChange={(event) => setEditingPeriod({ ...editingPeriod, endsAt: event.target.value })} /></label><div><button className="secondary" onClick={() => setEditingPeriod(null)}>Cancelar</button><button className="primary" onClick={savePeriod}>Salvar período</button></div></div> : <button className="task-period-line" onClick={() => editPeriod(task)}><CalendarDays size={14} /><span><b>Início:</b> {formatTaskDate(task.starts_at)}</span><i>→</i><span><b>Fim:</b> {formatTaskDate(task.ends_at || task.due_at)}</span></button>}</div><div className="task-reorder"><button disabled={index === 0} onClick={() => moveTask(index, -1)} aria-label={`Mover ${task.title} para cima`}><ArrowUp size={14} /></button><button disabled={index === tasks.length - 1} onClick={() => moveTask(index, 1)} aria-label={`Mover ${task.title} para baixo`}><ArrowDown size={14} /></button></div></article>)}{!tasks.length && <div className="detail-empty">Nenhuma tarefa pendente para esta negociação.</div>}</div>}
        </section>
        <section className="detail-panel history-panel"><div className="panel-title"><div><h2>Histórico</h2><p>Atividades e anotações registradas.</p></div><span className="activity-count">{activities.length} {activities.length === 1 ? 'registro' : 'registros'}</span></div><div className="note-composer"><textarea value={noteBody} onChange={(event) => setNoteBody(event.target.value)} placeholder="Registre uma anotação sobre esta negociação" /><button className="primary" disabled={!noteBody.trim() || savingNote} onClick={saveNote}><Send size={15} />{savingNote ? 'Salvando…' : 'Adicionar anotação'}</button></div><div className="activity-timeline">{activities.map((activity) => <article key={activity.id} className={activity.kind}><div className="activity-marker">{activity.kind === 'stage' ? <GitBranch /> : activity.kind === 'created' ? <Flag /> : <MessageSquareText />}</div><div className="activity-content"><header><span>{activity.kind === 'stage' ? 'Mudança de etapa' : activity.kind === 'created' ? 'Criação' : 'Anotação'}</span><time>{formatActivityDate(activity.created_at)}</time></header><p>{activity.kind === 'note' ? activity.body : <><strong>Fernando Ramalho</strong> {activity.kind === 'created' ? 'criou esta negociação' : activity.body.toLowerCase()}</>}</p></div></article>)}</div></section>
        {deal.demand && <section className="detail-panel demand-panel"><div className="demand-accent" aria-hidden="true"><Flag size={17} /></div><div><div className="panel-title"><div><p className="eyebrow">Contexto de entrada</p><h2>Demanda inicial</h2></div></div><p className="demand-text">{deal.demand}</p></div></section>}
      </main>
    </div>
    {taskDrawerOpen && <TaskDrawer dealId={deal.id} dealName={deal.name} onClose={() => setTaskDrawerOpen(false)} onCreated={load} />}
    {celebrating && <SaleCelebration dealName={deal.name} onDone={() => setCelebrating(false)} />}
  </div>;
};

const Info = ({ label, value }: { label: string; value: string }) => <div className="info-row"><span>{label}</span><strong>{value}</strong></div>;
const toInputDate = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 16) : '';
const formatTaskDate = (value?: string | null) => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'definir';
const formatActivityDate = (value: string) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' });
