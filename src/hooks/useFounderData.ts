import { useState, useEffect } from 'react';
import { founderService } from '../services/founderService';
import { FounderAnalytics, Company, RevenueChartData } from '../types/founder';
import { getCachedValue, getOrLoadCachedValue } from '../lib/memoryCache';

export const useFounderData = () => {
    const cachedFounderData = getCachedValue<{
        analytics: FounderAnalytics;
        companies: Company[];
        revenueChart: RevenueChartData[];
    }>('founder:data');

    const [analytics, setAnalytics] = useState<FounderAnalytics | null>(cachedFounderData?.analytics || null);
    const [companies, setCompanies] = useState<Company[]>(cachedFounderData?.companies || []);
    const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>(cachedFounderData?.revenueChart || []);
    const [isLoading, setIsLoading] = useState(!cachedFounderData);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!cachedFounderData) {
            setIsLoading(true);
        }
        setError(null);
        try {
            const founderData = await getOrLoadCachedValue(
                'founder:data',
                60000,
                async () => {
                    const [analyticsData, companiesData, revenueData] = await Promise.all([
                        founderService.getAnalytics(),
                        founderService.getCompanies(),
                        founderService.getRevenueChart(),
                    ]);

                    return {
                        analytics: analyticsData,
                        companies: companiesData,
                        revenueChart: revenueData,
                    };
                }
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        analytics,
        companies,
        revenueChart,
        isLoading,
        error,
        refetch: fetchData,
    };
};
