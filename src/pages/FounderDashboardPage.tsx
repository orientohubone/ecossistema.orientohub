import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Crown, TrendingUp, Users, DollarSign, Activity, FileText, GitBranch, Download, Inbox, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/founder/DashboardHeader';
import { KPICards } from '../components/founder/metrics/KPICards';
import { useFounderData } from '../hooks/useFounderData';
import { Company } from '../types/founder';
import DashboardPageSkeleton from '../components/ui/DashboardPageSkeleton';
import { LeadsManagement } from '../components/founder/LeadsManagement';
import { FeatureFlagsPanel } from '../components/founder/FeatureFlagsPanel';
import { PricingCalculator } from '../components/founder/PricingCalculator';

const FounderDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { analytics, companies, revenueChart, isLoading, error, refetch } = useFounderData();

    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: Crown },
        { id: 'revenue', label: 'Receita', icon: DollarSign },
        { id: 'engagement', label: 'Engajamento', icon: TrendingUp },
        { id: 'reports', label: 'Relatórios', icon: FileText },
        { id: 'leads', label: 'Recebimentos', icon: Inbox },
        { id: 'versions', label: 'Versões', icon: GitBranch },
        { id: 'flags', label: 'Feature Flags', icon: Activity },
        { id: 'pricing', label: 'Precificação', icon: Calculator },
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
        return <DashboardPageSkeleton cards={5} columns={2} />;
    }

    if (error || !analytics) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400">{error || 'Erro ao carregar dados'}</p>
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

            <div className="dark min-h-screen bg-[#0c121b] text-white">
                <div className="container-custom space-y-6 py-6 md:py-8">
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
                        <div className="flex gap-2 overflow-x-auto rounded-xl border border-[#273548] bg-[#101722] p-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-primary-500 text-[#0c121b] shadow-lg shadow-primary-500/15'
                                            : 'text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
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
                                    <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6">
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-300">Pulso da operação</p>
                                        <h3 className="mb-2 text-xl font-bold text-white">Visão Geral</h3>
                                        <p className="text-[#9ba9bc]">
                                            Dashboard completo com métricas de negócio, receita e engajamento.
                                        </p>
                                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                                            <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-4">
                                                <p className="text-sm text-[#9ba9bc]">Total de Empresas</p>
                                                <p className="text-2xl font-bold text-white">{companies.length}</p>
                                            </div>
                                            <div className="rounded-xl border border-primary-400/20 bg-primary-500/10 p-4">
                                                <p className="text-sm text-primary-200">Receita Mensal</p>
                                                <p className="text-2xl font-bold text-primary-500">
                                                    R$ {analytics.revenue.total_mrr.toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'flags' && <FeatureFlagsPanel />}

                            {activeTab === 'pricing' && <PricingCalculator />}

                            {activeTab === 'revenue' && (
                                <div className="space-y-6">
                                    {/* Revenue Overview */}
                                    <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6">
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-300">Assinaturas</p>
                                        <h3 className="mb-6 text-xl font-bold text-white">Análise de Receita</h3>

                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                            {/* MRR */}
                                            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                                                <p className="mb-1 text-sm font-medium text-emerald-200">MRR Total</p>
                                                <p className="text-3xl font-bold text-white">
                                                    R$ {analytics.revenue.total_mrr.toLocaleString('pt-BR')}
                                                </p>
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                                    +{analytics.revenue.mrr_growth}% este mês
                                                </p>
                                            </div>

                                            {/* ARR */}
                                            <div className="rounded-xl border border-primary-400/20 bg-primary-500/10 p-4">
                                                <p className="mb-1 text-sm font-medium text-primary-200">ARR Total</p>
                                                <p className="text-3xl font-bold text-white">
                                                    R$ {analytics.revenue.total_arr.toLocaleString('pt-BR')}
                                                </p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                                    Receita anual recorrente
                                                </p>
                                            </div>

                                            {/* LTV */}
                                            <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 p-4">
                                                <p className="mb-1 text-sm font-medium text-violet-200">LTV Médio</p>
                                                <p className="text-3xl font-bold text-white">
                                                    R$ {analytics.revenue.ltv.toLocaleString('pt-BR')}
                                                </p>
                                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                                    Lifetime Value
                                                </p>
                                            </div>

                                            {/* Churn */}
                                            <div className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-4">
                                                <p className="mb-1 text-sm font-medium text-orange-200">Churn Rate</p>
                                                <p className="text-3xl font-bold text-white">
                                                    {((analytics.customers.churned_customers / analytics.customers.active_customers) * 100).toFixed(1)}%
                                                </p>
                                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                                    {analytics.customers.churned_customers} clientes este mês
                                                </p>
                                            </div>
                                        </div>

                                        {/* Revenue Breakdown */}
                                        <div className="mt-6 rounded-xl border border-[#273548] bg-[#151f2b] p-4">
                                            <h4 className="mb-3 text-sm font-semibold text-white">Distribuição de Receita por Plano</h4>
                                            <div className="space-y-2">
                                                {['Starter', 'Pro', 'Business', 'Enterprise'].map((plan, idx) => {
                                                    const percentage = [15, 35, 30, 20][idx];
                                                    return (
                                                        <div key={plan} className="flex items-center gap-3">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400 w-24">{plan}</span>
                                                            <div className="h-2 flex-1 rounded-full bg-[#0c121b]">
                                                                <div
                                                                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">{percentage}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'engagement' && (
                                <div className="rounded-2xl border border-[#273548] bg-[#101722] p-6">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-300">Adoção</p>
                                    <h3 className="mb-4 text-xl font-bold text-white">Métricas de Engajamento</h3>
                                    <div className="grid gap-4 md:grid-cols-3 mt-6">
                                        <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-4">
                                            <p className="text-sm text-[#9ba9bc]">DAU</p>
                                            <p className="text-2xl font-bold text-white">{analytics.engagement.daily_active_users}</p>
                                        </div>
                                        <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">WAU</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.engagement.weekly_active_users}</p>
                                        </div>
                                        <div className="rounded-xl border border-[#273548] bg-[#151f2b] p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">MAU</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.engagement.monthly_active_users}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reports' && (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Relatórios Disponíveis</h3>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {/* Relatório de Receita */}
                                            <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Mensal</span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                                                    Relatório de Receita
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    Análise completa de MRR, ARR e crescimento mensal
                                                </p>
                                                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                                                    Gerar Relatório →
                                                </button>
                                            </div>

                                            {/* Relatório de Clientes */}
                                            <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Semanal</span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                                                    Relatório de Clientes
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    Health score, churn e análise de segmentação
                                                </p>
                                                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                                                    Gerar Relatório →
                                                </button>
                                            </div>

                                            {/* Relatório de Engajamento */}
                                            <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Diário</span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                                                    Relatório de Engajamento
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    DAU, WAU, MAU e tempo médio de sessão
                                                </p>
                                                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                                                    Gerar Relatório →
                                                </button>
                                            </div>

                                            {/* Relatório Executivo */}
                                            <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                        <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded">Trimestral</span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                                                    Relatório Executivo
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    Visão consolidada de todas as métricas do negócio
                                                </p>
                                                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                                                    Gerar Relatório →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'leads' && (
                                <LeadsManagement />
                            )}

                            {activeTab === 'versions' && (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Histórico de Versões</h3>

                                        <div className="space-y-4">
                                            {/* Version 2.1.0 */}
                                            <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                        <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">v2.1.0 - Dashboard Founder</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">21 de Novembro, 2025</p>
                                                        </div>
                                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Atual</span>
                                                    </div>
                                                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <li>✨ Novo Dashboard Founder com métricas completas</li>
                                                        <li>📊 Sistema de tabs para análise de receita e engajamento</li>
                                                        <li>📈 KPI Cards com tooltips educativos</li>
                                                        <li>🎨 Suporte completo para modo claro e escuro</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Version 2.0.5 */}
                                            <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">v2.0.5 - Melhorias de Performance</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">15 de Novembro, 2025</p>
                                                        </div>
                                                    </div>
                                                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <li>⚡ Otimização de carregamento de páginas</li>
                                                        <li>🔧 Correções de bugs no sistema de autenticação</li>
                                                        <li>🎯 Melhorias na experiência do usuário</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Version 2.0.0 */}
                                            <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                        <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">v2.0.0 - Oriento Academy</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">1 de Novembro, 2025</p>
                                                        </div>
                                                    </div>
                                                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <li>🎓 Lançamento da Oriento Academy</li>
                                                        <li>📚 Sistema de cursos e trilhas de aprendizado</li>
                                                        <li>🏆 Gamificação com badges e conquistas</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Version 1.5.0 */}
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                        <GitBranch className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">v1.5.0 - Integração Asaas</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">15 de Outubro, 2025</p>
                                                        </div>
                                                    </div>
                                                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <li>💳 Integração completa com Asaas</li>
                                                        <li>📦 Sistema de planos e assinaturas</li>
                                                        <li>🔐 Checkout seguro e webhooks</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
