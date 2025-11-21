
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EngagementMetrics } from './EngagementMetrics';
import { FounderAnalytics } from '@/types/founder';

interface FounderEngagementTabProps {
  analytics: FounderAnalytics;
}

export const FounderEngagementTab: React.FC<FounderEngagementTabProps> = ({ analytics }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <EngagementMetrics analytics={analytics.engagement} />
      
      <Card>
        <CardHeader>
          <CardTitle>Adoção de Features</CardTitle>
          <CardDescription>
            Principais funcionalidades utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Dashboard</span>
              <span className="text-sm font-medium">95%</span>
            </div>
            <Progress value={95} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Relatórios</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <Progress value={78} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Analytics</span>
              <span className="text-sm font-medium">65%</span>
            </div>
            <Progress value={65} />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">API</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <Progress value={42} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
