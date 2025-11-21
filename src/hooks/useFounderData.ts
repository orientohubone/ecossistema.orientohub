import { useState, useEffect } from 'react';
import { founderService } from '../services/founderService';
import { FounderAnalytics, Company, RevenueChartData } from '../types/founder';

export const useFounderData = () => {
    const [analytics, setAnalytics] = useState<FounderAnalytics | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [analyticsData, companiesData, revenueData] = await Promise.all([
                founderService.getAnalytics(),
                founderService.getCompanies(),
                founderService.getRevenueChart(),
            ]);

            setAnalytics(analyticsData);
            setCompanies(companiesData);
            setRevenueChart(revenueData);
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
