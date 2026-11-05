import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { MetricTooltip } from '../metrics/MetricTooltip';
import {
    TrendingUp,
    DollarSign,
    Users,
    Activity,
    BarChart3
} from 'lucide-react';
import { FounderAnalytics } from '../../../types/founder';

interface KPICardsProps {
    analytics: FounderAnalytics;
}

export const KPICards = ({ analytics }: KPICardsProps) => {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-emerald-400/20 bg-emerald-400/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6">
                    <CardTitle className="text-sm font-medium">
                        <MetricTooltip metric="mrr">
                            <span>MRR Total</span>
                        </MetricTooltip>
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-300" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <div className="text-xl font-bold text-white sm:text-2xl">
                        R$ {analytics.revenue.total_mrr.toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        +{analytics.revenue.mrr_growth.toFixed(1)}% este mês
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary-400/20 bg-primary-500/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6">
                    <CardTitle className="text-sm font-medium">
                        <MetricTooltip metric="arr">
                            <span>ARR Total</span>
                        </MetricTooltip>
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-primary-300" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <div className="text-xl font-bold text-white sm:text-2xl">
                        R$ {analytics.revenue.total_arr.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        <MetricTooltip metric="ltv">
                            <span>LTV médio: R$ {analytics.revenue.ltv.toFixed(0)}</span>
                        </MetricTooltip>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-violet-400/20 bg-violet-400/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6">
                    <CardTitle className="text-sm font-medium">Assinaturas ativas</CardTitle>
                    <Users className="h-4 w-4 text-violet-300" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <div className="text-xl font-bold text-white sm:text-2xl">
                        {analytics.customers.active_customers}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {analytics.customers.new_customers_this_month} cadastros neste mês
                    </div>
                </CardContent>
            </Card>

            <Card className="border-amber-400/20 bg-amber-400/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6">
                    <CardTitle className="text-sm font-medium">
                        <span>Usuários ativos em 7 dias</span>
                    </CardTitle>
                    <Activity className="h-4 w-4 text-amber-300" />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <div className="text-xl font-bold text-white sm:text-2xl">
                        {analytics.engagement.weekly_active_users}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Presença ou login registrado
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
