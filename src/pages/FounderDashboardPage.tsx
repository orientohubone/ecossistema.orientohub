import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Crown, TrendingUp, DollarSign, FileText, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/founder/DashboardHeader';
import { KPICards } from '../components/founder/metrics/KPICards';
import { useFounderData } from '../hooks/useFounderData';
import { Company } from '../types/founder';

const FounderDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { analytics, companies, revenueChart, isLoading, error, refetch } = useFounderData();

    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: Crown },
        { id: 'revenue', label: 'Receita', icon: DollarSign },
        { id: 'engagement', label: 'Engajamento', icon: TrendingUp },
        { id: 'reports', label: 'Relatórios', icon: FileText },
        { id: 'versions', label: 'Versões', icon: GitBranch },
    ];

    const handleExport = (data: Company[], filename: string) => {
        // Implementar export para CSV
        const csvContent = [
            ['Nome', 'Plano', 'MRR', 'Status', 'Health Score', 'Criado em'].join(','),
            ...data.map(company => [
                company.name,
                company.plan,
                company.mrr,
                company.status,
                company.health_score,
                company.created_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="text-center">
                    <Crown className="h-12 w-12 text-primary-500 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-400">Carregando Dashboard Founder...</p>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="text-center">
                    <p className="text-red-400">{error || 'Erro ao carregar dados'}</p>
                    <button
                        onClick={refetch}
                        className="mt-4 px-4 py-2 bg-primary-500 text-black rounded-lg hover:bg-primary-600"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Dashboard Founder - OrientoHub</title>
                <meta name="description" content="Painel exclusivo do fundador para controle operacional completo" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="container-custom py-8 space-y-8">
                    {/* Header */}
                    <DashboardHeader
                        onRefetch={refetch}
                        onExport={handleExport}
                        companies={companies}
                    />

                    {/* KPI Cards */}
                    <KPICards analytics={analytics} />

                    {/* Tabs */}
                    <div className="space-y-6">
                        {/* Tab Navigation */}
                        <div className="flex gap-2 border-b border-gray-800 overflow-x-auto pb-px">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all whitespace-nowrap relative ${activeTab === tab.id
                                            ? 'text-primary-500'
                                            : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[400px]"
                        >
                            {activeTab === 'overview' && (
                                <div className="grid gap-6">
                                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-4">Visão Geral</h3>
                                        <p className="text-gray-400">
                                            Dashboard completo com métricas de negócio, receita e engajamento.
                                        </p>
                                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                                            <div className="p-4 bg-gray-800/50 rounded-lg">
                                                <p className="text-sm text-gray-400">Total de Empresas</p>
                                                <p className="text-2xl font-bold text-white">{companies.length}</p>
                                            </div>
                                            <div className="p-4 bg-gray-800/50 rounded-lg">
                                                <p className="text-sm text-gray-400">Receita Mensal</p>
                                                <p className="text-2xl font-bold text-primary-500">
                                                    R$ {analytics.revenue.total_mrr.toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'revenue' && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Análise de Receita</h3>
                                    <p className="text-gray-400">Gráficos e métricas detalhadas de receita (em desenvolvimento)</p>
                                </div>
                            )}

                            {activeTab === 'engagement' && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Métricas de Engajamento</h3>
                                    <div className="grid gap-4 md:grid-cols-3 mt-6">
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <p className="text-sm text-gray-400">DAU</p>
                                            <p className="text-2xl font-bold text-white">{analytics.engagement.daily_active_users}</p>
                                        </div>
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <p className="text-sm text-gray-400">WAU</p>
                                            <p className="text-2xl font-bold text-white">{analytics.engagement.weekly_active_users}</p>
                                        </div>
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <p className="text-sm text-gray-400">MAU</p>
                                            <p className="text-2xl font-bold text-white">{analytics.engagement.monthly_active_users}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reports' && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Relatórios</h3>
                                    <p className="text-gray-400">Relatórios detalhados e análises (em desenvolvimento)</p>
                                </div>
                            )}

                            {activeTab === 'versions' && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Controle de Versões</h3>
                                    <p className="text-gray-400">Histórico de versões e atualizações (em desenvolvimento)</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FounderDashboardPage;
