import { FounderAnalytics, Company, RevenueChartData } from '../types/founder';

class FounderService {
    async getAnalytics(): Promise<FounderAnalytics> {
        // Por enquanto, retornar dados mockados
        // TODO: Implementar função RPC no Supabase
        return {
            revenue: {
                total_mrr: 45000,
                total_arr: 540000,
                mrr_growth: 15.5,
                ltv: 5000
            },
            customers: {
                active_customers: 127,
                new_customers_this_month: 23,
                churned_customers: 5
            },
            health: {
                avg_health_score: 78,
                healthy_customers: 95,
                at_risk_customers: 24,
                critical_customers: 8
            },
            engagement: {
                daily_active_users: 450,
                weekly_active_users: 1200,
                monthly_active_users: 2800,
                avg_session_duration: 1245
            }
        };
    }

    async getCompanies(): Promise<Company[]> {
        // Por enquanto, retornar dados mockados
        // TODO: Implementar query real no Supabase
        return [
            {
                id: '1',
                name: 'TechStart Inc',
                plan: 'pro',
                mrr: 1500,
                status: 'active',
                health_score: 85,
                created_at: '2024-01-15',
                last_activity: '2025-11-20'
            },
            {
                id: '2',
                name: 'InnovateCo',
                plan: 'business',
                mrr: 3000,
                status: 'active',
                health_score: 92,
                created_at: '2024-02-20',
                last_activity: '2025-11-19'
            }
        ];
    }

    async getRevenueChart(): Promise<RevenueChartData[]> {
        // Dados mockados para o gráfico
        return [
            { month: 'Jan', mrr: 25000, arr: 300000, new_mrr: 5000, churned_mrr: 1000 },
            { month: 'Fev', mrr: 28000, arr: 336000, new_mrr: 4500, churned_mrr: 1500 },
            { month: 'Mar', mrr: 32000, arr: 384000, new_mrr: 5500, churned_mrr: 1500 },
            { month: 'Abr', mrr: 35000, arr: 420000, new_mrr: 4000, churned_mrr: 1000 },
            { month: 'Mai', mrr: 38000, arr: 456000, new_mrr: 4500, churned_mrr: 1500 },
            { month: 'Jun', mrr: 42000, arr: 504000, new_mrr: 5000, churned_mrr: 1000 },
            { month: 'Jul', mrr: 45000, arr: 540000, new_mrr: 4000, churned_mrr: 1000 }
        ];
    }
}

export const founderService = new FounderService();
