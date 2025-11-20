import { useState, FormEvent } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Shield, AlertCircle } from 'lucide-react';
import { InteractiveCard } from './InteractiveCard';

interface CheckoutFormProps {
    amount: number;
    plan: string;
    billing: string;
}

export const CheckoutForm = ({ amount, plan, billing }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Estados para o cartão interativo
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success?plan=${plan}&billing=${billing}`,
                },
            });

            if (error) {
                setErrorMessage(error.message || 'Erro ao processar pagamento');
            }
        } catch (err: any) {
            setErrorMessage('Erro inesperado. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cartão Interativo */}
            <div className="mb-8">
                <InteractiveCard
                    cardNumber={cardData.number}
                    cardholderName={cardData.name}
                    expiryDate={cardData.expiry}
                    cvv={cardData.cvv}
                />
            </div>

            {/* Campos para Preview do Cartão */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Preview do Cartão (apenas visual)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                        <input
                            type="text"
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"
                            value={cardData.number}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                setCardData({ ...cardData, number: value });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                        <input
                            type="text"
                            placeholder="NOME COMPLETO"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Validade</label>
                        <input
                            type="text"
                            maxLength={5}
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setCardData({ ...cardData, expiry: value });
                            }}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                            type="text"
                            maxLength={4}
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    ℹ️ Estes campos são apenas para visualização. Use o formulário abaixo para pagamento seguro.
                </p>
            </div>

            {/* Stripe Payment Element (Pagamento Real) */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Dados de Pagamento Seguro
                </h4>
                <div className="min-h-[500px] overflow-visible">
                    <PaymentElement />
                </div>
            </div>

            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
                >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-900 dark:text-red-100 text-sm">
                            Erro no pagamento
                        </p>
                        <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                            {errorMessage}
                        </p>
                    </div>
                </motion.div>
            )}

            <motion.button
                type="submit"
                disabled={isProcessing || !stripe}
                whileHover={{ scale: !isProcessing ? 1.01 : 1 }}
                whileTap={{ scale: !isProcessing ? 0.99 : 1 }}
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
                        Finalizar Compra - R$ {amount}
                        <ChevronRight className="w-5 h-5" />
                    </>
                )}
            </motion.button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Pagamento processado de forma segura pelo Stripe
            </div>
        </form>
    );
};
