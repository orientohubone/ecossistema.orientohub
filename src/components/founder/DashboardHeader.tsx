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
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#273548] bg-[#101722] p-5 md:flex-row md:items-center md:p-6">
            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Painel privado</p>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15"><Crown className="h-6 w-6 text-primary-300" /></span>
                    Dashboard Founder
                </h1>
                <p className="mt-2 text-[#9ba9bc]">
                    Visão 360° do seu negócio e crescimento
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onRefetch} className="border-[#34455a] bg-[#151f2b] text-[#d7e0ea] hover:bg-[#0c121b] hover:text-white">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                </Button>
                <Button onClick={() => onExport(companies, 'companies-report')} className="bg-primary-500 text-[#0c121b] hover:bg-primary-400">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                </Button>
            </div>
        </div>
    );
};
