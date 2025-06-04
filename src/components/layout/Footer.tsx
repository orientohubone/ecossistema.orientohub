import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                Oriento<span className="text-primary-500">hub</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              {t('nav.home')}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/ecossistema" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('nav.ecosystem')}
                </Link>
              </li>
              <li>
                <Link to="/planos" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/termos" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('legal.termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('legal.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-primary-500 transition-colors">
                  {t('legal.cookiesPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Orientohub. {t('common.rights')}
          </p>
          <div className="mt-4 md:mt-0">
            <select
              className="bg-gray-800 text-gray-400 text-sm rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              defaultValue="pt-BR"
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;