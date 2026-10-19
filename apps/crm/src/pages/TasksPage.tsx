import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, ChevronDown, Circle, Columns3, GripVertical, List, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskDrawer } from '../components/TaskDrawer';
import { CustomSelect } from '../components/CustomSelect';
import { crm } from '../services/crm';
import type { Deal } from '../types/crm';

type TaskStatus = 'pending' | 'in_progress' | 'waiting_client' | 'completed';
type TaskRow = { id: string; deal_id: string; title: string; description?: string | null; completed: boolean; task_status?: TaskStatus | null; starts_at?: string | null; ends_at?: string | null; due_at?: string | null; task_type?: string; deal?: { name?: string; company?: { name?: string } | null } | null };

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'pending', label: 'A fazer' },
  { id: 'in_progress', label: 'Em andamento' },
  { id: 'waiting_client', label: 'Aguardando cliente' },
  { id: 'completed', label: 'Concluídas' },
];

const statusOf = (task: TaskRow): TaskStatus => task.task_status || (task.completed ? 'completed' : 'pending');
const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sem início';

export const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [pendingCollapsed, setPendingCollapsed] = useState(false);
  const [completedCollapsed, setCompletedCollapsed] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [expandedColumns, setExpandedColumns] = useState<TaskStatus[]>([]);
  const load = () => crm.listTasks().then((items) => setTasks(items as TaskRow[])).catch(console.error);

  useEffect(() => { load(); crm.listDeals().then(setDeals).catch(console.error); }, []);
  const toggle = async (task: TaskRow) => {
    const completed = !task.completed;
    await crm.toggleTask(task.id, completed);
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed, task_status: completed ? 'completed' : 'pending' } : item));
  };
  const moveTask = async (status: TaskStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find((item) => item.id === draggedTaskId);
    setDraggedTaskId(null);
    if (!task || statusOf(task) === status) return;
    const previous = tasks;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, task_status: status, completed: status === 'completed' } : item));
    try { await crm.updateTaskStatus(task.id, status); } catch (error) { setTasks(previous); console.error(error); }
  };

  const selectedDeal = deals.find((deal) => deal.id === selectedDealId);
  const visibleTasks = selectedDealId ? tasks.filter((task) => task.deal_id === selectedDealId) : tasks;
  const completedTasks = visibleTasks.filter((task) => statusOf(task) === 'completed');
  const activeTasks = visibleTasks.filter((task) => statusOf(task) !== 'completed');

  return <>
    <header className="page-header tasks-page-header">
      <div><p className="eyebrow">Agenda comercial</p><h1>Tarefas</h1><p className="page-description">Organize prioridades e acompanhe o avanço de cada negociação.</p></div>
      <div className="task-create-actions">
        <label><span>Filtrar por cliente</span><CustomSelect value={selectedDealId} onChange={setSelectedDealId} ariaLabel="Filtrar tarefas por cliente" options={[{ value: '', label: 'Todos os clientes' }, ...deals.map((deal) => ({ value: deal.id, label: dealLabel(deal) }))]} /></label>
        <button className="primary" disabled={!selectedDealId} onClick={() => setDrawerOpen(true)} title={!selectedDealId ? 'Selecione um cliente para criar a tarefa' : undefined}><Plus size={16} />Criar tarefa</button>
      </div>
    </header>
    <div className="tasks-toolbar">
      <div className="task-summary"><div><strong>{activeTasks.length}</strong><span>Em aberto</span></div><div><strong>{completedTasks.length}</strong><span>Concluídas</span></div></div>
      <div className="task-view-switch" aria-label="Visualização das tarefas"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}><List size={16} />Lista</button><button className={view === 'kanban' ? 'active' : ''} onClick={() => setView('kanban')} aria-pressed={view === 'kanban'}><Columns3 size={16} />Kanban</button></div>
    </div>

    {view === 'list' ? <div className="task-groups">
      <TaskGroup title="Em aberto" tasks={activeTasks} collapsed={pendingCollapsed} onCollapse={() => setPendingCollapsed((current) => !current)} onToggle={toggle} />
      <TaskGroup title="Concluídas" tasks={completedTasks} collapsed={completedCollapsed} onCollapse={() => setCompletedCollapsed((current) => !current)} onToggle={toggle} completed />
    </div> : <div className="tasks-kanban">{columns.map((column) => {
      const items = visibleTasks.filter((task) => statusOf(task) === column.id);
      const expanded = expandedColumns.includes(column.id);
      const visibleItems = expanded ? items : items.slice(0, 2);
      const hiddenCount = items.length - 2;
      return <section key={column.id} className={`task-kanban-column status-${column.id}`} onDragOver={(event) => event.preventDefault()} onDrop={() => moveTask(column.id)}><header><div><span className="task-status-dot" /><strong>{column.label}</strong></div><small>{items.length}</small></header><div className="task-kanban-list">{visibleItems.map((task) => <article key={task.id} draggable onDragStart={() => setDraggedTaskId(task.id)} onDragEnd={() => setDraggedTaskId(null)} className={draggedTaskId === task.id ? 'dragging' : ''}><div className="task-kanban-top"><span>{task.task_type || 'Tarefa'}</span><GripVertical size={15} /></div><strong style={{ fontSize: 15, lineHeight: 1.4, color: '#f8fafc' }}>{task.title}</strong>{task.description && <p>{task.description}</p>}<Link to={`/negociacoes/${task.deal_id}`} style={{ display: 'grid', gap: 3, borderTop: '1px solid #273548', paddingTop: 10 }}><small style={{ color: '#52647a', fontSize: 8, fontWeight: 900, letterSpacing: '.14em', textTransform: 'uppercase' }}>Cliente</small><span style={{ overflow: 'hidden', color: '#aebccc', fontSize: 11, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.deal?.name || 'Negociação'} <span style={{ color: '#52647a' }}>·</span> {task.deal?.company?.name || 'Sem empresa'}</span></Link><time><CalendarDays size={13} />{formatDate(task.starts_at)}</time></article>)}{!items.length && <div className="task-kanban-empty">Arraste uma tarefa para cá</div>}</div>{items.length > 2 && <button type="button" className="stage-more" onClick={() => setExpandedColumns((current) => expanded ? current.filter((id) => id !== column.id) : [...current, column.id])}>{expanded ? 'Recolher' : `Ver mais ${hiddenCount}`}</button>}</section>;
    })}</div>}
    {drawerOpen && selectedDeal && <TaskDrawer dealId={selectedDeal.id} dealName={dealLabel(selectedDeal)} onClose={() => setDrawerOpen(false)} onCreated={load} />}
  </>;
};

const TaskGroup = ({ title, tasks, collapsed, onCollapse, onToggle, completed = false }: { title: string; tasks: TaskRow[]; collapsed: boolean; onCollapse: () => void; onToggle: (task: TaskRow) => void; completed?: boolean }) => <section className={`task-group ${collapsed ? 'collapsed' : ''}`}>
  <button className="task-group-header" onClick={onCollapse} aria-expanded={!collapsed}><span className={completed ? 'completed-dot' : 'pending-dot'} /><strong>{title}</strong><small>{tasks.length}</small><ChevronDown className={collapsed ? '' : 'rotated'} size={18} /></button>
  {!collapsed && <div className="tasks-table">{tasks.map((task) => <article key={task.id} className={task.completed ? 'completed' : ''}><button onClick={() => onToggle(task)}>{task.completed ? <CheckCircle2 /> : <Circle />}</button><div><strong>{task.title}</strong><Link to={`/negociacoes/${task.deal_id}`}>{task.deal?.name || 'Negociação'} · {task.deal?.company?.name || 'Sem empresa'}</Link></div><span className={`task-status-label ${statusOf(task)}`}>{columns.find((item) => item.id === statusOf(task))?.label}</span><time><CalendarDays size={14} />{formatDate(task.starts_at)}{task.ends_at || task.due_at ? ` → ${formatDate(task.ends_at || task.due_at)}` : ''}</time></article>)}{!tasks.length && <div className="detail-empty">Nenhuma tarefa {title.toLowerCase()}.</div>}</div>}
</section>;

const dealLabel = (deal: Deal) => deal.company ? `${deal.company} · ${deal.name}` : deal.name;
