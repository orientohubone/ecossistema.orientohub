import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  Check, 
  ArrowLeft,
  Sparkles,
  QrCode,
  Barcode,
  Calendar,
  User,
  Mail,
  MapPin,
  Building,
  ChevronRight
} from 'lucide-react';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  
  // Get plan and billing from URL params
  const searchParams = new URLSearchParams(location.search);
  const selectedPlan = searchParams.get('plan') || 'pro';
  const billingPeriod = searchParams.get('billing') || 'monthly'; // monthly or annual
  
  const plans = {
    free: {
      name: 'Free',
      price: {
        monthly: 0,
        annual: 0,
      },
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
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
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
                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Método de Pagamento</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-primary-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium block">Cartão</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'pix'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <QrCode className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'pix' ? 'text-primary-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium block">PIX</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'boleto'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Barcode className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'boleto' ? 'text-primary-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium block">Boleto</span>
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
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
                        
                        <div className="md:col-span-2">
                          <label htmlFor="cpf" className="block text-sm font-medium mb-2">
                            CPF *
                          </label>
                          <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            required
                            value={formData.cpf}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                            placeholder="000.000.000-00"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Details - Conditional based on method */}
                    {paymentMethod === 'card' && (
                      <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary-500" />
                          Dados do Cartão
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                              Número do cartão *
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              required
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                                Validade *
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                required
                                placeholder="MM/AA"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="cvc" className="block text-sm font-medium mb-2">
                                CVV *
                              </label>
                              <input
                                type="text"
                                id="cvc"
                                name="cvc"
                                required
                                maxLength={4}
                                value={formData.cvc}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'pix' && (
                      <div className="bg-primary-500/10 border-2 border-primary-500/30 rounded-xl p-6">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                          <h4 className="font-bold mb-2">Pagamento via PIX</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Após clicar em "Finalizar Compra", você receberá um QR Code para pagamento
                          </p>
                          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-medium">
                            <Check className="w-4 h-4" />
                            Aprovação instantânea
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'boleto' && (
                      <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6">
                        <div className="text-center">
                          <Barcode className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                          <h4 className="font-bold mb-2">Pagamento via Boleto</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            O boleto será gerado após a confirmação e pode levar até 3 dias úteis para compensação
                          </p>
                          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            Vencimento em 3 dias úteis
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        Endereço de Cobrança
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium mb-2">
                            Endereço *
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                            placeholder="Rua, Número, Complemento"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-2">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                            placeholder="São Paulo"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium mb-2">
                            Estado *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                            placeholder="SP"
                            maxLength={2}
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                            CEP *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            required
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                            placeholder="00000-000"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isProcessing}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando pagamento...
                        </>
                      ) : (
                        <>
                          <Lock className="w-6 h-6" />
                          Finalizar Compra - R$ {displayPrice}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                    
                    {/* Security Notice */}
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      Pagamento processado de forma segura e criptografada
                    </div>
                  </form>
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
