import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Lightbulb, Plus, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Idea, IdeaHypothesis, IdeaStage, ideasService } from '../services/ideasService';
import { projectsService } from '../services/projectsService';
import IdeaWorkspaceModal from '../components/modals/IdeaWorkspaceModal';

const stages: { id: IdeaStage; label: string; hint: string; color: string }[] = [
  { id: 'capture', label: 'Captura', hint: 'Ideias ainda cruas', color: 'text-primary-300' },
  { id: 'discovery', label: 'Descoberta', hint: 'Problema e público', color: 'text-sky-300' },
  { id: 'validation', label: 'Validação', hint: 'Hipóteses em teste', color: 'text-violet-300' },
  { id: 'incubation', label: 'Incubação', hint: 'Evidência sendo consolidada', color: 'text-orange-300' },
  { id: 'ready', label: 'Prontas', hint: 'Podem virar projeto', color: 'text-emerald-300' },
  { id: 'archived', label: 'Arquivadas', hint: 'Pausadas ou descartadas', color: 'text-slate-400' },
];

interface IdeasPageProps {
  initialIdeas?: Idea[];
  initialHypotheses?: IdeaHypothesis[];
  showcaseFrame?: number;
}

const IdeasPage = ({ initialIdeas, initialHypotheses = [], showcaseFrame }: IdeasPageProps = {}) => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas ?? []);
  const [loading, setLoading] = useState(!initialIdeas);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [draggedIdea, setDraggedIdea] = useState<Idea | null>(null);
  const [hypotheses, setHypotheses] = useState<IdeaHypothesis[]>(initialHypotheses);
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', audience: '', problem: '', proposed_solution: '' });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [savingIdea, setSavingIdea] = useState(false);
  const [pageError, setPageError] = useState('');

  const load = async () => { setLoading(true); setPageError(''); try { setIdeas(await ideasService.getAll()); } catch { setPageError('Não foi possível carregar suas ideias. Tente novamente.'); } finally { setLoading(false); } };
  useEffect(() => { if (!initialIdeas) load(); }, [initialIdeas]);
  useEffect(() => {
    if (!selected || initialIdeas) return;
    let cancelled = false;
    const id = selected.id;
    void Promise.all([ideasService.getById(id), ideasService.getHypotheses(id)]).then(([fresh, rows]) => {
      if (cancelled) return;
      setIdeas(all => all.map(idea => idea.id === id ? fresh : idea));
      setSelected(current => current?.id === id ? fresh : current); setHypotheses(rows);
    }).catch(() => { if (!cancelled) setPageError('Não foi possível atualizar esta ideia. Tente novamente.'); });
    return () => { cancelled = true; };
  }, [selected?.id, initialIdeas]);
  const showcaseIdeas = useMemo(() => showcaseFrame === undefined ? ideas : ideas.map((idea, index) => index === 0 ? {
    ...idea,
    stage: showcaseFrame >= 220 ? 'validation' as IdeaStage : idea.stage,
    curation_score: Math.round(idea.curation_score + Math.max(0, Math.min(1, (showcaseFrame - 430) / 60)) * (90 - idea.curation_score)),
    evidence: showcaseFrame >= 455 ? '7 de 10 gestores confirmaram perda de tempo no acompanhamento manual.' : idea.evidence,
  } : idea), [ideas, showcaseFrame]);
  const showcaseHypotheses = useMemo(() => showcaseFrame === undefined ? hypotheses : hypotheses.map((item, index) => index === 0 && showcaseFrame >= 410 ? {...item, status: 'testing' as const} : item), [hypotheses, showcaseFrame]);
  const showcaseSelected = showcaseFrame !== undefined && showcaseFrame >= 300 ? showcaseIdeas[0] ?? null : selected;
  const filtered = useMemo(() => showcaseIdeas.filter((idea) => `${idea.title} ${idea.description || ''} ${idea.audience || ''}`.toLowerCase().includes(query.toLowerCase())), [showcaseIdeas, query]);
  const saveNew = async () => { if (!form.title.trim() || savingIdea) return; setSavingIdea(true); try { let idea = await ideasService.create(form); if (newImages.length) { const image_urls = await ideasService.uploadImages(idea.id, newImages); idea = await ideasService.update(idea.id, { image_urls }); } setIdeas((all) => [idea, ...all]); setForm({ title: '', description: '', audience: '', problem: '', proposed_solution: '' }); setNewImages([]); setCreateOpen(false); setSelected(idea); } finally { setSavingIdea(false); } };
  const updateSelected = async (data: Partial<Idea>) => { if (!selected) return; const updated = await ideasService.update(selected.id, data); setIdeas((all) => all.map((idea) => idea.id === updated.id ? updated : idea)); setSelected(updated); };
  const moveIdea = async (idea: Idea, stage: IdeaStage) => { if (idea.stage === stage) return; const updated = await ideasService.update(idea.id, { stage }); setIdeas((all) => all.map((current) => current.id === updated.id ? updated : current)); if (selected?.id === updated.id) setSelected(updated); };
  const promote = async () => { if (!selected) return; const project = await projectsService.create({ name: selected.title, description: selected.description || selected.problem || undefined, stage: 'ideation' }); await updateSelected({ promoted_project_id: String(project.id), stage: 'ready' }); navigate(`/dashboard/projects/${project.id}`); };

  return <main className="min-h-screen space-y-6 bg-[#171c24] p-4 text-white md:p-6 lg:p-8">
    {pageError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"><span>{pageError}</span><button type="button" onClick={() => void load()} className="font-bold">Tentar novamente</button></div>}
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary-300">Pré-projeto</p><h1 className="mt-1 text-3xl font-bold">Ideias e incubação</h1><p className="mt-2 max-w-2xl text-sm text-[#9ba9bc]">Capture sinais, teste hipóteses e use curadoria antes de comprometer uma ideia com um projeto.</p></div><button onClick={() => setCreateOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-[#0c121b]"><Plus className="h-4 w-4" />Nova ideia</button></header>
    <div className="grid gap-3 sm:grid-cols-3">{[['Em incubação', showcaseIdeas.filter((idea) => idea.stage === 'incubation').length], ['Em validação', showcaseIdeas.filter((idea) => idea.stage === 'validation').length], ['Prontas para projeto', showcaseIdeas.filter((idea) => idea.stage === 'ready').length]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-[#273548] bg-[#101722] p-4"><p className="text-xs text-[#9ba9bc]">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</div>
    <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718096]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ideias, público ou problema" className="w-full rounded-xl border border-[#273548] bg-[#101722] py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-500" /></div>
    {loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#101722]" /> : <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{stages.map((stage) => { const stageIdeas = filtered.filter((idea) => idea.stage === stage.id); const previewDirection = stage.id === 'capture' || stage.id === 'discovery' ? 'right' : 'left'; return <section key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedIdea) moveIdea(draggedIdea, stage.id); setDraggedIdea(null); }} className={`min-h-[320px] rounded-2xl border p-2.5 transition ${draggedIdea ? 'border-primary-400/50 bg-primary-500/5' : 'border-[#273548] bg-[#101722]'}`}><div className="mb-3 px-1"><div className="flex justify-between"><h2 className={`text-xs font-bold uppercase tracking-[.12em] ${stage.color}`}>{stage.label}</h2><span className="text-xs text-[#718096]">{stageIdeas.length}</span></div><p className="mt-1 text-[11px] text-[#718096]">{stage.hint}</p></div><div className="space-y-2">{stageIdeas.map((idea) => <IdeaPreviewCard key={idea.id} idea={idea} direction={previewDirection} onOpen={() => setSelected(idea)} onDragStart={() => setDraggedIdea(idea)} onDragEnd={() => setDraggedIdea(null)} />)}{!stageIdeas.length && <p className="rounded-xl border border-dashed border-[#34455a] p-4 text-center text-xs text-[#718096]">Arraste uma ideia para cá</p>}</div></section>; })}</section>}
    {createOpen && <Dialog title="Capturar nova ideia" close={() => setCreateOpen(false)}><IdeaFields values={form} setValues={setForm} /><ImageAttachments files={newImages} onFilesChange={setNewImages} /><button disabled={savingIdea} onClick={saveNew} className="mt-4 w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-[#0c121b] disabled:opacity-60">{savingIdea ? 'Salvando imagens...' : 'Salvar na captura'}</button></Dialog>}
    {showcaseSelected && <IdeaWorkspaceModal key={showcaseSelected.id} idea={showcaseSelected} hypotheses={showcaseHypotheses} readOnly={Boolean(initialIdeas)} onClose={() => setSelected(null)} onSave={updateSelected} onRefresh={async () => {
      const updated = await ideasService.getById(showcaseSelected.id);
      setIdeas(all => all.map(idea => idea.id === updated.id ? updated : idea));
      setSelected(current => current?.id === updated.id ? updated : current);
    }} onUpload={async files => {
      const sources = showcaseSelected.image_sources ?? showcaseSelected.image_urls ?? [];
      if (sources.length + files.length > 2) throw new Error('Escolha no máximo duas imagens por ideia.');
      const paths = await ideasService.uploadImages(showcaseSelected.id, files);
      await updateSelected({ image_urls: [...sources, ...paths] });
    }} onRemove={async index => {
      const sources = showcaseSelected.image_sources ?? showcaseSelected.image_urls ?? [];
      await updateSelected({ image_urls: sources.filter((_, position) => position !== index) });
    }} onRecover={async () => {
      const updated = await ideasService.recoverImages(showcaseSelected.id);
      setIdeas(all => all.map(idea => idea.id === updated.id ? updated : idea)); setSelected(updated);
      return (updated.image_sources ?? []).length;
    }} onAddHypothesis={async text => {
      const item = await ideasService.addHypothesis(showcaseSelected.id, text);
      setHypotheses(all => [item, ...all]);
    }} onHypothesisStatus={async (id, status) => {
      const updated = await ideasService.updateHypothesis(id, { status });
      setHypotheses(all => all.map(item => item.id === updated.id ? updated : item));
    }} onPromote={promote} />}
  </main>;
};
const Field = ({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) => <label className="block text-xs font-bold uppercase tracking-wide text-[#9ba9bc]">{label}{multiline ? <textarea spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm font-normal normal-case text-white" /> : <input spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] p-3 text-sm font-normal normal-case text-white" />}</label>;
const IdeaPreviewCard = ({ idea, direction, onOpen, onDragStart, onDragEnd }: { idea: Idea; direction: 'left' | 'right'; onOpen: () => void; onDragStart: () => void; onDragEnd: () => void }) => <div className="group relative"><button draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onOpen} className="w-full cursor-grab rounded-xl border border-[#273548] bg-[#151f2b] p-3 text-left transition hover:border-primary-400/60 hover:bg-[#192331] active:cursor-grabbing"><div className="flex gap-2"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" /><p className="line-clamp-2 text-sm font-bold">{idea.title}</p></div><p className="mt-2 line-clamp-2 text-xs text-[#9ba9bc]">{idea.problem || idea.description || 'Defina o problema a explorar.'}</p><p className="mt-3 text-right text-xs font-bold text-primary-300">Curadoria {idea.curation_score}%</p></button><div className={`pointer-events-none absolute bottom-full z-40 mb-2 hidden w-[30rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-primary-400/30 bg-[#101722] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 lg:block lg:translate-y-1 ${direction === 'right' ? 'left-0' : 'right-0'}`}><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500/10"><Lightbulb className="h-4 w-4 text-primary-300" /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.12em] text-primary-300">Prévia da ideia</p><h3 className="mt-1 line-clamp-2 text-base font-bold text-white">{idea.title}</h3></div></div><div className={`mt-4 grid gap-4 ${idea.image_urls?.length ? 'grid-cols-[10rem_minmax(0,1fr)]' : 'grid-cols-1'}`}>{Boolean(idea.image_urls?.length) && <div className={`grid items-start gap-2 ${idea.image_urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>{idea.image_urls.filter(Boolean).slice(0, 2).map((url, index) => <div key={url} className="w-fit max-w-full overflow-hidden rounded-xl border border-[#34455a]"><img src={url} alt={`Referência ${index + 1} da ideia`} className="block h-auto max-h-40 max-w-full w-auto" /></div>)}</div>}<div className="space-y-3"><div><p className="text-[11px] font-bold uppercase tracking-wide text-[#718096]">Problema</p><p className="mt-1 line-clamp-3 text-sm leading-relaxed text-[#d7e0ea]">{idea.problem || idea.description || 'Ainda sem contexto registrado.'}</p></div>{idea.audience && <div><p className="text-[11px] font-bold uppercase tracking-wide text-[#718096]">Público</p><p className="mt-1 line-clamp-2 text-sm text-[#d7e0ea]">{idea.audience}</p></div>}{idea.proposed_solution && <div><p className="text-[11px] font-bold uppercase tracking-wide text-[#718096]">Aposta de solução</p><p className="mt-1 line-clamp-2 text-sm text-[#d7e0ea]">{idea.proposed_solution}</p></div>}</div></div><div className="mt-4 flex items-center justify-between border-t border-[#273548] pt-3"><span className="text-xs text-[#9ba9bc]">Clique para abrir</span><span className="text-xs font-bold text-primary-300">Curadoria {idea.curation_score}%</span></div></div></div>;
const IdeaFields = ({ values, setValues }: { values: { title: string; description: string; audience: string; problem: string; proposed_solution: string }; setValues: (values: { title: string; description: string; audience: string; problem: string; proposed_solution: string }) => void }) => <div className="grid gap-3"><Field label="Ideia *" value={values.title} onChange={(title) => setValues({ ...values, title })} /><Field label="Contexto" value={values.description} multiline onChange={(description) => setValues({ ...values, description })} /><Field label="Público" value={values.audience} onChange={(audience) => setValues({ ...values, audience })} /><Field label="Problema" value={values.problem} multiline onChange={(problem) => setValues({ ...values, problem })} /><Field label="Possível solução" value={values.proposed_solution} multiline onChange={(proposed_solution) => setValues({ ...values, proposed_solution })} /></div>;
const ImageAttachments = ({ imageUrls = [], files = [], onFilesChange, onRemoveUrl }: { imageUrls?: string[]; files?: File[]; onFilesChange: (files: File[]) => void | Promise<void>; onRemoveUrl?: (url: string) => void }) => {
  const occupied = imageUrls.length + files.length;
  const addFiles = (list: FileList | null) => { const next = Array.from(list || []).filter((file) => file.type.startsWith('image/')).slice(0, 2 - occupied); if (next.length) onFilesChange([...files, ...next]); };
  return <section className="mt-4 rounded-2xl border border-[#273548] bg-[#151f2b] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-white">Imagens de referência</p><p className="mt-1 text-xs text-[#9ba9bc]">Adicione até 2 imagens para dar contexto à ideia.</p></div><span className="rounded-lg bg-[#0c121b] px-2 py-1 text-xs font-bold text-primary-300">{occupied}/2</span></div><div className="mt-3 grid grid-cols-2 items-start gap-3">{imageUrls.map((url) => <div key={url} className="group relative w-fit max-w-full overflow-hidden rounded-xl border border-[#34455a] bg-[#0c121b]"><img src={url} alt="Referência da ideia" className="block h-auto max-h-72 max-w-full w-auto" />{onRemoveUrl && <button type="button" onClick={() => onRemoveUrl(url)} className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-label="Remover imagem"><X className="h-3.5 w-3.5" /></button>}</div>)}{files.map((file) => <div key={`${file.name}-${file.lastModified}`} className="relative w-fit max-w-full overflow-hidden rounded-xl border border-primary-400/40 bg-[#0c121b]"><img src={URL.createObjectURL(file)} alt="Prévia da imagem" className="block h-auto max-h-72 max-w-full w-auto" /><button type="button" onClick={() => onFilesChange(files.filter((item) => item !== file))} className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-white" aria-label="Remover imagem"><X className="h-3.5 w-3.5" /></button></div>)}{occupied < 2 && <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#4a5d73] bg-[#0c121b] px-3 text-center transition-colors hover:border-primary-400 hover:bg-primary-500/5"><ImagePlus className="h-5 w-5 text-primary-300" /><span className="mt-2 text-xs font-semibold text-[#d7e0ea]">Adicionar imagem</span><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ''; }} /></label>}</div></section>;
};
const Dialog = ({ title, close, children, workspace = false }: { title: string; close: () => void; children: React.ReactNode; workspace?: boolean }) => <div className={`fixed inset-0 z-[100] flex bg-black/75 backdrop-blur-sm ${workspace ? 'items-stretch p-0' : 'items-end p-0 sm:items-center sm:justify-center sm:p-5'}`} onMouseDown={close}><div className={workspace ? 'h-full w-full overflow-y-auto bg-[#171c24] p-4 shadow-2xl md:p-6 lg:p-8' : 'max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[#34455a] bg-[#101722] p-5 shadow-2xl sm:rounded-3xl sm:p-6'} onMouseDown={(event) => event.stopPropagation()}><div className={workspace ? 'mx-auto mb-6 flex max-w-7xl items-center justify-between gap-3 border-b border-[#273548] pb-5' : 'mb-5 flex justify-between gap-3'}><div><p className={workspace ? 'mb-1 text-xs font-bold uppercase tracking-[.14em] text-primary-300' : 'hidden'}>Espaço da ideia</p><h2 className="text-xl font-bold text-white">{title}</h2></div><button onClick={close} className="rounded-xl border border-[#34455a] bg-[#101722] p-2 text-[#9ba9bc] transition-colors hover:bg-[#151f2b] hover:text-white" aria-label="Voltar para o kanban"><X className="h-4 w-4" /></button></div><div className={workspace ? 'mx-auto max-w-7xl' : ''}>{children}</div></div></div>;
export default IdeasPage;
