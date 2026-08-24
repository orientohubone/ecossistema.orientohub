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
                <h1 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 sm:h-10 sm:w-10"><Crown className="h-5 w-5 text-primary-300 sm:h-6 sm:w-6" /></span>
                    Dashboard Founder
                </h1>
                <p className="mt-2 text-[#9ba9bc]">
                    Visão 360° do seu negócio e crescimento
                </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
                <Button variant="outline" onClick={onRefetch} className="w-full border-[#34455a] bg-[#151f2b] text-[#d7e0ea] hover:bg-[#0c121b] hover:text-white sm:w-auto">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                </Button>
                <Button onClick={() => onExport(companies, 'companies-report')} className="w-full bg-primary-500 text-[#0c121b] hover:bg-primary-400 sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                </Button>
            </div>
        </div>
    );
};
