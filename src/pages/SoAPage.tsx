import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, Heart, Play, Users, Search, Beaker, TrendingUp, Target } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';

const SoAPage = () => {
  const guidePreviewRef = useRef<HTMLDivElement>(null);
  const [guideZoom, setGuideZoom] = useState({ visible: false, x: 50, y: 50, left: 0, top: 0, backgroundSize: 1000 });

  useEffect(() => {
    // O script da Hotmart controla o modal. Os IDs evitam carregamento duplicado
    // no StrictMode e ao retornar para esta página.
    if (!document.getElementById('hotmart-widget-styles')) {
      const link = document.createElement('link');
      link.id = 'hotmart-widget-styles';
      link.rel = 'stylesheet';
      link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('hotmart-widget-script')) {
      const script = document.createElement('script');
      script.id = 'hotmart-widget-script';
      script.src = 'https://static.hotmart.com/checkout/widget.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGuideZoom = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = guidePreviewRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setGuideZoom({ visible: true, x, y, left: event.clientX - bounds.left, top: event.clientY - bounds.top, backgroundSize: (bounds.width / 192) * 240 });
  };

  const features = [
    {
      number: '1',
      title: 'Entenda',
      description: 'Conheça o conceito de Share of Attention e por que seguidores representam audiência potencial'
    },
    {
      number: '2',
      title: 'Meça',
      description: 'Veja como frequência, relevância, recorrência e interação constroem sua presença no Instagram'
    },
    {
      number: '3',
      title: 'Teste',
      description: 'Use um protocolo prático para transformar publicação, análise e aprendizado em processo contínuo'
    },
    {
      number: '4',
      title: 'Evolua',
      description: 'Aprenda a observar sinais que ajudam a identificar se seu conteúdo está conquistando atenção'
    }
  ];

  const targetAudience = [
    {
      icon: Eye,
      title: 'Criadores de Conteúdo',
      description: 'Potencialize o alcance e a interação de suas criações, transformando seguidores em uma audiência engajada'
    },
    {
      icon: Heart,
      title: 'Social Medias e Marketing',
      description: 'Desenvolva estratégias mais eficazes para seus clientes, garantindo que o conteúdo entregue valor e atenção real'
    },
    {
      icon: Users,
      title: 'Empreendedores e Marcas',
      description: 'Utilize o Instagram de forma estratégica para construir autoridade, atrair mais clientes e gerar negócios consistentes'
    },
    {
      icon: Play,
      title: 'Gestores de Comunidade',
      description: 'Entenda a dinâmica da atenção para fortalecer a conexão com seu público e otimizar o desempenho da sua equipe'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <>
      <Helmet>
        <title>SoA — Share of Attention | OrientoHub</title>
        <meta name="description" content="Um guia estratégico e prático para conquistar mais atenção, relevância e resultados no Instagram." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SoA — Share of Attention" />
        <meta property="og:description" content="O novo jogo da atenção no digital. Transforme publicações em relevância duradoura." />
        <meta property="og:url" content="https://orientohub.com.br/soa" />
        <meta property="og:image" content="https://orientohub.com.br/SoA.png" />
        <meta property="og:image:alt" content="SoA — Share of Attention" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SoA — Share of Attention" />
        <meta name="twitter:description" content="O novo jogo da atenção no digital." />
        <meta name="twitter:image" content="https://orientohub.com.br/SoA.png" />
      </Helmet>
      <div className="min-h-screen bg-[#0c121b] text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] py-8 sm:py-10 lg:min-h-[90vh] lg:py-12 xl:py-16 flex items-center overflow-hidden bg-[#0c121b]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        <div className="relative z-10 container-custom">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight text-black dark:text-white">
                  SoA
                </h1>
                <p className="text-2xl sm:text-3xl font-bold">
                  <span className="text-gray-600 dark:text-gray-300">Share of</span>{' '}
                  <span className="text-primary-600 dark:text-primary-400">Attention</span>
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t-2 border-gray-200 dark:border-gray-800">
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  O novo jogo da{' '}
                  <span className="text-primary-600 dark:text-primary-400">atenção no digital</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  Você não disputa apenas seguidores. Você disputa <strong>atenção</strong>. Aprenda a transformar suas publicações em tentativas eficientes de conquistar relevância duradoura.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a
                  href="https://pay.hotmart.com/A107111484M?checkoutMode=2"
                  className="hotmart-fb hotmart__button-checkout inline-block"
                >
                  <img src="https://static.hotmart.com/img/btn-buy-green.png" alt="Comprar no Hotmart" className="h-12" />
                </a>
                <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span><strong>Oferta limitada!</strong> Garanta seu acesso agora</span>
                </div>
              </div>

              <div className="flex gap-6 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Visibilidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Engajamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Ação</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] sm:h-[500px] flex items-center justify-center"
            >
              <img 
                src="/SoA.png" 
                alt="SoA - Share of Attention"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider topSpacing="normal" />

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#101722]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black dark:text-white">
              O Que Você Vai Encontrar no Guia SoA
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Um mergulho profundo nas táticas e estratégias para dominar a atenção no Instagram, com insights práticos para o seu dia a dia.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-300 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-500 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                    {feature.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider topSpacing="normal" />

      {/* Target Audience Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#0c121b]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black dark:text-white">
              Para Quem é o SoA?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
              Este guia foi cuidadosamente elaborado para profissionais e marcas que buscam maximizar sua presença e impacto no Instagram.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {targetAudience.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-300 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-500 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-600 group-hover:bg-gradient-to-br transition-all">
                      <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {audience.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                    {audience.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <SectionDivider topSpacing="normal" />

      {/* Guide Preview */}
      <section className="bg-[#101722] py-16 sm:py-20 lg:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-300">Prévia do material</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Veja o que você vai encontrar no guia</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">Um método visual e prático para transformar atenção em decisões melhores no Instagram.</p>
          </div>
          <div ref={guidePreviewRef} onMouseMove={handleGuideZoom} onMouseLeave={() => setGuideZoom((current) => ({ ...current, visible: false }))} className="relative mx-auto mt-10 hidden max-w-4xl cursor-crosshair lg:block">
            <div className="overflow-hidden rounded-2xl border border-primary-500/20 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              <img src="/AMOSTRA%20GUIA.png" alt="Amostra do guia SoA: Share of Attention" className="block h-auto w-full" />
            </div>
            {guideZoom.visible && <div aria-hidden="true" className="pointer-events-none absolute z-10 h-48 w-48 rounded-full border-4 border-primary-300 shadow-[0_12px_36px_rgba(0,0,0,0.45)]" style={{ left: guideZoom.left, top: guideZoom.top, transform: 'translate(-50%, -50%)', backgroundImage: 'url(/AMOSTRA%20GUIA.png)', backgroundPosition: `${guideZoom.x}% ${guideZoom.y}%`, backgroundRepeat: 'no-repeat', backgroundSize: `${guideZoom.backgroundSize}%` }} />}
          </div>
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-primary-500/20 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:hidden">
            <img src="/AMOSTRA%20GUIA.png" alt="Amostra do guia SoA: Share of Attention" className="block h-auto w-full" />
          </div>
        </div>
      </section>

      <SectionDivider topSpacing="normal" />

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-[#101722] via-[#0c121b] to-[#101722] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        <div className="relative z-10 container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                Transforme Seguidores em
                <br />
                <span className="text-primary-300">
                  Atenção Conquistada
                </span>
              </h2>
              <p className="text-xl text-gray-200 leading-relaxed">
                Pare de apenas publicar e comece a entender quanto da atenção você realmente consegue conquistar. O SoA é o seu mapa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <a
                href="https://pay.hotmart.com/A107111484M?checkoutMode=2"
                className="hotmart-fb hotmart__button-checkout inline-block"
              >
                <img src="https://static.hotmart.com/img/btn-buy-green.png" alt="Comprar no Hotmart" className="mx-auto h-14" />
              </a>
            </div>

            <div className="pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-300">
                © 2026 SoA: Share of Attention. Todos os direitos reservados.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Desenvolvido com foco na sua relevância digital.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};

export default SoAPage;
