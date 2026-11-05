import { useState, useEffect, useCallback } from 'react';
import { founderService } from '../services/founderService';
import { FounderAnalytics, Company, RevenueChartData } from '../types/founder';
import { getCachedValue, getOrLoadCachedValue } from '../lib/memoryCache';
import { useAuthStore } from '../stores/authStore';

export const useFounderData = () => {
    const userId = useAuthStore(state => state.user?.id);
    const cacheKey = `founder:data:${userId || 'anonymous'}`;
    const cachedFounderData = getCachedValue<{
        analytics: FounderAnalytics;
        companies: Company[];
        revenueChart: RevenueChartData[];
    }>(cacheKey);

    const [analytics, setAnalytics] = useState<FounderAnalytics | null>(cachedFounderData?.analytics || null);
    const [companies, setCompanies] = useState<Company[]>(cachedFounderData?.companies || []);
    const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>(cachedFounderData?.revenueChart || []);
    const [isLoading, setIsLoading] = useState(!cachedFounderData);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!userId) { setIsLoading(false); return; }
        setError(null);
        try {
            const founderData = await getOrLoadCachedValue(
                cacheKey,
                60000,
                async () => {
                    const [analyticsResult, companiesResult] = await Promise.allSettled([
                        founderService.getAnalytics(),
                        founderService.getCompanies(),
                    ]);
                    if (analyticsResult.status === 'rejected') throw analyticsResult.reason;
                    const analyticsData = analyticsResult.value;
                    if (companiesResult.status === 'rejected') throw companiesResult.reason;
                    return {
                        analytics: analyticsData,
                        companies: companiesResult.value,
                        revenueChart: [{ month: 'Atual', mrr: analyticsData.revenue.total_mrr, arr: analyticsData.revenue.total_arr, new_mrr: 0, churned_mrr: 0 }],
                    };
                }, { forceRefresh }
            );

            setAnalytics(founderData.analytics);
            setCompanies(founderData.companies);
            setRevenueChart(founderData.revenueChart);
        } catch (err) {
            console.error('Error fetching founder data:', err);
            setError('Erro ao carregar dados do dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [cacheKey, userId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        analytics,
        companies,
        revenueChart,
        isLoading,
        error,
        refetch: () => fetchData(true),
    };
};
