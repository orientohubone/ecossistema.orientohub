import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  BookOpen,
  Search,
  TrendingUp,
  Users,
  Target,
  Zap,
  Rocket,
  DollarSign,
  BarChart2,
  Lightbulb,
  Award,
  Clock,
  X
} from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: BookOpen },
    { id: 'funding', name: 'Investimento', icon: DollarSign },
    { id: 'metrics', name: 'Métricas', icon: BarChart2 },
    { id: 'strategy', name: 'Estratégia', icon: Target },
    { id: 'growth', name: 'Crescimento', icon: TrendingUp }
  ];

  const glossaryTerms = [
    {
      term: 'MVP',
      fullName: 'Minimum Viable Product',
      category: 'strategy',
      definition: 'Versão mais simples de um produto que pode ser lançada com recursos mínimos suficientes para validar uma hipótese de negócio e coletar feedback dos primeiros usuários.',
      icon: Rocket
    },
    {
      term: 'Burn Rate',
      fullName: 'Taxa de Queima',
      category: 'funding',
      definition: 'Velocidade com que uma startup gasta seu capital disponível, geralmente medida mensalmente. Indica quanto tempo a empresa pode operar antes de precisar de mais investimento.',
      icon: Clock
    },
    {
      term: 'PMF',
      fullName: 'Product-Market Fit',
      category: 'strategy',
      definition: 'Momento em que um produto atende com sucesso uma forte demanda de mercado. É quando o produto resolve um problema real de forma tão eficaz que os clientes o promovem naturalmente.',
      icon: Target
    },
    {
      term: 'CAC',
      fullName: 'Customer Acquisition Cost',
      category: 'metrics',
      definition: 'Custo total para adquirir um novo cliente, incluindo todos os investimentos em marketing e vendas divididos pelo número de clientes conquistados.',
      icon: DollarSign
    },
    {
      term: 'LTV',
      fullName: 'Lifetime Value',
      category: 'metrics',
      definition: 'Valor total que um cliente gera para a empresa durante todo o período de relacionamento. Métrica fundamental para avaliar a sustentabilidade do negócio.',
      icon: TrendingUp
    },
    {
      term: 'Runway',
      fullName: 'Pista de Decolagem',
      category: 'funding',
      definition: 'Tempo que uma startup consegue operar com o capital disponível antes de precisar de mais investimento ou se tornar lucrativa.',
      icon: Rocket
    },
    {
      term: 'Churn Rate',
      fullName: 'Taxa de Cancelamento',
      category: 'metrics',
      definition: 'Percentual de clientes que cancelam o serviço em um determinado período. Indicador crucial da satisfação e retenção de clientes.',
      icon: Users
    },
    {
      term: 'Valuation',
      fullName: 'Avaliação',
      category: 'funding',
      definition: 'Valor estimado de uma empresa, geralmente calculado em rodadas de investimento. Pode ser pré-money (antes do investimento) ou pós-money (depois do investimento).',
      icon: Award
    },
    {
      term: 'Pivot',
      fullName: 'Mudança de Direção',
      category: 'strategy',
      definition: 'Mudança estratégica significativa no modelo de negócio ou produto, baseada em aprendizados e feedback do mercado.',
      icon: Zap
    },
    {
      term: 'Traction',
      fullName: 'Tração',
      category: 'growth',
      definition: 'Evidência mensurável de demanda do mercado, demonstrada através de crescimento de usuários, receita ou outros indicadores-chave.',
      icon: TrendingUp
    },
    {
      term: 'Seed Round',
      fullName: 'Rodada Semente',
      category: 'funding',
      definition: 'Primeira rodada formal de investimento, geralmente usada para desenvolver o MVP e validar o modelo de negócio.',
      icon: DollarSign
    },
    {
      term: 'Scalability',
      fullName: 'Escalabilidade',
      category: 'growth',
      definition: 'Capacidade de uma startup crescer exponencialmente sem aumentar custos proporcionalmente. Característica essencial de modelos de negócio digitais.',
      icon: BarChart2
    },
    {
      term: 'Unit Economics',
      fullName: 'Economia Unitária',
      category: 'metrics',
      definition: 'Análise da rentabilidade por unidade (cliente, transação, produto), considerando receita e custos associados a cada unidade.',
      icon: BarChart2
    },
    {
      term: 'Growth Hacking',
      fullName: 'Hacking de Crescimento',
      category: 'growth',
      definition: 'Conjunto de estratégias e técnicas focadas em crescimento rápido e sustentável, usando criatividade, análise de dados e automação.',
      icon: Lightbulb
    },
    {
      term: 'Due Diligence',
      fullName: 'Diligência Prévia',
      category: 'funding',
      definition: 'Processo de investigação detalhada que investidores realizam antes de investir, analisando aspectos financeiros, legais, técnicos e de mercado.',
      icon: Search
    },
    {
      term: 'ICP',
      fullName: 'Ideal Customer Profile',
      category: 'strategy',
      definition: 'Descrição do cliente ideal para o negócio: o perfil que mais sente o problema, obtém valor da solução e tem maior potencial de compra e retenção.',
      icon: Users
    },
    {
      term: 'Problem-Solution Fit',
      fullName: 'Aderência problema-solução',
      category: 'strategy',
      definition: 'Estágio em que a solução proposta responde de forma clara e relevante a um problema real, antes de escalar aquisição ou operação.',
      icon: Target
    },
    {
      term: 'TAM, SAM e SOM',
      fullName: 'Mercado total, atendível e conquistável',
      category: 'strategy',
      definition: 'Forma de dimensionar o mercado: TAM representa todo o potencial, SAM o recorte que a solução pode atender e SOM a parcela realisticamente conquistável no início.',
      icon: BarChart2
    },
    {
      term: 'MRR',
      fullName: 'Monthly Recurring Revenue',
      category: 'metrics',
      definition: 'Receita recorrente mensal gerada pelas assinaturas ativas. Ajuda a acompanhar previsibilidade, crescimento e qualidade da receita de um negócio recorrente.',
      icon: DollarSign
    },
    {
      term: 'Retention',
      fullName: 'Taxa de Retenção',
      category: 'metrics',
      definition: 'Percentual de usuários ou clientes que continuam ativos após um período. Uma retenção saudável mostra que o produto entrega valor de forma contínua.',
      icon: Users
    },
    {
      term: 'Conversion Rate',
      fullName: 'Taxa de Conversão',
      category: 'metrics',
      definition: 'Proporção de pessoas que realizam uma ação desejada, como se cadastrar, solicitar uma demonstração ou comprar, em relação ao total de visitantes ou oportunidades.',
      icon: TrendingUp
    },
    {
      term: 'A/B Test',
      fullName: 'Teste A/B',
      category: 'growth',
      definition: 'Experimento que compara duas versões de uma página, mensagem ou funcionalidade para descobrir qual gera melhor resultado com base em comportamento real.',
      icon: Zap
    },
    {
      term: 'Value Proposition',
      fullName: 'Proposta de Valor',
      category: 'strategy',
      definition: 'Declaração clara do valor que a solução entrega, para quem entrega e por que é melhor ou diferente das alternativas disponíveis.',
      icon: Lightbulb
    }
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <Helmet><title>Glossário | OrientoHub</title><meta name="description" content="Conceitos de estratégia, métricas, crescimento e investimento explicados com clareza." /></Helmet>
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="pointer-events-none fixed inset-0 -z-50 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <main>
        <section className="border-b border-white/10">
          <div className="container-custom grid min-h-[620px] items-center gap-12 py-24 lg:grid-cols-[1fr_0.55fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Badge variant="liquid-glass" className="gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2"><BookOpen className="h-3.5 w-3.5 text-[#FFF200]" /><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-xs">Biblioteca de conceitos</span></Badge>
              <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl">Entenda os termos. <span className="text-[#FFF200]">Decida com clareza.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">Conceitos de estratégia, métricas, crescimento e investimento explicados sem complicação.</p>
            </motion.div>
            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d]/90 p-7">
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200] to-transparent" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Nesta biblioteca</p><p className="mt-5 text-5xl font-black">{glossaryTerms.length}</p><p className="mt-1 text-sm text-white/40">conceitos disponíveis</p>
              <div className="mt-7 grid grid-cols-2 gap-2">{categories.slice(1).map(category => <span key={category.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/55">{category.name}</span>)}</div>
            </motion.aside>
          </div>
        </section>

        <SectionDivider topSpacing="tight" />

        <section className="container-custom py-12 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-[#0d131d]/90 p-4 sm:p-6">
            <div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FFF200]" /><input type="search" placeholder="Busque por termo, significado ou contexto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 py-4 pl-12 pr-12 text-base text-white outline-none transition placeholder:text-white/25 focus:border-[#FFF200]/60 focus:ring-2 focus:ring-[#FFF200]/10" />{searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="Limpar busca" className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/35 transition hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>}</div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{categories.map(category => { const Icon = category.icon; const active = selectedCategory === category.id; return <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${active ? 'border-[#FFF200] bg-[#FFF200] text-black' : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-[#FFF200]/35 hover:text-white'}`}><Icon className="h-4 w-4" />{category.name}</button>; })}</div>
          </motion.div>

          <div className="mb-7 mt-12 flex items-end justify-between gap-4 border-b border-white/10 pb-5"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Resultados</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{selectedCategory === 'all' ? 'Todos os conceitos' : categories.find(category => category.id === selectedCategory)?.name}</h2></div><span className="text-sm font-bold text-white/35">{filteredTerms.length} {filteredTerms.length === 1 ? 'termo' : 'termos'}</span></div>

          <motion.div layout className="grid gap-4 lg:grid-cols-2">{filteredTerms.map((term, index) => <GlossaryCard key={term.term} {...term} delay={index * 0.025} />)}</motion.div>
          {!filteredTerms.length && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-dashed border-white/15 py-20 text-center"><Search className="mx-auto h-10 w-10 text-white/20" /><p className="mt-4 text-lg font-bold">Nenhum conceito encontrado</p><p className="mt-2 text-sm text-white/40">Tente outro termo ou selecione uma categoria diferente.</p></motion.div>}
        </section>

        <SectionDivider />

        <section className="container-custom py-16 sm:py-28"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-8 rounded-3xl border border-[#FFF200]/30 bg-[#0d131d] p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Do conceito à prática</p><h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Conhecimento ganha valor quando orienta o <span className="text-[#FFF200]">próximo passo.</span></h2><p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/50">Use a plataforma para organizar ideias, aplicar frameworks e transformar entendimento em execução.</p></div><Link to="/plataforma" className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#FFF200] px-7 py-4 font-black text-black transition hover:bg-[#fff76a]">Conhecer a plataforma <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></Link></motion.div></section>
      </main>
    </div>
  );
};

interface GlossaryCardProps {
  term: string;
  fullName: string;
  category: string;
  definition: string;
  icon: React.ElementType;
  delay: number;
}

const GlossaryCard = ({ term, fullName, category, definition, icon: Icon, delay }: GlossaryCardProps) => {
  const categoryNames: Record<string, string> = {
    funding: 'Investimento',
    metrics: 'Métricas',
    strategy: 'Estratégia',
    growth: 'Crescimento',
  };

  return (
    <motion.div
      layout
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFF200]/45 hover:bg-[#111925] sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent opacity-25 transition group-hover:opacity-100" />
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10 text-[#FFF200] transition-all duration-300 group-hover:bg-[#FFF200] group-hover:text-black">
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black text-white transition-colors group-hover:text-[#FFF200]">
              {term}
            </h3>
            <span className="rounded-full border border-[#FFF200]/20 bg-[#FFF200]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#FFF200]">
              {categoryNames[category] || category}
            </span>
            <span className="w-full text-xs text-white/30 sm:w-auto">
              {fullName}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/50 sm:text-[15px]">
            {definition}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GlossaryPage;
