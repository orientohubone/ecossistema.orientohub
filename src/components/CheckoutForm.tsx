import { useState, FormEvent } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Shield, AlertCircle } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="min-h-[400px]">
                <PaymentElement />
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
