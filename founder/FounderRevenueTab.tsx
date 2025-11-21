
import React from 'react';
import { RevenueChart } from './RevenueChart';
import { ChurnAnalysisChart } from './ChurnAnalysisChart';
import { CompanyOverview } from './CompanyOverview';
import { RevenueChartData, ChurnAnalysis, Company } from '@/types/founder';

interface FounderRevenueTabProps {
  revenueChart: RevenueChartData[];
  churnAnalysis: ChurnAnalysis[];
  companies: Company[];
}

export const FounderRevenueTab: React.FC<FounderRevenueTabProps> = ({
  revenueChart,
  churnAnalysis,
  companies
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueChart} />
        <ChurnAnalysisChart data={churnAnalysis} />
      </div>
      
      <CompanyOverview companies={companies} />
    </div>
  );
};
