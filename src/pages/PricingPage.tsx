import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Rocket, 
  TrendingUp, 
  Zap,
  Award,
  Shield,
  Users,
  ChevronDown,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Free',
      tagline: 'Para começar',
      description: 'Perfeito para founders explorando ideias',
      price: {
        monthly: 0,
        annual: 0,
      },
      icon: Rocket,
      features: [
        'Acesso a frameworks básicos',
        'Comunidade gratuita',
        'Recursos de gamificação',
        '1 projeto ativo',
        'Suporte via comunidade',
      ],
      cta: 'Começar Grátis',
      href: '/cadastro',
      featured: false,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Pro',
      tagline: 'Mais popular',
      description: 'Para founders sérios sobre crescimento',
      price: {
        monthly: 97,
        annual: 970,
      },
      icon: TrendingUp,
      features: [
        'Tudo do plano Free',
        'Frameworks avançados',
        'Templates premium',
        'Projetos ilimitados',
        'Mentorias mensais',
        'Integrações avançadas',
        'Suporte prioritário',
        'Networking exclusivo',
      ],
      cta: 'Começar Teste Grátis',
      href: '/checkout?plan=pro',
      featured: true,
      color: 'from-primary-400 to-primary-600',
    },
    {
      name: 'Enterprise',
      tagline: 'Solução completa',
      description: 'Para aceleradoras e corporates',
      price: {
        monthly: 'Custom',
        annual: 'Custom',
      },
      icon: Award,
      features: [
        'Tudo do plano Pro',
        'Onboarding dedicado',
        'Customer Success exclusivo',
        'API personalizada',
        'Relatórios avançados',
        'Treinamentos in-company',
        'SLA garantido',
        'Customizações específicas',
      ],
      cta: 'Falar com Vendas',
      href: '/contato',
      featured: false,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const faqs = [
    {
      question: 'Posso mudar de plano depois?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças serão refletidas imediatamente e ajustaremos o valor proporcional na sua próxima fatura.'
    },
    {
      question: 'Como funciona o período de teste?',
      answer: 'Oferecemos 14 dias de teste gratuito no plano Pro, sem necessidade de cartão de crédito. Você terá acesso completo a todas as funcionalidades premium durante este período.'
    },
    {
      question: 'Quais formas de pagamento são aceitas?',
      answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express, Elo), PIX e boleto bancário para pagamentos no Brasil. Para planos Enterprise, também oferecemos faturamento.'
    },
    {
      question: 'Há taxa de cancelamento?',
      answer: 'Não! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas. Seu acesso continuará ativo até o final do período pago.'
    },
    {
      question: 'Vocês oferecem desconto para startups early-stage?',
      answer: 'Sim! Temos um programa especial para startups pré-seed e seed. Entre em contato conosco para saber mais sobre condições especiais.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Planos e Preços - Orientohub</title>
        <meta name="description" content="Escolha o plano perfeito para acelerar sua startup. Comece grátis ou desbloqueie recursos premium." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
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
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Planos e Preços
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              Escolha o plano{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                perfeito
              </span>
              {' '}para você
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Comece grátis e escale conforme sua startup cresce
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-white/5 backdrop-blur-sm border border-primary-500/20 rounded-full p-2 max-w-md mx-auto">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  !isAnnual
                    ? 'bg-primary-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isAnnual
                    ? 'bg-primary-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Anual
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                isAnnual={isAnnual}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            className="mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, text: 'Pagamento Seguro' },
                { icon: Zap, text: 'Ativação Instantânea' },
                { icon: Users, text: '500+ Founders' },
                { icon: Star, text: '4.9/5 Avaliação' }
              ].map((badge, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <badge.icon className="w-8 h-8 text-primary-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-semibold text-sm">PERGUNTAS FREQUENTES</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Dúvidas sobre os planos?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Encontre respostas para as perguntas mais comuns
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ainda tem dúvidas?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Fale com nosso time e descubra qual plano é ideal para sua startup
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
              >
                <Rocket className="w-6 h-6" />
                Começar Grátis
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 px-8 py-5 border-2 border-primary-500/50 hover:border-primary-500 text-primary-500 font-bold text-lg rounded-xl backdrop-blur-sm hover:bg-primary-500/10 transition-all duration-300"
              >
                Falar com Vendas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Pricing Card Component
interface PricingCardProps {
  plan: {
    name: string;
    tagline: string;
    description: string;
    price: {
      monthly: number | string;
      annual: number | string;
    };
    icon: React.ElementType;
    features: string[];
    cta: string;
    href: string;
    featured: boolean;
    color: string;
  };
  isAnnual: boolean;
  delay: number;
}

const PricingCard = ({ plan, isAnnual, delay }: PricingCardProps) => {
  const Icon = plan.icon;
  const price = isAnnual ? plan.price.annual : plan.price.monthly;
  const displayPrice = typeof price === 'number' ? `R$ ${price}` : price;

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl ${
        plan.featured
          ? 'border-primary-500 shadow-xl shadow-primary-500/20 scale-105 lg:scale-110'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-500'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      {/* Featured badge */}
      {plan.featured && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary-500 text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
          <Star className="w-4 h-4 fill-current" />
          {plan.tagline}
        </div>
      )}

      {/* Icon - Floating and Interactive */}
      <div className="flex items-center justify-between mb-6">
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-150" />
          
          {/* Icon */}
          <Icon className="relative w-14 h-14 text-primary-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all duration-300" />
        </motion.div>
        
        {!plan.featured && (
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {plan.tagline}
          </span>
        )}
      </div>

      {/* Plan info */}
      <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {plan.description}
      </p>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            {displayPrice}
          </span>
          {typeof price === 'number' && (
            <span className="text-gray-500 dark:text-gray-400">
              /{isAnnual ? 'ano' : 'mês'}
            </span>
          )}
        </div>
        {isAnnual && typeof price === 'number' && (
          <p className="text-sm text-primary-500 font-medium mt-2">
            Economize R$ {(plan.price.monthly as number) * 12 - (plan.price.annual as number)} por ano
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to={plan.href}
        className={`block w-full text-center px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
          plan.featured
            ? 'bg-primary-500 hover:bg-primary-600 text-black shadow-lg shadow-primary-500/30'
            : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black'
        }`}
      >
        {plan.cta}
      </Link>
    </motion.div>
  );
};

// FAQ Item Component
interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  delay: number;
}

const FaqItem = ({ question, answer, isOpen, onClick, delay }: FaqItemProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <h3 className="text-lg font-bold pr-8">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-primary-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PricingPage;
