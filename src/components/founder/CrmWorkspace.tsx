import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CalendarCheck2,
  Check,
  ChevronRight,
  Circle,
  Copy,
  ExternalLink,
  GripVertical,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Send,
  Trash2,
  UserRound,
} from 'lucide-react';
import { serviceCatalog } from '../../data/serviceCatalog';
import { crmService } from '../../services/crmService';
import { CrmIndicators } from './CrmIndicators';
import type { CrmClient, CrmNote, CrmStage, CrmTask } from '../../services/crmService';

const stages: { id: CrmStage; label: string; color: string }[] = [
  { id: 'novo', label: 'Novos', color: 'border-sky-400/30 bg-sky-400/10 text-sky-200' },
  { id: 'qualificando', label: 'Qualificando', color: 'border-violet-400/30 bg-violet-400/10 text-violet-200' },
  { id: 'proposta', label: 'Proposta', color: 'border-amber-400/30 bg-amber-400/10 text-amber-200' },
  { id: 'negociação', label: 'Negociação', color: 'border-orange-400/30 bg-orange-400/10 text-orange-200' },
  { id: 'ganho', label: 'Ganhos', color: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' },
  { id: 'perdido', label: 'Perdidos', color: 'border-slate-400/30 bg-slate-400/10 text-slate-300' },
];

const emptyForm = { name: '', email: '', phone: '', company: '', cnpj: '', address: '', services: [] as string[], demand: '' };
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const activityWithLinks = (body: string) => body.split(/(https?:\/\/[^\s]+|www\.[^\s]+)/gi).map((part, index) => {
  const isLink = /^(https?:\/\/|www\.)/i.test(part);
  if (!isLink) return part;
  const href = part.toLowerCase().startsWith('www.') ? `https://${part}` : part;
  return <a key={`${part}-${index}`} href={href} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-primary-300 underline decoration-primary-400/40 underline-offset-2 transition hover:text-primary-200">{part}</a>;
});

export const CrmWorkspace = ({ onCreateProposal }: { onCreateProposal: (client: CrmClient) => void }) => {
  const [clients, setClients] = useState<CrmClient[]>([]);
  const [selected, setSelected] = useState<CrmClient | null>(null);
  const [draggedClient, setDraggedClient] = useState<CrmClient | null>(null);
  const [notes, setNotes] = useState<CrmNote[]>([]);
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [activity, setActivity] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'stages' | 'indicators'>('stages');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newClient, setNewClient] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const mutationLock = useRef(false);
  const [saving, setSaving] = useState(false);
  const [commercial, setCommercial] = useState({ value: '', step: '', date: '' });
  const selectedId = selected?.id;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    setCommercial({ value: selected?.estimated_value?.toString() ?? '', step: selected?.next_step ?? '', date: selected?.next_contact_on ?? '' });
  }, [selectedId, selected?.estimated_value, selected?.next_step, selected?.next_contact_on]);

  useEffect(() => {
    setLoading(true);
    crmService.getClients().then(setClients).catch(() => setError('Não foi possível carregar os clientes.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    setNotes([]);
    setTasks([]);
    setActivity('');
    setTaskTitle('');
    setDetailLoading(true);
    Promise.all([crmService.getNotes(selectedId), crmService.getTasks(selectedId)])
      .then(([clientNotes, clientTasks]) => { if (active) { setNotes(clientNotes); setTasks(clientTasks); } })
      .catch(() => { if (active) setError('Não foi possível carregar a ficha completa do cliente.'); })
      .finally(() => { if (active) setDetailLoading(false); });
    return () => { active = false; };
  }, [selectedId]);

  const filtered = useMemo(() => clients.filter((client) => `${client.name} ${client.company || ''} ${client.email || ''} ${client.cnpj || ''}`.toLowerCase().includes(search.toLowerCase())), [clients, search]);
  const completedTasks = tasks.filter((task) => task.completed).length;

  const updateStage = async (client: CrmClient, stage: CrmStage) => {
    if (client.stage === stage || mutationLock.current) return;
    mutationLock.current = true;
    setSaving(true);
    setError('');
    try {
      const updated = await crmService.updateClient(client.id, { stage });
      setClients((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelected((current) => current?.id === updated.id ? updated : current);
    } catch {
      setError('Não foi possível mudar a etapa. Tente novamente.');
    } finally {
      mutationLock.current = false;
      setSaving(false);
    }
  };

  const saveCommercial = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || mutationLock.current) return;
    const value = commercial.value === '' ? null : Number(commercial.value);
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 9999999999.99)) {
      setError('Informe um valor estimado válido.');
      return;
    }
    mutationLock.current = true;
    setSaving(true);
    setError('');
    try {
      const updated = await crmService.updateClient(selected.id, { estimated_value: value, next_step: commercial.step.trim() || null, next_contact_on: commercial.date || null });
      setClients((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelected((current) => current?.id === updated.id ? updated : current);
    } catch {
      setError('Não foi possível salvar o acompanhamento comercial. Tente novamente.');
    } finally {
      mutationLock.current = false;
      setSaving(false);
    }
  };

  const saveClient = async () => {
    if (!form.name.trim()) return;
    const created = await crmService.createClient(form);
    setClients((current) => [created, ...current]);
    setForm(emptyForm);
    setNewClient(false);
    setSelected(created);
  };

  const saveActivity = async () => {
    if (!selected || !activity.trim()) return;
    const created = await crmService.addNote(selected.id, activity.trim());
    setNotes((current) => [created, ...current]);
    setActivity('');
    const updated = await crmService.updateClient(selected.id, { last_contact_at: new Date().toISOString() });
    setSelected(updated);
    setClients((current) => current.map((client) => client.id === updated.id ? updated : client));
  };

  const addTask = async () => {
    if (!selected || !taskTitle.trim()) return;
    const created = await crmService.addTask(selected.id, taskTitle.trim(), tasks.length);
    setTasks((current) => [...current, created]);
    setTaskTitle('');
  };

  const toggleTask = async (task: CrmTask) => {
    const updated = await crmService.toggleTask(task.id, !task.completed);
    setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const removeTask = async (task: CrmTask) => {
    await crmService.deleteTask(task.id);
    setTasks((current) => current.filter((item) => item.id !== task.id));
  };

  const moveTask = async (targetTaskId: string) => {
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;
    const previous = tasks;
    const fromIndex = tasks.findIndex((task) => task.id === draggedTaskId);
    const toIndex = tasks.findIndex((task) => task.id === targetTaskId);
    if (fromIndex < 0 || toIndex < 0) return;
    const reordered = [...tasks];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const orderedTasks = reordered.map((task, index) => ({ ...task, sort_order: index }));
    setTasks(orderedTasks);
    setDraggedTaskId(null);
    try {
      await crmService.reorderTasks(orderedTasks.map(({ id, sort_order }) => ({ id, sort_order })));
    } catch {
      setTasks(previous);
      setError('Não foi possível salvar a nova ordem das etapas.');
    }
  };

  const checklistText = () => {
    if (!selected) return '';
    const serviceNames = (selected.services || []).map((slug) => serviceCatalog.find((service) => service.slug === slug)?.title || slug);
    const serviceDescription = serviceNames.length ? serviceNames.join(', ') : selected.demand || 'Não informado';
    const items = tasks.map((task, index) => `${index + 1}. ${task.completed ? '[CONCLUÍDO]' : '[PENDENTE]'} ${task.title}`);
    return [
      '*ACOMPANHAMENTO DO SERVIÇO*',
      '',
      `*Cliente:* ${selected.name}`,
      `*Empresa / atuação:* ${selected.company || 'Não informada'}`,
      `*Serviço realizado:* ${serviceDescription}`,
      '',
      '*CHECKLIST*',
      ...items,
      '',
      `*Progresso:* ${completedTasks}/${tasks.length} etapas concluídas.`,
    ].join('\n');
  };

  const copyChecklist = async () => {
    if (!tasks.length) return;
    await navigator.clipboard.writeText(checklistText());
    setCopiedChecklist(true);
    window.setTimeout(() => setCopiedChecklist(false), 2000);
  };

  const sendChecklistToWhatsApp = () => {
    if (!tasks.length) return;
    const digits = selected?.phone?.replace(/\D/g, '') || '';
    const whatsappPhone = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
    const target = whatsappPhone ? `https://wa.me/${whatsappPhone}` : 'https://wa.me/';
    window.open(`${target}?text=${encodeURIComponent(checklistText())}`, '_blank', 'noopener,noreferrer');
  };

  const deleteClient = async () => {
    if (!selected || deleting) return;
    setDeleting(true);
    try {
      await crmService.deleteClient(selected.id);
      setClients((current) => current.filter((client) => client.id !== selected.id));
      setSelected(null);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const toggleService = (slug: string) => setForm((current) => ({ ...current, services: current.services.includes(slug) ? current.services.filter((item) => item !== slug) : [...current.services, slug] }));

  if (selected) {
    return (
      <div className="space-y-5" spellCheck={false}>
        <button onClick={() => { setSelected(null); setConfirmDelete(false); }} className="inline-flex items-center gap-2 text-sm font-semibold text-[#9ba9bc] transition hover:text-white"><ArrowLeft className="h-4 w-4" />Voltar ao funil</button>

        <header className="rounded-2xl border border-[#273548] bg-[#101722] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="flex gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-300"><UserRound className="h-6 w-6" /></span>
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary-300">Ficha do cliente</p><h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{selected.name}</h2><p className="mt-1 text-sm text-[#9ba9bc]">{selected.company || 'Cliente em potencial'}</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select aria-label="Etapa do funil" disabled={saving} value={selected.stage} onChange={(event) => updateStage(selected, event.target.value as CrmStage)} className="rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm font-semibold text-white">{stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select>
              <button onClick={() => onCreateProposal(selected)} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b]"><Send className="h-4 w-4" />Criar proposta</button>
            </div>
          </div>
        </header>

        {saving && <p role="status" className="text-sm text-primary-300">Salvando alterações...</p>}{error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{error}</p>}
        {detailLoading ? <div className="h-80 animate-pulse rounded-2xl bg-[#151f2b]" /> : (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-[#273548] bg-[#101722] p-5">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-primary-300">Dados comerciais</p>
                <div className="mt-4 grid gap-3 text-sm text-[#d7e0ea] sm:grid-cols-2">
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-300" />{selected.email || 'E-mail não informado'}</p>
                  <div className="flex flex-wrap items-center gap-2"><span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary-300" />{selected.cnpj ? `CNPJ ${selected.cnpj}` : 'CNPJ não informado'}</span><span className="flex items-center gap-1.5"><a href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-primary-400/25 bg-primary-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-200 transition hover:border-primary-400/60 hover:bg-primary-500/15">REDESIM<ExternalLink className="h-3 w-3" /></a><a href="https://www.cadesp.fazenda.sp.gov.br/(S(nqtk35dsb3k5pg5ispmnlj3k))/Pages/Cadastro/Consultas/ConsultaPublica/ConsultaPublica.aspx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-sky-400/25 bg-sky-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-200 transition hover:border-sky-400/60 hover:bg-sky-400/15">CADESP<ExternalLink className="h-3 w-3" /></a></span></div>
                  <p className="flex items-start gap-2 sm:col-span-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />{selected.address || 'Endereço não informado'}</p>
                </div>
                {Boolean(selected.services?.length) && <div className="mt-4 border-t border-[#273548] pt-4"><p className="text-xs font-bold uppercase tracking-wide text-[#718096]">Serviços de interesse</p><div className="mt-2 flex flex-wrap gap-2">{selected.services?.map((slug) => <span key={slug} className="rounded-lg border border-primary-400/20 bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-200">{serviceCatalog.find((service) => service.slug === slug)?.title || slug}</span>)}</div></div>}
                <form onSubmit={saveCommercial} className="mt-4 space-y-3 border-t border-[#273548] pt-4">
<fieldset disabled={saving} className="grid gap-3 sm:grid-cols-2">
<label className="text-xs text-[#9ba9bc]">Valor estimado (R$)<input type="number" min="0" max="9999999999.99" step="0.01" value={commercial.value} onChange={(event) => setCommercial((current) => ({ ...current, value: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm text-white" /></label>
<label className="text-xs text-[#9ba9bc]">Próximo contato<input type="date"  value={commercial.date} onChange={(event) => setCommercial((current) => ({ ...current, date: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm text-white" /></label>
<label className="text-xs text-[#9ba9bc]">Próximo passo<input type="text"  value={commercial.step} onChange={(event) => setCommercial((current) => ({ ...current, step: event.target.value }))} className="mt-1 w-full rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm text-white" /></label>
</fieldset><button disabled={saving} className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-bold text-[#0c121b] disabled:opacity-50">Salvar acompanhamento</button>
</form><p className="mt-4 rounded-xl bg-[#151f2b] p-3 text-sm leading-relaxed text-[#9ba9bc]">{selected.demand || 'Sem demanda registrada.'}</p>
              </section>

              <section className="rounded-2xl border border-[#273548] bg-[#101722] p-5">
                <div className="flex items-center gap-2"><CalendarCheck2 className="h-5 w-5 text-primary-300" /><div><h3 className="font-bold text-white">Atividades realizadas</h3><p className="text-xs text-[#9ba9bc]">Registre contatos, reuniões, decisões e entregas.</p></div></div>
                <textarea value={activity} onChange={(event) => setActivity(event.target.value)} placeholder="O que foi feito com este cliente?" className="mt-4 min-h-24 w-full rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm text-white outline-none focus:border-primary-400" />
                <button onClick={saveActivity} className="mt-2 rounded-lg bg-primary-500 px-3 py-2 text-xs font-bold text-[#0c121b]">Registrar atividade</button>
                <div className="mt-5 space-y-3 border-t border-[#273548] pt-4">{notes.map((item) => <article key={item.id} className="rounded-xl bg-[#151f2b] p-3"><p className="whitespace-pre-wrap text-sm text-[#d7e0ea]">{activityWithLinks(item.body)}</p><time className="mt-2 block text-xs text-[#718096]">{new Date(item.created_at).toLocaleString('pt-BR')}</time></article>)}{!notes.length && <p className="rounded-xl border border-dashed border-[#34455a] p-5 text-center text-xs text-[#718096]">Nenhuma atividade registrada.</p>}</div>
              </section>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-5">
              <section className="rounded-2xl border border-primary-400/20 bg-primary-500/5 p-5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary-300">Próximos passos</p><h3 className="mt-1 text-xl font-bold text-white">Checklist comercial</h3></div><span className="rounded-lg bg-primary-500 px-2.5 py-1 text-xs font-bold text-[#0c121b]">{completedTasks}/{tasks.length}</span></div>
                <div className="mt-4 flex gap-2"><input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addTask(); }} placeholder="Adicionar próximo passo" className="min-w-0 flex-1 rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2.5 text-sm text-white outline-none focus:border-primary-400" /><button onClick={addTask} aria-label="Adicionar próximo passo" className="rounded-xl bg-primary-500 px-3 text-[#0c121b]"><Plus className="h-4 w-4" /></button></div>
                <div className="mt-4 space-y-2">{tasks.map((task, index) => <div key={task.id} draggable onDragStart={() => setDraggedTaskId(task.id)} onDragEnd={() => setDraggedTaskId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => moveTask(task.id)} className={`group flex items-start gap-2 rounded-xl border p-3 transition ${draggedTaskId === task.id ? 'scale-[.98] border-primary-400/50 opacity-50' : task.completed ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-[#273548] bg-[#101722]'}`}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-[11px] font-black text-primary-300">{index + 1}</span><button onClick={() => toggleTask(task)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${task.completed ? 'border-emerald-400 bg-emerald-400 text-[#0c121b]' : 'border-[#52647a] text-transparent'}`}>{task.completed ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}</button><button onClick={() => toggleTask(task)} className={`min-w-0 flex-1 text-left text-sm leading-relaxed ${task.completed ? 'text-[#718096] line-through' : 'text-[#d7e0ea]'}`}>{task.title}</button><span title="Arraste para reordenar" className="cursor-grab p-1 text-[#718096] active:cursor-grabbing"><GripVertical className="h-4 w-4" /></span><button onClick={() => removeTask(task)} aria-label={`Excluir ${task.title}`} className="p-1 text-[#718096] opacity-0 transition hover:text-red-300 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button></div>)}{!tasks.length && <p className="rounded-xl border border-dashed border-[#34455a] p-5 text-center text-xs text-[#718096]">Adicione o próximo movimento deste relacionamento.</p>}</div>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-primary-400/15 pt-4"><button type="button" onClick={copyChecklist} disabled={!tasks.length} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#34455a] bg-[#101722] px-3 py-2.5 text-xs font-bold text-[#d7e0ea] transition hover:border-primary-400/50 disabled:cursor-not-allowed disabled:opacity-40"><Copy className="h-4 w-4" />{copiedChecklist ? 'Copiado!' : 'Copiar checklist'}</button><button type="button" onClick={sendChecklistToWhatsApp} disabled={!tasks.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-[#07150c] transition hover:bg-[#34df75] disabled:cursor-not-allowed disabled:opacity-40"><MessageCircle className="h-4 w-4" />Enviar no WhatsApp</button></div>
              </section>

              <section className="rounded-2xl border border-red-400/15 bg-[#101722] p-4">{confirmDelete ? <div><p className="text-sm font-bold text-red-200">Excluir {selected.name}?</p><p className="mt-1 text-xs text-[#9ba9bc]">Atividades e próximos passos também serão removidos.</p><div className="mt-3 flex gap-2"><button onClick={deleteClient} disabled={deleting} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{deleting ? 'Excluindo...' : 'Sim, excluir'}</button><button onClick={() => setConfirmDelete(false)} className="rounded-lg border border-[#34455a] px-3 py-2 text-xs font-semibold text-[#d7e0ea]">Cancelar</button></div></div> : <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-300"><Trash2 className="h-4 w-4" />Excluir cliente</button>}</section>
            </aside>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5" spellCheck={false}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary-300">Relacionamento comercial</p><h3 className="mt-1 text-2xl font-bold text-white">CRM comercial</h3><p className="mt-1 max-w-2xl text-sm text-[#9ba9bc]">Acompanhe oportunidades no funil e abra a ficha para gerenciar atividades e próximos passos.</p></div><button onClick={() => setNewClient(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-[#0c121b]"><Plus className="h-4 w-4" />Novo cliente</button></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718096]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por pessoa, empresa, CNPJ ou e-mail" className="w-full rounded-xl border border-[#273548] bg-[#101722] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary-500" /></div>
      {saving && <p role="status" className="text-sm text-primary-300">Salvando alterações...</p>}{error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{error}</p>}

      {newClient && <section className="grid gap-3 rounded-2xl border border-primary-400/25 bg-primary-500/5 p-4 md:grid-cols-2"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nome do contato *" className="rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm" /><input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Empresa" className="rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm" /><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="E-mail" className="rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm" /><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Telefone" className="rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm" /><input value={form.cnpj} onChange={(event) => setForm({ ...form, cnpj: event.target.value })} placeholder="CNPJ" className="rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm" /><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Endereço" className="rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm" /><fieldset className="rounded-xl border border-[#34455a] bg-[#0c121b]/60 p-3 md:col-span-2"><legend className="px-1 text-xs font-bold uppercase tracking-wide text-[#9ba9bc]">Serviços de interesse</legend><div className="mt-2 flex flex-wrap gap-2">{serviceCatalog.map((service) => { const active = form.services.includes(service.slug); return <button key={service.slug} type="button" onClick={() => toggleService(service.slug)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${active ? 'border-primary-400 bg-primary-500/15 text-primary-200' : 'border-[#34455a] bg-[#151f2b] text-[#9ba9bc]'}`}>{service.title}</button>; })}</div></fieldset><textarea value={form.demand} onChange={(event) => setForm({ ...form, demand: event.target.value })} placeholder="Demanda inicial" className="min-h-20 rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm md:col-span-2" /><div className="flex gap-2 md:col-span-2"><button onClick={saveClient} className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-[#0c121b]">Salvar cliente</button><button onClick={() => setNewClient(false)} className="rounded-xl border border-[#34455a] px-4 py-2 text-sm font-semibold text-[#d7e0ea]">Cancelar</button></div></section>}

      <div className="flex gap-2" aria-label="Visualização do CRM">{([{ id: 'stages', label: 'Etapas do funil' }, { id: 'indicators', label: 'Indicadores e gráficos' }] as const).map((item) => <button key={item.id} type="button" aria-pressed={view === item.id} onClick={() => setView(item.id)} className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${view === item.id ? 'border-primary-400 bg-primary-500/15 text-primary-200' : 'border-[#34455a] text-[#9ba9bc] hover:text-white'}`}>{item.label}</button>)}</div>
      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#151f2b]" /> : view === 'indicators' ? <CrmIndicators clients={filtered} /> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{stages.map((stage) => { const stageClients = filtered.filter((client) => client.stage === stage.id); return <section key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedClient) updateStage(draggedClient, stage.id); setDraggedClient(null); }} className={`min-h-[420px] rounded-2xl border p-2.5 ${draggedClient ? 'border-primary-400/45 bg-primary-500/5' : 'border-[#273548] bg-[#0c121b]/45'}`}><div className="mb-3 flex items-center justify-between px-1"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#d7e0ea]">{stage.label}</span><span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${stage.color}`}>{stageClients.length}</span></div><p className="mb-3 px-1 text-xs text-[#9ba9bc]">{currency.format(stageClients.reduce((total, client) => total + Number(client.estimated_value || 0), 0))} estimados</p><div className="space-y-2">{stageClients.map((client) => <button key={client.id} disabled={saving} draggable={!saving} onDragStart={() => setDraggedClient(client)} onDragEnd={() => setDraggedClient(null)} onClick={() => setSelected(client)} className={`w-full cursor-grab rounded-xl border p-3 text-left transition active:cursor-grabbing ${client.stage === 'novo' ? 'border-transparent bg-primary-500/15 hover:bg-primary-500/20' : 'border-[#273548] bg-[#101722] hover:border-[#41546b]'}`}><div className="flex items-center gap-2.5"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${client.stage === 'novo' ? 'bg-primary-500 text-[#0c121b]' : 'bg-[#151f2b] text-primary-300'}`}>{client.company ? <Building2 className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{client.name}</p><p className="truncate text-xs text-[#9ba9bc]">{client.company || client.email || 'Sem empresa informada'}</p></div><ChevronRight className="h-4 w-4 text-[#718096]" /></div><div className="mt-3 space-y-1 text-xs text-[#9ba9bc]">
<p className="font-semibold text-primary-200">{client.estimated_value != null ? currency.format(client.estimated_value) : 'Valor não informado'}</p>
<p className="break-words">{client.next_step || 'Próximo passo não definido'}</p>
<p>Último contato: {client.last_contact_at ? new Date(client.last_contact_at).toLocaleDateString('pt-BR') : 'Não registrado'}</p>
{client.stage !== 'ganho' && client.stage !== 'perdido' && <p className={client.next_contact_on && client.next_contact_on < today ? 'font-semibold text-red-300' : ''}>{client.next_contact_on ? (client.next_contact_on < today ? 'Retorno atrasado: ' : 'Retorno: ') + new Date(client.next_contact_on + 'T12:00:00').toLocaleDateString('pt-BR') : 'Retorno não agendado'}</p>}
</div><div className="mt-3 flex justify-between text-[11px] text-[#718096]"><span>{client.source === 'contato' ? 'Formulário' : 'Manual'}</span><span>{new Date(client.created_at).toLocaleDateString('pt-BR')}</span></div></button>)}{!stageClients.length && <div className="rounded-xl border border-dashed border-[#34455a] px-3 py-6 text-center text-xs text-[#718096]">Arraste uma oportunidade para cá</div>}</div></section>; })}</div>}
    </div>
  );
};
