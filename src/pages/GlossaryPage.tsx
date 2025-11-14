import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen,
  Search,
  TrendingUp,
  Users,
  Target,
  Zap,
  Rocket,
  DollarSign,
  BarChart,
  Lightbulb,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: BookOpen },
    { id: 'funding', name: 'Investimento', icon: DollarSign },
    { id: 'metrics', name: 'Metricas', icon: BarChart },
    { id: 'strategy', name: 'Estrategia', icon: Target },
    { id: 'growth', name: 'Crescimento', icon: TrendingUp }
  ];

  const glossaryTerms = [
    {
      term: 'MVP',
      fullName: 'Minimum Viable Product',
      category: 'strategy',
      definition: 'Versao mais simples de um produto que pode ser lancada com recursos minimos suficientes para validar uma hipotese de negocio e coletar feedback dos primeiros usuarios.',
      icon: Rocket
    },
    {
      term: 'Burn Rate',
      fullName: 'Taxa de Queima',
      category: 'funding',
      definition: 'Velocidade com que uma startup gasta seu capital disponivel, geralmente medida mensalmente. Indica quanto tempo a empresa pode operar antes de precisar de mais investimento.',
      icon: Clock
    },
    {
      term: 'PMF',
      fullName: 'Product-Market Fit',
      category: 'strategy',
      definition: 'Momento em que um produto atende com sucesso uma forte demanda de mercado. E quando o produto resolve um problema real de forma tao eficaz que os clientes o promovem naturalmente.',
      icon: Target
    },
    {
      term: 'CAC',
      fullName: 'Customer Acquisition Cost',
      category: 'metrics',
      definition: 'Custo total para adquirir um novo cliente, incluindo todos os investimentos em marketing e vendas divididos pelo numero de clientes conquistados.',
      icon: DollarSign
    },
    {
      term: 'LTV',
      fullName: 'Lifetime Value',
      category: 'metrics',
      definition: 'Valor total que um cliente gera para a empresa durante todo o periodo de relacionamento. Metrica fundamental para avaliar a sustentabilidade do negocio.',
      icon: TrendingUp
    },
    {
      term: 'Runway',
      fullName: 'Pista de Decolagem',
      category: 'funding',
      definition: 'Tempo que uma startup consegue operar com o capital disponivel antes de precisar de mais investimento ou se tornar lucrativa.',
      icon: Rocket
    },
    {
      term: 'Churn Rate',
      fullName: 'Taxa de Cancelamento',
      category: 'metrics',
      definition: 'Percentual de clientes que cancelam o servico em um determinado periodo. Indicador crucial da satisfacao e retencao de clientes.',
      icon: Users
    },
    {
      term: 'Valuation',
      fullName: 'Avaliacao',
      category: 'funding',
      definition: 'Valor estimado de uma empresa, geralmente calculado em rodadas de investimento. Pode ser pre-money (antes do investimento) ou pos-money (depois do investimento).',
      icon: Award
    },
    {
      term: 'Pivot',
      fullName: 'Mudanca de Direcao',
      category: 'strategy',
      definition: 'Mudanca estrategica significativa no modelo de negocio ou produto, baseada em aprendizados e feedback do mercado.',
      icon: Zap
    },
    {
      term: 'Traction',
      fullName: 'Tracao',
      category: 'growth',
      definition: 'Evidencia mensuravel de demanda do mercado, demonstrada atraves de crescimento de usuarios, receita ou outros indicadores-chave.',
      icon: TrendingUp
    },
    {
      term: 'Seed Round',
      fullName: 'Rodada Semente',
      category: 'funding',
      definition: 'Primeira rodada formal de investimento, geralmente usada para desenvolver o MVP e validar o modelo de negocio.',
      icon: DollarSign
    },
    {
      term: 'Scalability',
      fullName: 'Escalabilidade',
      category: 'growth',
      definition: 'Capacidade de uma startup crescer exponencialmente sem aumentar custos proporcionalmente. Caracteristica essencial de modelos de negocio digitais.',
      icon: BarChart
    },
    {
      term: 'Unit Economics',
      fullName: 'Economia Unitaria',
      category: 'metrics',
      definition: 'Analise da rentabilidade por unidade (cliente, transacao, produto), considerando receita e custos associados a cada unidade.',
      icon: BarChart
    },
    {
      term: 'Growth Hacking',
      fullName: 'Hacking de Crescimento',
      category: 'growth',
      definition: 'Conjunto de estrategias e tecnicas focadas em crescimento rapido e sustentavel, usando criatividade, analise de dados e automacao.',
      icon: Lightbulb
    },
    {
      term: 'Due Diligence',
      fullName: 'Diligencia Previa',
      category: 'funding',
      definition: 'Processo de investigacao detalhada que investidores realizam antes de investir, analisando aspectos financeiros, legais, tecnicos e de mercado.',
      icon: Search
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
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-1.5 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BookOpen className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide text-center">
                Glossario de Startups
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Domine a{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Linguagem
              </span>
              {' '}das Startups
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Termos essenciais, conceitos fundamentais e o vocabulario que todo empreendedor precisa conhecer.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="h-1 w-20 bg-primary-500 rounded-full" />
              <Sparkles className="w-6 h-6 text-primary-500" />
              <div className="h-1 w-20 bg-primary-500 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar termos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none text-lg transition-colors"
                />
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/30'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
              {filteredTerms.map((term, index) => (
                <GlossaryCard key={index} {...term} delay={index * 0.05} />
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Nenhum termo encontrado para "{searchTerm}"
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <Lightbulb className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Pronto para aplicar esse conhecimento
              <br />
              <span className="text-primary-500">
                na sua startup?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Transforme teoria em pratica com nossa plataforma gamificada de desenvolvimento de startups.
            </p>

            <div className="mt-16">
              <a
                href="/cadastro"
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-6 h-6" />
                Comecar Agora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
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

const GlossaryCard = ({ term, fullName, definition, icon: Icon, delay }: GlossaryCardProps) => {
  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-black to-gray-900 rounded-xl flex items-center justify-center border-2 border-primary-500/30 group-hover:border-primary-500 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-primary-500" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 mb-2">
            <h3 className="text-2xl md:text-3xl font-bold group-hover:text-primary-500 transition-colors">
              {term}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
              {fullName}
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {definition}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GlossaryPage;
