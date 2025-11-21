
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, RefreshCw, Download } from 'lucide-react';
import { Company } from '@/types/founder';

interface FounderDashboardHeaderProps {
  onRefetch: () => void;
  onExport: (data: Company[], filename: string) => void;
  companies: Company[];
}

export const FounderDashboardHeader: React.FC<FounderDashboardHeaderProps> = ({
  onRefetch,
  onExport,
  companies
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          Dashboard Founder
        </h1>
        <p className="text-muted-foreground">
          Visão 360° do seu negócio e crescimento
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
        <Button onClick={() => onExport(companies, 'companies-report')}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
