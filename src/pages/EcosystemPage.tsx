import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Settings,
  Rocket,
  Target,
  Users,
  Brain,
  BarChart3,
  Compass,
  GraduationCap,
  Mic,
  TrendingUp,
  Lightbulb,
  Shield,
  Zap,
  Network,
  Code,
  Database,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Building2,
  Sparkles,
  Layers,
  Award,
  Heart,
  Play
} from 'lucide-react';

const EcosystemPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Ecossistema - Orientohub</title>
        <meta name="description" content="Conheça a arquitetura estratégica do Orientohub: núcleo empresarial, plataforma de aceleração, MVPs conectados e verticais de expansão." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary-500/30 bg-primary-500/10 text-primary-500 backdrop-blur-sm">
                <Settings className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm font-semibold">Arquitetura Estratégica</span>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-white mb-2">
                Orientohub
              </span>
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Ecossistema
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl sm:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Um ecossistema completo de inovação, aceleração e produtos conectados em 4 camadas estratégicas.
            </motion.p>

            {/* Layer Navigation */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="#nucleo" className="group px-6 py-3 bg-primary-500/10 border-2 border-primary-500/50 hover:border-primary-500 hover:bg-primary-500/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary-500" />
                  <span className="text-primary-500 font-semibold">Núcleo</span>
                </div>
              </a>
              
              <a href="#plataforma" className="group px-6 py-3 bg-blue-500/10 border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-500 font-semibold">Plataforma</span>
                </div>
              </a>
              
              <a href="#mvps" className="group px-6 py-3 bg-green-500/10 border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">MVPs</span>
                </div>
              </a>
              
              <a href="#verticais" className="group px-6 py-3 bg-purple-500/10 border-2 border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/20 rounded-xl backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-purple-500 font-semibold">Verticais</span>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Núcleo Section */}
      <section id="nucleo" className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
              <Compass className="w-5 h-5 text-primary-500" />
              <span className="text-primary-500 font-semibold text-sm">NÚCLEO</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Orientohub Soluções Empresariais</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Base institucional e marca-mãe. Responsável por governança, cultura, metodologia e estrutura de aceleração.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Gestão do Ecossistema"
              description="Governança estratégica e alinhamento de todas as iniciativas do ecossistema."
              delay={0.1}
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Curadoria de Projetos"
              description="Seleção e acompanhamento de founders e startups de alto potencial."
              delay={0.2}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Aceleração Ágil"
              description="Metodologias ágeis para validação rápida e crescimento sustentável."
              delay={0.3}
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8" />}
              title="Framework de Inovação"
              description="Estrutura proprietária para inovação contínua e sistemática."
              delay={0.4}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Branding & Posicionamento"
              description="Construção de marca e posicionamento estratégico no mercado."
              delay={0.5}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Cultura & Comunidade"
              description="Desenvolvimento de cultura de inovação e comunidade de founders."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Camada 1 - Plataforma */}
      <section id="plataforma" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
              <Network className="w-5 h-5 text-blue-500" />
              <span className="text-blue-500 font-semibold text-sm">CAMADA 1</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Plataforma Orientohub</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              O hub digital onde startups, founders e parceiros interagem, compartilham recursos e validam ideias.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <PlatformCard
              icon={<Users className="w-10 h-10" />}
              title="Comunidade de Founders"
              description="Rede exclusiva para conexão, troca de experiências e colaboração entre empreendedores."
              features={["Networking qualificado", "Eventos exclusivos", "Grupos de mastermind", "Fórum de discussão"]}
              delay={0.1}
            />
            <PlatformCard
              icon={<Lightbulb className="w-10 h-10" />}
              title="Framework de Aceleração"
              description="Metodologias comprovadas: Design Thinking, OKRs, Lean Startup e mais."
              features={["Design Thinking", "OKRs", "Lean Startup", "Business Model Canvas"]}
              delay={0.2}
            />
            <PlatformCard
              icon={<BarChart3 className="w-10 h-10" />}
              title="Dashboard de Progresso"
              description="Acompanhamento em tempo real do desenvolvimento das startups aceleradas."
              features={["Métricas em tempo real", "KPIs personalizados", "Relatórios automáticos", "Analytics avançado"]}
              delay={0.3}
            />
            <PlatformCard
              icon={<Database className="w-10 h-10" />}
              title="Repositório de Conhecimento"
              description="Biblioteca completa de metodologias, templates e boas práticas de mercado."
              features={["Templates prontos", "Cases de sucesso", "Documentação completa", "Vídeo-aulas"]}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Camada 2 - MVPs */}
      <section id="mvps" className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
              <Rocket className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold text-sm">CAMADA 2</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">MVPs & Soluções Conectadas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Produtos criados ou incubados dentro do ecossistema. Cada um com autonomia, mas conectados via participação societária de 20%.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <MVPCard
              name="Humansys + BrainSys"
              description="Plataforma de RH inteligente com algoritmo ontológico para gestão de pessoas e cultura organizacional."
              focus="Gestão de Pessoas"
              icon={<Brain className="w-12 h-12 text-white" />}
              color="from-blue-500 to-cyan-500"
              delay={0.1}
              link="https://humansys.com.br"
              status="active"
              metrics={[
                { label: 'Empresas', value: '50+' },
                { label: 'Usuários', value: '2k+' }
              ]}
            />
            <MVPCard
              name="Simples Metrics"
              description="Plataforma de marketing analítico focada em performance e growth para startups e negócios digitais."
              focus="Growth & Analytics"
              icon={<BarChart3 className="w-12 h-12 text-white" />}
              color="from-green-500 to-emerald-500"
              delay={0.2}
              link="https://simplesmetrics.com.br"
              status="active"
              metrics={[
                { label: 'Métricas', value: '100+' },
                { label: 'Integrações', value: '20+' }
              ]}
            />
            <MVPCard
              name="Vo.ai"
              description="Plataforma de convergência vocacional com testes de perfil e inteligência artificial para autoconhecimento."
              focus="Educação & IA"
              icon={<Compass className="w-12 h-12 text-white" />}
              color="from-purple-500 to-pink-500"
              delay={0.3}
              link="https://vo.ai"
              status="beta"
              metrics={[
                { label: 'Testes', value: '15k+' },
                { label: 'Precisão', value: '94%' }
              ]}
            />
            <MVPCard
              name="Vibe Coding"
              description="Stack de tecnologia com IA aplicada ao desenvolvimento, automação de código e produtividade para devs."
              focus="Tech & Automação"
              icon={<Code className="w-12 h-12 text-white" />}
              color="from-orange-500 to-red-500"
              delay={0.4}
              link="https://vibecodingstack.netlify.app/"
              status="active"
              metrics={[
                { label: 'Ferramentas', value: '30+' },
                { label: 'Economia', value: '60%' }
              ]}
            />
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-primary-500/10 border border-primary-500/30 px-6 py-3 rounded-full">
              <CircleDot className="w-5 h-5 text-primary-500" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong className="text-primary-500">20% de participação societária</strong> em cada solução acelerada
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Camada 3 - Verticais */}
      <section id="verticais" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-purple-500 font-semibold text-sm">CAMADA 3</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Verticais de Expansão</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Produtos e iniciativas de fortalecimento da comunidade e monetização de conhecimento.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <VerticalCard
              icon={<Mic className="w-12 h-12" />}
              title="OrientoCast"
              emoji="🎙️"
              description="Podcast com founders e parceiros para difundir ideias do ecossistema"
              features={["Episódios semanais", "Convidados especiais", "Insights exclusivos"]}
              status="active"
              delay={0.1}
            />
            <VerticalCard
              icon={<GraduationCap className="w-12 h-12" />}
              title="Oriento Academy"
              emoji="🎓"
              description="Plataforma de cursos e certificações orientadas a inovação e negócios"
              features={["Cursos práticos", "Certificações", "Mentoria ao vivo"]}
              status="active"
              delay={0.2}
            />
            <VerticalCard
              icon={<Briefcase className="w-12 h-12" />}
              title="Oriento Ventures"
              emoji="💼"
              description="Fundo interno de investimento anjo e equity compartilhado"
              features={["Investimento anjo", "Equity compartilhado", "Due diligence"]}
              status="coming-soon"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-primary-500" />
              <span className="text-primary-500 font-semibold text-sm">MODELO DE NEGÓCIO</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Como Geramos Valor</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Um modelo de negócio diversificado que sustenta o ecossistema e gera valor para todos os participantes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <BusinessModelCard
              icon="💰"
              title="Coparticipação Societária"
              description="20% de participação em startups aceleradas"
              delay={0.1}
            />
            <BusinessModelCard
              icon="🎓"
              title="Oriento Academy"
              description="Monetização via cursos e serviços B2B"
              delay={0.2}
            />
            <BusinessModelCard
              icon="🎙️"
              title="Branding via OrientoCast"
              description="Parcerias e patrocínios estratégicos"
              delay={0.3}
            />
            <BusinessModelCard
              icon="🧠"
              title="Receita Recorrente"
              description="Membership de founders na plataforma"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Founder Journey Timeline */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Jornada do Founder</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Da validação da ideia até o crescimento escalável. Acompanhamos você em cada etapa.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <JourneyStep
                number={1}
                title="Validação & Entrada"
                description="Validação inicial da ideia, mentoria de founders experientes e acesso à comunidade"
                delay={0.1}
              />
              <JourneyStep
                number={2}
                title="Desenvolvimento & MVP"
                description="Acesso aos frameworks, construção de MVP e primeiras validações de mercado"
                delay={0.2}
              />
              <JourneyStep
                number={3}
                title="Tração & Crescimento"
                description="Estratégias de growth, conexão com investidores e expansão do time"
                delay={0.3}
              />
              <JourneyStep
                number={4}
                title="Escala & Investimento"
                description="Rodadas de investimento, expansão de mercado e consolidação do negócio"
                delay={0.4}
              />
            </div>
          </div>

          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <StatCard number="50+" label="Startups Aceleradas" />
            <StatCard number="R$ 15M+" label="Investimento Captado" />
            <StatCard number="200+" label="Founders na Comunidade" />
            <StatCard number="95%" label="Taxa de Sucesso" />
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border-2 border-primary-500/40 px-5 py-2 rounded-full mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wide">
                Junte-se a Nós
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Pronto para{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Fazer Parte
              </span>?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Escolha como você quer se conectar ao ecossistema Orientohub
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <CTACard
              title="Sou Founder"
              description="Quero acelerar minha startup e fazer parte da comunidade"
              features={["Acesso ao ecossistema", "Mentorias especializadas", "Networking qualificado"]}
              ctaText="Aplicar Agora"
              ctaLink="/cadastro"
              icon={Rocket}
              delay={0.1}
            />
            <CTACard
              title="Sou Parceiro"
              description="Quero contribuir com conhecimento e recursos"
              features={["Visibilidade no mercado", "Acesso a startups", "Eventos exclusivos"]}
              ctaText="Tornar-se Parceiro"
              ctaLink="/contato"
              icon={Users}
              delay={0.2}
              featured={true}
            />
            <CTACard
              title="Sou Investidor"
              description="Quero investir em startups promissoras"
              features={["Deal flow qualificado", "Due diligence", "Co-investimento"]}
              ctaText="Conhecer Oportunidades"
              ctaLink="/contato"
              icon={TrendingUp}
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </>
  );
};

// ===== COMPONENTS =====

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <div className="text-primary-500 mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
};

interface PlatformCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  delay: number;
}

const PlatformCard = ({ icon, title, description, features, delay }: PlatformCardProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-blue-500/20 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <div className="text-blue-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

interface MVPCardProps {
  name: string;
  description: string;
  focus: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  link?: string;
  status?: 'active' | 'beta' | 'coming-soon';
  metrics?: { label: string; value: string }[];
}

const MVPCard = ({ name, description, focus, icon, color, delay, link, status = 'active', metrics }: MVPCardProps) => {
  return (
    <motion.div
      className="group relative h-[480px] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      {/* Main Card Container */}
      <div className={`relative h-full bg-gradient-to-br ${color} p-[2px] rounded-2xl`}>
        <div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          {/* Header Section with Gradient */}
          <div className={`relative bg-gradient-to-br ${color} p-6 pb-20`}>
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                status === 'active' ? 'bg-green-500 text-white' :
                status === 'beta' ? 'bg-primary-500 text-black' :
                'bg-gray-800 text-white'
              }`}>
                {status === 'active' ? '✓ Ativo' : status === 'beta' ? '⚡ Beta' : '🔜 Em Breve'}
              </div>
            </div>

            {/* Icon */}
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                {icon}
              </div>
            </div>

            {/* Name */}
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            
            {/* Focus Tag */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              <Target className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{focus}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative -mt-12 px-6 pb-6 space-y-4">
            {/* Description Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Metrics (if provided) */}
            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{metric.label}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Equity Badge */}
            <div className="flex items-center justify-center gap-2 bg-primary-500/10 border-2 border-primary-500/30 rounded-lg p-3">
              <CircleDot className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                20% Participação Societária
              </span>
            </div>

            {/* Visit Site Button */}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/btn flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r ${color} text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                Visitar Site
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            )}
          </div>

          {/* Hover Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
        </div>
      </div>

      {/* External Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 blur-2xl -z-10 transition-opacity duration-300`} />
    </motion.div>
  );
};

interface VerticalCardProps {
  icon: React.ReactNode;
  title: string;
  emoji: string;
  description: string;
  features: string[];
  status: 'active' | 'coming-soon';
  delay: number;
}

const VerticalCard = ({ icon, title, emoji, description, features, status, delay }: VerticalCardProps) => {
  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-purple-500/20 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      {status === 'coming-soon' && (
        <div className="absolute top-4 right-4 bg-primary-500 text-black text-xs font-bold px-3 py-1 rounded-full">
          Em Breve
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="text-purple-500">
          {icon}
        </div>
        <span className="text-3xl">{emoji}</span>
      </div>

      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

interface BusinessModelCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const BusinessModelCard = ({ icon, title, description, delay }: BusinessModelCardProps) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300 hover:bg-white/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  );
};

interface JourneyStepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const JourneyStep = ({ number, title, description, delay }: JourneyStepProps) => {
  return (
    <motion.div
      className="flex gap-6 items-start group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform shadow-lg">
        {number}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => {
  return (
    <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all">
      <div className="text-3xl font-bold text-primary-500 mb-2">{number}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
};

interface CTACardProps {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  icon: React.ElementType;
  delay: number;
  featured?: boolean;
}

const CTACard = ({ title, description, features, ctaText, ctaLink, icon: Icon, delay, featured = false }: CTACardProps) => {
  return (
    <motion.div
      className={`group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl ${
        featured 
          ? 'border-primary-500 shadow-xl shadow-primary-500/20 scale-105' 
          : 'border-gray-700 hover:border-primary-500 hover:shadow-primary-500/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8, scale: featured ? 1.05 : 1.02 }}
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-black border-2 border-primary-500/30 rounded-xl flex items-center justify-center group-hover:border-primary-500 transition-colors">
          <Icon className="w-8 h-8 text-primary-500" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href={ctaLink}
        className={`block w-full text-center px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
          featured
            ? 'bg-primary-500 hover:bg-primary-600 text-black shadow-lg shadow-primary-500/30'
            : 'bg-white/5 hover:bg-primary-500 text-white hover:text-black border-2 border-primary-500/30 hover:border-primary-500'
        }`}
      >
        {ctaText}
      </a>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default EcosystemPage;
