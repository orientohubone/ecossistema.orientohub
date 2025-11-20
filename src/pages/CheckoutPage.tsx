import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../components/CheckoutForm';
import {
  Lock,
  Shield,
  Check,
  ArrowLeft,
  Sparkles,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Inicializar Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const CheckoutPage = () => {
  const location = useLocation();

  // Estados
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Get plan and billing from URL params
  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get('plan') || 'pro';
  const billingPeriod = searchParams.get('billing') || 'monthly';

  const plans = {
    free: {
      name: 'Free',
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [],
    },
    pro: {
      name: 'Pro',
      price: {
        monthly: 97,
        annual: 970,
      },
      features: [
        'Frameworks avançados',
        'Templates premium',
        'Projetos ilimitados',
        'Mentorias mensais',
        'Integrações avançadas',
        'Suporte prioritário',
        'Networking exclusivo',
        'Analytics detalhado',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: {
        monthly: 'Custom',
        annual: 'Custom',
      },
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
    },
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const isAnnual = billingPeriod === 'annual';
  const price = currentPlan.price[isAnnual ? 'annual' : 'monthly'];
  const displayPrice = typeof price === 'number' ? price : 0;
  const savings = isAnnual && typeof price === 'number'
    ? (currentPlan.price.monthly as number) * 12 - price
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Criar PaymentIntent quando o usuário preencher nome e email
  useEffect(() => {
    const createPaymentIntent = async () => {
      // Validar dados básicos
      if (!formData.name || !formData.email) {
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return;
      }

      setIsLoadingPaymentIntent(true);
      setPaymentError(null);

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: selectedPlan,
            billing: billingPeriod,
            email: formData.email,
            name: formData.name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao criar pagamento');
        }

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Erro ao criar PaymentIntent:', error);
        setPaymentError(error.message || 'Erro ao processar pagamento. Tente novamente.');
      } finally {
        setIsLoadingPaymentIntent(false);
      }
    };

    // Debounce: aguardar 500ms após última digitação
    const timeoutId = setTimeout(createPaymentIntent, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.name, formData.email, selectedPlan, billingPeriod]);

  return (
    <>
      <Helmet>
        <title>Checkout - Orientohub</title>
        <meta name="description" content="Finalize sua assinatura e comece a transformar sua startup hoje!" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[30vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
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

        <div className="container-custom relative z-10 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para planos
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Checkout Seguro
                </h1>
                <p className="text-gray-400">Finalize sua assinatura em poucos passos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary - Sidebar */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    <h2 className="text-xl font-bold">Resumo do Pedido</h2>
                  </div>

                  {/* Plan Badge */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-xl mb-6">
                    <h3 className="text-lg font-bold text-black mb-1">{currentPlan.name}</h3>
                    <p className="text-sm text-black/80">
                      Cobrança {isAnnual ? 'anual' : 'mensal'}
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Plano {currentPlan.name}</span>
                      <span className="font-semibold">
                        R$ {displayPrice}
                      </span>
                    </div>

                    {isAnnual && savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">Desconto anual</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          -R$ {savings}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-500">
                        R$ {displayPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{isAnnual ? 'ano' : 'mês'}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  {currentPlan.features && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Incluído no plano:
                      </p>
                      {currentPlan.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Pagamento Seguro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span>SSL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Form - Main Content */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary-500" />
                      Informações Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                          placeholder="João Silva"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                          placeholder="joao@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary-500" />
                      Dados de Pagamento
                    </h3>

                    {/* Error Message */}
                    {paymentError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl mb-6"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900 dark:text-red-100 text-sm">
                            Erro ao criar pagamento
                          </p>
                          <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                            {paymentError}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Loading State */}
                    {isLoadingPaymentIntent && (
                      <div className="flex items-center justify-center gap-3 p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Preparando pagamento seguro...
                        </span>
                      </div>
                    )}

                    {/* Stripe Elements */}
                    {!isLoadingPaymentIntent && clientSecret && stripePromise && (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: 'stripe',
                            variables: {
                              colorPrimary: '#FFD700',
                            },
                          },
                        }}
                      >
                        <CheckoutForm
                          amount={displayPrice}
                          plan={selectedPlan}
                          billing={billingPeriod}
                        />
                      </Elements>
                    )}

                    {/* Waiting for User Info */}
                    {!isLoadingPaymentIntent && !clientSecret && !paymentError && (
                      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Preencha seu nome e email para continuar
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
