import { Crown, RefreshCw, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Company } from '../../types/founder';

interface DashboardHeaderProps {
    onRefetch: () => void;
    onExport: (data: Company[], filename: string) => void;
    companies: Company[];
}

export const DashboardHeader = ({
    onRefetch,
    onExport,
    companies
}: DashboardHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
                    <Crown className="h-8 w-8 text-primary-500" />
                    Dashboard Founder
                </h1>
                <p className="text-gray-400 mt-1">
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
