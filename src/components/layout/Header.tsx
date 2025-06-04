import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

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
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/sobre' },
    { name: t('nav.ecosystem'), href: '/ecossistema' },
    { name: t('nav.pricing'), href: '/planos' },
    { name: t('nav.blog'), href: '/blog' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-black dark:text-white">
                Oriento<span className="text-primary-500">hub</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-500'
                    : 'text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language toggle */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">
                <Globe size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                  : 'text-gray-700 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
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
  );
};

export default Header;