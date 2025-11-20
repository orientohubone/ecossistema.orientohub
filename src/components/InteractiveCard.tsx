import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wifi } from 'lucide-react';

interface InteractiveCardProps {
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    cvv?: string;
}

export const InteractiveCard = ({
    cardNumber = '',
    cardholderName = '',
    expiryDate = '',
    cvv = '',
}: InteractiveCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Formatar número do cartão (4 grupos de 4 dígitos)
    const formatCardNumber = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        const groups = cleaned.match(/.{1,4}/g) || [];
        return groups.join(' ').padEnd(19, '•');
    };

    // Detectar bandeira do cartão
    const getCardBrand = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('3')) return 'Amex';
        return '';
    };

    // Flip para mostrar CVV quando usuário digita
    useEffect(() => {
        if (cvv.length > 0) {
            setIsFlipped(true);
            const timer = setTimeout(() => setIsFlipped(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [cvv]);

    const brand = getCardBrand(cardNumber);

    return (
        <div className="w-full max-w-md mx-auto perspective-1000">
            <motion.div
                className="relative w-full h-56"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Frente do Cartão */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-2xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full -translate-y-32 translate-x-32" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black rounded-full translate-y-24 -translate-x-24" />
                        </div>

                        {/* Header */}
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-black" />
                                </div>
                                <Wifi className="w-6 h-6 text-black rotate-90" />
                            </div>
                            <div className="text-black font-bold text-lg">
                                {brand || 'CARD'}
                            </div>
                        </div>

                        {/* Número do Cartão */}
                        <div className="relative z-10">
                            <motion.div
                                className="text-black text-2xl font-mono tracking-wider"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {formatCardNumber(cardNumber) || '•••• •••• •••• ••••'}
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <div className="text-black text-xs opacity-70 mb-1">Titular</div>
                                <motion.div
                                    className="text-black font-semibold text-sm uppercase"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {cardholderName || 'SEU NOME'}
                                </motion.div>
                            </div>
                            <div>
                                <div className="text-black text-xs opacity-70 mb-1">Validade</div>
                                <motion.div
                                    className="text-black font-semibold text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {expiryDate || 'MM/AA'}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verso do Cartão */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Tarja Magnética */}
                        <div className="w-full h-12 bg-black mt-6" />

                        {/* CVV */}
                        <div className="px-6 mt-6">
                            <div className="bg-white rounded px-4 py-2 text-right">
                                <span className="text-black font-mono text-lg">
                                    {cvv || '•••'}
                                </span>
                            </div>
                            <div className="text-black text-xs mt-2 opacity-70">CVV</div>
                        </div>

                        {/* Info */}
                        <div className="px-6 mt-8">
                            <div className="text-black text-xs opacity-70">
                                Este cartão é de uso exclusivo do titular.
                                <br />
                                Em caso de perda ou roubo, entre em contato imediatamente.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Legenda */}
            <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                {isFlipped ? 'Verificando CVV...' : 'Preencha os dados para visualizar'}
            </div>
        </div>
    );
};
