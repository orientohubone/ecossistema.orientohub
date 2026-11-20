import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Sparkles,
  Zap,
  ArrowRight,
  Calendar,
  Clock,
  Search,
  X,
  Lightbulb,
  Target,
  TrendingUp,
  Brain,
  Users,
  Shield,
  Workflow,
  Globe,
  Code,
  Palette,
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

interface Update {
  id: string;
  title: string;
  description: string;
  details: string[];
  date: string;
  version?: string;
  category: 'feature' | 'improvement' | 'fix' | 'milestone';
  tags: string[];
  icon: typeof Rocket;
}

type CategoryFilter = 'all' | 'feature' | 'improvement' | 'fix' | 'milestone';

const NovidadesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: CategoryFilter; label: string; icon: typeof Sparkles }[] = [
    { id: 'all', label: 'Todas', icon: Sparkles },
    { id: 'feature', label: 'Novidades', icon: Rocket },
    { id: 'milestone', label: 'Marcos', icon: Flame },
    { id: 'improvement', label: 'Melhorias', icon: Zap },
    { id: 'fix', label: 'Correções', icon: Shield },
  ];

  const updates: Update[] = [
    {
      id: '1',
      title: 'Inteligência Artificial no dossiê de ideias',
      description: 'Sugestões contextuais automáticas para cada seção do dossiê, baseadas no que você já preencheu.',
      details: [
        'Sugestões de hipóteses, análise de mercado, persona e modelo de negócio',
        'Insights estratégicos gerados a partir dos dados da ideia',
        'Aplicação de templates com um clique diretamente no dossiê',
      ],
      date: '2025-11-20',
      version: 'v2.4',
      category: 'feature',
      tags: ['IA', 'Ideias', 'Dossiê'],
      icon: Brain,
    },
    {
      id: '2',
      title: 'Jornada Empreendedora gamificada',
      description: 'Sistema de missões, XP, níveis e conquistas que orientam a evolução de cada iniciativa.',
      details: [
        'Missões sequenciadas por estágio (ideia → validação → projeto)',
        'XP e barra de progresso por iniciativa',
        'Conquistas desbloqueáveis ao completar marcos',
      ],
      date: '2025-11-10',
      version: 'v2.3',
      category: 'feature',
      tags: ['Gamificação', 'Jornada', 'Engajamento'],
      icon: Rocket,
    },
    {
      id: '3',
      title: 'Framework Game — aprendizagem interativa',
      description: 'Transforme frameworks de negócio em experiências interativas com perguntas, pontuação e feedback.',
      details: [
        'Jogos passo a passo baseados em frameworks proprietários',
        'Feedback contextual após cada resposta',
        'Ranking e resultados comparáveis entre jogadores',
      ],
      date: '2025-10-28',
      version: 'v2.2',
      category: 'feature',
      tags: ['Frameworks', 'Educação', 'Interativo'],
      icon: Target,
    },
    {
      id: '4',
      title: 'Referências visuais para ideias',
      description: 'Anexe até duas imagens de referência por ideia para documentar inspirações e benchmarks.',
      details: [
        'Upload direto de JPG, PNG e WebP',
        'Visualização ampliada com zoom',
        'Recuperação automática de anexos da pasta privada',
      ],
      date: '2025-10-15',
      version: 'v2.1',
      category: 'feature',
      tags: ['Ideias', 'Imagens', 'Multimídia'],
      icon: Palette,
    },
    {
      id: '5',
      title: 'Validação com hipóteses e curadoria',
      description: 'Transforme suposições em testes verificáveis e acompanhe a confiança do dossiê.',
      details: [
        'Formulário de hipóteses com status (aberta, em teste, validada, invalidada)',
        'Slider de confiança no dossiê',
        'Campo de decisão e próximo passo',
      ],
      date: '2025-09-30',
      version: 'v2.0',
      category: 'milestone',
      tags: ['Validação', 'Hipóteses', 'Metodologia'],
      icon: CheckCircle2,
    },
    {
      id: '6',
      title: 'Promoção de ideia para projeto',
      description: 'Ideias maduras podem ser promovidas a projetos diretamente do dossiê.',
      details: [
        'Validação automática de campos obrigatórios antes da promoção',
        'Preservação do histórico da ideia original',
        'Transição fluida para o kanban de projetos',
      ],
      date: '2025-09-15',
      version: 'v2.0',
      category: 'feature',
      tags: ['Ideias', 'Projetos', 'Workflow'],
      icon: Workflow,
    },
    {
      id: '7',
      title: 'Ecossistema orientohub',
      description: 'Unificação da plataforma, serviços, verticais e comunidade em uma experiência coesa.',
      details: [
        'Página de ecossistema com 4 camadas: Núcleo, Plataforma, MVPs e Verticais',
        'Navegação integrada entre produtos',
        'Identidade visual unificada',
      ],
      date: '2025-08-20',
      version: 'v1.0',
      category: 'milestone',
      tags: ['Plataforma', 'Ecossistema', 'Lançamento'],
      icon: Globe,
    },
    {
      id: '8',
      title: 'Performance e estabilidade',
      description: 'Otimizações de carregamento, cache de dados e estabilidade geral da plataforma.',
      details: [
        'Redução de 40% no tempo de carregamento das páginas',
        'Cache inteligente de dados do dashboard',
        'Correção de race conditions no kanban',
      ],
      date: '2025-11-05',
      category: 'improvement',
      tags: ['Performance', 'Infraestrutura'],
      icon: Zap,
    },
    {
      id: '9',
      title: 'Correção de upload de imagens',
      description: 'Resolvido problema que impedia upload de arquivos WebP em algumas situações.',
      details: [
        'Suporte completo a WebP, PNG e JPG',
        'Validação de tipo e tamanho no cliente',
        'Feedback visual durante o upload',
      ],
      date: '2025-10-22',
      category: 'fix',
      tags: ['Upload', 'Imagens', 'Bug'],
      icon: Shield,
    },
  ];

  const filteredUpdates = updates.filter(update => {
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
    const matchesSearch = update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         update.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categoryConfig: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
    feature: { label: 'Novidade', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/30', dotClass: 'bg-blue-400' },
    improvement: { label: 'Melhoria', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/30', dotClass: 'bg-amber-400' },
    fix: { label: 'Correção', badgeClass: 'bg-red-500/20 text-red-300 border-red-400/30', dotClass: 'bg-red-400' },
    milestone: { label: 'Marco', badgeClass: 'bg-[#FFF200]/20 text-[#FFF200] border-[#FFF200]/30', dotClass: 'bg-[#FFF200]' },
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Shared fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-50" />
      <div
        className="fixed inset-0 opacity-20 -z-50"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <Helmet>
        <title>Novidades — orientohub</title>
        <meta
          name="description"
          content="Acompanhe a evolução da orientohub: novas funcionalidades, melhorias e marcos da plataforma."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative flex min-h-[500px] w-full items-center overflow-hidden border-b border-white/10">
        <div className="container-custom relative z-10 py-20 sm:py-28">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="liquid-glass" className="gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2">
                <Rocket className="h-3.5 w-3.5 text-[#FFF200]" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-xs">
                  Evolução contínua
                </span>
              </Badge>
            </motion.div>

            <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
              Novidades <span className="text-[#FFF200]">oriento</span><span className="text-white">hub</span>
            </h1>

            <p className="mb-10 mt-7 max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
              Cada atualização é um passo para transformar a forma como ideias viram projetos.
              Acompanhe o que construímos e o que vem por aí.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#FFF200]" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar novidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-[#0d131d]/85 py-4 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-[#FFF200]/60 focus:ring-2 focus:ring-[#FFF200]/10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpar busca"
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/35 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Categories Filter */}
      <section className="relative z-30">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d131d]/90 p-2 backdrop-blur-xl scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#FFF200] text-black'
                      : 'border border-transparent text-white/50 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          {filteredUpdates.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Nenhuma novidade encontrada
              </h3>
              <p className="text-white/40">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="mb-10 border-b border-white/10 pb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">
                    {selectedCategory === 'all' ? 'Todas as atualizações' : categories.find(c => c.id === selectedCategory)?.label}
                  </p>
                  <h2 className="mt-2 text-3xl font-black">
                    {filteredUpdates.length} {filteredUpdates.length === 1 ? 'atualização' : 'atualizações'}
                  </h2>
                </div>
              </motion.div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFF200]/40 via-white/10 to-transparent" />

                <div className="space-y-6 sm:space-y-8">
                  {filteredUpdates.map((update, index) => {
                    const config = categoryConfig[update.category];
                    const Icon = update.icon;

                    return (
                      <motion.div
                        key={update.id}
                        className="relative pl-16 sm:pl-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-4 sm:left-6 top-6 sm:top-8 z-10">
                          <div className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full border-2 border-[#0c121b] bg-[#0d131d]">
                            <span className={`h-3 w-3 rounded-full ${config.dotClass}`} />
                          </div>
                        </div>

                        {/* Card */}
                        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 transition-all duration-300 hover:border-[#FFF200]/35 hover:bg-[#111925]">
                          <div className="p-5 sm:p-7">
                            {/* Header */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${config.badgeClass}`}>
                                <Icon className="h-3 w-3" />
                                {config.label}
                              </span>
                              {update.version && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
                                  <Code className="h-3 w-3" />
                                  {update.version}
                                </span>
                              )}
                              <span className="ml-auto flex items-center gap-1.5 text-xs text-white/35">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(update.date)}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-black leading-snug text-white transition-colors group-hover:text-[#FFF200] mb-3">
                              {update.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm sm:text-base leading-relaxed text-white/55 mb-5">
                              {update.description}
                            </p>

                            {/* Details */}
                            <ul className="space-y-2.5">
                              {update.details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FFF200] mt-0.5" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/5">
                              {update.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-white/35"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Continue the journey CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="container-custom relative z-10">
          <motion.div
            className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d] lg:grid-cols-[1.1fr_0.9fr] lg:grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16">
              <div className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#FFF200]/35 bg-[#FFF200]/10 px-3.5 py-2">
                <Sparkles className="h-3.5 w-3.5 text-[#FFF200]" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
                  Faz parte também
                </span>
              </div>
              <h2 className="max-w-xl text-4xl font-black leading-[1.05] text-white md:text-5xl">
                Construa a próxima atualização com a gente.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55">
                Cadastre-se para testar novas funcionalidades antes de todo mundo e ajudar a moldar a plataforma.
              </p>
              <div className="mt-8">
                <Link
                  to="/cadastro"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFF200] hover:bg-[#FFF200]/90 text-black font-bold text-base rounded-xl transition-all active:scale-95"
                >
                  Começar agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="grid gap-px border-t border-white/10 bg-white/10 lg:border-l lg:border-t-0">
              <Link to="/plataforma" className="group flex items-center gap-5 bg-[#101722] p-7 transition-colors hover:bg-[#151d29] sm:p-9">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#FFF200]/25 bg-[#FFF200]/10 text-[#FFF200]">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-lg font-black text-white">Ver a plataforma</strong>
                  <span className="mt-1 block text-sm leading-relaxed text-white/45">Explore funcionalidades e recursos.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#FFF200] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link to="/contato" className="group flex items-center gap-5 bg-[#101722] p-7 transition-colors hover:bg-[#151d29] sm:p-9">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#FFF200]/25 bg-[#FFF200]/10 text-[#FFF200]">
                  <Users className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-lg font-black text-white">Fale com o time</strong>
                  <span className="mt-1 block text-sm leading-relaxed text-white/45">Tire dúvidas e envie sugestões.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#FFF200] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 sm:py-12">
        <div className="container-custom flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/30">
            orientohub — Ideias com direção.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/blog" className="text-sm text-white/35 hover:text-[#FFF200] transition-colors">
              Blog
            </Link>
            <Link to="/ecossistema" className="text-sm text-white/35 hover:text-[#FFF200] transition-colors">
              Ecossistema
            </Link>
            <Link to="/contato" className="text-sm text-white/35 hover:text-[#FFF200] transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NovidadesPage;
