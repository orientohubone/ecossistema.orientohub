import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sparkles, GraduationCap, ChevronDown, Layout, Info, MessageCircle, Layers, Briefcase, Monitor, Handshake, Compass, Share2, Building2, Newspaper, BookOpen, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.add('[&_*]:transition-colors', '[&_*]:duration-200');

  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  window.setTimeout(() => {
    document.documentElement.classList.remove('[&_*]:transition-colors', '[&_*]:duration-200');
  }, 220);
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [dismissedDropdown, setDismissedDropdown] = useState<string | null>(null);

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
    setActiveSubmenu(null);
  };


  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Force dark mode on public pages
    applyTheme(true);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { 
      name: 'Ecossistema', 
      icon: Layout,
      subItems: [
        { name: t('nav.ecosystem'), href: '/ecossistema', icon: Layers, description: 'Conheça as quatro camadas conectadas.' },
        { name: 'Serviços', href: '/servicos', icon: Briefcase, description: 'Estratégia e execução para o seu negócio.' },
        { name: 'Plataforma', href: '/plataforma', icon: Monitor, description: 'Ideias, projetos, soluções e frameworks.' },
        { name: 'Nossos parceiros', href: '/parceiros', icon: Handshake, description: 'Tecnologia e serviços que ampliam entregas.' },
        { name: 'Manifesto', href: '/manifesto', icon: Compass, description: 'Os princípios que orientam nossas escolhas.' },
        { name: 'Infoprodutos', href: '#', isGroup: true },
        { name: 'SoA — Share of Attention', href: '/soa', icon: Share2, description: 'Uma nova leitura sobre atenção e relevância.', preview: '/SoA.png' },
      ]
    },
    {
      name: 'Empresa',
      icon: Info,
      subItems: [
        { name: t('nav.about'), href: '/sobre', icon: Building2, description: 'Nossa história, visão e forma de construir.' },
        { name: t('nav.blog'), href: '/blog', icon: Newspaper, description: 'Ideias e aprendizados para colocar em prática.' },
        { name: 'Glossário', href: '/glossario', icon: BookOpen, description: 'Conceitos para navegar com mais clareza.' },
      ]
    },
    { name: t('nav.pricing'), href: '/planos' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <>      {/* Launch Banner */}
      <div className="bg-gradient-to-r from-[#FFF200] to-[#FFF200] px-3 py-1.5 sm:px-4 sm:py-2">
        <div className="container-custom">
          <div className="mx-auto flex max-w-4xl items-center justify-center gap-1.5 sm:gap-2.5 text-center text-[11px] sm:text-sm font-bold sm:font-semibold leading-tight text-black">
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-black/10">
              <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" />
            </span>
            <a 
              href="https://wa.me/551433331071?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais." 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline decoration-black/50 underline-offset-4 whitespace-normal"
            >
              Possui alguma ideia e deseja tirar do papel?
            </a>
          </div>
        </div>
      </div>
      
      <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' : 'bg-transparent dark:bg-[#14181f]/35'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/orientohub.png" 
                  alt="Orientohub" 
                  className="h-6 sm:h-7 w-auto dark:hidden"
                />
                <img 
                  src="/orientohub-dark.png" 
                  alt="Orientohub" 
                  className="h-5 sm:h-6 w-auto hidden dark:block"
                />
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className={`relative ${dismissedDropdown === item.name ? '' : 'group'}`}
                  onMouseLeave={() => {
                    if (dismissedDropdown === item.name) setDismissedDropdown(null);
                  }}
                >
                  {item.subItems ? (
                    <div className="flex items-center gap-1 cursor-pointer py-2 text-sm font-medium text-gray-700 hover:text-[#FFF200] dark:text-gray-300 dark:hover:text-[#FFF200] transition-colors">
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      
                      {/* Dropdown Desktop */}
                      <div className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${item.name === 'Ecossistema' ? 'w-[430px]' : 'w-[370px]'}`}>
                        <div className="relative origin-top scale-[0.97] overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/95 p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl transition-transform group-hover:scale-100">
                          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent" />
                          <div className="mb-1 flex items-center justify-between px-3 pb-2 pt-2">
                            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFF200]">Explorar</p><p className="mt-0.5 text-xs text-white/40">{item.name === 'Ecossistema' ? 'Encontre o melhor ponto de entrada.' : 'Conheça mais sobre a OrientoHub.'}</p></div>
                            {item.icon && <item.icon className="h-5 w-5 text-[#FFF200]/70" />}
                          </div>
                          {item.subItems.map((sub) => sub.isGroup ? (
                            <p key={sub.name} className="mx-2 mt-2 border-t border-white/10 px-2 pb-1 pt-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">{sub.name}</p>
                          ) : (
                            <Link key={sub.name} to={sub.href} onClick={() => { handleNavClick(); setDismissedDropdown(item.name); }} className={`group/link flex items-center gap-3 rounded-xl border px-3 py-3 transition-all ${location.pathname === sub.href ? 'border-[#FFF200]/35 bg-[#FFF200]/10' : 'border-transparent hover:border-white/10 hover:bg-white/[0.05]'}`}>
                              <span className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border transition ${'preview' in sub ? 'h-14 w-14' : 'h-10 w-10'} ${location.pathname === sub.href ? 'border-[#FFF200] bg-[#FFF200] text-black' : 'border-white/10 bg-white/[0.04] text-[#FFF200] group-hover/link:border-[#FFF200]/35'}`}>
                                {'preview' in sub ? <img src={sub.preview} alt="Prévia do guia SoA" className="h-full w-full object-cover" /> : sub.icon && <sub.icon className="h-[18px] w-[18px]" />}
                              </span>
                              <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{sub.name}</span><span className="mt-0.5 block truncate text-[11px] text-white/40">{sub.description}</span></span>
                              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-[#FFF200]" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href || '#'}
                      onClick={handleNavClick}
                      className={`text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'text-[#FFF200]'
                          : 'text-gray-700 hover:text-[#FFF200] dark:text-gray-300 dark:hover:text-[#FFF200]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                to="/academy"
                onClick={handleNavClick}
                className={`group relative ml-2 inline-flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 font-bold transition-all duration-300 ${
                  location.pathname === '/academy'
                    ? 'border-[#FFF200] bg-gradient-to-r from-[#FFF200] via-[#FFF200] to-[#FFF200] text-black shadow-none'
                    : 'border-[#FFF200]/40 bg-gradient-to-r from-[#FFF200]/16 via-[#FFF200]/10 to-[#FFF200]/16 text-[#FFF200] dark:text-[#FFF200] shadow-none hover:border-[#FFF200]/70 hover:shadow-none'
                }`}
              >
                <span className={`absolute inset-[1px] rounded-full transition-colors duration-300 group-hover:bg-white/82 dark:group-hover:bg-gray-950/82 ${location.pathname === '/academy' ? 'bg-transparent dark:bg-transparent group-hover:bg-transparent dark:group-hover:bg-transparent' : 'bg-white/78 dark:bg-gray-950/78'}`} />
                <GraduationCap className={`relative w-4 h-4 ${location.pathname === '/academy' ? 'text-black' : 'text-[#FFF200]'} transition-transform duration-300 group-hover:scale-105`} />
                <span className="relative text-sm">Academy</span>
              </Link>
            </nav>
            
            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={handleNavClick} className="btn-primary">{t('common.dashboard')}</Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/entrar" onClick={handleNavClick} className="btn-outline">{t('common.signIn')}</Link>
                  <Link to="/cadastro" onClick={handleNavClick} className="btn-primary">{t('common.signUp')}</Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#FFF200] dark:hover:text-[#FFF200] rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Abrir menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-2.5 max-h-[calc(100vh-80px)] overflow-y-auto styled-scrollbar">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                          className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon && <item.icon className="w-4 h-4 text-[#FFF200]" />}
                            {item.name}
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeSubmenu === item.name ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeSubmenu === item.name && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-1.5 overflow-hidden px-2 pb-2 pt-1"
                            >
                              {item.subItems.map((sub) => sub.isGroup ? (
                                <p key={sub.name} className="mt-2 border-t border-white/10 px-2 pt-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{sub.name}</p>
                              ) : (
                                <Link key={sub.name} to={sub.href} className={`flex items-center gap-3 rounded-xl border p-3 transition ${location.pathname === sub.href ? 'border-[#FFF200]/35 bg-[#FFF200]/10' : 'border-white/[0.07] bg-white/[0.025] hover:border-white/15'}`} onClick={handleNavClick}>
                                  <span className={`grid shrink-0 place-items-center overflow-hidden rounded-lg ${'preview' in sub ? 'h-12 w-12' : 'h-9 w-9'} ${location.pathname === sub.href ? 'bg-[#FFF200] text-black' : 'bg-[#FFF200]/10 text-[#FFF200]'}`}>
                                    {'preview' in sub ? <img src={sub.preview} alt="Prévia do guia SoA" className="h-full w-full object-cover" /> : sub.icon && <sub.icon className="h-4 w-4" />}
                                  </span>
                                  <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-bold text-white">{sub.name}</span><span className="mt-0.5 block text-[11px] leading-snug text-white/40">{sub.description}</span></span>
                                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25" />
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href || '#'}
                        className={`block px-3 py-2.5 rounded-xl text-base font-bold transition-all ${
                          location.pathname === item.href
                            ? 'text-[#FFF200] bg-[#FFF200]/100/10'
                            : 'text-gray-800 dark:text-gray-100 hover:text-[#FFF200]'
                        }`}
                        onClick={handleNavClick}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.name === t('nav.home') && <Layout className="w-4 h-4 text-[#FFF200]" />}
                          {item.name === t('nav.pricing') && <Sparkles className="w-4 h-4 text-[#FFF200]" />}
                          {item.name === 'Contato' && <MessageCircle className="w-4 h-4 text-[#FFF200]" />}
                          {item.name}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
                
                <Link
                  to="/academy"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFF200]/15 via-[#FFF200]/10 to-[#FFF200]/15 border border-[#FFF200]/30 text-[#FFF200] dark:text-[#FFF200] shadow-sm"
                  onClick={handleNavClick}
                >
                  <GraduationCap className="w-5 h-5 text-[#FFF200]" />
                  Academy
                </Link>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 px-1">
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="btn-primary w-full justify-center text-center py-2.5" onClick={handleNavClick}>{t('common.dashboard')}</Link>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <Link to="/entrar" className="btn-outline w-full justify-center text-center py-2.5" onClick={handleNavClick}>{t('common.signIn')}</Link>
                      <Link to="/cadastro" className="btn-primary w-full justify-center text-center py-2.5" onClick={handleNavClick}>{t('common.signUp')}</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
