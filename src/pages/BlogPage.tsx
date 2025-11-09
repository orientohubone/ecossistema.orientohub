import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Rocket,
  Target,
  Search,
  Filter,
  Mail,
  CheckCircle2
} from 'lucide-react';

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
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'validacao', label: 'Validação', icon: Target },
    { id: 'mvp', label: 'MVP', icon: Rocket },
    { id: 'pitch', label: 'Pitch', icon: TrendingUp },
  ];

  // Mock blog posts data
  const blogPosts: BlogPost[] = [
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
    <>
      <Helmet>
        <title>Blog - Orientohub | Conteúdo para Founders e Startups</title>
        <meta name="description" content="Artigos, guias e recursos exclusivos sobre empreendedorismo, startups e inovação. Aprenda com quem já trilhou esse caminho." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 py-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Blog Orientohub
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              Conteúdo que{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                acelera
              </span>
              {' '}sua startup
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Artigos práticos, guias completos e insights valiosos para founders que querem transformar ideias em negócios de sucesso.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-primary-500 focus:ring-0 transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
        <div className="container-custom py-6">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16">
          <div className="container-custom">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary-500" />
                Artigo em Destaque
              </h2>
            </motion.div>

            <FeaturedPostCard post={featuredPost} />
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container-custom">
          {regularPosts.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold">
                  {selectedCategory === 'all' ? 'Últimos Artigos' : `Artigos de ${categories.find(c => c.id === selectedCategory)?.label}`}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
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

      {/* Newsletter CTA */}
      <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Mail className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Newsletter Exclusiva
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Não perca nenhum conteúdo
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Receba semanalmente os melhores artigos sobre empreendedorismo, startups e inovação direto no seu e-mail.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-primary-500/30 bg-white/5 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-0 focus:bg-white/10 transition-all backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Assinar Grátis
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                Sem spam
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                Cancele quando quiser
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                Conteúdo exclusivo
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
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
        className="group block bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border-2 border-primary-500/30 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 lg:h-auto overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-primary-500 text-black text-sm font-bold rounded-full shadow-lg">
                ⭐ DESTAQUE
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-primary-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name) + '&size=48&background=FFD700&color=000&bold=true';
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

            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-primary-500 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-primary-500 font-bold">
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
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary-500 text-black text-xs font-bold rounded-full shadow-lg uppercase">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full border-2 border-primary-500"
              onError={(e) => {
                e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name) + '&size=40&background=FFD700&color=000&bold=true';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {post.author.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
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
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary-500 font-semibold">
              Ler mais
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            {post.views && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
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
