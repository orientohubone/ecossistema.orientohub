import { useRef, useState, type FormEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { AlertTriangle, ArrowRight, CheckCircle, Loader2, Rocket, X } from 'lucide-react';
import type { Solution } from '../../services/solutionsService';
import { clearSolutionDraft, readSolutionDraft, saveSolutionDraft, solutionSaveError, solutionStages, validateSolutionForm, type SolutionForm, type SolutionFormErrors } from '../../lib/solutionForm';

interface Props { userId?: string; onClose: () => void; onSave: (solution: Partial<Solution>) => Promise<void> }

export default function AddSolutionModal({ userId, onClose, onSave }: Props) {
  const [form, setForm] = useState<SolutionForm>(() => readSolutionDraft(userId));
  const [errors, setErrors] = useState<SolutionFormErrors>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const update = (key: keyof SolutionForm, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    saveSolutionDraft(userId, next);
    setErrors(current => ({ ...current, [key]: undefined }));
    setError('');
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current) return;
    const result = validateSolutionForm(form);
    setErrors(result.errors);
    setError('');
    if (Object.keys(result.errors).length) {
      const first = Object.keys(result.errors)[0];
      const input = formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`);
      const details = input?.closest('details');
      if (details) details.open = true;
      input?.focus();
      return;
    }
    busy.current = true;
    setSaving(true);
    try {
      await onSave(result.payload);
      clearSolutionDraft(userId);
    }
    catch (failure) { setError(solutionSaveError(failure)); }
    finally { busy.current = false; setSaving(false); }
  };
  const inputClass = 'mt-2 w-full rounded-xl border border-[#34455a] bg-[#0c121b] px-3.5 py-3 text-sm font-normal text-white outline-none transition placeholder:text-[#63748a] focus:border-primary-400 focus:ring-2 focus:ring-primary-400/15 disabled:opacity-60';
  const field = (key: Exclude<keyof SolutionForm, 'stage' | 'description'>, label: string, placeholder: string, required = false, numeric = false) => (
    <label className="block text-sm font-semibold text-[#d4deeb]" key={key}>
      {label}{required && <span className="ml-1 text-primary-300">*</span>}
      <input name={key} value={form[key]} onChange={e => update(key, e.target.value)} className={inputClass} placeholder={placeholder} disabled={saving} required={required} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `solution-${key}-error` : undefined} inputMode={numeric ? 'decimal' : key.endsWith('_url') ? 'url' : 'text'} autoComplete="off" />
      {errors[key] && <span id={`solution-${key}-error`} className="mt-1.5 block text-xs font-normal text-red-300">{errors[key]}</span>}
    </label>
  );
  return (
    <Dialog open onClose={() => { if (!busy.current) onClose(); }} className="relative z-[200]">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <Dialog.Panel className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#34455a] bg-[#101722] text-white shadow-2xl">
          <form ref={formRef} onSubmit={submit} noValidate>
            <header className="flex items-start justify-between gap-4 border-b border-[#273548] px-5 py-6 sm:px-8">
              <div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-400/30 bg-primary-400/10"><Rocket className="h-6 w-6 text-primary-300" /></div><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">Portfólio / Nova solução</p><Dialog.Title className="text-2xl font-bold tracking-tight">Dê espaço à sua próxima solução.</Dialog.Title><Dialog.Description className="mt-2 text-sm text-[#9ba9bc]">Reúna identidade, estágio e operação em um só lugar.</Dialog.Description></div></div>
              <button type="button" onClick={onClose} disabled={saving} className="rounded-lg p-2 text-[#9ba9bc] hover:bg-white/5 hover:text-white disabled:opacity-40" aria-label="Fechar cadastro"><X className="h-5 w-5" /></button>
            </header>
            <div className="grid lg:grid-cols-[1fr_260px]">
              <div className="space-y-7 p-5 sm:p-8">
                <section><h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-300">01 / Identidade e posicionamento</h3><div className="grid gap-4 sm:grid-cols-2">{field('name', 'Nome da solução', 'Como seu produto se chama?', true)}{field('category', 'Categoria', 'Ex.: SaaS, inteligência artificial, fintech')}</div><label className="mt-4 block text-sm font-semibold text-[#d4deeb]">Descrição<textarea name="description" value={form.description} onChange={e => update('description', e.target.value)} disabled={saving} rows={3} className={`${inputClass} resize-y`} placeholder="Qual problema resolve e para quem?" /></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-[#d4deeb]">Estágio<select name="stage" value={form.stage} onChange={e => update('stage', e.target.value)} disabled={saving} className={inputClass}>{solutionStages.map(stage => <option key={stage}>{stage}</option>)}</select></label>{field('founder_name', 'Responsável', 'Nome de quem lidera a solução')}</div></section>
                <section className="border-t border-[#273548] pt-6"><h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-300">02 / Presença e produto</h3><div className="grid gap-4 sm:grid-cols-2">{field('solution_url', 'Endereço do produto', 'app.exemplo.com', true)}{field('logo_url', 'URL do logotipo', 'https://exemplo.com/logo.png')}{field('git_url', 'Repositório GitHub', 'github.com/organização/repositório')}{field('instagram_url', 'Instagram', 'instagram.com/sua-solucao')}</div><p className="mt-3 text-xs leading-relaxed text-[#9ba9bc]">Não precisa incluir https://. O GitHub é opcional e não impede o cadastro.</p></section>
                <details className="border-t border-[#273548] pt-5"><summary className="cursor-pointer text-sm font-semibold text-[#d4deeb]">Infraestrutura e indicadores <span className="ml-2 text-xs font-normal text-[#9ba9bc]">Opcional</span></summary><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('ide_url', 'Ambiente de desenvolvimento', 'https://...')}{field('database_url', 'Console do banco', 'https://...')}{field('mrr', 'Receita recorrente mensal (R$)', '0,00', false, true)}{field('active_users', 'Usuários ativos', '0', false, true)}</div><p className="mt-3 text-xs text-[#9ba9bc]">Use links dos consoles. Não inclua senhas ou strings de conexão.</p></details>
              </div>
              <aside className="hidden border-l border-[#273548] bg-[#0c121b] p-6 lg:block"><p className="text-[10px] font-bold uppercase tracking-widest text-[#9ba9bc]">Resumo da solução</p><div className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#34455a] bg-[#151f2b] text-2xl font-bold text-primary-300">{form.name.trim().slice(0, 1).toUpperCase() || <Rocket className="h-6 w-6" />}</div><h3 className="mt-4 break-words text-xl font-bold">{form.name.trim() || 'Sua próxima solução'}</h3><p className="mt-2 break-words text-sm text-[#9ba9bc]">{form.category || 'Categoria a definir'}</p><p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary-300">{form.stage}</p><p className="mt-4 break-words text-sm leading-relaxed text-[#9ba9bc]">{form.description || 'Seu posicionamento começa com um problema real e uma proposta de valor clara.'}</p><div className="mt-8 border-t border-[#273548] pt-5 text-xs leading-relaxed text-[#9ba9bc]"><CheckCircle className="mb-2 h-4 w-4 text-primary-300" />Você pode atualizar links, estágio e indicadores depois do cadastro.</div></aside>
            </div>
            <footer className="sticky bottom-0 border-t border-[#273548] bg-[#101722] px-5 py-4 sm:px-8">
              {error && <div role="alert" className="mb-4 flex gap-2 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
              {Object.values(errors).some(Boolean) && <p role="alert" className="mb-3 text-sm text-red-300">Revise os campos destacados para continuar.</p>}
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[#9ba9bc]">* Nome e endereço obrigatórios. Rascunho mantido nesta aba.</p><div className="flex gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-[#34455a] px-4 py-3 text-sm font-bold text-[#c2cedd] disabled:opacity-50">Fechar</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-400 px-5 py-3 text-sm font-bold text-black hover:bg-primary-300 disabled:cursor-wait disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}{saving ? 'Cadastrando…' : 'Cadastrar solução'}</button></div></div>
            </footer>
          </form>
        </Dialog.Panel>
      </div></div>
    </Dialog>
  );
}
