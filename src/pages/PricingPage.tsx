import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: t('pricing.free.name'),
      description: t('pricing.free.description'),
      price: {
        monthly: 'R$ 0',
        annual: 'R$ 0',
      },
      features: [
        'Acesso a frameworks básicos',
        'Comunidade gratuita',
        'Recursos de gamificação',
        '1 projeto ativo',
        'Suporte via comunidade',
      ],
      limitations: [
        'Sem acesso a templates premium',
        'Sem mentorias exclusivas',
        'Sem integrações avançadas',
      ],
      cta: t('pricing.free.cta'),
      href: '/cadastro',
      featured: false,
    },
    {
      name: t('pricing.pro.name'),
      description: t('pricing.pro.description'),
      price: {
        monthly: 'R$ 97',
        annual: 'R$ 970',
      },
      features: [
        'Todos os recursos do plano Free',
        'Frameworks avançados',
        'Templates premium',
        'Projetos ilimitados',
        'Mentorias mensais',
        'Integrações avançadas',
        'Suporte prioritário',
        'Networking exclusivo',
      ],
      cta: t('pricing.pro.cta'),
      href: '/checkout?plan=pro',
      featured: true,
    },
    {
      name: t('pricing.enterprise.name'),
      description: t('pricing.enterprise.description'),
      price: {
        monthly: t('pricing.enterprise.price'),
        annual: t('pricing.enterprise.price'),
      },
      features: [
        'Todos os recursos do plano Pro',
        'Onboarding dedicado',
        'Customer Success exclusivo',
        'API personalizada',
        'Relatórios avançados',
        'Treinamentos in-company',
        'SLA garantido',
        'Customizações específicas',
      ],
      cta: t('pricing.enterprise.cta'),
      href: '/contato',
      featured: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('pricing.title')} | Orientohub</title>
        <meta name="description" content={t('pricing.subtitle')} />
      </Helmet>

      <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 page-background-lines">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('pricing.title')}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('pricing.subtitle')}</p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-sm ${!isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {t('pricing.monthly')}
                </span>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700"
                  role="switch"
                  aria-checked={isAnnual}
                  onClick={() => setIsAnnual(!isAnnual)}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isAnnual ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm ${isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {t('pricing.yearly')}
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
                    {t('pricing.savePercent', { percent: 20 })}
                  </span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl pricing-card ${
                  plan.featured
                    ? 'bg-primary-500 text-black'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                } shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.featured && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-black px-4 py-1 text-sm font-medium text-white">
                      Mais popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className={`mt-2 ${plan.featured ? 'text-black/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {plan.description}
                  </p>
                  <p className="mt-6">
                    <span className="text-4xl font-bold">{isAnnual ? plan.price.annual : plan.price.monthly}</span>
                    {plan.name !== 'Enterprise' && (
                      <span className={plan.featured ? 'text-black/80' : 'text-gray-500 dark:text-gray-400'}>
                        {t('pricing.free.period')}
                      </span>
                    )}
                  </p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className={`h-5 w-5 flex-shrink-0 ${plan.featured ? 'text-black' : 'text-primary-500'}`} />
                        <span className="ml-3">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation) => (
                      <li key={limitation} className="flex items-start">
                        <X className="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                        <span className="ml-3 text-gray-500 dark:text-gray-400">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      to={plan.href}
                      className={`block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors ${
                        plan.featured
                          ? 'bg-black text-white hover:bg-gray-900'
                          : 'bg-primary-500 text-black hover:bg-primary-600'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Perguntas Frequentes</h2>
              <div className="grid gap-8 mt-8">
                <FaqItem
                  question="Posso mudar de plano depois?"
                  answer="Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças serão refletidas na sua próxima fatura."
                />
                <FaqItem
                  question="Como funciona o período gratuito?"
                  answer="Oferecemos 14 dias de teste gratuito nos planos pagos, sem compromisso. Você pode cancelar a qualquer momento durante este período."
                />
                <FaqItem
                  question="Quais formas de pagamento são aceitas?"
                  answer="Aceitamos cartões de crédito (Visa, Mastercard, American Express) e PIX para pagamentos no Brasil."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  return (
    <div className="text-left">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-gray-600 dark:text-gray-300">{answer}</p>
    </div>
  );
};

export default PricingPage;