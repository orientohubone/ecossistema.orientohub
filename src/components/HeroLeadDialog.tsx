import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lightbulb, Loader2, X } from 'lucide-react';
import { contactService } from '../services/contactService';

type HeroLeadDialogProps = {
  open: boolean;
  onClose: () => void;
};

const emptyForm = { name: '', company: '', phone: '', context: '' };

const HeroLeadDialog = ({ open, onClose }: HeroLeadDialogProps) => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    window.setTimeout(() => nameInputRef.current?.focus(), 120);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose, submitting]);

  const close = () => {
    if (submitting) return;
    onClose();
    window.setTimeout(() => {
      setForm(emptyForm);
      setError('');
      setSent(false);
    }, 250);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');
    const result = await contactService.sendMessage({
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: '',
      subject: 'CTA da home — Tire sua ideia do papel',
      message: form.context.trim(),
      source: 'contato',
    });
    setSubmitting(false);

    if (!result.success) {
      setError('Não foi possível enviar agora. Revise os dados e tente novamente.');
      return;
    }

    setSent(true);
  };

  const fieldClassName = 'mt-2 w-full rounded-xl border border-white/10 bg-[#0a1018] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#536174] focus:border-[#FFF200]/70 focus:ring-2 focus:ring-[#FFF200]/10';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-lead-title"
            className="relative my-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-[#FFF200]/25 bg-[#101722] shadow-[0_32px_100px_rgba(0,0,0,.7)]"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,242,0,.13),transparent_70%)]" />
            <button type="button" onClick={close} disabled={submitting} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-white/60 transition hover:border-white/25 hover:text-white" aria-label="Fechar formulário">
              <X className="h-5 w-5" />
            </button>

            {sent ? (
              <div className="relative flex min-h-[440px] flex-col items-center justify-center px-7 py-12 text-center sm:px-12">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-emerald-300"><CheckCircle2 className="h-8 w-8" /></span>
                <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-[#FFF200]">Contexto recebido</p>
                <h2 id="hero-lead-title" className="mt-3 text-3xl font-black tracking-tight text-white">Sua ideia já deu o primeiro passo.</h2>
                <p className="mt-4 max-w-md leading-relaxed text-[#aab7c7]">As informações entraram no nosso fluxo comercial. Vamos analisar seu momento e entrar em contato pelo telefone informado.</p>
                <button type="button" onClick={close} className="mt-8 rounded-xl bg-[#FFF200] px-6 py-3 text-sm font-black text-black transition hover:bg-[#fff64d]">Voltar ao site</button>
              </div>
            ) : (
              <div className="relative p-6 sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF200]/10 text-[#FFF200]"><Lightbulb className="h-6 w-6" /></span>
                <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-[#FFF200]">Conversa inicial</p>
                <h2 id="hero-lead-title" className="mt-2 pr-10 text-3xl font-black tracking-tight text-white sm:text-4xl">Conte o que você quer tirar do papel.</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#9ba9bc] sm:text-base">Compartilhe seu momento. Vamos entender o desafio antes de recomendar o próximo passo.</p>

                <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-bold text-[#d7e0ea]">Nome
                    <input ref={nameInputRef} required maxLength={100} autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Como podemos chamar você?" className={fieldClassName} />
                  </label>
                  <label className="text-xs font-bold text-[#d7e0ea]">Empresa ou projeto
                    <input required maxLength={120} autoComplete="organization" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Nome da empresa ou ideia" className={fieldClassName} />
                  </label>
                  <label className="text-xs font-bold text-[#d7e0ea] sm:col-span-2">Telefone / WhatsApp
                    <input required type="tel" minLength={8} maxLength={30} autoComplete="tel" inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(00) 00000-0000" className={fieldClassName} />
                  </label>
                  <label className="text-xs font-bold text-[#d7e0ea] sm:col-span-2">Qual é o contexto?
                    <textarea required minLength={20} maxLength={800} value={form.context} onChange={(event) => setForm({ ...form, context: event.target.value })} placeholder="O que você quer construir, em que estágio está e qual é o principal desafio hoje?" className={`${fieldClassName} min-h-28 resize-none leading-relaxed`} />
                    <span className="mt-1.5 block text-right text-[10px] font-medium text-[#718096]">{form.context.length}/800</span>
                  </label>

                  {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm text-red-200 sm:col-span-2">{error}</p>}

                  <div className="sm:col-span-2">
                    <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-3.5 text-sm font-black text-black transition hover:bg-[#fff64d] disabled:cursor-wait disabled:opacity-60">
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando contexto…</> : <>Quero tirar minha ideia do papel <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                    </button>
                    <p className="mt-3 text-center text-[11px] leading-relaxed text-[#718096]">Seus dados serão usados apenas para este contato comercial.</p>
                  </div>
                </form>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeroLeadDialog;
