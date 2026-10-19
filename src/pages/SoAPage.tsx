import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BarChart3, Beaker, BookOpen, Bot, Check, Eye, Heart, Megaphone, RefreshCw, Search, Send, Target, Users } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

const checkoutUrl = 'https://pay.hotmart.com/A107111484M?checkoutMode=2';

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.14 },
};

const method = [
  { number: '01', icon: Search, title: 'Entenda', description: 'Descubra por que seguidores representam apenas audiência potencial — e o que realmente transforma presença em atenção.' },
  { number: '02', icon: BarChart3, title: 'Meça', description: 'Observe frequência, relevância, recorrência e interação para interpretar sua presença com mais clareza.' },
  { number: '03', icon: Beaker, title: 'Teste', description: 'Use um protocolo prático para transformar publicação, análise e aprendizado em um ciclo contínuo.' },
  { number: '04', icon: RefreshCw, title: 'Evolua', description: 'Leia os sinais do público, ajuste suas escolhas e construa relevância sem depender de fórmulas prontas.' },
];

const audiences = [
  { icon: Eye, title: 'Criadores de conteúdo', description: 'Para sair da publicação por impulso e construir uma presença com intenção, leitura e consistência.' },
  { icon: Megaphone, title: 'Social medias e marketing', description: 'Para transformar métricas em diagnóstico e orientar estratégias mais relevantes para cada público.' },
  { icon: Target, title: 'Empreendedores e marcas', description: 'Para usar o Instagram como ativo de autoridade, relacionamento e geração de oportunidades.' },
  { icon: Users, title: 'Gestores de comunidade', description: 'Para entender a dinâmica da atenção e fortalecer conexões que permanecem além de uma publicação.' },
];

const guideInsights = [
  { prompt: 'O que vou encontrar aqui?', response: 'Um método para sair da disputa por volume e começar a interpretar a atenção que sua presença realmente conquista.' },
  { prompt: 'Qual é a ideia central?', response: 'Seguidores representam audiência potencial. Atenção conquistada depende de relevância, recorrência e conexão com o público.' },
  { prompt: 'Como o SoA ajuda na prática?', response: 'O guia organiza critérios de leitura para você observar sinais, formular hipóteses e decidir o que testar em seguida.' },
  { prompt: 'Isso depende de métricas?', response: 'Métricas ajudam, mas não contam tudo sozinhas. O SoA conecta dados, comportamento e contexto para produzir uma leitura mais útil.' },
  { prompt: 'Existe um processo de teste?', response: 'Sim. O protocolo experimental transforma cada publicação em uma oportunidade estruturada de testar, medir e aprender.' },
  { prompt: 'Qual é o resultado esperado?', response: 'Mais clareza para criar conteúdo relevante, aprender com a resposta do público e evoluir sua presença continuamente.' },
];

const SoAPage = () => {
  const guidePreviewRef = useRef<HTMLDivElement>(null);
  const [guideZoom, setGuideZoom] = useState({ visible: false, x: 50, y: 50, left: 0, top: 0, backgroundSize: 1000 });
  const [activeGuideInsight, setActiveGuideInsight] = useState(0);
  const [typedInsight, setTypedInsight] = useState('');

  useEffect(() => {
    const response = guideInsights[activeGuideInsight].response;
    setTypedInsight('');
    let character = 0;
    const typing = window.setInterval(() => {
      character += 1;
      setTypedInsight(response.slice(0, character));
      if (character >= response.length) window.clearInterval(typing);
    }, 13);
    return () => window.clearInterval(typing);
  }, [activeGuideInsight]);

  const handleGuideZoom = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = guidePreviewRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setActiveGuideInsight(Math.min(guideInsights.length - 1, Math.floor((y / 100) * guideInsights.length)));
    setGuideZoom({ visible: true, x, y, left: event.clientX - bounds.left, top: event.clientY - bounds.top, backgroundSize: (bounds.width / 192) * 240 });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <Helmet>
        <title>SoA — Share of Attention | OrientoHub</title>
        <meta name="description" content="Um guia estratégico e prático para entender, medir e conquistar atenção relevante no Instagram." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SoA — Share of Attention" />
        <meta property="og:description" content="Seguidores não garantem atenção. Aprenda a construir relevância no Instagram." />
        <meta property="og:url" content="https://orientohub.com.br/soa" />
        <meta property="og:image" content="https://orientohub.com.br/SoA.png" />
        <meta property="og:image:alt" content="SoA — Share of Attention" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SoA — Share of Attention" />
        <meta name="twitter:description" content="Seguidores não garantem atenção." />
        <meta name="twitter:image" content="https://orientohub.com.br/SoA.png" />
      </Helmet>

      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="pointer-events-none fixed inset-0 -z-50 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="container-custom flex min-h-[680px] items-center py-24 lg:py-28">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="max-w-5xl">
              <Badge variant="liquid-glass" className="gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2">
                <Eye className="h-3.5 w-3.5 shrink-0 text-[#FFF200]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-xs">Guia estratégico · Instagram</span>
              </Badge>
              <p className="mt-8 text-sm font-black uppercase tracking-[0.24em] text-[#FFF200]">SoA · Share of Attention</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[5.2rem]">Seguidores não garantem <span className="text-[#FFF200]">atenção.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">Você não disputa apenas alcance. Disputa espaço na mente das pessoas. Aprenda a observar, medir e conquistar relevância de verdade.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <PurchaseButton label="Quero acessar o guia SoA" />
                <span className="flex items-center justify-center gap-2 text-sm text-white/45 sm:justify-start"><BookOpen className="h-4 w-4 text-[#FFF200]" /> Guia digital e aplicação prática</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Leitura estratégica', 'Método aplicável', 'Sem fórmulas prontas'].map(item => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/55">{item}</span>)}
              </div>
            </motion.div>

          </div>
        </section>

        <SectionDivider topSpacing="tight" />

        <section className="container-custom py-16 sm:py-24">
          <motion.div {...reveal} className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">A mudança de perspectiva</p><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Audiência é potencial. Atenção é conquista.</h2></div>
            <div className="max-w-2xl"><p className="text-lg leading-relaxed text-white/55">Número de seguidores não revela quanto espaço sua marca ocupa na rotina, na memória ou nas decisões do público. O SoA propõe uma forma mais madura de interpretar presença digital.</p><div className="mt-6 flex gap-5 border-l border-[#FFF200] pl-5"><p className="text-sm font-bold text-white/80">Menos obsessão por volume.<br /><span className="text-[#FFF200]">Mais atenção à relevância.</span></p></div></div>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {method.map((item, index) => <MethodCard key={item.number} {...item} index={index} />)}
          </div>
        </section>

        <SectionDivider />

        <section className="container-custom py-16 sm:py-24">
          <motion.div {...reveal} className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Para quem é</p><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Para quem precisa transformar presença em relevância.</h2><p className="mt-5 text-lg leading-relaxed text-white/55">Um guia para quem cria, planeja ou lidera a comunicação e quer tomar decisões melhores no Instagram.</p></motion.div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
            {audiences.map((audience, index) => <AudienceCard key={audience.title} {...audience} index={index} />)}
          </div>
        </section>

        <SectionDivider />

        <section className="container-custom py-16 sm:py-24">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFF200]">Por dentro do guia</p><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Conteúdo para consultar, aplicar e revisitar.</h2><p className="mt-5 leading-relaxed text-white/55">Uma experiência visual que organiza o conceito, apresenta critérios de leitura e conduz você até um protocolo prático de experimentação.</p><div className="mt-7 space-y-3">{['Conceito explicado sem superficialidade', 'Critérios para observar sua presença', 'Protocolo para testar e aprender'].map(item => <p key={item} className="flex items-center gap-3 text-sm font-semibold text-white/65"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#FFF200] text-black"><Check className="h-3.5 w-3.5" /></span>{item}</p>)}</div></div>
            <div className="grid items-start gap-4 sm:grid-cols-[260px_minmax(0,1fr)]">
              <div className="mx-auto w-[260px] max-w-full">
                <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/35">Explore o conteúdo com a lupa</p>
                <div ref={guidePreviewRef} onMouseMove={handleGuideZoom} onMouseLeave={() => setGuideZoom(current => ({ ...current, visible: false }))} className="relative hidden cursor-crosshair lg:block">
                  <GuideImage />
                  {guideZoom.visible && <div aria-hidden="true" className="pointer-events-none absolute z-10 h-40 w-40 rounded-full border-4 border-[#FFF200] shadow-[0_12px_36px_rgba(0,0,0,0.45)]" style={{ left: guideZoom.left, top: guideZoom.top, transform: 'translate(-50%, -50%)', backgroundImage: 'url(/AMOSTRA%20GUIA.png)', backgroundPosition: `${guideZoom.x}% ${guideZoom.y}%`, backgroundRepeat: 'no-repeat', backgroundSize: `${guideZoom.backgroundSize}%` }} />}
                </div>
                <div className="lg:hidden"><GuideImage /></div>
              </div>
              <GuideAssistant active={activeGuideInsight} typedResponse={typedInsight} scanning={guideZoom.visible} />
            </div>
          </motion.div>
        </section>

        <SectionDivider />

        <section className="container-custom py-16 sm:py-28">
          <motion.div {...reveal} className="relative overflow-hidden rounded-3xl border border-[#FFF200]/30 bg-[#0d131d] px-6 py-12 text-center sm:px-12 sm:py-20">
            <Heart className="relative mx-auto h-7 w-7 text-[#FFF200]" />
            <h2 className="relative mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl">Pare de apenas publicar. Comece a <span className="text-[#FFF200]">conquistar atenção.</span></h2>
            <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">Use o SoA como mapa para interpretar sua presença, aprender com o público e construir relevância ao longo do tempo.</p>
            <div className="relative mt-9 flex justify-center"><PurchaseButton label="Quero acessar o guia" /></div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

const MethodCard = ({ number, icon: Icon, title, description, index }: (typeof method)[number] & { index: number }) => (
  <motion.article {...reveal} transition={{ delay: index * 0.06 }} className="group relative min-h-[270px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#FFF200]/45">
    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent opacity-30 transition group-hover:opacity-100" />
    <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF200] text-black"><Icon className="h-5 w-5" /></span><span className="text-xs font-black tracking-[0.18em] text-[#FFF200]/35">{number}</span></div>
    <h3 className="mt-9 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/50">{description}</p>
  </motion.article>
);

const AudienceCard = ({ icon: Icon, title, description, index }: (typeof audiences)[number] & { index: number }) => (
  <motion.article {...reveal} transition={{ delay: index * 0.05 }} className="group bg-[#0d131d] p-6 transition hover:bg-[#111925] sm:p-8">
    <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/10 text-[#FFF200]"><Icon className="h-5 w-5" /></span>
    <h3 className="mt-7 text-xl font-black transition group-hover:text-[#FFF200]">{title}</h3><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">{description}</p>
  </motion.article>
);

const GuideImage = () => <img src="/AMOSTRA%20GUIA.png" alt="Amostra do guia SoA — Share of Attention" className="block h-auto w-full rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.42)] ring-1 ring-white/15" />;

const GuideAssistant = ({ active, typedResponse, scanning }: { active: number; typedResponse: string; scanning: boolean }) => {
  const insight = guideInsights[active];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f16]/95 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFF200] text-black"><Bot className="h-4 w-4" /></span><div><p className="text-xs font-black text-white">SoA Insight</p><p className="text-[9px] uppercase tracking-[0.14em] text-white/30">Leitura assistida</p></div></div>
        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#FFF200]"><i className={`h-1.5 w-1.5 rounded-full bg-[#FFF200] ${scanning ? 'animate-pulse' : ''}`} />{scanning ? 'Analisando' : 'Pronto'}</span>
      </div>
      <div className="min-h-[300px] space-y-4 p-4">
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-[#FFF200] px-3.5 py-3 text-xs font-bold leading-relaxed text-black">{insight.prompt}</div>
        <div className="flex items-start gap-2.5"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#FFF200]/25 bg-[#FFF200]/10 text-[#FFF200]"><Bot className="h-3.5 w-3.5" /></span><p className="min-h-[92px] rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.04] px-3.5 py-3 text-xs leading-relaxed text-white/60">{typedResponse}<span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-[#FFF200] align-middle" /></p></div>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 p-3"><span className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[10px] text-white/25">Mova a lupa para explorar o guia...</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF200] text-black"><Send className="h-4 w-4" /></span></div>
    </div>
  );
};

const PurchaseButton = ({ label }: { label: string }) => (
  <a href={checkoutUrl} className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#FFF200] px-7 py-4 text-base font-black text-black shadow-[0_16px_38px_rgba(0,0,0,0.38)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff76a] sm:w-auto sm:px-9 sm:text-lg">
    {label}
    <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
  </a>
);

export default SoAPage;
