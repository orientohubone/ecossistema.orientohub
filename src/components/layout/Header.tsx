import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Moon, Sun, Sparkles, GraduationCap, Rocket } from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
    // Initialize dark mode
    applyTheme(darkMode);
  }, [darkMode]);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/sobre' },
    { name: 'Manifesto', href: '/manifesto' },
    { name: t('nav.ecosystem'), href: '/ecossistema' },
    { name: t('nav.pricing'), href: '/planos' },
    { name: t('nav.blog'), href: '/blog' },
    { name: 'Glossário', href: '/glossario' },
  ];

  return (
    <>
      {/* Launch Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="container-custom">
          <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 text-center text-[11px] font-semibold leading-tight text-black sm:gap-2.5 sm:text-sm sm:font-medium">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/10">
              <Rocket className="h-3.5 w-3.5 text-black" />
            </span>
            <span className="max-w-[18rem] sm:max-w-none">
              <span className="sm:hidden">
                Plataforma Pronta!
                <br />
                Lançamento Oficial em Breve
              </span>
              <span className="hidden sm:inline">Plataforma Pronta! Lançamento Oficial em Breve</span>
            </span>
            <Sparkles className="hidden h-4 w-4 animate-pulse text-black/70 sm:block" />
          </div>
        </div>
      </div>
      
      <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' : 'bg-transparent dark:bg-[#14181f]/35'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
<div className="flex-shrink-0">
  <Link to="/" className="flex items-center">
    {/* Logo para modo light (fundo branco) */}
    <img 
      src="/orientohub-dark.png" 
      alt="Orientohub" 
      className="h-7 w-auto dark:hidden"
    />
    {/* Logo para modo dark (fundo escuro) */}
    <img 
      src="/orientohub.png" 
      alt="Orientohub" 
      className="h-6 w-auto hidden dark:block"
    />
  </Link>
</div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href && item.href !== '/glossario'
                    ? 'text-primary-500'
                    : 'text-gray-700 hover:text-[#FFD700] dark:text-gray-300 dark:hover:text-[#FFD700]'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/academy"
              className={`group relative ml-2 inline-flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 font-bold transition-all duration-300 ${
                location.pathname === '/academy'
                  ? 'border-primary-400 bg-gradient-to-r from-primary-500 via-yellow-400 to-primary-500 text-black shadow-[0_10px_30px_rgba(255,215,0,0.35)]'
                  : 'border-primary-500/40 bg-gradient-to-r from-primary-500/16 via-yellow-400/10 to-primary-500/16 text-primary-700 dark:text-primary-300 shadow-[0_8px_24px_rgba(255,215,0,0.12)] hover:border-primary-400/70 hover:shadow-[0_12px_32px_rgba(255,215,0,0.18)]'
              }`}
              style={{
                letterSpacing: '0.01em',
                fontSize: '1rem',
              }}
            >
              <span className="absolute inset-[1px] rounded-full bg-white/78 dark:bg-gray-950/78 transition-colors duration-300 group-hover:bg-white/82 dark:group-hover:bg-gray-950/82" />
              <GraduationCap className="relative w-4 h-4 text-primary-500 transition-transform duration-300 group-hover:scale-105" />
              <span className="relative">Academy</span>
            </Link>
          </nav>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language toggle */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">
                <Globe size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => changeLanguage('pt-BR')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    i18n.language === 'pt-BR' ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  Português (BR)
                </button>
                <button
                  onClick={() => changeLanguage('en-US')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    i18n.language === 'en-US' ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  English (US)
                </button>
              </div>
            </div>
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Auth buttons */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary"
              >
                {t('common.dashboard')}
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/entrar"
                  className="btn-outline"
                >
                  {t('common.signIn')}
                </Link>
                <Link
                  to="/cadastro"
                  className="btn-primary"
                >
                  {t('common.signUp')}
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.href
                  ? 'text-primary-500 bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 hover:text-[#FFD700] hover:bg-gray-100 dark:text-gray-300 dark:hover:text-[#FFD700] dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/academy"
            className={`block mt-2 px-4 py-2 rounded-xl font-bold border transition-all duration-300 ${
              location.pathname === '/academy'
                ? 'border-primary-400 bg-gradient-to-r from-primary-500 via-yellow-400 to-primary-500 text-black shadow-[0_10px_24px_rgba(255,215,0,0.28)]'
                : 'border-primary-500/40 bg-gradient-to-r from-primary-500/16 via-yellow-400/10 to-primary-500/16 text-primary-600 dark:text-primary-300 hover:border-primary-400/70 hover:bg-primary-500/18'
            }`}
            style={{
              letterSpacing: '0.01em',
              fontSize: '1rem',
            }}
            onClick={() => setIsOpen(false)}
          >
            Academy
          </Link>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative">
                  <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">
                    <Globe size={20} />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden">
                    <button
                      onClick={() => changeLanguage('pt-BR')}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        i18n.language === 'pt-BR' ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      Português (BR)
                    </button>
                    <button
                      onClick={() => changeLanguage('en-US')}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        i18n.language === 'en-US' ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      English (US)
                    </button>
                  </div>
                </div>
              </div>
              
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {t('common.dashboard')}
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/entrar"
                    className="btn-outline"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('common.signIn')}
                  </Link>
                  <Link
                    to="/cadastro"
                    className="btn-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('common.signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
