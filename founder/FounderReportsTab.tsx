
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react';
import { Company, CustomerHealthScore, ChurnAnalysis } from '@/types/founder';

interface FounderReportsTabProps {
  companies: Company[];
  healthScores: CustomerHealthScore[];
  churnAnalysis: ChurnAnalysis[];
  exportToCSV: (data: any[], filename: string) => void;
}

export const FounderReportsTab: React.FC<FounderReportsTabProps> = ({
  companies,
  healthScores,
  churnAnalysis,
  exportToCSV
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Executivos</CardTitle>
          <CardDescription>
            Relatórios automatizados para tomada de decisão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => exportToCSV(companies, 'monthly-revenue-report')}
          >
            <Download className="h-4 w-4 mr-2" />
            Relatório Mensal de Receita
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => exportToCSV(healthScores, 'customer-health-report')}
          >
            <Download className="h-4 w-4 mr-2" />
            Análise de Health Score
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => exportToCSV(churnAnalysis, 'churn-analysis-report')}
          >
            <Download className="h-4 w-4 mr-2" />
            Análise de Churn
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Insights de IA</CardTitle>
          <CardDescription>
            Recomendações baseadas em dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-2">
                <Zap className="h-4 w-4 text-blue-500 mr-2" />
                <span className="font-medium">Oportunidade de Upsell</span>
              </div>
              <p className="text-sm text-blue-700">
                3 clientes do plano básico estão usando 90%+ dos recursos. 
                Potencial de upgrade.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="font-medium">Risco de Churn</span>
              </div>
              <p className="text-sm text-yellow-700">
                2 clientes com baixo engajamento nos últimos 7 dias. 
                Intervenção recomendada.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 text-green-500 mr-2" />
                <span className="font-medium">Meta de Crescimento</span>
              </div>
              <p className="text-sm text-green-700">
                Crescimento de 15% MRR está acima da meta mensal. 
                Parabéns pelo resultado!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
