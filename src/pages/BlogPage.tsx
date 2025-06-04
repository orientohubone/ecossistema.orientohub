import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  category: string;
}

const BlogPage = () => {
  const { t } = useTranslation();

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
      category: 'Validação',
    },
    {
      id: '2',
      slug: 'pitch-deck-perfeito',
      title: 'Estrutura do pitch deck perfeito para conquistar investidores',
      excerpt: 'Descubra os elementos essenciais que todo pitch deck precisa ter para chamar a atenção dos investidores e aumentar suas chances de investimento.',
      coverImage: 'https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-10',
      readingTime: '10 min',
      category: 'Pitch',
    },
    {
      id: '3',
      slug: 'mvp-lean-startup',
      title: 'MVP: O guia completo da metodologia Lean Startup',
      excerpt: 'Entenda como criar um MVP (Minimum Viable Product) eficiente usando os princípios da metodologia Lean Startup.',
      coverImage: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-05',
      readingTime: '12 min',
      category: 'MVP',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Blog | Orientohub</title>
        <meta name="description" content="Artigos, guias e recursos para empreendedores e startups em crescimento." />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Blog
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Artigos, guias e recursos para empreendedores e startups em crescimento.
            </motion.p>
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-primary-500 text-black text-sm font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar size={16} className="mr-2" />
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </time>
                      <span className="mx-2">•</span>
                      <Clock size={16} className="mr-2" />
                      <span>{post.readingTime}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary-500 font-medium">
                      Ler mais
                      <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Newsletter subscription */}
          <motion.div
            className="mt-16 bg-primary-500 rounded-xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Receba as últimas novidades
              </h2>
              <p className="text-black/80 mb-6">
                Assine nossa newsletter e receba conteúdo exclusivo sobre empreendedorismo e inovação.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-black/10 focus:border-black/20 focus:ring-0 bg-white/90 placeholder-black/60"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  Assinar
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;