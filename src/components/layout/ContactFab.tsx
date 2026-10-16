import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, MessageSquare, Linkedin, Mail, ArrowUpRight, ChevronRight, RotateCcw, Send, CheckCircle2 } from 'lucide-react';
import fernandoSelecao6 from '../../assets/fernando-selecao6.png';
import { contactService } from '../../services/contactService';

const ContactFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationStep, setConversationStep] = useState<'scenario' | 'context' | 'identity' | 'decision'>('scenario');
  const [scenarioId, setScenarioId] = useState('');
  const [context, setContext] = useState('');
  const [identity, setIdentity] = useState({ name: '', email: '', phone: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const location = useLocation();

  // Rotas onde o FAB NÃO deve aparecer
  const privateRoutes = ['/dashboard', '/founder', '/academy', '/plataforma/app', '/entrar', '/cadastro'];
  const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route));

  if (isPrivateRoute) return null;

  const scenarios = [
    { id: 'idea', label: 'Tenho uma ideia para tirar do papel', reply: 'Ótimo. Vamos entender a oportunidade e o que você já estruturou.' },
    { id: 'validation', label: 'Preciso validar um negócio', reply: 'Boa. Vamos olhar problema, público e as evidências que você já possui.' },
    { id: 'product', label: 'Quero criar ou melhorar um produto', reply: 'Perfeito. Conte sobre o produto, o estágio atual e o principal desafio.' },
    { id: 'partnership', label: 'Quero conversar sobre parceria', reply: 'Legal. Explique o tipo de parceria e o resultado que imagina construir.' },
  ];
  const selectedScenario = scenarios.find((item) => item.id === scenarioId);
  const contactMessage = `Olá, Fernando! Vim pelo site da OrientoHub.\n\nCenário: ${selectedScenario?.label || 'Quero conversar'}\nContexto: ${context}`;
  const encodedMessage = encodeURIComponent(contactMessage);

  const contactOptions = [
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      subtitle: 'Resposta rápida',
      href: `https://wa.me/5514998618547?text=${encodedMessage}`,
      gradient: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/25',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      subtitle: 'Conecte-se comigo',
      href: 'https://www.linkedin.com/in/fernandoramalhooficial/',
      gradient: 'from-blue-500 to-blue-700',
      shadow: 'shadow-blue-500/25',
    },
    {
      icon: Mail,
      label: 'Email',
      subtitle: 'oriento.contato@pm.me',
      href: `mailto:oriento.contato@pm.me?subject=${encodeURIComponent('Contato pelo site — OrientoHub')}&body=${encodedMessage}`,
      gradient: 'from-[#FFF200] to-[#FFF200]',
      shadow: 'shadow-none',
    },
  ];

  const resetConversation = () => {
    setConversationStep('scenario');
    setScenarioId('');
    setContext('');
    setIdentity({ name: '', email: '', phone: '', company: '' });
    setSubmitError('');
  };

  const registerConversation = async () => {
    if (!identity.name.trim() || (!identity.email.trim() && !identity.phone.trim()) || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');

    const result = await contactService.sendMessage({
      name: identity.name.trim(),
      email: identity.email.trim(),
      phone: identity.phone.trim(),
      company: identity.company.trim(),
      subject: selectedScenario?.label || 'Chat do site',
      message: `Cenário: ${selectedScenario?.label || 'Conversa pelo site'}\n\nContexto:\n${context.trim()}`,
      source: 'chat_site',
    });

    setIsSubmitting(false);
    if (!result.success) {
      setSubmitError('Não consegui registrar agora. Confira os dados e tente novamente.');
      return;
    }
    setConversationStep('decision');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 28 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[100]">
      {/* Contact Modal/Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-[-1]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="absolute bottom-20 right-0 flex max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-[24px] sm:max-h-[570px] sm:w-[390px]"
              style={{
                background: 'linear-gradient(160deg, rgba(16,23,34,0.99), rgba(8,13,20,0.99))',
                boxShadow: '0 32px 90px -18px rgba(0,0,0,0.82), inset 0 1px 0 rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,242,0,0.22)',
              }}
            >
              {/* Header */}
              <div className="relative flex-shrink-0 border-b border-white/[0.07] bg-[#0d141e] px-5 pb-5 pt-5 sm:px-6">
                <div className="pointer-events-none absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,242,0,0.35) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }} />
                <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/55 transition hover:border-white/20 hover:bg-white/10 hover:text-white" aria-label="Fechar contato">
                  <X className="h-4 w-4" />
                </button>
                <div className="relative flex items-center gap-4 pr-10">
                  <div className="relative shrink-0">
                  <div className="absolute -in-[3px] rounded-2xl bg-[#FFF200]" />
                  <img
                    src={fernandoSelecao6}
                    alt="Fernando Ramalho"
                    className="relative h-[72px] w-[72px] rounded-2xl border-[3px] border-[#0d141e] object-cover object-top"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#0d141e] bg-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#07110c]" />
                  </div>
                </div>
                  <div className="min-w-0 text-left">
                    <h3 className="truncate text-lg font-extrabold tracking-tight text-white">Fernando Ramalho</h3>
                    <p className="mt-0.5 text-xs text-[#9ba9bc]">Fundador da OrientoHub</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Disponível para conversar
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5 sm:px-6">
                <AnimatePresence mode="wait" initial={false}>
                  {conversationStep === 'scenario' && (
                    <motion.div key="scenario" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                      <div className="mb-4 rounded-2xl border border-[#FFF200]/20 bg-[#FFF200]/[0.055] p-4 text-left">
                        <p className="text-base font-extrabold text-white">Olá! Em que cenário você está?</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#b8c4d4]">Escolha a opção mais próxima. Vou organizar o contexto antes de você decidir como continuar.</p>
                      </div>
                      <div className="space-y-2">
                        {scenarios.map((scenario, index) => (
                          <motion.button key={scenario.id} type="button" onClick={() => { setScenarioId(scenario.id); setConversationStep('context'); }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-left transition hover:border-[#FFF200]/35 hover:bg-[#FFF200]/[0.06]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF200]/10 text-xs font-black text-[#FFF200]">{index + 1}</span>
                            <span className="flex-1 text-sm font-semibold text-[#d7e0ea] group-hover:text-white">{scenario.label}</span>
                            <ChevronRight className="h-4 w-4 text-[#4a5d73] group-hover:text-[#FFF200]" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {conversationStep === 'context' && (
                    <motion.div key="context" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                      <div className="mb-3 flex justify-end"><div className="max-w-[88%] rounded-2xl rounded-br-md bg-[#FFF200] px-3.5 py-2.5 text-sm font-semibold text-black">{selectedScenario?.label}</div></div>
                      <div className="mb-4 rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.045] p-4 text-left">
                        <p className="text-sm leading-relaxed text-[#d7e0ea]">{selectedScenario?.reply}</p>
                        <p className="mt-2 text-xs text-[#9ba9bc]">Descreva brevemente seu momento atual, o que já tentou e qual resultado busca.</p>
                      </div>
                      <label className="block text-left text-[10px] font-black uppercase tracking-[0.14em] text-[#718096]">Seu contexto
                        <textarea autoFocus value={context} onChange={(event) => setContext(event.target.value)} maxLength={600} placeholder="Ex.: já tenho um protótipo, conversei com alguns clientes e agora preciso validar o modelo comercial..." className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-white/[0.1] bg-[#090f17] p-3.5 text-sm font-normal normal-case leading-relaxed text-white outline-none transition placeholder:text-[#4a5d73] focus:border-[#FFF200]/50" />
                      </label>
                      <div className="mt-2 flex items-center justify-between"><button type="button" onClick={() => setConversationStep('scenario')} className="text-xs font-semibold text-[#9ba9bc] hover:text-white">Voltar</button><span className="text-[10px] text-[#4a5d73]">{context.length}/600</span></div>
                      <button type="button" disabled={context.trim().length < 12} onClick={() => setConversationStep('identity')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-4 py-3 text-sm font-black text-black transition hover:bg-[#fff64d] disabled:cursor-not-allowed disabled:opacity-35">Organizar meu contato <Send className="h-4 w-4" /></button>
                    </motion.div>
                  )}

                  {conversationStep === 'identity' && (
                    <motion.div key="identity" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                      <div className="mb-4 rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.045] p-4 text-left">
                        <p className="text-sm font-extrabold text-white">Como posso identificar você?</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#9ba9bc]">Assim seu contexto chega organizado e não se perde quando esta conversa for fechada.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <label className="col-span-2 text-left text-[10px] font-black uppercase tracking-[0.12em] text-[#718096]">Nome *<input autoFocus value={identity.name} onChange={(event) => setIdentity({ ...identity, name: event.target.value })} maxLength={100} placeholder="Seu nome" className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-[#090f17] px-3.5 py-2.5 text-sm font-normal normal-case text-white outline-none placeholder:text-[#4a5d73] focus:border-[#FFF200]/50" /></label>
                        <label className="col-span-2 text-left text-[10px] font-black uppercase tracking-[0.12em] text-[#718096]">Empresa<input value={identity.company} onChange={(event) => setIdentity({ ...identity, company: event.target.value })} maxLength={120} placeholder="Empresa ou projeto (opcional)" className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-[#090f17] px-3.5 py-2.5 text-sm font-normal normal-case text-white outline-none placeholder:text-[#4a5d73] focus:border-[#FFF200]/50" /></label>
                        <label className="text-left text-[10px] font-black uppercase tracking-[0.12em] text-[#718096]">E-mail<input type="email" value={identity.email} onChange={(event) => setIdentity({ ...identity, email: event.target.value })} maxLength={160} placeholder="voce@email.com" className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-[#090f17] px-3 py-2.5 text-sm font-normal normal-case text-white outline-none placeholder:text-[#4a5d73] focus:border-[#FFF200]/50" /></label>
                        <label className="text-left text-[10px] font-black uppercase tracking-[0.12em] text-[#718096]">WhatsApp<input type="tel" value={identity.phone} onChange={(event) => setIdentity({ ...identity, phone: event.target.value })} maxLength={30} placeholder="(14) 99999-9999" className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-[#090f17] px-3 py-2.5 text-sm font-normal normal-case text-white outline-none placeholder:text-[#4a5d73] focus:border-[#FFF200]/50" /></label>
                      </div>
                      <p className="mt-2.5 text-left text-[10px] leading-relaxed text-[#718096]">Informe e-mail ou WhatsApp. Ao continuar, seus dados e contexto serão registrados para retorno comercial.</p>
                      {submitError && <p role="alert" className="mt-2.5 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-3 py-2 text-left text-xs text-red-200">{submitError}</p>}
                      <div className="mt-3 flex items-center justify-between"><button type="button" onClick={() => setConversationStep('context')} className="text-xs font-semibold text-[#9ba9bc] hover:text-white">Voltar</button><span className="text-[10px] text-[#4a5d73]">* campo obrigatório</span></div>
                      <button type="button" disabled={!identity.name.trim() || (!identity.email.trim() && !identity.phone.trim()) || isSubmitting} onClick={registerConversation} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-4 py-3 text-sm font-black text-black transition hover:bg-[#fff64d] disabled:cursor-not-allowed disabled:opacity-35">{isSubmitting ? 'Registrando…' : 'Registrar e continuar'} <Send className="h-4 w-4" /></button>
                    </motion.div>
                  )}

                  {conversationStep === 'decision' && (
                    <motion.div key="decision" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                      <div className="mb-5 flex min-h-[230px] flex-col items-center justify-center rounded-[22px] border border-emerald-400/20 bg-gradient-to-b from-emerald-400/[0.09] to-emerald-400/[0.025] px-6 py-8 text-center">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_32px_rgba(52,211,153,0.12)]">
                          <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <p className="max-w-[270px] text-xl font-black leading-tight tracking-tight text-white">Informações enviadas para nosso time comercial</p>
                        <p className="mt-3 max-w-[250px] text-sm leading-relaxed text-[#aebdca]">Em breve, nossa equipe entrará em contato com você.</p>
                        <div className="mt-5 h-px w-12 bg-emerald-300/30" />
                      </div>
                      <div className="mb-2.5 flex items-center justify-between px-0.5"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#718096]">Se preferir, fale agora</p><p className="text-[10px] font-semibold text-[#718096]">Opcional</p></div>
                      <motion.div className="grid grid-cols-3 gap-2" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                        {contactOptions.map((option, index) => (
                          <motion.a key={option.label} href={option.href} target="_blank" rel="noopener noreferrer" variants={itemVariants} aria-label={`${option.label}: ${option.subtitle}`} className={`group relative flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 transition-all duration-300 ${index === 0 ? 'border-emerald-400/25 bg-emerald-400/[0.06] hover:border-emerald-400/50' : 'border-white/[0.07] bg-white/[0.025] hover:border-[#FFF200]/30'}`} whileHover={{ y: -2 }} whileTap={{ scale: .97 }}>
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${option.gradient} ${option.shadow}`}><option.icon className={`h-4 w-4 ${option.label === 'Email' ? 'text-black' : 'text-white'}`} /></div>
                            <span className="truncate text-[11px] font-bold text-white">{option.label}</span>
                            <ArrowUpRight className="absolute right-1.5 top-1.5 h-3 w-3 text-white/15 group-hover:text-[#FFF200]" />
                          </motion.a>
                        ))}
                      </motion.div>
                      <button type="button" onClick={resetConversation} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#718096] hover:text-white"><RotateCcw className="h-3.5 w-3.5" />Recomeçar conversa</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] bg-black/20 px-5 py-3.5 sm:px-6">
                <MessageCircle className="h-3.5 w-3.5 text-[#FFF200]" />
                <p className="text-[10px] font-semibold text-[#718096]">Orientação inicial por fluxo — contato final direto comigo.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Fechar núcleo de conversa' : 'Abrir núcleo de conversa'}
        aria-expanded={isOpen}
      >
        {/* Outer glow ring (visible when closed) */}
        {!isOpen && (
          <>
            <div className="absolute -inset-3 rounded-full bg-[#FFF200]/25 blur-2xl opacity-55 transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute inset-1 rounded-full bg-[#FFF200]/25 animate-ping opacity-20" />
          </>
        )}

        {/* Button body */}
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 sm:h-[72px] sm:w-[72px] ${
            isOpen
              ? 'border border-white/10 bg-gray-900 text-[#FFF200] shadow-2xl'
              : 'bg-transparent text-black'
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="message"
                className="h-full w-full"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              >
                <img src="/Ícone de núcleo orbital elétrico.png" alt="" className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(255,210,0,.28)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
};

export default ContactFab;
