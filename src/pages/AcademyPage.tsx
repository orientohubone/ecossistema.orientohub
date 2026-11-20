import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Lock,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import { Badge } from '../components/ui/Badge';

const AcademyPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Shared fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-50" />
      <div
        className="fixed inset-0 opacity-20 pointer-events-none -z-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <Helmet>
        <title>Oriento Academy — orientohub</title>
        <meta
          name="description"
          content="Trilhas de aprendizagem, certificações e gamificação para founders aplicarem o que aprendem."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative flex min-h-[520px] w-full items-center overflow-hidden border-b border-white/10">
        <div className="container-custom relative z-10 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="liquid-glass" className="gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2">
                <GraduationCap className="h-3.5 w-3.5 text-[#FFF200]" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-xs">
                  Oriento Academy
                </span>
              </Badge>
            </motion.div>

            <motion.h1
              className="mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Aprenda a construir. <span className="text-[#FFF200]">Aplicando.</span>
            </motion.h1>

            <motion.p
              className="mt-7 max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Trilhas guiadas, certificações e uma experiência gamificada que transforma conhecimento em projetos reais. Para founders que não querem só aprender — querem executar.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/cadastro"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFF200] hover:bg-[#FFF200] hover:opacity-90 shadow-none text-black font-bold text-base sm:text-lg rounded-xl shadow-none transition-all active:scale-95"
              >
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Comece a construir
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/academy/login"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-[#FFF200]/50 hover:border-[#FFF200] hover:bg-[#FFF200]/100/10 text-[#FFF200] font-bold text-base sm:text-lg rounded-xl backdrop-blur-sm transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Sou founder da Academy
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider topSpacing="tight" />

      {/* Stats Bar */}
      <section className="relative z-30 border-b border-white/5">
        <div className="container-custom py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: '4', label: 'Trilhas ativas', icon: Target },
              { value: '100%', label: 'Aplicação prática', icon: CheckCircle2 },
              { value: '∞', label: 'Badges e conquistas', icon: Trophy },
              { value: '3', label: 'Pilares instrucionais', icon: BookOpen },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <stat.icon className="h-5 w-5 text-[#FFF200] mx-auto mb-2" />
                <p className="text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-white/40 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Trilhas</p>
            <h2 className="mt-2 text-3xl font-black">Quatro caminhos. Um objetivo.</h2>
            <p className="mt-3 max-w-2xl text-white/50">Cada trilha é uma sequência de cursos e missões que levam do primeiro contato com o tema à aplicação real no seu projeto.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Target,
                title: 'Validação',
                description: 'Do problema ao teste. Hipóteses, entrevistas e experimentos para validar antes de construir.',
                badge: 'Validador',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: TrendingUp,
                title: 'Growth',
                description: 'Aquisição, funil e retenção. Estratégias de crescimento com dados e experimentação contínua.',
                badge: 'Growth',
                color: 'from-emerald-500 to-green-600',
              },
              {
                icon: Users,
                title: 'Liderança',
                description: 'Times, cultura e decisão. Para founders que precisam liderar além do produto.',
                badge: 'Líder',
                color: 'from-purple-500 to-pink-600',
              },
              {
                icon: Trophy,
                title: 'Finanças',
                description: 'Modelo de negócio, métricas e captação. Do break-even ao pitch que converte.',
                badge: 'Financeiro',
                color: 'from-amber-500 to-orange-600',
              },
            ].map((track, i) => (
              <motion.div
                key={track.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d131d]/90 p-5 sm:p-6 transition-all duration-300 hover:border-[#FFF200]/35 hover:bg-[#111925]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${track.color} px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white mb-4`}>
                  <track.icon className="h-3 w-3" />
                  {track.badge}
                </div>
                <h3 className="text-xl font-black text-white mb-2">{track.title}</h3>
                <p className="text-sm leading-relaxed text-white/45">{track.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFF200]">
                  <span>Explorar trilha</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Instructional Pillars */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Metodologia</p>
            <h2 className="mt-2 text-3xl font-black">Três pilares que fazem a diferença</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: '01',
                title: 'Percursos guiados',
                description: 'Cada trilha tem objetivos claros, sequência lógica e checkpoints de progresso. Você não navega sozinho — o caminho é desenhado para quem está construindo algo real.',
                icon: BookOpen,
              },
              {
                number: '02',
                title: 'Aplicação prática',
                description: 'Planos de ação, rubricas e materiais alinhados ao dia a dia do founder. O conteúdo não fica na teoria: cada módulo tem uma entrega que avança o seu projeto.',
                icon: Zap,
              },
              {
                number: '03',
                title: 'Evidências de aprendizagem',
                description: 'Registros, avaliações e histórico documentam o progresso real. Suas conquistas — badges, certificados e níveis — refletem o que você de fato executou.',
                icon: CheckCircle2,
              },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.number}
                className="relative rounded-2xl border border-white/10 bg-[#0d131d]/90 p-6 sm:p-8 transition-all duration-300 hover:border-[#FFF200]/25"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl font-black text-[#FFF200]">{pillar.number}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#FFF200]/25 bg-[#FFF200]/10">
                    <pillar.icon className="h-5 w-5 text-[#FFF200]" />
                  </span>
                  <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/45">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Course Sample — what you'll experience */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Experiência</p>
            <h2 className="mt-2 text-3xl font-black">Um curso dentro da Academy</h2>
            <p className="mt-3 max-w-2xl text-white/50">Veja como funciona uma trilha completa — da primeira aula ao badge conquistado.</p>
          </motion.div>

          <div className="rounded-3xl border border-white/10 bg-[#0d131d] overflow-hidden">
            {/* Course Header */}
            <div className="relative h-48 sm:h-64 border-b border-white/10 bg-gradient-to-br from-blue-900/40 via-[#0d131d] to-[#0d131d]">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10 flex h-full items-end p-6 sm:p-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300">
                      <Target className="h-3 w-3" /> Validação
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Iniciante</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">Validação de Ideias na Prática</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> 12 aulas</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 4h 30min</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 850 alunos</span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-[#FFF200]" /> 4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Body */}
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Modules Preview */}
                <div className="lg:col-span-2 space-y-3">
                  {[
                    { module: 'Módulo 1 — Problema e Público', lessons: 3, active: true },
                    { module: 'Módulo 2 — Hipóteses e Experimentos', lessons: 4 },
                    { module: 'Módulo 3 — MVP e Validação', lessons: 3 },
                    { module: 'Módulo 4 — Resultados e Próximos Passos', lessons: 2 },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-xl border ${item.active ? 'border-[#FFF200]/25 bg-[#FFF200]/[0.04]' : 'border-white/5 bg-white/[0.01]'} p-4`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{item.module}</p>
                          <p className="text-xs text-white/30 mt-0.5">{item.lessons} aulas</p>
                        </div>
                        {item.active && <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFF200]">Em andamento</span>}
                      </div>
                      {item.active && (
                        <div className="mt-3 h-1.5 rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-[#FFF200]" style={{ width: '35%' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sidebar: Badge & Progress */}
                <div className="space-y-5">
                  <div className="rounded-2xl border border-[#FFF200]/20 bg-[#FFF200]/[0.04] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF200] mb-3">Badge ao concluir</p>
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#FFF200] bg-[#FFF200]/10">
                        <Award className="h-6 w-6 text-[#FFF200]" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">Validador</p>
                        <p className="text-xs text-white/35">Certificação verificável</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-3">Nível</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">Iniciante</span>
                    </div>
                    <p className="text-xs text-white/30 mt-1">Sem pré-requisitos</p>
                  </div>

                  <button className="w-full rounded-xl bg-[#FFF200] px-5 py-3.5 text-sm font-bold text-black hover:bg-[#FFF200]/90 transition active:scale-95">
                    Começar agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Bridge: Learning → Platform */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">Integração</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black">Aprendizado que alimenta a plataforma</h2>
            <p className="mt-3 max-w-2xl mx-auto text-white/50">O que você aprende na Academy não fica no curso. Cada módulo gera insumos diretos para as ferramentas do ecossistema.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { from: 'Hipóteses validadas', to: 'Ideias', desc: 'Experimentos viram campos preenchidos no dossiê.' },
              { from: 'Canvas e modelos', to: 'Projetos', desc: 'Frameworks aplicados viram estrutura de projeto.' },
              { from: 'Métricas aprendidas', to: 'Dashboard', desc: 'KPIs do curso alimentam o acompanhamento.' },
              { from: 'Badges conquistados', to: 'Jornada', desc: 'Conquistas somam XP e desbloqueiam missões.' },
            ].map((bridge, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-white/10 bg-[#0d131d]/90 p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-[#FFF200] bg-[#FFF200]/10 px-2 py-0.5 rounded-md">{bridge.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/20" />
                  <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{bridge.to}</span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{bridge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Pedagogic Panel Teaser */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <motion.div
            className="rounded-3xl border border-white/10 bg-[#0d131d] overflow-hidden lg:grid lg:grid-cols-[1fr_1fr]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFF200]/30 bg-[#FFF200]/10 px-3 py-1.5 w-fit mb-5">
                <Lock className="h-3.5 w-3.5 text-[#FFF200]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFF200]">Painel pedagógico</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black leading-[1.05] text-white">
                Governança para quem ensina.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/50">
                Founders e tutores gerenciam currículos, módulos, aulas e evidências de aprendizagem em uma área exclusiva. Do planejamento à publicação, tudo controlado por quem domina o conteúdo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFF200]" /> CRUD de cursos
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFF200]" /> Módulos e aulas
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFF200]" /> Anexos e vídeos
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFF200]" /> Evidências
                </span>
              </div>
            </div>
            <div className="relative border-t border-white/5 lg:border-t-0 lg:border-l bg-[#080b10] p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFF200 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/30 mb-4">Acesso</p>
                <div className="space-y-3">
                  {['Chave pedagógica', 'Vinculada ao usuário', 'Painel exclusivo para founders'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border border-[#FFF200]/30 bg-[#FFF200]/10 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-[#FFF200]" />
                      </div>
                      <span className="text-sm text-white/40">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-white/25">
                  Área restrita. Acesso mediante chave pedagógica e perfil de founder.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="container-custom relative z-10">
          <motion.div
            className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#FFF200]/20 bg-gradient-to-br from-[#FFF200]/[0.06] via-[#FFF200]/[0.12] to-[#FFF200]/[0.06] backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFF200]/80 to-transparent" />
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FFF200]/25 bg-black/30 px-3.5 py-2 mb-6">
                <Flame className="h-3.5 w-3.5 text-[#FFF200]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFF200]">Oriento Academy</span>
              </div>
              <h2 className="max-w-3xl mx-auto text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                A sua próxima conquista <span className="text-[#FFF200]">começa aqui.</span>
              </h2>
              <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-white/55">
                Cadastre-se gratuitamente, escolha uma trilha e transforme conhecimento em evolução real.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/cadastro"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-[#FFF200] hover:bg-[#FFF200]/90 text-black font-bold text-lg rounded-xl transition-all active:scale-95"
                >
                  Criar conta gratuita
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/ecossistema"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all active:scale-95"
                >
                  Ver o ecossistema
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
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
            <Link to="/ecossistema" className="text-sm text-white/35 hover:text-[#FFF200] transition-colors">
              Ecossistema
            </Link>
            <Link to="/blog" className="text-sm text-white/35 hover:text-[#FFF200] transition-colors">
              Blog
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

export default AcademyPage;
