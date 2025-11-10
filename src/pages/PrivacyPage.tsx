import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye,
  Database,
  UserCheck,
  Bell,
  Share2,
  Settings,
  Cookie,
  Mail,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
  Download,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'introduction',
      icon: Shield,
      title: '1. Introdução',
      content: `Esta Política de Privacidade descreve como o Orientohub coleta, usa, armazena e protege suas informações pessoais. Levamos sua privacidade muito a sério e nos comprometemos a ser transparentes sobre nossas práticas de dados e a proteger suas informações com os mais altos padrões de segurança.`,
      important: true
    },
    {
      id: 'data-collection',
      icon: Database,
      title: '2. Informações que Coletamos',
      content: `Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:`,
      subcategories: [
        {
          title: 'Informações de Cadastro',
          items: [
            'Nome completo e nome de usuário',
            'Endereço de e-mail',
            'Senha (armazenada com criptografia)',
            'Foto de perfil (opcional)',
            'Informações da empresa/startup'
          ]
        },
        {
          title: 'Dados de Uso',
          items: [
            'Páginas visitadas e recursos utilizados',
            'Tempo gasto na plataforma',
            'Interações com conteúdo e outros usuários',
            'Progresso em frameworks e cursos'
          ]
        },
        {
          title: 'Informações Técnicas',
          items: [
            'Endereço IP e localização aproximada',
            'Tipo de navegador e dispositivo',
            'Sistema operacional',
            'Cookies e identificadores únicos'
          ]
        }
      ]
    },
    {
      id: 'data-usage',
      icon: Settings,
      title: '3. Como Usamos suas Informações',
      content: `Utilizamos suas informações para diversos propósitos legítimos:`,
      highlights: [
        'Fornecer, operar e manter a plataforma Orientohub',
        'Personalizar sua experiência e recomendar conteúdo relevante',
        'Processar transações e gerenciar assinaturas',
        'Enviar comunicações importantes sobre sua conta',
        'Melhorar nossos serviços através de análises e feedback',
        'Prevenir fraudes e garantir a segurança da plataforma',
        'Cumprir obrigações legais e regulatórias',
        'Enviar newsletters e conteúdo educacional (com seu consentimento)'
      ]
    },
    {
      id: 'data-sharing',
      icon: Share2,
      title: '4. Compartilhamento de Dados',
      content: `Não vendemos suas informações pessoais. Compartilhamos dados apenas nas seguintes situações:`,
      subcategories: [
        {
          title: 'Prestadores de Serviços',
          items: [
            'Provedores de hospedagem em nuvem (AWS, Google Cloud)',
            'Serviços de pagamento (Stripe, PagSeguro)',
            'Ferramentas de análise (Google Analytics)',
            'Serviços de e-mail marketing'
          ]
        },
        {
          title: 'Exigências Legais',
          items: [
            'Quando requerido por lei ou ordem judicial',
            'Para proteger direitos, propriedade ou segurança',
            'Em casos de investigação de fraude ou atividade ilegal'
          ]
        },
        {
          title: 'Com Seu Consentimento',
          items: [
            'Quando você autorizar explicitamente o compartilhamento',
            'Para recursos de networking com outros usuários',
            'Integrações com ferramentas de terceiros que você conectar'
          ]
        }
      ]
    },
    {
      id: 'data-security',
      icon: Lock,
      title: '5. Segurança dos Dados',
      content: `Implementamos medidas rigorosas de segurança para proteger suas informações:`,
      highlights: [
        'Criptografia SSL/TLS para todas as comunicações',
        'Senhas com hash e salt usando algoritmos modernos',
        'Autenticação de dois fatores (2FA) disponível',
        'Firewalls e sistemas de detecção de intrusão',
        'Backups regulares e criptografados',
        'Controles de acesso baseados em funções',
        'Auditorias de segurança periódicas',
        'Monitoramento contínuo de atividades suspeitas'
      ]
    },
    {
      id: 'user-rights',
      icon: UserCheck,
      title: '6. Seus Direitos (LGPD)',
      content: `De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:`,
      highlights: [
        'Acessar todos os seus dados pessoais que temos',
        'Corrigir informações incompletas, inexatas ou desatualizadas',
        'Solicitar a exclusão de dados desnecessários ou tratados em desconformidade',
        'Revogar consentimentos anteriormente dados',
        'Solicitar a portabilidade de dados para outro fornecedor',
        'Obter informações sobre com quem compartilhamos seus dados',
        'Opor-se ao tratamento de dados em certas circunstâncias',
        'Apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD)'
      ]
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: '7. Cookies e Tecnologias Similares',
      content: `Utilizamos cookies para melhorar sua experiência e analisar o uso da plataforma:`,
      subcategories: [
        {
          title: 'Cookies Essenciais',
          items: [
            'Necessários para funcionalidade básica',
            'Autenticação e segurança de sessão',
            'Não podem ser desativados'
          ]
        },
        {
          title: 'Cookies de Desempenho',
          items: [
            'Análise de uso e comportamento',
            'Identificação de problemas técnicos',
            'Podem ser desativados nas configurações'
          ]
        },
        {
          title: 'Cookies de Funcionalidade',
          items: [
            'Lembrar preferências do usuário',
            'Personalização de conteúdo',
            'Podem ser gerenciados individualmente'
          ]
        }
      ]
    },
    {
      id: 'data-retention',
      icon: Clock,
      title: '8. Retenção de Dados',
      content: `Mantemos suas informações apenas pelo tempo necessário:`,
      highlights: [
        'Dados de conta ativa: enquanto você usar nossos serviços',
        'Dados de conta cancelada: até 90 dias após cancelamento',
        'Dados de transações: 5 anos (exigência fiscal)',
        'Logs de segurança: até 1 ano',
        'Dados anonimizados: podem ser mantidos indefinidamente para análises'
      ]
    },
    {
      id: 'international-transfers',
      icon: Share2,
      title: '9. Transferências Internacionais',
      content: `Alguns de nossos prestadores de serviços estão localizados fora do Brasil. Garantimos proteção adequada através de:`,
      highlights: [
        'Cláusulas contratuais padrão aprovadas',
        'Certificações de privacidade reconhecidas',
        'Medidas técnicas e organizacionais apropriadas',
        'Transferências apenas para países com proteção adequada'
      ]
    },
    {
      id: 'children',
      icon: AlertTriangle,
      title: '10. Menores de Idade',
      content: `Nossa plataforma não é direcionada a menores de 18 anos. Se descobrirmos que coletamos dados de menores sem consentimento parental adequado, tomaremos medidas para excluir essas informações imediatamente.`
    },
    {
      id: 'changes',
      icon: Bell,
      title: '11. Alterações na Política',
      content: `Podemos atualizar esta política periodicamente para refletir mudanças em nossas práticas ou requisitos legais. Alterações significativas serão comunicadas através de:`,
      highlights: [
        'Notificação por e-mail com 30 dias de antecedência',
        'Aviso destacado na plataforma',
        'Atualização da data "Última modificação" no topo desta página',
        'Registro de versões anteriores disponível mediante solicitação'
      ]
    },
    {
      id: 'contact',
      icon: Mail,
      title: '12. Contato e DPO',
      content: `Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato com nosso Encarregado de Proteção de Dados (DPO):`,
      contactInfo: {
        email: 'privacy@orientohub.com',
        dpo: 'dpo@orientohub.com',
        address: 'Orientohub - Avenida Exemplo, 1234 - São Paulo, SP',
        response: 'Responderemos em até 15 dias úteis'
      }
    }
  ];

  const lastUpdated = '15 de fevereiro de 2025';

  return (
    <>
      <Helmet>
        <title>Política de Privacidade - Orientohub</title>
        <meta name="description" content="Saiba como o Orientohub protege seus dados pessoais. Nossa política de privacidade em conformidade com a LGPD." />
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
              <Lock className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Política de Privacidade
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Seus dados{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                protegidos
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Transparência total sobre como coletamos, usamos e protegemos suas informações pessoais de acordo com a LGPD
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>Última atualização: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Conforme LGPD</span>
              </div>
              <button className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
                <Download className="w-4 h-4" />
                <span>Baixar PDF</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Ir para:
            </span>
            {sections.slice(0, 6).map((section) => (
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
            {/* LGPD Compliance Badge */}
            <motion.div
              className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30 rounded-2xl p-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    Conformidade com a LGPD
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Esta política está em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Respeitamos seus direitos como titular de dados e mantemos a transparência sobre todas as nossas práticas de tratamento de informações pessoais.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Privacy Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <PrivacySection
                  key={section.id}
                  section={section}
                  delay={index * 0.05}
                />
              ))}
            </div>

            {/* Contact DPO */}
            <motion.div
              className="mt-16 bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border-2 border-primary-500/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Dúvidas sobre Privacidade?
                </h3>
                <p className="text-gray-300 mb-6">
                  Entre em contato com nosso Encarregado de Proteção de Dados
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
                    Formulário de Contato
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
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
                to="/termos"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                      Termos de Serviço
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Condições de uso da plataforma
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
                    <Cookie className="w-6 h-6 text-primary-500" />
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

// Privacy Section Component
interface PrivacySectionProps {
  section: {
    id: string;
    icon: React.ElementType;
    title: string;
    content: string;
    important?: boolean;
    highlights?: string[];
    subcategories?: Array<{
      title: string;
      items: string[];
    }>;
    contactInfo?: {
      email: string;
      dpo: string;
      address: string;
      response: string;
    };
  };
  delay: number;
}

const PrivacySection = ({ section, delay }: PrivacySectionProps) => {
  const Icon = section.icon;

  return (
    <motion.div
      id={section.id}
      className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-8 scroll-mt-24 ${
        section.important 
          ? 'border-primary-500/50 bg-primary-500/5' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          section.important ? 'bg-primary-500/20' : 'bg-primary-500/10'
        }`}>
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

        {/* Subcategories */}
        {section.subcategories && (
          <div className="mt-6 space-y-6">
            {section.subcategories.map((subcategory, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  {subcategory.title}
                </h4>
                <ul className="space-y-2">
                  {subcategory.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Contact Info */}
        {section.contactInfo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">E-mail Privacidade</p>
              <a href={`mailto:${section.contactInfo.email}`} className="text-primary-500 font-medium hover:underline">
                {section.contactInfo.email}
              </a>
            </div>
            <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">DPO</p>
              <a href={`mailto:${section.contactInfo.dpo}`} className="text-primary-500 font-medium hover:underline">
                {section.contactInfo.dpo}
              </a>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Endereço</p>
              <p className="text-gray-700 dark:text-gray-300">{section.contactInfo.address}</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 md:col-span-2">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {section.contactInfo.response}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PrivacyPage;
