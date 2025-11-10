import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Scale,
  Lock,
  Users,
  Sparkles,
  ArrowRight,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle2,
      title: '1. Aceitação dos Termos',
      content: `Ao acessar e usar o Orientohub, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.`
    },
    {
      id: 'service',
      icon: FileText,
      title: '2. Descrição do Serviço',
      content: `O Orientohub é uma plataforma online que oferece ferramentas e recursos para empreendedores e startups, incluindo frameworks de negócios, mentorias, recursos educacionais e uma comunidade ativa de founders.`,
      highlights: [
        'Acesso a frameworks e metodologias exclusivas',
        'Mentorias com especialistas do mercado',
        'Networking com outros empreendedores',
        'Recursos de gamificação e acompanhamento'
      ]
    },
    {
      id: 'account',
      icon: Users,
      title: '3. Contas de Usuário',
      content: `Para acessar determinados recursos da plataforma, você precisará criar uma conta. Você é responsável por:`,
      highlights: [
        'Manter a confidencialidade de sua conta e senha',
        'Fornecer informações verdadeiras e atualizadas',
        'Notificar-nos imediatamente sobre uso não autorizado',
        'Ser o único responsável por todas as atividades em sua conta'
      ]
    },
    {
      id: 'acceptable-use',
      icon: Shield,
      title: '4. Uso Aceitável',
      content: `Você concorda em usar o Orientohub apenas para fins legais e de acordo com estes termos. É proibido:`,
      highlights: [
        'Usar a plataforma para fins ilegais ou não autorizados',
        'Tentar danificar, desabilitar ou sobrecarregar nossos servidores',
        'Copiar, modificar ou distribuir conteúdo sem permissão',
        'Fazer engenharia reversa de qualquer parte da plataforma',
        'Usar bots ou ferramentas automatizadas sem autorização'
      ]
    },
    {
      id: 'intellectual-property',
      icon: Lock,
      title: '5. Propriedade Intelectual',
      content: `Todo o conteúdo disponível no Orientohub, incluindo textos, gráficos, logos, ícones, imagens, vídeos e frameworks, é propriedade do Orientohub ou de seus licenciadores e está protegido por leis de propriedade intelectual brasileiras e internacionais.`
    },
    {
      id: 'liability',
      icon: AlertCircle,
      title: '6. Limitação de Responsabilidade',
      content: `O Orientohub fornece a plataforma "como está" e "conforme disponível". Não nos responsabilizamos por:`,
      highlights: [
        'Danos diretos, indiretos ou consequenciais do uso da plataforma',
        'Perda de dados, lucros ou oportunidades de negócio',
        'Interrupções temporárias do serviço',
        'Ações ou decisões tomadas com base no conteúdo da plataforma'
      ]
    },
    {
      id: 'modifications',
      icon: Clock,
      title: '7. Modificações dos Termos',
      content: `Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas com pelo menos 30 dias de antecedência. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.`
    },
    {
      id: 'cancellation',
      icon: FileText,
      title: '8. Cancelamento e Suspensão',
      content: `Você pode cancelar sua conta a qualquer momento através das configurações. O Orientohub se reserva o direito de suspender ou encerrar contas que:`,
      highlights: [
        'Violem estes termos de serviço',
        'Tenham atividades suspeitas ou fraudulentas',
        'Permaneçam inativas por mais de 12 meses',
        'Recebam múltiplas reclamações de outros usuários'
      ]
    },
    {
      id: 'law',
      icon: Scale,
      title: '9. Lei Aplicável e Jurisdição',
      content: `Estes termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais da comarca de [Sua Cidade], Brasil.`
    }
  ];

  const lastUpdated = '15 de fevereiro de 2025';

  return (
    <>
      <Helmet>
        <title>Termos de Serviço - Orientohub</title>
        <meta name="description" content="Leia os termos de serviço do Orientohub. Conheça seus direitos e responsabilidades ao usar nossa plataforma." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
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
              <Shield className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Termos de Serviço
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Termos e{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Condições
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Leia atentamente nossos termos de serviço para entender seus direitos e responsabilidades ao usar o Orientohub
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>Última atualização: {lastUpdated}</span>
              </div>
              <button className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
                <Download className="w-4 h-4" />
                <span>Baixar PDF</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Ir para:
            </span>
            {sections.slice(0, 5).map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors whitespace-nowrap"
              >
                {section.title.split('.')[0]}. {section.title.split('. ')[1]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Important Notice */}
            <motion.div
              className="bg-primary-500/10 border-2 border-primary-500/30 rounded-2xl p-6 mb-12 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Importante: Leia com Atenção
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Estes termos constituem um acordo legal entre você e o Orientohub. Ao criar uma conta ou usar nossos serviços, você concorda com todos os termos aqui descritos. Se tiver dúvidas, entre em contato com nosso suporte.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <TermSection
                  key={section.id}
                  section={section}
                  delay={index * 0.1}
                />
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              className="mt-16 bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border-2 border-primary-500/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Dúvidas sobre os Termos?
                </h3>
                <p className="text-gray-300 mb-6">
                  Nossa equipe está pronta para esclarecer qualquer questão
                </p>
                <Link
                  to="/contato"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/30"
                >
                  Fale Conosco
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            {/* Related Links */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to="/privacidade"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300"
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
                      Como protegemos seus dados
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                to="/cookies"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                      Política de Cookies
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Como usamos cookies
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

// Term Section Component
interface TermSectionProps {
  section: {
    id: string;
    icon: React.ElementType;
    title: string;
    content: string;
    highlights?: string[];
  };
  delay: number;
}

const TermSection = ({ section, delay }: TermSectionProps) => {
  const Icon = section.icon;

  return (
    <motion.div
      id={section.id}
      className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {section.title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {section.content}
        </p>

        {/* Highlights */}
        {section.highlights && (
          <ul className="space-y-3 mt-6">
            {section.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default TermsPage;
