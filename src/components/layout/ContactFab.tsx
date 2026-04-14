import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, MessageSquare, Linkedin, Mail, Phone } from 'lucide-react';
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
      href: 'https://wa.me/5514998618547',
      color: 'bg-green-500',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/fernandoramalhooficial/',
      color: 'bg-blue-600',
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:oriento.contato@pm.me',
      color: 'bg-primary-500',
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Contact Modal/Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-primary-500/20 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]"
            >
              {/* Header with Avatar */}
              <div className="relative h-24 bg-gradient-to-br from-black to-gray-800 flex items-center justify-center pt-6 flex-shrink-0">
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Avatar container */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <img
                      src={fernandoSelecao6}
                      alt="Fernando Ramalho"
                      className="relative w-20 h-20 rounded-full border-4 border-primary-500 object-cover object-top shadow-xl"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-10 pb-6 px-6 text-center overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Fernando Ramalho
                </h3>
                <p className="text-sm font-medium text-primary-500 uppercase tracking-wider mb-6">
                  Fundador do Orientohub
                </p>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Como posso ajudar a transformar sua jornada hoje?
                </p>

                {/* Contact List */}
                <div className="space-y-3">
                  {contactOptions.map((option, index) => (
                    <motion.a
                      key={index}
                      href={option.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-500/10 dark:hover:bg-primary-500/10 border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-bold text-gray-900 dark:text-white">
                          Falar via {option.label}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
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
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-black text-primary-500' : 'bg-primary-500 text-black hover:scale-110'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
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
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-8 h-8 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect when closed */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20" />
        )}
      </motion.button>
    </div>
  );
};

export default ContactFab;
