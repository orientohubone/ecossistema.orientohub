import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, MessageSquare, Linkedin, Mail, Sparkles, ArrowUpRight } from 'lucide-react';
import fernandoSelecao6 from '../../assets/fernando-selecao6.png';

const ContactFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Rotas onde o FAB NÃO deve aparecer
  const privateRoutes = ['/dashboard', '/founder', '/academy', '/plataforma/app', '/entrar', '/cadastro'];
  const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route));

  if (isPrivateRoute) return null;

  const contactOptions = [
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      subtitle: 'Resposta rápida',
      href: 'https://wa.me/5514998618547',
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
      href: 'mailto:oriento.contato@pm.me',
      gradient: 'from-primary-400 to-primary-600',
      shadow: 'shadow-primary-500/25',
    },
  ];

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
              className="absolute bottom-20 right-0 w-[calc(100vw-40px)] max-w-[340px] sm:w-[340px] rounded-[28px] flex flex-col max-h-[calc(100vh-120px)]"
              style={{
                background: 'linear-gradient(145deg, rgba(15,15,15,0.97), rgba(24,24,27,0.98))',
                boxShadow: '0 32px 80px -12px rgba(0,0,0,0.65), 0 0 60px -20px rgba(234,179,8,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Header — Banner + Avatar + Identity (all in normal flow) */}
              <div className="flex-shrink-0 rounded-t-[28px] overflow-hidden">
                {/* Background gradient canvas */}
                <div className="h-20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/25 via-primary-600/10 to-transparent" />
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(234,179,8,0.35) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                  {/* Glow orb */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-500/20 blur-3xl" />

                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Avatar + Identity — in normal flow, pulled up to overlap the banner */}
              <div className="flex flex-col items-center -mt-10 flex-shrink-0 relative z-10">
                <div className="relative mb-3">
                  {/* Glow ring */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 opacity-70 blur-sm" />
                  <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600" />
                  <img
                    src={fernandoSelecao6}
                    alt="Fernando Ramalho"
                    className="relative w-20 h-20 rounded-full object-cover object-top border-[3px] border-[#0f0f0f]"
                  />
                  {/* Online indicator */}
                  <div className="absolute bottom-0.5 right-0.5">
                    <div className="relative">
                      <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-40" />
                      <div className="relative w-4 h-4 bg-green-500 rounded-full border-[2.5px] border-[#0f0f0f]" />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5 tracking-tight">
                  Fernando Ramalho
                </h3>
                <div className="inline-flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-primary-400" />
                  <span className="text-[11px] font-semibold text-primary-400/90 uppercase tracking-[0.14em]">
                    Fundador do Orientohub
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="pt-4 pb-5 px-5 sm:px-6 text-center overflow-y-auto flex-1">

                {/* Message bubble */}
                <div className="relative mb-5">
                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-gray-300 leading-relaxed text-left">
                    <span className="text-white/80">Olá! 👋</span> Como posso ajudar a transformar sua jornada empreendedora hoje?
                  </div>
                  {/* Bubble tail */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/[0.04] border-t border-l border-white/[0.06]" />
                </div>

                {/* Contact channels */}
                <motion.div
                  className="space-y-2.5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {contactOptions.map((option, index) => (
                    <motion.a
                      key={index}
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={itemVariants}
                      className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 cursor-pointer"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Icon pill */}
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shrink-0 shadow-lg ${option.shadow} group-hover:scale-105 transition-transform duration-300`}>
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      {/* Label */}
                      <div className="flex-1 text-left">
                        <span className="block text-[13px] font-semibold text-white/90 group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                        <span className="block text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors">
                          {option.subtitle}
                        </span>
                      </div>
                      {/* Arrow */}
                      <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary-400 transition-colors shrink-0" />
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-white/[0.06] flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.16em] font-semibold">
                  Resposta em até 24 horas
                </p>
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
      >
        {/* Outer glow ring (visible when closed) */}
        {!isOpen && (
          <>
            <div className="absolute -inset-2 rounded-full bg-primary-500/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-15" />
          </>
        )}

        {/* Button body */}
        <div
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-gray-900 border border-white/10 text-primary-400'
              : 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 text-black shadow-primary-500/40'
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
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
};

export default ContactFab;
