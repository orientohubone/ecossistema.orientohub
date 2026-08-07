import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Mail, Sparkles } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../stores/authStore';

const CheckoutSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [activationStatus, setActivationStatus] = useState<'checking' | 'waiting' | 'active' | 'timeout'>('checking');

    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan') || 'pro';
    const billing = searchParams.get('billing') || 'monthly';
    const paymentIntent = searchParams.get('payment_intent');

    const planNames: Record<string, string> = {
        free: 'Free',
        pro: 'Pro',
        enterprise: 'Enterprise',
    };

    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        let redirectTimer: ReturnType<typeof setTimeout> | undefined;
        const startedAt = Date.now();

        const checkActivation = async () => {
            const { data } = await supabase
                .from('billing_subscriptions')
                .select('id')
                .eq('user_id', user.id)
                .eq('plan', plan)
                .eq('status', 'active')
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (cancelled) return true;
            if (data) {
                setActivationStatus('active');
                redirectTimer = setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
                return true;
            }

            if (Date.now() - startedAt >= 45_000) {
                setActivationStatus('timeout');
                return true;
            }

            setActivationStatus('waiting');
            return false;
        };

        const poll = async () => {
            if (await checkActivation()) clearInterval(interval);
        };
        const interval = setInterval(poll, 2_500);
        poll();

        return () => {
            cancelled = true;
            clearInterval(interval);
            if (redirectTimer) clearTimeout(redirectTimer);
        };
    }, [navigate, plan, user]);

    return (
        <>
            <Helmet>
                <title>Pagamento Confirmado - Orientohub</title>
            </Helmet>

            <section className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-2xl w-full"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200 dark:border-gray-700">
                        {/* Ícone de Sucesso */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50"
                        >
                            <CheckCircle className="w-14 h-14 text-white" />
                        </motion.div>

                        {/* Título */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl md:text-4xl font-bold text-center mb-4"
                        >
                            🎉 Checkout recebido!
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-center text-gray-600 dark:text-gray-400 mb-8"
                        >
                            {activationStatus === 'active'
                                ? 'Assinatura ativada! Você será direcionado ao Dashboard.'
                                : activationStatus === 'timeout'
                                    ? 'Ainda estamos aguardando a confirmação. Você pode abrir o Dashboard e atualizar a página em alguns instantes.'
                                    : 'Confirmando a assinatura com o Asaas. Isso pode levar alguns segundos.'}
                        </motion.p>

                        {/* Detalhes do Plano */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-8"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-black" />
                                    <h2 className="text-xl font-bold text-black">Plano {planNames[plan]}</h2>
                                </div>
                                <div className="bg-black/20 px-4 py-2 rounded-lg">
                                    <span className="text-sm font-semibold text-black">
                                        {billing === 'annual' ? 'Anual' : 'Mensal'}
                                    </span>
                                </div>
                            </div>

                            {paymentIntent && (
                                <p className="text-xs text-black/70 font-mono">
                                    ID: {paymentIntent}
                                </p>
                            )}
                        </motion.div>

                        {/* Próximos Passos */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4 mb-8"
                        >
                            <h3 className="font-bold text-lg mb-4">📋 Próximos Passos:</h3>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Verifique seu email</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Enviamos um recibo e detalhes da sua assinatura
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <Download className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Acompanhe pelo Dashboard</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        O acesso aos recursos premium será liberado após a confirmação do pagamento.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Botões de Ação */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-4"
                        >
                            <Link
                                to="/dashboard"
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-black font-bold text-lg rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/50 transition-all"
                            >
                                Ir para Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                {activationStatus === 'active' ? 'Redirecionando...' : 'Aguardando confirmação segura do pagamento...'}
                            </p>
                        </motion.div>

                        {/* Suporte */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Precisa de ajuda?{' '}
                                <Link to="/suporte" className="text-primary-500 hover:text-primary-600 font-semibold">
                                    Entre em contato
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default CheckoutSuccessPage;
