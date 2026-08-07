import { FounderAnalytics, Company, RevenueChartData } from '../types/founder';
import { supabase } from '../config/supabase';

class FounderService {
    async getAnalytics(): Promise<FounderAnalytics> {
        const { data, error } = await supabase.rpc('get_founder_metrics');
        if (error || !data) throw error || new Error('Métricas indisponíveis.');
        return data as FounderAnalytics;
    }

    async getCompanies(): Promise<Company[]> {
        const { data, error } = await supabase.rpc('get_founder_companies');
        if (error) throw error;
        return (data || []) as Company[];
    }

    async getRevenueChart(): Promise<RevenueChartData[]> {
        const analytics = await this.getAnalytics();
        return [{
            month: 'Atual',
            mrr: analytics.revenue.total_mrr,
            arr: analytics.revenue.total_arr,
            new_mrr: 0,
            churned_mrr: 0,
        }];
    }
}

export const founderService = new FounderService();
