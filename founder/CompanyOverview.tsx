
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Company } from '@/types/founder';
import { Building2, Calendar, DollarSign } from 'lucide-react';

interface CompanyOverviewProps {
  companies: Company[];
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({ companies }) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      trial: 'bg-blue-500',
      churned: 'bg-red-500',
      inactive: 'bg-gray-500'
    };
    
    const labels = {
      active: 'Ativo',
      trial: 'Trial',
      churned: 'Churned',
      inactive: 'Inativo'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      starter: 'bg-gray-500',
      professional: 'bg-blue-500',
      enterprise: 'bg-purple-500'
    };
    
    return (
      <Badge variant="outline" className={colors[plan as keyof typeof colors]}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Visão Geral dos Clientes
        </CardTitle>
        <CardDescription>
          Todos os clientes e seus detalhes de assinatura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>ARR</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Trial Expira</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{company.name}</div>
                    {company.domain && (
                      <div className="text-sm text-muted-foreground">{company.domain}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getPlanBadge(company.plan_type)}</TableCell>
                <TableCell>{getStatusBadge(company.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {company.mrr.toLocaleString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {company.arr.toLocaleString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(company.subscription_started_at).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell>
                  {company.trial_ends_at ? (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(company.trial_ends_at).toLocaleDateString('pt-BR')}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
