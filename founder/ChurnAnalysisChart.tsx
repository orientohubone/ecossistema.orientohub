
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChurnAnalysis } from '@/types/founder';
import { MetricTooltip } from './MetricTooltip';

interface ChurnAnalysisChartProps {
  data: ChurnAnalysis[];
}

export const ChurnAnalysisChart: React.FC<ChurnAnalysisChartProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Get the most recent churn analysis for pie chart
  const latestAnalysis = data[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MetricTooltip metric="churn_rate">
            <span>Análise de Churn</span>
          </MetricTooltip>
        </CardTitle>
        <CardDescription>
          Taxa de churn por período e principais motivos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Churn Rate by Period */}
          <div className="h-[200px]">
            <h4 className="text-sm font-medium mb-4">Taxa de Churn por Período</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Taxa de Churn']}
                />
                <Bar dataKey="rate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Churn Reasons */}
          {latestAnalysis && (
            <div className="h-[200px]">
              <h4 className="text-sm font-medium mb-4">Motivos de Churn (Último Mês)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={latestAnalysis.reasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {latestAnalysis.reasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
