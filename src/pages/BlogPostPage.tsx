import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  category: string;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Mock post data - in production, this would fetch from an API
    const mockPost: BlogPost = {
      id: '1',
      slug: 'validacao-problema-startup',
      title: 'Como validar o problema da sua startup em 5 passos',
      content: `
        <p>Validar o problema que sua startup pretende resolver é um dos passos mais cruciais no processo de empreendedorismo. Muitas startups falham não porque a solução era ruim, mas porque o problema não era significativo o suficiente para os clientes.</p>
        
        <h2>1. Identifique seu público-alvo</h2>
        <p>Antes de tudo, você precisa ter clareza sobre quem são as pessoas que sofrem com o problema que você quer resolver. Quanto mais específico você for nessa definição, mais fácil será encontrar essas pessoas para validar suas hipóteses.</p>
        
        <h2>2. Faça entrevistas qualitativas</h2>
        <p>Conversas profundas com potenciais clientes são fundamentais. O objetivo é entender não só o problema em si, mas também como as pessoas lidam com ele atualmente e quanto esse problema realmente as incomoda.</p>
        
        <h2>3. Analise soluções existentes</h2>
        <p>Pesquise como as pessoas resolvem esse problema hoje. Às vezes, a ausência de soluções pode indicar que o problema não é relevante o suficiente, em vez de uma oportunidade de mercado.</p>
        
        <h2>4. Quantifique o problema</h2>
        <p>Tente mensurar o impacto do problema em termos de tempo, dinheiro ou outros recursos desperdiçados. Isso ajudará a determinar o valor potencial da sua solução.</p>
        
        <h2>5. Teste a disposição para pagar</h2>
        <p>Por fim, valide se as pessoas estariam dispostas a pagar pela solução. Uma dica é tentar vender a solução antes mesmo de construí-la, através de uma landing page ou MVP.</p>
      `,
      coverImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      publishedAt: '2025-02-15',
      readingTime: '8 min',
      category: 'Validação',
    };

    // Simulate API fetch
    setTimeout(() => {
      setPost(mockPost);
    }, 100);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Orientohub`}</title>
        <meta name="description" content={post.content.substring(0, 155)} />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
        <div className="container-custom">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Voltar para o blog
            </Link>
          </motion.div>

          {/* Article header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <span className="inline-block bg-primary-500 text-black text-sm font-medium px-3 py-1 rounded-full mb-6">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} className="mr-2" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
              </time>
              <span className="mx-2">•</span>
              <Clock size={16} className="mr-2" />
              <span>{post.readingTime}</span>
            </div>
          </motion.div>

          {/* Featured image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Article content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary-500 hover:prose-a:text-primary-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Newsletter subscription */}
          <motion.div
            className="max-w-3xl mx-auto mt-16 bg-primary-500 rounded-xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Gostou do conteúdo?
              </h2>
              <p className="text-black/80 mb-6">
                Assine nossa newsletter e receba mais artigos como este diretamente no seu e-mail.
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

export default BlogPostPage;