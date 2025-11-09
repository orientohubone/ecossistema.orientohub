import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Linkedin,
  Facebook,
  User,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
  likes: number;
  comments: number;
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  readingTime: string;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    // Mock post data
    const mockPost: BlogPost = {
      id: '1',
      slug: 'validacao-problema-startup',
      title: 'Como validar o problema da sua startup em 5 passos',
      subtitle: 'A validação é o primeiro passo para construir um negócio de sucesso. Descubra como fazer isso da maneira certa.',
      content: `
        <div class="article-intro">
          <p class="lead">Validar o problema que sua startup pretende resolver é um dos passos mais cruciais no processo de empreendedorismo. Muitas startups falham não porque a solução era ruim, mas porque o problema não era significativo o suficiente para os clientes.</p>
        </div>

        <h2>🎯 1. Identifique seu público-alvo</h2>
        <p>Antes de tudo, você precisa ter clareza sobre quem são as pessoas que sofrem com o problema que você quer resolver. Quanto mais específico você for nessa definição, mais fácil será encontrar essas pessoas para validar suas hipóteses.</p>
        
        <div class="highlight-box">
          <strong>Dica prática:</strong> Crie personas detalhadas com dados demográficos, comportamentais e psicográficos.
        </div>

        <h2>💬 2. Faça entrevistas qualitativas</h2>
        <p>Conversas profundas com potenciais clientes são fundamentais. O objetivo é entender não só o problema em si, mas também como as pessoas lidam com ele atualmente e quanto esse problema realmente as incomoda.</p>
        
        <blockquote>
          "As melhores startups não são construídas no escritório, mas nas conversas com clientes reais."
        </blockquote>

        <h2>🔍 3. Analise soluções existentes</h2>
        <p>Pesquise como as pessoas resolvem esse problema hoje. Às vezes, a ausência de soluções pode indicar que o problema não é relevante o suficiente, em vez de uma oportunidade de mercado.</p>

        <h2>📊 4. Quantifique o problema</h2>
        <p>Tente mensurar o impacto do problema em termos de tempo, dinheiro ou outros recursos desperdiçados. Isso ajudará a determinar o valor potencial da sua solução.</p>
        
        <div class="stats-box">
          <div class="stat">
            <span class="stat-number">70%</span>
            <span class="stat-label">das startups falham por falta de validação</span>
          </div>
          <div class="stat">
            <span class="stat-number">10x</span>
            <span class="stat-label">mais chances de sucesso com validação adequada</span>
          </div>
        </div>

        <h2>💰 5. Teste a disposição para pagar</h2>
        <p>Por fim, valide se as pessoas estariam dispostas a pagar pela solução. Uma dica é tentar vender a solução antes mesmo de construí-la, através de uma landing page ou MVP.</p>

        <div class="key-takeaways">
          <h3>📌 Principais aprendizados</h3>
          <ul>
            <li>Comece sempre conversando com clientes reais</li>
            <li>Quantifique o problema para entender o potencial de mercado</li>
            <li>Teste a disposição de pagamento antes de construir</li>
            <li>Itere rapidamente com base no feedback</li>
          </ul>
        </div>
      `,
      coverImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-15',
      readingTime: '8 min',
      category: 'Validação',
      author: {
        name: 'Fernando Ramalho',
        avatar: '/fernando-ramalho.jpg',
        role: 'CEO & Fundador'
      },
      tags: ['Validação', 'MVP', 'Product-Market Fit', 'Metodologia'],
      likes: 234,
      comments: 45
    };

    const mockRelatedPosts: RelatedPost[] = [
      {
        id: '2',
        slug: 'mvp-perfeito',
        title: 'Como criar o MVP perfeito para sua startup',
        coverImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'MVP',
        readingTime: '6 min'
      },
      {
        id: '3',
        slug: 'product-market-fit',
        title: 'Guia completo: Como alcançar Product-Market Fit',
        coverImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Growth',
        readingTime: '10 min'
      },
      {
        id: '4',
        slug: 'pitch-investidores',
        title: '10 dicas para um pitch matador para investidores',
        coverImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
        category: 'Fundraising',
        readingTime: '7 min'
      }
    ];

    setTimeout(() => {
      setPost(mockPost);
      setRelatedPosts(mockRelatedPosts);
    }, 100);
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    
    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Orientohub Blog`}</title>
        <meta name="description" content={post.subtitle} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.subtitle} />
        <meta property="og:image" content={post.coverImage} />
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 pt-32 pb-20">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Voltar para o blog</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Content */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Category Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                  {post.category}
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                {post.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                {post.subtitle}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span>{post.readingTime} de leitura</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-primary-500" />
                  <span>{post.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary-500" />
                  <span>{post.comments} comentários</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-primary-500/20 rounded-xl backdrop-blur-sm">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-14 h-14 rounded-full border-2 border-primary-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name) + '&size=56&background=FFD700&color=000&bold=true';
                  }}
                />
                <div>
                  <h3 className="text-white font-bold">{post.author.name}</h3>
                  <p className="text-primary-500 text-sm">{post.author.role}</p>
                </div>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ opacity, scale }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent z-10" />
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar - Social Share & Actions */}
            <motion.aside
              className="lg:col-span-2 lg:sticky lg:top-24 self-start hidden lg:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-4">
                <button
                  onClick={() => setHasLiked(!hasLiked)}
                  className={`w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                    hasLiked
                      ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-500'
                  }`}
                >
                  <ThumbsUp className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{hasLiked ? post.likes + 1 : post.likes}</span>
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                    isBookmarked
                      ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-500'
                  }`}
                >
                  <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="text-xs font-medium">Salvar</span>
                </button>

                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 text-center">COMPARTILHAR</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                    >
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Main Article */}
            <motion.article
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-500/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                  prose-img:rounded-xl prose-img:shadow-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">TAGS</h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-primary-500/10 hover:text-primary-500 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Section Mobile */}
              <div className="lg:hidden mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">GOSTOU? COMPARTILHE!</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">LinkedIn</span>
                  </button>
                </div>
              </div>
            </motion.article>

            {/* Right Sidebar - Table of Contents & Related */}
            <motion.aside
              className="lg:col-span-3 lg:sticky lg:top-24 self-start"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Neste artigo
                </h3>
                <nav className="space-y-3">
                  <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                    → Identifique seu público-alvo
                  </a>
                  <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                    → Faça entrevistas qualitativas
                  </a>
                  <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                    → Analise soluções existentes
                  </a>
                  <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                    → Quantifique o problema
                  </a>
                  <a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                    → Teste a disposição para pagar
                  </a>
                </nav>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Newsletter
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Gostou do conteúdo?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Receba semanalmente artigos exclusivos sobre empreendedorismo e startups direto no seu e-mail.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-primary-500/30 bg-white/5 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-0 focus:bg-white/10 transition-all backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/30"
              >
                Assinar Grátis
              </button>
            </form>

            <p className="text-sm text-gray-400 mt-4">
              📧 Sem spam. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Continue Lendo
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Artigos relacionados que você vai adorar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost, index) => (
              <RelatedPostCard key={relatedPost.id} post={relatedPost} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Related Post Card Component
interface RelatedPostCardProps {
  post: RelatedPost;
  delay: number;
}

const RelatedPostCard = ({ post, delay }: RelatedPostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary-500 text-black text-xs font-bold rounded-full">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold mb-3 group-hover:text-primary-500 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Custom Styles (adicione no seu CSS global ou como styled-component)
const customStyles = `
  .article-intro {
    margin-bottom: 3rem;
  }

  .lead {
    font-size: 1.25rem;
    line-height: 1.8;
    color: #4B5563;
  }

  .dark .lead {
    color: #D1D5DB;
  }

  .highlight-box {
    background: linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 100%);
    border-left: 4px solid #FFD700;
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin: 2rem 0;
  }

  .dark .highlight-box {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  }

  .stats-box {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .stat {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
    border-radius: 1rem;
  }

  .dark .stat {
    background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: #FFD700;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: #6B7280;
  }

  .dark .stat-label {
    color: #9CA3AF;
  }

  .key-takeaways {
    background: linear-gradient(135deg, #000000 0%, #1F2937 100%);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    margin: 3rem 0;
  }

  .key-takeaways h3 {
    color: #FFD700 !important;
    margin-bottom: 1rem;
  }

  .key-takeaways ul {
    list-style: none;
    padding: 0;
  }

  .key-takeaways li {
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 0.75rem;
  }

  .key-takeaways li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #FFD700;
    font-weight: bold;
  }
`;

export default BlogPostPage;
