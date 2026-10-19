import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Lightbulb,
  TrendingUp,
  Rocket,
  Target,
  Search,
  X
} from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  featured?: boolean;
  author: {
    name: string;
    avatar: string;
  };
  views?: number;
}

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'validacao', label: 'Validação', icon: Target },
    { id: 'mvp', label: 'MVP', icon: Rocket },
    { id: 'pitch', label: 'Pitch', icon: TrendingUp },
    { id: 'ideias', label: 'Ideias', icon: Lightbulb },
  ];

  // Mock blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '7',
      slug: '50-ideias-negocios-baixo-investimento',
      title: '50 ideias de negócios para começar com pouco dinheiro',
      excerpt: 'Ideias viáveis em serviços digitais, empresas, negócios locais, alimentação e produtos — cada uma com um critério simples para validar antes de investir.',
      coverImage: '/IDEIAS DE NEGÓCIO.png',
      publishedAt: '2026-08-25',
      readingTime: '16 min',
      category: 'ideias',
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 0
    },
    {
      id: '1',
      slug: 'validacao-problema-startup',
      title: 'Como validar o problema da sua startup em 5 passos',
      excerpt: 'Aprenda técnicas práticas para validar se o problema que sua startup resolve realmente existe e vale a pena ser solucionado.',
      coverImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-15',
      readingTime: '8 min',
      category: 'validacao',
      featured: true,
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 1234
    },
    {
      id: '2',
      slug: 'pitch-deck-perfeito',
      title: 'Estrutura do pitch deck perfeito para conquistar investidores',
      excerpt: 'Descubra os elementos essenciais que todo pitch deck precisa ter para chamar a atenção dos investidores e aumentar suas chances de investimento.',
      coverImage: 'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-10',
      readingTime: '10 min',
      category: 'pitch',
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 987
    },
    {
      id: '3',
      slug: 'mvp-lean-startup',
      title: 'MVP: O guia completo da metodologia Lean Startup',
      excerpt: 'Entenda como criar um MVP (Minimum Viable Product) eficiente usando os princípios da metodologia Lean Startup.',
      coverImage: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-05',
      readingTime: '12 min',
      category: 'mvp',
      featured: false,
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 756
    },
    {
      id: '4',
      slug: 'product-market-fit',
      title: 'Como alcançar Product-Market Fit: O guia definitivo',
      excerpt: 'Descubra os sinais de que sua startup atingiu o Product-Market Fit e as estratégias para chegar lá mais rápido.',
      coverImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-01',
      readingTime: '15 min',
      category: 'validacao',
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 1543
    },
    {
      id: '5',
      slug: 'metricas-startup',
      title: '10 métricas essenciais que toda startup deve acompanhar',
      excerpt: 'Conheça as métricas mais importantes para medir o crescimento e sucesso da sua startup.',
      coverImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-01-28',
      readingTime: '9 min',
      category: 'mvp',
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 892
    },
    {
      id: '6',
      slug: 'growth-hacking',
      title: 'Growth Hacking: Estratégias práticas para startups',
      excerpt: 'Aprenda táticas de growth hacking comprovadas para acelerar o crescimento da sua startup com pouco orçamento.',
      coverImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-01-25',
      readingTime: '11 min',
      category: 'mvp',
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg'
      },
      views: 1120
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Shared fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-50" />
      {/* Global dot grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none -z-40"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <Helmet>
        <title>Blog | Ideias em movimento — OrientoHub</title>
        <meta name="description" content="Estratégia, validação, inovação e aprendizados práticos para transformar ideias em projetos e soluções." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative flex min-h-[620px] w-full items-center overflow-hidden border-b border-white/10">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          
          
        </div>

        {/* Grid pattern */}


        <div className="container-custom relative z-10 py-20">
          <motion.div
            className="max-w-5xl"
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
                Blog Orientohub
              </span>
              </Badge>
            </motion.div>

            <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
              Ideias para pensar melhor. <span className="text-[#FFF200]">Caminhos para avançar.</span>
            </h1>

            <p className="mb-10 mt-7 max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
              Estratégia, validação, inovação e aprendizados práticos para transformar possibilidades em decisões, projetos e soluções.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#FFF200]" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-[#0d131d]/85 py-4 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-[#FFF200]/60 focus:ring-2 focus:ring-[#FFF200]/10"
                />
                {searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label="Limpar busca" className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/35 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider topSpacing="tight" />

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

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'all' && !searchQuery && (
        <section className="py-16 sm:py-20">
          <div className="container-custom">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Leitura recomendada</p><h2 className="mt-2 text-3xl font-black">Artigo em destaque</h2>
            </motion.div>

            <FeaturedPostCard post={featuredPost} />
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          {regularPosts.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-white/40">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Publicações</p><h2 className="mt-2 text-3xl font-black">
                  {selectedCategory === 'all' ? 'Últimos Artigos' : `Artigos de ${categories.find(c => c.id === selectedCategory)?.label}`}
                </h2></div>
                <p className="text-sm font-bold text-white/35">
                  {regularPosts.length} {regularPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <BlogPostCard key={post.id} post={post} delay={index * 0.1} />
                ))}
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
            className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d] lg:grid-cols-[1.1fr_0.9fr]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16">
              <div className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#FFF200]/35 bg-[#FFF200]/10 px-3.5 py-2">
                <Sparkles className="h-3.5 w-3.5 text-[#FFF200]" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
                  Do conteúdo à prática
                </span>
              </div>
              <h2 className="max-w-xl text-4xl font-black leading-[1.05] text-white md:text-5xl">
                Leu. Agora escolha o próximo movimento.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55">
                Aprofunde um conceito ou leve sua ideia para um ambiente feito para organizar decisões e construir avanços.
              </p>
            </div>

            <div className="grid gap-px border-t border-white/10 bg-white/10 lg:border-l lg:border-t-0">
              <Link to="/glossario" className="group flex items-center gap-5 bg-[#101722] p-7 transition-colors hover:bg-[#151d29] sm:p-9">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#FFF200]/25 bg-[#FFF200]/10 text-[#FFF200]">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-lg font-black text-white">Entenda um conceito</strong>
                  <span className="mt-1 block text-sm leading-relaxed text-white/45">Consulte definições diretas no Glossário.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#FFF200] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link to="/plataforma" className="group flex items-center gap-5 bg-[#101722] p-7 transition-colors hover:bg-[#151d29] sm:p-9">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#FFF200]/25 bg-[#FFF200]/10 text-[#FFF200]">
                  <Rocket className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-lg font-black text-white">Faça uma ideia avançar</strong>
                  <span className="mt-1 block text-sm leading-relaxed text-white/45">Conheça a plataforma e seus recursos.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#FFF200] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Featured Post Card Component
interface FeaturedPostCardProps {
  post: BlogPost;
}

const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block overflow-hidden rounded-3xl border border-white/10 bg-[#0d131d] transition-all duration-300 hover:border-[#FFF200]/55"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#FFF200]/60 bg-black/70 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-none backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#FFF200]" />
                Destaque
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-7 lg:p-12">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-[#FFF200]"
                onError={(e) => {
                  e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name) + '&size=48&background=FFF200&color=000&bold=true';
                }}
              />
              <div>
                <p className="text-white font-semibold">{post.author.name}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-black leading-tight text-white transition-colors group-hover:text-[#FFF200] lg:text-4xl">
              {post.title}
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-[#FFF200] font-bold">
              Ler artigo completo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Blog Post Card Component
interface BlogPostCardProps {
  post: BlogPost;
  delay: number;
}

const BlogPostCard = ({ post, delay }: BlogPostCardProps) => {
  const CategoryIcon = post.category === 'validacao'
    ? Target
    : post.category === 'mvp'
      ? Rocket
      : post.category === 'pitch'
        ? TrendingUp
        : post.category === 'ideias'
          ? Lightbulb
          : Sparkles;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFF200]/45 hover:bg-[#111925]"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden border-b border-white/10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#FFF200]/60 bg-black/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-none backdrop-blur-md">
              <CategoryIcon className="h-3 w-3 text-[#FFF200]" />
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full border-2 border-[#FFF200]"
              onError={(e) => {
                e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name) + '&size=40&background=FFF200&color=000&bold=true';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {post.author.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/35">
                <Calendar className="w-3 h-3" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </time>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-xl font-black leading-snug text-white transition-colors group-hover:text-[#FFF200]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-white/45">
            {post.excerpt}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#FFF200] font-semibold">
              Ler mais
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            {post.views && (
              <span className="text-xs text-white/30">
                {post.views.toLocaleString()} visualizações
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogPage;
