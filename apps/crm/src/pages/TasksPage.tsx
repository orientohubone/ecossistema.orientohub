import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, ChevronDown, Circle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskDrawer } from '../components/TaskDrawer';
import { CustomSelect } from '../components/CustomSelect';
import { crm } from '../services/crm';
import type { Deal } from '../types/crm';

type TaskRow = { id: string; deal_id: string; title: string; description?: string | null; completed: boolean; starts_at?: string | null; ends_at?: string | null; due_at?: string | null; task_type?: string; deal?: { name?: string; company?: { name?: string } | null } | null };

export const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCollapsed, setPendingCollapsed] = useState(true);
  const [completedCollapsed, setCompletedCollapsed] = useState(true);
  const load = () => crm.listTasks().then((items) => setTasks(items as TaskRow[])).catch(console.error);

  useEffect(() => { load(); crm.listDeals().then(setDeals).catch(console.error); }, []);
  const toggle = async (task: TaskRow) => {
    await crm.toggleTask(task.id, !task.completed);
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item));
  };

  const selectedDeal = deals.find((deal) => deal.id === selectedDealId);
  const visibleTasks = selectedDealId ? tasks.filter((task) => task.deal_id === selectedDealId) : tasks;
  const pendingTasks = visibleTasks.filter((task) => !task.completed);
  const completedTasks = visibleTasks.filter((task) => task.completed);

  return <>
    <header className="page-header">
      <div><p className="eyebrow">Agenda comercial</p><h1>Tarefas</h1></div>
      <div className="task-create-actions">
        <label><span>Filtrar por cliente</span><CustomSelect value={selectedDealId} onChange={setSelectedDealId} ariaLabel="Filtrar tarefas por cliente" options={[{ value: '', label: 'Todos os clientes' }, ...deals.map((deal) => ({ value: deal.id, label: dealLabel(deal) }))]} /></label>
        <button className="primary" disabled={!selectedDealId} onClick={() => setDrawerOpen(true)} title={!selectedDealId ? 'Selecione um cliente para criar a tarefa' : undefined}><Plus size={16} />Criar tarefa</button>
      </div>
    </header>
    <div className="task-summary"><div><strong>{pendingTasks.length}</strong><span>Pendentes</span></div><div><strong>{completedTasks.length}</strong><span>Concluídas</span></div></div>
    <div className="task-groups">
      <TaskGroup title="Pendentes" tasks={pendingTasks} collapsed={pendingCollapsed} onCollapse={() => setPendingCollapsed((current) => !current)} onToggle={toggle} />
      <TaskGroup title="Concluídas" tasks={completedTasks} collapsed={completedCollapsed} onCollapse={() => setCompletedCollapsed((current) => !current)} onToggle={toggle} completed />
    </div>
    {drawerOpen && selectedDeal && <TaskDrawer dealId={selectedDeal.id} dealName={dealLabel(selectedDeal)} onClose={() => setDrawerOpen(false)} onCreated={load} />}
  </>;
};

const TaskGroup = ({ title, tasks, collapsed, onCollapse, onToggle, completed = false }: { title: string; tasks: TaskRow[]; collapsed: boolean; onCollapse: () => void; onToggle: (task: TaskRow) => void; completed?: boolean }) => <section className={`task-group ${collapsed ? 'collapsed' : ''}`}>
  <button className="task-group-header" onClick={onCollapse} aria-expanded={!collapsed}>
    <span className={completed ? 'completed-dot' : 'pending-dot'} />
    <strong>{title}</strong><small>{tasks.length}</small><ChevronDown className={collapsed ? '' : 'rotated'} size={18} />
  </button>
  {!collapsed && <div className="tasks-table">{tasks.map((task) => <article key={task.id} className={task.completed ? 'completed' : ''}><button onClick={() => onToggle(task)}>{task.completed ? <CheckCircle2 /> : <Circle />}</button><div><strong>{task.title}</strong><Link to={`/negociacoes/${task.deal_id}`}>{task.deal?.name || 'Negociação'} · {task.deal?.company?.name || 'Sem empresa'}</Link></div><span className="task-type">{task.task_type || 'Tarefa'}</span><time><CalendarDays size={14} />{task.starts_at ? new Date(task.starts_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sem início'}{task.ends_at || task.due_at ? ` → ${new Date(task.ends_at || task.due_at!).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}` : ''}</time></article>)}{!tasks.length && <div className="detail-empty">Nenhuma tarefa {title.toLowerCase()}.</div>}</div>}
</section>;

const dealLabel = (deal: Deal) => deal.company ? `${deal.company} · ${deal.name}` : deal.name;
