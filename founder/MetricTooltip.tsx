
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface MetricTooltipProps {
  metric: string;
  children: React.ReactNode;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({ metric, children }) => {
  const getTooltipContent = (metric: string) => {
    const tooltips: Record<string, { title: string; definition: string; calculation: string; importance: string; benchmark?: string }> = {
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
      'cac': {
        title: 'CAC - Customer Acquisition Cost',
        definition: 'Custo total para adquirir um novo cliente.',
        calculation: 'Gastos com marketing e vendas ÷ Número de novos clientes',
        importance: 'Determina a eficiência dos investimentos em aquisição.',
        benchmark: 'CAC Payback ideal é de 12-18 meses'
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
      },
      'sticky_factor': {
        title: 'Sticky Factor',
        definition: 'Indica com que frequência os usuários mensais retornam diariamente.',
        calculation: 'DAU ÷ MAU × 100',
        importance: 'Mede o nível de dependência e engajamento com o produto.',
        benchmark: 'Fator > 20% indica produto muito envolvente'
      },
      'session_duration': {
        title: 'Duração da Sessão',
        definition: 'Tempo médio que usuários passam na plataforma por sessão.',
        calculation: 'Tempo total de uso ÷ Número de sessões',
        importance: 'Indica profundidade de engajamento e valor percebido.',
        benchmark: 'Varia por produto, mas tendência crescente é positiva'
      }
    };

    return tooltips[metric.toLowerCase()] || {
      title: metric.toUpperCase(),
      definition: 'Métrica de negócio importante para análise.',
      calculation: 'Varia conforme a implementação.',
      importance: 'Ajuda na tomada de decisões estratégicas.',
    };
  };

  const content = getTooltipContent(metric);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-4 bg-popover border shadow-lg">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary">{content.title}</h4>
            <p className="text-xs text-muted-foreground">{content.definition}</p>
            <div className="space-y-1">
              <p className="text-xs"><strong>Cálculo:</strong> {content.calculation}</p>
              <p className="text-xs"><strong>Importância:</strong> {content.importance}</p>
              {content.benchmark && (
                <p className="text-xs text-green-600"><strong>Benchmark:</strong> {content.benchmark}</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
