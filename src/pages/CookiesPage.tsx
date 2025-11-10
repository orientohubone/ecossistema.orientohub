import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  Settings,
  Eye,
  BarChart,
  Clock,
  Toggle,
  ExternalLink,
  Mail,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  XCircle,
  Info,
  Zap,
  Heart,
  Users,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CookiesPage = () => {
  const { t } = useTranslation();
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    preferences: true,
    marketing: false
  });

  const cookieTypes = [
    {
      id: 'essential',
      icon: Shield,
      name: 'Cookies Essenciais',
      emoji: '🔒',
      description: 'São como a receita secreta - sem eles, nada funciona! Esses cookies são necessários para o funcionamento básico da plataforma.',
      purpose: 'Garantem que você consiga fazer login, navegar com segurança e usar recursos fundamentais.',
      examples: [
        'Token de autenticação da sessão',
        'Preferências de segurança',
        'Carrinho de compras',
        'Proteção contra CSRF'
      ],
      duration: 'Sessão até 30 dias',
      canDisable: false,
      required: true
    },
    {
      id: 'preferences',
      icon: Settings,
      name: 'Cookies de Preferências',
      emoji: '🎨',
      description: 'Esses são os "cookies personalizados" - fazem você se sentir em casa! Lembram das suas escolhas e deixam tudo do seu jeito.',
      purpose: 'Salvam suas preferências para tornar sua experiência mais agradável e personalizada.',
      examples: [
        'Idioma preferido',
        'Tema (claro/escuro)',
        'Layout e visualização',
        'Configurações de notificação'
      ],
      duration: 'Até 1 ano',
      canDisable: true,
      required: false
    },
    {
      id: 'analytics',
      icon: BarChart,
      name: 'Cookies Analíticos',
      emoji: '📊',
      description: 'Os "cookies nerds" que adoram estatísticas! Eles nos ajudam a entender como melhorar a plataforma (prometemos que não julgamos seus cliques!).',
      purpose: 'Coletam dados anônimos sobre como você usa o site para melhorarmos continuamente.',
      examples: [
        'Páginas mais visitadas',
        'Tempo de permanência',
        'Origem do tráfego',
        'Comportamento de navegação'
      ],
      duration: 'Até 2 anos',
      canDisable: true,
      required: false,
      thirdParty: ['Google Analytics', 'Hotjar']
    },
    {
      id: 'marketing',
      icon: Zap,
      name: 'Cookies de Marketing',
      emoji: '🎯',
      description: 'Os "cookies publicitários" - mostram coisas que você realmente pode se interessar (nada de anúncios aleatórios!).',
      purpose: 'Exibem conteúdo e anúncios relevantes baseados nos seus interesses.',
      examples: [
        'Anúncios personalizados',
        'Retargeting',
        'Campanhas de e-mail',
        'Integração com redes sociais'
      ],
      duration: 'Até 1 ano',
      canDisable: true,
      required: false,
      thirdParty: ['Facebook Pixel', 'LinkedIn Insight', 'Google Ads']
    }
  ];

  const lastUpdated = '15 de fevereiro de 2025';

  const handleToggle = (id: string) => {
    if (id === 'essential') return; // Can't disable essential
    setCookiePreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const savePreferences = () => {
    // Here you would actually save the preferences
    alert('Preferências salvas com sucesso! 🍪✨');
  };

  return (
    <>
      <Helmet>
        <title>Política de Cookies - Orientohub | Sem Glúten, Só Dados! 🍪</title>
        <meta name="description" content="Descubra como os cookies do Orientohub tornam sua experiência mais saborosa (e segura). Spoiler: não são comestíveis!" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Cookies Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-20"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: -100,
                rotate: 0
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: 360
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              🍪
            </motion.div>
          ))}
        </div>

        <div className="container-custom relative z-10 py-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Cookie className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Política de Cookies
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              🍪 Nossos Cookies{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                (Não Comestíveis)
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              Aviso: Estes cookies não vão matar sua fome, mas vão tornar sua experiência muito mais gostosa! 😋
            </p>

            <p className="text-lg text-gray-400 mb-8">
              Descubra como usamos cookies (os digitais, não os de chocolate) para fazer a mágica acontecer
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>Última fornada: {lastUpdated}</span>
              </div>
              <button className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
                <Download className="w-4 h-4" />
                <span>Baixar Receita (PDF)</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Are Cookies Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 border-2 border-primary-500/30 rounded-2xl p-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="text-6xl">🍪</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    O que são Cookies? (A versão sem jargão técnico)
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Imagine que você entra na sua padaria favorita. O dono te reconhece e já sabe que você gosta de pão francês quentinho. 
                    <strong className="text-primary-600 dark:text-primary-400"> Cookies são exatamente isso, mas no mundo digital!</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    São pequenos arquivos de texto que guardam informações sobre suas preferências e atividades no site. 
                    Eles fazem você se sentir em casa e tornam tudo mais rápido e personalizado. E não, eles não ocupam espaço na sua despensa! 😄
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cookie Types Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                🍪 Nosso Cardápio de Cookies
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Conheça os diferentes sabores (tipos) de cookies que servimos
              </p>
            </motion.div>

            <div className="space-y-6">
              {cookieTypes.map((cookie, index) => (
                <CookieTypeCard
                  key={cookie.id}
                  cookie={cookie}
                  isEnabled={cookiePreferences[cookie.id as keyof typeof cookiePreferences]}
                  onToggle={() => handleToggle(cookie.id)}
                  delay={index * 0.1}
                />
              ))}
            </div>

            {/* Save Preferences Button */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button
                onClick={savePreferences}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-6 h-6" />
                Salvar Minhas Preferências
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Suas escolhas são respeitadas e podem ser alteradas a qualquer momento
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Control Cookies */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary-500" />
                Como Controlar os Cookies
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Toggle className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Aqui na Plataforma</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use os controles acima para escolher quais cookies aceitar. Simples assim!
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">No Seu Navegador</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Você também pode gerenciar cookies nas configurações do navegador:
                  </p>
                  <div className="space-y-1 text-sm">
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-500 hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      Chrome
                    </a>
                    <a href="https://support.mozilla.org/pt-BR/kb/protecao-aprimorada-contra-rastreamento-firefox-desktop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-500 hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      Firefox
                    </a>
                    <a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-500 hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      Safari
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                      ⚠️ Atenção, Aventureiro!
                    </h4>
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                      Desabilitar cookies essenciais pode fazer a plataforma funcionar de forma... digamos... criativa 🎨 
                      (tradução: algumas coisas podem não funcionar direito). Mas você é livre para experimentar!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="bg-gradient-to-br from-primary-500/5 to-primary-600/5 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-primary-500" />
                Curiosidades sobre Cookies
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  emoji: '🎂',
                  title: 'Aniversário',
                  text: 'Cookies digitais foram inventados em 1994. Mais velhos que muito founder por aí!'
                },
                {
                  emoji: '📏',
                  title: 'Tamanho',
                  text: 'Um cookie típico tem cerca de 4KB. Menor que uma foto de meme!'
                },
                {
                  emoji: '🏃',
                  title: 'Velocidade',
                  text: 'Cookies fazem sites carregarem mais rápido ao lembrar suas preferências.'
                },
                {
                  emoji: '🔒',
                  title: 'Segurança',
                  text: 'Cookies não podem carregar vírus ou acessar seu computador. São inofensivos!'
                }
              ].map((fact, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-3">{fact.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{fact.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{fact.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6">🍪❓</div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ainda com Fome de Informação?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Se tiver dúvidas sobre nossos cookies (digitais ou existenciais), estamos aqui para ajudar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@orientohub.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/30"
              >
                <Mail className="w-5 h-5" />
                privacy@orientohub.com
              </a>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 text-primary-500 font-bold rounded-xl backdrop-blur-sm hover:bg-primary-500/10 transition-all duration-300"
              >
                Fale Conosco
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Links */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/termos"
                className="group p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <Shield className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                      Termos de Serviço
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      As regras do jogo
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                to="/privacidade"
                className="group p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <Lock className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                      Política de Privacidade
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Como protegemos você
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Cookie Type Card Component
interface CookieTypeCardProps {
  cookie: any;
  isEnabled: boolean;
  onToggle: () => void;
  delay: number;
}

const CookieTypeCard = ({ cookie, isEnabled, onToggle, delay }: CookieTypeCardProps) => {
  const Icon = cookie.icon;

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 transition-all duration-300 ${
        isEnabled 
          ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            isEnabled ? 'bg-primary-500/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Icon className={`w-7 h-7 ${isEnabled ? 'text-primary-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {cookie.emoji} {cookie.name}
            </h3>
            {cookie.required && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full mt-1">
                <Shield className="w-3 h-3" />
                Obrigatório
              </span>
            )}
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          disabled={!cookie.canDisable}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
          } ${!cookie.canDisable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {cookie.description}
      </p>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">Para que servem:</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{cookie.purpose}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">Exemplos:</h4>
          <ul className="space-y-1">
            {cookie.examples.map((example: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                {example}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Duração: {cookie.duration}</span>
          </div>
          {cookie.thirdParty && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Terceiros: {cookie.thirdParty.length}
              </span>
            </div>
          )}
        </div>

        {cookie.thirdParty && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Serviços: {cookie.thirdParty.join(', ')}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CookiesPage;
