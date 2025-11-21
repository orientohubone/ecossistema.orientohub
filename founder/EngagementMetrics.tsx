
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, Zap, Target } from 'lucide-react';
import { MetricTooltip } from './MetricTooltip';

interface EngagementAnalytics {
  dau: number;
  mau: number;
  avg_session_duration: number;
  feature_adoption_rate: number;
}

interface EngagementMetricsProps {
  analytics: EngagementAnalytics;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ analytics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Engajamento</CardTitle>
        <CardDescription>
          Atividade e engajamento dos usuários
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <MetricTooltip metric="dau">
                  <span className="text-sm font-medium">DAU</span>
                </MetricTooltip>
              </div>
              <div className="text-2xl font-bold">{analytics.dau}</div>
              <div className="text-xs text-muted-foreground">usuários/dia</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <MetricTooltip metric="mau">
                  <span className="text-sm font-medium">MAU</span>
                </MetricTooltip>
              </div>
              <div className="text-2xl font-bold">{analytics.mau}</div>
              <div className="text-xs text-muted-foreground">usuários/mês</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-orange-500 mr-2" />
                  <MetricTooltip metric="session_duration">
                    <span className="text-sm font-medium">Duração Média da Sessão</span>
                  </MetricTooltip>
                </div>
                <span className="text-sm font-bold">{analytics.avg_session_duration}min</span>
              </div>
              <Progress value={(analytics.avg_session_duration / 60) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-sm font-medium">Taxa de Adoção</span>
                </div>
                <span className="text-sm font-bold">{analytics.feature_adoption_rate}%</span>
              </div>
              <Progress value={analytics.feature_adoption_rate} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                  <MetricTooltip metric="sticky_factor">
                    <span className="text-sm font-medium">Sticky Factor (DAU/MAU)</span>
                  </MetricTooltip>
                </div>
                <span className="text-sm font-bold">
                  {Math.round((analytics.dau / analytics.mau) * 100)}%
                </span>
              </div>
              <Progress value={(analytics.dau / analytics.mau) * 100} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
