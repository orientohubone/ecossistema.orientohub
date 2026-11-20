import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { AlertTriangle, ArrowLeft, ArrowRight, Beaker, Brain, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, ImageIcon, Lightbulb, Loader2, RefreshCw, Save, Sparkles, Upload, Users, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { HypothesisStatus, Idea, IdeaHypothesis } from '../../services/ideasService';
import { generateIntelligenceSuggestions, type Suggestion } from '../../services/ideasIntelligenceService';

interface Props {
  idea: Idea; hypotheses: IdeaHypothesis[]; readOnly?: boolean; onClose: () => void;
  onSave: (data: Partial<Idea>) => Promise<void>; onRefresh: () => Promise<void>;
  onUpload: (files: File[]) => Promise<void>; onRemove: (index: number) => Promise<void>;
  onRecover: () => Promise<number>;
  onAddHypothesis: (text: string) => Promise<void>;
  onHypothesisStatus: (id: string, status: HypothesisStatus) => Promise<void>;
  onPromote: () => Promise<void>;
}
const stageLabels: Record<string, string> = { capture: 'Captura', discovery: 'Descoberta', validation: 'Validação', incubation: 'Incubação', ready: 'Pronta para projeto', archived: 'Arquivada' };
const fieldClass = 'mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-4 py-3 text-sm font-normal text-white outline-none focus:border-primary-400 disabled:opacity-60';
const makeDraft = (idea: Idea) => ({ title: idea.title, description: idea.description || '', audience: idea.audience || '', problem: idea.problem || '', proposed_solution: idea.proposed_solution || '', evidence: idea.evidence || '', curation_notes: idea.curation_notes || '', curation_score: idea.curation_score, market_analysis: idea.market_analysis || '', customer_persona: idea.customer_persona || '', business_model_notes: idea.business_model_notes || '', competitive_analysis: idea.competitive_analysis || '' });

type TabId = 'overview' | 'intelligence' | 'images' | 'validation';

export default function IdeaWorkspaceModal(props: Props) {
  const { idea, hypotheses, readOnly = false } = props;
  const [tab, setTab] = useState<TabId>('overview');
  const [draft, setDraft] = useState(() => makeDraft(idea));
  const [baseline, setBaseline] = useState(() => JSON.stringify(makeDraft(idea)));
  const [busy, setBusy] = useState('');
  const busyRef = useRef(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [closing, setClosing] = useState(false);
  const [hypothesisText, setHypothesisText] = useState('');
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState<number[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  const retried = useRef(new Set<number>());
  const dirty = baseline !== JSON.stringify(draft);
  const sources = idea.image_sources ?? idea.image_urls ?? [];
  const imageKey = idea.image_urls.join('|');
  const suggestions = generateIntelligenceSuggestions(idea);
  const allSuggestions: Suggestion[] = [
    ...suggestions.hypothesisSuggestions,
    ...suggestions.marketSuggestions,
    ...suggestions.customerSuggestions,
    ...suggestions.businessModelSuggestions,
    ...suggestions.competitiveSuggestions,
    ...suggestions.smartInsights,
  ];
  const pendingCount = allSuggestions.filter(s => !s.applied && !appliedSuggestions.has(s.id)).length;
  useEffect(() => { setFailed([]); }, [imageKey]);
  useEffect(() => {
    if (readOnly) return;
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void props.onRefresh().catch(() => { }); }, 45 * 60000);
    return () => window.clearInterval(timer);
  }, [idea.id, readOnly, props.onRefresh]);
  const perform = async (name: string, action: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(name); setError(''); setNotice('');
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Não foi possível concluir esta ação. Tente novamente.'); }
    finally { busyRef.current = false; setBusy(''); }
  };
  const refresh = () => perform('images', async () => { setFailed([]); await props.onRefresh(); });
  const close = () => { if (busyRef.current) return; if (dirty) setClosing(true); else props.onClose(); };
  const field = (key: Exclude<keyof typeof draft, 'curation_score'>, label: string, hint: string, rows = 3) => <label key={key} className="block text-sm font-semibold text-[#d7e0ea]">{label}{key === 'title' ? <input value={draft[key]} disabled={readOnly || Boolean(busy)} onChange={event => setDraft(current => ({ ...current, [key]: event.target.value }))} placeholder={hint} className={fieldClass} /> : <textarea rows={rows} value={draft[key]} disabled={readOnly || Boolean(busy)} onChange={event => setDraft(current => ({ ...current, [key]: event.target.value }))} placeholder={hint} className={`${fieldClass} resize-y`} />}</label>;
  const onImageFailure = (index: number) => {
    setFailed(current => current.includes(index) ? current : [...current, index]);
    if (!readOnly && !retried.current.has(index)) {
      retried.current.add(index);
      void props.onRefresh().catch(() => { });
    }
  };
  const applySuggestion = (suggestion: Suggestion) => {
    if (readOnly) return;
    if (appliedSuggestions.has(suggestion.id)) return;
    const sectionMap: Record<string, keyof typeof draft> = {
      market: 'market_analysis',
      customer: 'customer_persona',
      business_model: 'business_model_notes',
      competitive: 'competitive_analysis',
      hypothesis: 'problem',
    };
    const fieldKey = sectionMap[suggestion.section];
    if (fieldKey) {
      const currentValue = draft[fieldKey] || '';
      const separator = currentValue && !currentValue.endsWith('\n') ? '\n\n' : '';
      setDraft(current => ({ ...current, [fieldKey]: currentValue + separator + suggestion.template }));
      setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
      setNotice(`Sugestão aplicada: ${suggestion.title}`);
    }
  };
  const activeImage = imageIndex === null ? '' : idea.image_urls[imageIndex];
  const sectionIcon = (section: string) => {
    switch (section) {
      case 'hypothesis': return <Beaker className="h-4 w-4" />;
      case 'market': return <ArrowRight className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      case 'business_model': return <Save className="h-4 w-4" />;
      case 'competitive': return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };
  const sectionLabel = (section: string) => {
    switch (section) {
      case 'hypothesis': return 'Hipótese';
      case 'market': return 'Mercado';
      case 'customer': return 'Cliente';
      case 'business_model': return 'Negócio';
      case 'competitive': return 'Competição';
      default: return 'Insight';
    }
  };
  const sectionLeftAccent = (section: string) => {
    switch (section) {
      case 'hypothesis': return 'border-l-violet-400/70';
      case 'market': return 'border-l-sky-400/70';
      case 'customer': return 'border-l-emerald-400/70';
      case 'business_model': return 'border-l-amber-400/70';
      case 'competitive': return 'border-l-rose-400/70';
      default: return 'border-l-primary-400/70';
    }
  };
  const sectionDotColor = (section: string) => {
    switch (section) {
      case 'hypothesis': return 'bg-violet-400';
      case 'market': return 'bg-sky-400';
      case 'customer': return 'bg-emerald-400';
      case 'business_model': return 'bg-amber-400';
      case 'competitive': return 'bg-rose-400';
      default: return 'bg-primary-400';
    }
  };
  const sectionBadgeCls = (section: string) => {
    switch (section) {
      case 'hypothesis': return 'bg-violet-500/10 text-violet-300';
      case 'market': return 'bg-sky-500/10 text-sky-300';
      case 'customer': return 'bg-emerald-500/10 text-emerald-300';
      case 'business_model': return 'bg-amber-500/10 text-amber-300';
      case 'competitive': return 'bg-rose-500/10 text-rose-300';
      default: return 'bg-primary-500/10 text-primary-300';
    }
  };
  const priorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-300';
      case 'medium': return 'bg-amber-500/10 text-amber-300';
      default: return 'bg-[#9ba9bc]/10 text-[#9ba9bc]';
    }
  };
  return <>
    <Dialog open onClose={close} className="relative z-[160]">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4 lg:p-6">
        <Dialog.Panel className="flex h-full max-h-[960px] w-full max-w-7xl flex-col overflow-hidden border border-[#34455a] bg-[#101722] text-white shadow-2xl sm:h-[94dvh] sm:rounded-2xl">
          <header className="shrink-0 border-b border-[#273548] px-4 py-4 sm:px-7 sm:py-5"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 gap-3"><span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-400/25 bg-primary-400/10 text-primary-300 sm:flex"><Lightbulb className="h-6 w-6" /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary-300">Ideias / Espaço de trabalho</p><Dialog.Title className="mt-1 break-words text-xl font-bold tracking-tight sm:text-2xl">{idea.title}</Dialog.Title><Dialog.Description className="mt-2 flex flex-wrap gap-3 text-xs text-[#9ba9bc]"><span className="text-primary-200">{stageLabels[idea.stage]}</span><span>{sources.length} imagens</span><span>{hypotheses.length} hipóteses</span>{pendingCount > 0 && <span className="flex items-center gap-1 text-primary-300"><Sparkles className="h-3 w-3" />{pendingCount} sugestões</span>}</Dialog.Description></div></div><button type="button" onClick={close} disabled={Boolean(busy)} aria-label="Fechar ideia" className="rounded-xl border border-[#34455a] p-2 text-[#9ba9bc] hover:text-white disabled:opacity-40"><X className="h-5 w-5" /></button></div></header>
          <nav aria-label="Seções da ideia" className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#273548] px-4 sm:px-7">{[{ id: 'overview', label: 'Dossiê', icon: Lightbulb }, { id: 'intelligence', label: `Inteligência`, icon: Brain }, { id: 'images', label: `Referências (${sources.length})`, icon: ImageIcon }, { id: 'validation', label: 'Validação e curadoria', icon: Beaker }].map(item => <button type="button" key={item.id} onClick={() => setTab(item.id)} aria-current={tab === item.id ? 'page' : undefined} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold ${tab === item.id ? 'border-primary-400 text-primary-300' : 'border-transparent text-[#9ba9bc] hover:text-white'}`}><item.icon className="h-4 w-4" />{item.label}{item.id === 'intelligence' && pendingCount > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-400 text-[10px] font-bold text-black">{pendingCount}</span>}</button>)}</nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7">
            {closing && <div role="alert" className="mb-5 rounded-xl border border-primary-400/30 bg-primary-400/10 p-4 text-sm text-primary-100"><p>Você tem alterações ainda não salvas.</p><div className="mt-3 flex flex-wrap gap-4"><button type="button" onClick={() => setClosing(false)} className="font-bold">Continuar edição</button><button type="button" onClick={props.onClose} className="text-[#c2cedd]">Descartar e fechar</button></div></div>}
            {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
            {notice && <p role="status" className="mb-5 text-sm text-emerald-300">{notice}</p>}

            {/* ─── Dossiê ──────────────────────────────────────── */}
            {tab === 'overview' && <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="space-y-5">{field('title', 'Nome da ideia', 'Dê um nome à sua ideia')}{field('description', 'Contexto e visão', 'O que você observou e por que vale explorar?', 4)}<div className="grid gap-5 md:grid-cols-2">{field('audience', 'Para quem', 'Quem enfrenta esse problema?')}{field('problem', 'Problema a resolver', 'Qual dificuldade concreta precisa ser resolvida?')}</div>{field('proposed_solution', 'Possível solução', 'Como você pretende resolver esse problema?', 4)}</div><aside className="space-y-4 rounded-xl border border-[#273548] bg-[#0c121b] p-5"><p className="text-xs font-bold uppercase tracking-widest text-primary-300">Em foco</p><h3 className="font-bold">Da observação à evidência</h3><p className="text-sm leading-relaxed text-[#9ba9bc]">Registre o contexto, organize referências e teste suas suposições antes de transformar esta ideia em um projeto.</p><button type="button" onClick={() => setTab('intelligence')} className="flex w-full items-center justify-between border-t border-[#273548] pt-4 text-sm text-[#d7e0ea]">Inteligência da ideia<ArrowRight className="h-4 w-4 text-primary-300" /></button><button type="button" onClick={() => setTab('images')} className="flex w-full items-center justify-between border-t border-[#273548] pt-4 text-sm text-[#d7e0ea]">Ver referências<ArrowRight className="h-4 w-4 text-primary-300" /></button><button type="button" onClick={() => setTab('validation')} className="flex w-full items-center justify-between border-t border-[#273548] pt-4 text-sm text-[#d7e0ea]">Revisar validação<ArrowRight className="h-4 w-4 text-primary-300" /></button><p className="border-t border-[#273548] pt-4 text-xs leading-relaxed text-[#718096]">A etapa da ideia continua sendo movimentada pelo kanban.</p></aside></div>}

            {/* ─── Inteligência ────────────────────────────────── */}
            {tab === 'intelligence' && <div className="grid items-start gap-6 xl:grid-cols-2">
              {/* Coluna esquerda: campos editáveis */}
              <div className="space-y-5">
                <div className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary-300" /><h3 className="font-bold">Análise de Mercado</h3></div>
                {field('market_analysis', 'Análise de mercado', 'TAM, SAM, SOM, tendências, demanda. Use as sugestões ao lado como ponto de partida.', 5)}

                <div className="flex items-center gap-2 mt-6"><Users className="h-5 w-5 text-emerald-300" /><h3 className="font-bold">Perfil do Cliente Ideal</h3></div>
                {field('customer_persona', 'Persona do cliente', 'Demografia, dores, jornada, critérios de decisão. Clique nas sugestões para aplicar templates.', 5)}

                <div className="flex items-center gap-2 mt-6"><Save className="h-5 w-5 text-orange-300" /><h3 className="font-bold">Modelo de Negócio</h3></div>
                {field('business_model_notes', 'Modelo de negócio', 'Proposta de valor, precificação, canais, receita.', 4)}

                <div className="flex items-center gap-2 mt-6"><Sparkles className="h-5 w-5 text-pink-300" /><h3 className="font-bold">Análise Competitiva</h3></div>
                {field('competitive_analysis', 'Competidores e diferenciais', 'Quem resolve o mesmo problema? Quais alternativas existem?', 4)}
              </div>

              {/* Coluna direita: sugestões inteligentes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Sugestões inteligentes</h3>
                  {pendingCount > 0 && <span className="text-xs text-primary-300">{pendingCount} sugestões disponíveis</span>}
                </div>

                {allSuggestions.length === 0 && <div className="rounded-xl border border-dashed border-[#273548] bg-[#0c121b] p-5 text-center"><Brain className="mx-auto mb-2 h-8 w-8 text-[#718096]" /><p className="text-xs text-[#9ba9bc]">Preencha mais campos no dossiê para receber sugestões.</p></div>}

                <div className="rounded-xl border border-[#273548] bg-[#0c121b] divide-y divide-[#273548]">
                  {allSuggestions.filter(s => !s.applied && !appliedSuggestions.has(s.id)).map(suggestion => {
                    const isApplied = appliedSuggestions.has(suggestion.id);
                    const isExpanded = expandedSuggestions.has(suggestion.id);
                    const isApplicable = ['hypothesis','market','customer','business_model','competitive'].includes(suggestion.section);
                    return (
                      <div key={suggestion.id}>
                        <div className={`flex flex-col gap-0.5 px-3.5 py-2.5 transition ${isApplied ? 'opacity-50' : 'hover:bg-[#0f1720]'}`}>
                          <div className="flex items-center gap-3">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${sectionDotColor(suggestion.section)}`} />
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sectionBadgeCls(suggestion.section)}`}>
                              {sectionLabel(suggestion.section)}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="text-xs font-semibold text-white truncate block">{suggestion.title}</span>
                            </span>
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityBadge(suggestion.priority)}`}>
                              {suggestion.priority === 'high' ? 'A' : suggestion.priority === 'medium' ? 'M' : 'B'}
                            </span>
                            {!readOnly && isApplicable && (
                              <button type="button" onClick={(event) => { event.stopPropagation(); applySuggestion(suggestion); }} className="shrink-0 rounded border border-primary-500/30 bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold text-primary-300 hover:bg-primary-500/20">
                                Aplicar
                              </button>
                            )}
                            {isApplied && <span className="shrink-0 text-[10px] font-bold text-emerald-400">Pronto</span>}
                            {isApplied && (
                              <button type="button" onClick={() => setExpandedSuggestions(prev => { const next = new Set(prev); next.delete(suggestion.id); return next; })} className="shrink-0 text-[#718096] hover:text-white">
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] leading-snug text-[#718096] pl-5 line-clamp-1">{suggestion.description}</p>
                        </div>
                        {isApplied && isExpanded && (
                          <div className="border-t border-[#273548] bg-[#080b10] px-3.5 py-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#718096] mb-1">Template aplicado</p>
                            <p className="text-xs leading-relaxed text-[#9ba9bc] italic whitespace-pre-wrap">{suggestion.template}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>}

            {/* ─── Referências ────────────────────────────────── */}
            {tab === 'images' && <section className="space-y-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold">Imagens de referência</h3><p className="mt-1 text-sm text-[#9ba9bc]">Clique em uma imagem para ampliar. Até duas referências por ideia.</p></div><button type="button" disabled={Boolean(busy) || readOnly} onClick={() => void refresh()} className="inline-flex items-center gap-2 rounded-xl border border-[#34455a] px-3 py-2 text-sm disabled:opacity-40"><RefreshCw className={`h-4 w-4 ${busy === 'images' ? 'animate-spin' : ''}`} />Renovar acesso</button></div>{idea.image_error && <p role="alert" className="flex gap-2 rounded-xl border border-primary-400/25 bg-primary-400/10 p-4 text-sm text-primary-100"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{idea.image_error}</p>}<div className="grid items-start gap-5 md:grid-cols-2">{sources.map((source, index) => <article key={`${source}-${index}`} className="overflow-hidden rounded-xl border border-[#34455a] bg-[#0c121b]"><button type="button" onClick={() => { setZoom(1); setImageIndex(index); }} disabled={!idea.image_urls[index] || failed.includes(index)} className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-black/25 p-3 disabled:cursor-default">{idea.image_urls[index] && !failed.includes(index) ? <img src={idea.image_urls[index]} onError={() => onImageFailure(index)} alt={`Referência ${index + 1} de ${idea.title}`} className="h-full w-full object-contain" /> : <span className="px-4 text-center text-sm text-[#9ba9bc]"><ImageIcon className="mx-auto mb-3 h-8 w-8" />Imagem preservada, mas indisponível para visualização.<br />Tente renovar o acesso.</span>}</button><div className="flex items-center justify-between gap-3 border-t border-[#273548] px-4 py-3"><span className="text-xs text-[#9ba9bc]">Referência {index + 1}</span><div className="flex gap-4"><button type="button" disabled={!idea.image_urls[index]} onClick={() => { setZoom(1); setImageIndex(index); }} className="text-xs font-bold text-primary-300 disabled:opacity-30">Ampliar</button>{!readOnly && <button type="button" disabled={Boolean(busy)} onClick={() => void perform('remove', () => props.onRemove(index))} className="text-xs text-red-300 disabled:opacity-40">Remover</button>}</div></div></article>)}</div>{!sources.length && <div className="rounded-xl border border-dashed border-[#34455a] py-10 text-center"><ImageIcon className="mx-auto mb-3 h-8 w-8 text-[#718096]" /><p className="text-sm text-[#9ba9bc]">Nenhuma referência vinculada a esta ideia.</p>{!readOnly && <button type="button" disabled={Boolean(busy)} onClick={() => void perform('recover', async () => { const count = await props.onRecover(); setNotice(count ? `${count} referências recuperadas da pasta privada desta ideia.` : 'Nenhum arquivo encontrado na pasta privada desta ideia.'); })} className="mt-4 text-sm font-semibold text-primary-300">{busy === 'recover' ? 'Buscando…' : 'Recuperar anexos desta ideia'}</button>}</div>}{!readOnly && sources.length < 2 && <label className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-[#52667e] px-5 py-4 text-sm font-bold text-primary-300 ${busy ? 'opacity-40' : 'cursor-pointer hover:border-primary-400'}`}><Upload className="h-4 w-4" />{busy === 'upload' ? 'Enviando…' : 'Adicionar imagem'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={Boolean(busy)} className="sr-only" onChange={event => { const files = Array.from(event.target.files || []); event.target.value = ''; if (files.length) void perform('upload', () => props.onUpload(files)); }} /></label>}</section>}

            {/* ─── Validação ──────────────────────────────────── */}
            {tab === 'validation' && <div className="grid items-start gap-6 lg:grid-cols-2"><section className="space-y-4"><h3 className="font-bold">Hipóteses e aprendizados</h3><p className="text-sm text-[#9ba9bc]">Transforme suposições em testes verificáveis.</p>{!readOnly && <form onSubmit={event => { event.preventDefault(); if (hypothesisText.trim()) void perform('hypothesis', async () => { await props.onAddHypothesis(hypothesisText.trim()); setHypothesisText(''); }); }} className="flex gap-2"><input aria-label="Nova hipótese" value={hypothesisText} disabled={Boolean(busy)} onChange={event => setHypothesisText(event.target.value)} placeholder="Acreditamos que este público…" className={`${fieldClass} mt-0 min-w-0`} /><button type="submit" disabled={Boolean(busy) || !hypothesisText.trim()} className="rounded-xl bg-primary-400 px-3 text-sm font-bold text-black disabled:opacity-40">Adicionar</button></form>}{hypotheses.map(item => <div key={item.id} className="rounded-xl border border-[#273548] bg-[#0c121b] p-4"><p className="whitespace-pre-wrap text-sm text-[#d7e0ea]">{item.statement}</p><select aria-label={`Situação da hipótese ${item.statement}`} value={item.status} disabled={readOnly || Boolean(busy)} onChange={event => void perform('hypothesis', () => props.onHypothesisStatus(item.id, event.target.value as HypothesisStatus))} className={fieldClass}><option value="open">Aberta</option><option value="testing">Em teste</option><option value="validated">Validada</option><option value="invalidated">Invalidada</option></select></div>)}{!hypotheses.length && <p className="rounded-xl border border-dashed border-[#34455a] p-5 text-sm text-[#718096]">Nenhuma hipótese registrada.</p>}</section><section className="space-y-5 rounded-xl border border-[#273548] bg-[#0c121b] p-5"><h3 className="font-bold">Curadoria da ideia</h3>{field('evidence', 'Evidências coletadas', 'Entrevistas, testes e sinais do mercado', 4)}<label className="block text-sm font-semibold text-[#d7e0ea]">Confiança no dossiê: {draft.curation_score}%<input type="range" aria-label="Confiança no dossiê" min="0" max="100" step="5" value={draft.curation_score} disabled={readOnly || Boolean(busy)} onChange={event => setDraft(current => ({ ...current, curation_score: Number(event.target.value) }))} className="mt-4 w-full accent-primary-400" /></label>{field('curation_notes', 'Decisão e próximo passo', 'O que precisa ser testado ou esclarecido?', 4)}{idea.stage === 'ready' && !idea.promoted_project_id && !readOnly && <button type="button" onClick={() => void perform('promote', props.onPromote)} disabled={Boolean(busy) || dirty} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-4 py-3 text-sm font-bold text-black disabled:opacity-40"><Check className="h-4 w-4" />Promover a projeto</button>}</section></div>}
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#273548] bg-[#0c121b] px-4 py-4 sm:px-7"><button type="button" onClick={close} disabled={Boolean(busy)} className="inline-flex items-center gap-2 text-sm text-[#9ba9bc]"><ArrowLeft className="h-4 w-4" />Voltar ao kanban</button><div className="flex items-center gap-4"><span className="hidden text-xs text-[#9ba9bc] sm:block">{dirty ? 'Alterações não salvas' : 'Informações atualizadas'}</span>{!readOnly && <button type="button" disabled={Boolean(busy) || !dirty || !draft.title.trim()} onClick={() => void perform('save', async () => { await props.onSave({ ...draft, title: draft.title.trim() }); setBaseline(JSON.stringify(draft)); setNotice('Alterações salvas.'); })} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-4 py-3 text-sm font-bold text-black disabled:opacity-40">{busy === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Salvar alterações</button>}</div></footer>
        </Dialog.Panel>
      </div>
    </Dialog>
    {imageIndex !== null && activeImage && <Dialog open onClose={() => setImageIndex(null)} className="relative z-[220]"><div className="fixed inset-0 bg-black/95" aria-hidden="true" /><div className="fixed inset-0 flex flex-col p-3 sm:p-6"><Dialog.Panel className="flex min-h-0 flex-1 flex-col"><header className="flex flex-wrap items-center justify-between gap-3 pb-4 text-white"><Dialog.Title className="text-sm">{idea.title} · Referência {imageIndex + 1} de {sources.length}</Dialog.Title><div className="flex items-center gap-4"><button type="button" aria-label="Diminuir imagem" onClick={() => setZoom(value => Math.max(1, value - 0.25))}><ZoomOut className="h-5 w-5" /></button><span className="text-xs">{Math.round(zoom * 100)}%</span><button type="button" aria-label="Ampliar imagem" onClick={() => setZoom(value => Math.min(3, value + 0.25))}><ZoomIn className="h-5 w-5" /></button><button type="button" aria-label="Fechar imagem ampliada" onClick={() => setImageIndex(null)}><X className="h-6 w-6" /></button></div></header><div className="min-h-0 flex-1 overflow-auto rounded-xl bg-[#080b10]"><div className="flex min-h-full items-center justify-center" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><img src={activeImage} onError={() => { onImageFailure(imageIndex); setImageIndex(null); }} alt={`Referência ${imageIndex + 1} de ${idea.title}`} className="h-full w-full object-contain" /></div></div>{sources.length > 1 && <div className="flex justify-center gap-6 pt-4 text-white"><button type="button" aria-label="Imagem anterior" disabled={imageIndex <= 0} onClick={() => { setZoom(1); setImageIndex(imageIndex - 1); }} className="disabled:opacity-30"><ChevronLeft /></button><button type="button" aria-label="Próxima imagem" disabled={imageIndex >= sources.length - 1} onClick={() => { setZoom(1); setImageIndex(imageIndex + 1); }} className="disabled:opacity-30"><ChevronRight /></button></div>}</Dialog.Panel></div></Dialog>}
  </>;
}
