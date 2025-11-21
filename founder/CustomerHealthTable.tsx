
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomerHealthScore } from '@/types/founder';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CustomerHealthTableProps {
  healthScores: CustomerHealthScore[];
}

export const CustomerHealthTable: React.FC<CustomerHealthTableProps> = ({ healthScores }) => {
  const getHealthBadge = (score: number) => {
    if (score >= 70) {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Saudável</Badge>;
    } else if (score >= 40) {
      return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Em Risco</Badge>;
    } else {
      return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Crítico</Badge>;
    }
  };

  const getChurnRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    };
    
    return (
      <Badge className={colors[risk as keyof typeof colors]}>
        {risk === 'low' ? 'Baixo' : risk === 'medium' ? 'Médio' : 'Alto'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Score dos Clientes</CardTitle>
        <CardDescription>
          Monitoramento da saúde e risco de churn dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Engajamento</TableHead>
              <TableHead>Adoção</TableHead>
              <TableHead>Satisfação</TableHead>
              <TableHead>Risco de Churn</TableHead>
              <TableHead>Última Atividade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthScores.map((score) => (
              <TableRow key={score.id}>
                <TableCell className="font-medium">
                  {score.company?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{score.health_score}%</span>
                    {getHealthBadge(score.health_score)}
                  </div>
                </TableCell>
                <TableCell>{score.engagement_score}%</TableCell>
                <TableCell>{score.adoption_score}%</TableCell>
                <TableCell>{score.satisfaction_score}%</TableCell>
                <TableCell>{getChurnRiskBadge(score.churn_risk)}</TableCell>
                <TableCell>
                  {score.last_activity_at 
                    ? new Date(score.last_activity_at).toLocaleDateString('pt-BR')
                    : 'Nunca'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
