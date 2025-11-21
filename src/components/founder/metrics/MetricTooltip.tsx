import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { HelpCircle } from 'lucide-react';
import { MetricType } from '../../../types/founder';

interface MetricTooltipProps {
    metric: MetricType;
    children: React.ReactNode;
}

export const MetricTooltip = ({ metric, children }: MetricTooltipProps) => {
    const getTooltipContent = (metric: MetricType) => {
        const tooltips: Record<MetricType, { title: string; definition: string; calculation: string; importance: string; benchmark?: string }> = {
            'mrr': {
                title: 'MRR - Monthly Recurring Revenue',
                definition: 'Receita recorrente mensal é o valor previsível de receita que uma empresa pode esperar receber mensalmente.',
                calculation: 'Soma de todas as assinaturas ativas × valor mensal',
                importance: 'Principal métrica para empresas SaaS. Indica crescimento sustentável e previsibilidade de receita.',
                benchmark: 'Crescimento de 10-20% ao mês é considerado excelente para startups'
            },
            'arr': {
                title: 'ARR - Annual Recurring Revenue',
                definition: 'Receita recorrente anual é a projeção da receita que será gerada ao longo de um ano.',
                calculation: 'MRR × 12 meses',
                importance: 'Métrica fundamental para avaliação da empresa e planejamento de longo prazo.',
                benchmark: 'Empresas com ARR > R$ 1M são consideradas mais maduras'
            },
            'dau': {
                title: 'DAU - Daily Active Users',
                definition: 'Número de usuários únicos que interagem com o produto diariamente.',
                calculation: 'Contagem de usuários únicos com pelo menos uma ação no produto por dia',
                importance: 'Indica o nível de engajamento e valor percebido pelos usuários.',
                benchmark: 'Varia por setor, mas crescimento consistente é essencial'
            },
            'wau': {
                title: 'WAU - Weekly Active Users',
                definition: 'Número de usuários únicos que interagem com o produto semanalmente.',
                calculation: 'Contagem de usuários únicos com pelo menos uma ação no produto por semana',
                importance: 'Mostra o alcance e retenção do produto em períodos semanais.',
                benchmark: 'Relação DAU/WAU de 50%+ indica boa retenção'
            },
            'mau': {
                title: 'MAU - Monthly Active Users',
                definition: 'Número de usuários únicos que interagem com o produto mensalmente.',
                calculation: 'Contagem de usuários únicos com pelo menos uma ação no produto por mês',
                importance: 'Mostra o alcance e retenção do produto em períodos mais longos.',
                benchmark: 'Relação DAU/MAU de 20%+ indica boa retenção'
            },
            'ltv': {
                title: 'LTV - Lifetime Value',
                definition: 'Valor total que um cliente gera ao longo de todo seu relacionamento com a empresa.',
                calculation: 'Receita média por cliente ÷ Taxa de churn',
                importance: 'Essencial para definir quanto investir na aquisição de clientes.',
                benchmark: 'LTV deve ser pelo menos 3x maior que CAC'
            },
            'health_score': {
                title: 'Health Score',
                definition: 'Pontuação que indica a saúde geral da base de clientes.',
                calculation: 'Combinação de engajamento, adoção, satisfação e atividade',
                importance: 'Previne churn e identifica oportunidades de upsell.',
                benchmark: 'Score > 70% indica clientes saudáveis'
            },
            'churn_rate': {
                title: 'Taxa de Churn',
                definition: 'Percentual de clientes que cancelam o serviço em um período.',
                calculation: '(Clientes perdidos ÷ Total de clientes no início) × 100',
                importance: 'Métrica crucial para sustentabilidade do negócio.',
                benchmark: 'Taxa < 5% ao mês é considerada boa para SaaS'
            }
        };

        return tooltips[metric];
    };

    const content = getTooltipContent(metric);

    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                        {children}
                        <HelpCircle className="h-3 w-3 text-gray-400 hover:text-primary-500 transition-colors" />
                    </div>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side="top"
                        className="max-w-sm p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
                        sideOffset={5}
                    >
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-primary-500">{content.title}</h4>
                            <p className="text-xs text-gray-300">{content.definition}</p>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400"><strong className="text-white">Cálculo:</strong> {content.calculation}</p>
                                <p className="text-xs text-gray-400"><strong className="text-white">Importância:</strong> {content.importance}</p>
                                {content.benchmark && (
                                    <p className="text-xs text-green-400"><strong className="text-white">Benchmark:</strong> {content.benchmark}</p>
                                )}
                            </div>
                        </div>
                        <TooltipPrimitive.Arrow className="fill-gray-700" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};
