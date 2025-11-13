import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, Rocket, Sparkles, ArrowRight, Heart, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };
  
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-gray-400' },
  ];

  const navigationLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/sobre', label: t('nav.about') },
    { to: '/manifesto', label: 'Manifesto' },
    { to: '/ecossistema', label: t('nav.ecosystem') },
    { to: '/planos', label: t('nav.pricing') },
    { to: '/blog', label: t('nav.blog') },
  ];

  const legalLinks = [
    { to: '/termos', label: t('legal.termsOfService') },
    { to: '/privacidade', label: t('legal.privacyPolicy') },
    { to: '/cookies', label: t('legal.cookiesPolicy') },
  ];

  const contactInfo = [
    { icon: Mail, text: 'contato@orientohub.com' },
    { icon: Phone, text: '+55 (11) 9999-9999' },
    { icon: MapPin, text: 'São Paulo, Brasil' },
  ];
  
  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute top-8 right-8 z-20 group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/50 transition-all border-2 border-primary-400">
            <ArrowUp className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Voltar ao topo
        </span>
      </motion.button>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-800">
          <div className="container-custom py-16">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-primary-500 font-semibold text-sm">FIQUE POR DENTRO</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Receba insights exclusivos sobre{' '}
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  startups
                </span>
              </h3>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Junte-se a mais de 10.000 founders e receba conteúdo semanal sobre empreendedorismo, validação e crescimento.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none transition-all backdrop-blur-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 flex items-center justify-center gap-2"
                >
                  Inscrever-se
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Logo and description */}
            <div className="lg:col-span-2">
              <Link to="/" onClick={handleLinkClick} className="inline-flex items-center group mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                  <span className="relative text-3xl font-bold">
                    Oriento<span className="text-primary-500">hub</span>
                  </span>
                </div>
              </Link>
              
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                A plataforma gamificada que transforma a construção de startups em uma jornada imersiva e divertida.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`group relative w-12 h-12 bg-gray-800/50 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all border border-gray-700 hover:border-primary-500/50 ${social.color}`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 rounded-xl transition-all" />
                    <social.icon className="w-5 h-5 relative z-10" />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary-500 rounded-full" />
                Navegação
              </h3>
              <ul className="space-y-3">
                {navigationLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to}
                      onClick={handleLinkClick}
                      className="group text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary-500 rounded-full" />
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to}
                      onClick={handleLinkClick}
                      className="group text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary-500 rounded-full" />
                Contato
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-400">
                    <item.icon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>&copy; {currentYear} Orientohub.</span>
                <span className="hidden sm:inline">Feito com</span>
                <Heart className="w-4 h-4 text-primary-500 fill-primary-500 animate-pulse" />
                <span className="hidden sm:inline">para founders</span>
              </div>

              <div className="flex items-center gap-6">
                <select
                  className="bg-gray-800/50 border border-gray-700 text-gray-400 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all backdrop-blur-sm"
                  defaultValue="pt-BR"
                >
                  <option value="pt-BR">🇧🇷 Português (BR)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="es-ES">🇪🇸 Español (ES)</option>
                </select>

                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Rocket className="w-4 h-4 text-primary-500" />
                  <span>v2.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
