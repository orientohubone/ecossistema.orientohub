
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RevenueChart } from './RevenueChart';
import { EngagementMetrics } from './EngagementMetrics';
import { MetricTooltip } from './MetricTooltip';
import { FounderAnalytics, RevenueChartData } from '@/types/founder';

interface FounderOverviewTabProps {
  analytics: FounderAnalytics;
  revenueChart: RevenueChartData[];
}

export const FounderOverviewTab: React.FC<FounderOverviewTabProps> = ({
  analytics,
  revenueChart
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <RevenueChart data={revenueChart} />
      </div>
      <div className="space-y-6">
        <EngagementMetrics analytics={analytics.engagement} />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <MetricTooltip metric="churn_rate">
                <span>Alerta de Churn</span>
              </MetricTooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Clientes em Risco</span>
                <Badge variant="destructive">
                  {analytics.health.at_risk_customers}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Críticos</span>
                <Badge variant="destructive">
                  {analytics.health.critical_customers}
                </Badge>
              </div>
              <Progress 
                value={(analytics.health.healthy_customers / (analytics.health.healthy_customers + analytics.health.at_risk_customers + analytics.health.critical_customers)) * 100} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
