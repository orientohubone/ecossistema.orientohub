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
  Radio,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Layers,
  CircleDot,
  Building2,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

const EcosystemPage = () => {
  const { t } = useTranslation();
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Arquitetura Estratégica - Ecossistema Orientohub</title>
        <meta name="description" content="Conheça a arquitetura estratégica do Orientohub: núcleo empresarial, plataforma de aceleração, MVPs conectados e verticais de expansão." />
      </Helmet>

      {/* Hero Section - Strategic Architecture */}
      <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Settings className="w-4 h-4 text-primary-500 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-primary-500 font-semibold text-sm">ARQUITETURA ESTRATÉGICA</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Orientohub <span className="text-primary-500">Ecossistema</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Um ecossistema completo de inovação, aceleração e produtos conectados.
              Conheça nossa arquitetura em 3 camadas que transforma ideias em negócios escaláveis.
            </p>
          </motion.div>

          {/* Interactive Architecture Diagram */}
          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative flex flex-col items-center gap-8">
              {/* Layer indicators */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
                <LayerButton
                  number={0}
                  title="Núcleo"
                  icon={<Compass className="w-6 h-6" />}
                  color="primary"
                  active={selectedLayer === 0}
                  onClick={() => setSelectedLayer(selectedLayer === 0 ? null : 0)}
                />
                <LayerButton
                  number={1}
                  title="Plataforma"
                  icon={<Network className="w-6 h-6" />}
                  color="blue"
                  active={selectedLayer === 1}
                  onClick={() => setSelectedLayer(selectedLayer === 1 ? null : 1)}
                />
                <LayerButton
                  number={2}
                  title="MVPs & Soluções"
                  icon={<Rocket className="w-6 h-6" />}
                  color="green"
                  active={selectedLayer === 2}
                  onClick={() => setSelectedLayer(selectedLayer === 2 ? null : 2)}
                />
                <LayerButton
                  number={3}
                  title="Verticais"
                  icon={<TrendingUp className="w-6 h-6" />}
                  color="purple"
                  active={selectedLayer === 3}
                  onClick={() => setSelectedLayer(selectedLayer === 3 ? null : 3)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Núcleo - Core Business Section */}
      <section id="nucleo" className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-4">
              <Compass className="w-5 h-5 text-primary-500" />
              <span className="text-primary-500 font-semibold">NÚCLEO</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Orientohub Soluções Empresariais</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Base institucional e marca-mãe. Responsável por governança, cultura, metodologia e estrutura de aceleração.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CoreFeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Gestão do Ecossistema"
              description="Governança estratégica e alinhamento de todas as iniciativas do ecossistema."
              delay={0.1}
            />
            <CoreFeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Curadoria de Projetos"
              description="Seleção e acompanhamento de founders e startups de alto potencial."
              delay={0.2}
            />
            <CoreFeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Aceleração Ágil"
              description="Metodologias ágeis para validação rápida e crescimento sustentável."
              delay={0.3}
            />
            <CoreFeatureCard
              icon={<Layers className="w-8 h-8" />}
              title="Framework de Inovação"
              description="Estrutura proprietária para inovação contínua e sistemática."
              delay={0.4}
            />
            <CoreFeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Branding & Posicionamento"
              description="Construção de marca e posicionamento estratégico no mercado."
              delay={0.5}
            />
            <CoreFeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Cultura & Comunidade"
              description="Desenvolvimento de cultura de inovação e comunidade de founders."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Camada 1 - Platform Layer */}
      <section id="plataforma" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
              <Network className="w-5 h-5 text-blue-500" />
              <span className="text-blue-500 font-semibold">CAMADA 1</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Plataforma Orientohub</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              O hub digital onde startups, founders e parceiros interagem, compartilham recursos e validam ideias.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PlatformCard
              icon={<Users className="w-10 h-10" />}
              title="Comunidade de Founders"
              description="Rede exclusiva para conexão, troca de experiências e colaboração entre empreendedores."
              features={["Networking qualificado", "Eventos exclusivos", "Grupos de mastermind"]}
              delay={0.1}
            />
            <PlatformCard
              icon={<Lightbulb className="w-10 h-10" />}
              title="Framework de Aceleração"
              description="Metodologias comprovadas: Design Thinking, OKRs, Lean Startup e mais."
              features={["Design Thinking", "OKRs", "Lean Startup"]}
              delay={0.2}
            />
            <PlatformCard
              icon={<BarChart3 className="w-10 h-10" />}
              title="Dashboard de Progresso"
              description="Acompanhamento em tempo real do desenvolvimento das startups aceleradas."
              features={["Métricas em tempo real", "KPIs personalizados", "Relatórios automáticos"]}
              delay={0.3}
            />
            <PlatformCard
              icon={<Database className="w-10 h-10" />}
              title="Repositório de Conhecimento"
              description="Biblioteca completa de metodologias, templates e boas práticas de mercado."
              features={["Templates prontos", "Cases de sucesso", "Documentação completa"]}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Camada 2 - MVPs & Solutions */}
      <section id="mvps" className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-4">
              <Rocket className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">CAMADA 2</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">MVPs & Soluções Plugadas</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Produtos criados ou incubados dentro do ecossistema. Cada um com autonomia, mas conectados via participação societária de 20%.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MVPCard
              name="Humansys + BrainSys"
              description="Plataforma de RH inteligente com algoritmo ontológico"
              focus="Gestão de pessoas e cultura"
              icon={<Brain className="w-12 h-12" />}
              color="from-blue-500 to-cyan-500"
              id="humansys"
              flipped={flippedCard === 'humansys'}
              onFlip={() => setFlippedCard(flippedCard === 'humansys' ? null : 'humansys')}
              delay={0.1}
              link="https://humansys.com.br"
            />
            <MVPCard
              name="Simples Metrics"
              description="Plataforma de marketing analítico e performance"
              focus="Growth e dados"
              icon={<BarChart3 className="w-12 h-12" />}
              color="from-green-500 to-emerald-500"
              id="metrics"
              flipped={flippedCard === 'metrics'}
              onFlip={() => setFlippedCard(flippedCard === 'metrics' ? null : 'metrics')}
              delay={0.2}
              link="https://simplesmetrics.com.br"
            />
            <MVPCard
              name="Vo.ai"
              description="Plataforma de convergência vocacional e testes de perfil"
              focus="Educação e autoconhecimento"
              icon={<Compass className="w-12 h-12" />}
              color="from-purple-500 to-pink-500"
              id="voai"
              flipped={flippedCard === 'voai'}
              onFlip={() => setFlippedCard(flippedCard === 'voai' ? null : 'voai')}
              delay={0.3}
              link="https://vo.ai"
            />
            <MVPCard
              name="Vibe Coding"
              description="Stack tech com IA aplicada a desenvolvimento"
              focus="Tecnologia e automação"
              icon={<Code className="w-12 h-12" />}
              color="from-orange-500 to-red-500"
              id="vibe"
              flipped={flippedCard === 'vibe'}
              onFlip={() => setFlippedCard(flippedCard === 'vibe' ? null : 'vibe')}
              delay={0.4}
              link="https://vibecodingstack.netlify.app/"
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

      {/* Camada 3 - Expansion Verticals */}
      <section id="verticais" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, #FFD700 25%, transparent 25%), linear-gradient(-45deg, #FFD700 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FFD700 75%), linear-gradient(-45deg, transparent 75%, #FFD700 75%)',
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-purple-500 font-semibold">CAMADA 3</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Verticais de Expansão</h2>
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
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-transparent to-primary-500" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/40 px-4 py-2 rounded-full mb-4">
              <Building2 className="w-5 h-5 text-primary-500" />
              <span className="text-primary-500 font-semibold">MODELO DE NEGÓCIO</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Como Geramos Valor</h2>
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
            <h2 className="text-4xl font-bold mb-4">Jornada do Founder</h2>
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
        ctaLink="/cadastro"
        icon={Users}
        delay={0.2}
        featured={true}
      />
      <CTACard
        title="Sou Investidor"
        description="Quero investir em startups promissoras"
        features={["Deal flow qualificado", "Due diligence", "Co-investimento"]}
        ctaText="Conhecer Oportunidades"
        ctaLink="/cadastro"
        icon={TrendingUp}
        delay={0.3}
      />
    </div>
  </div>
</section>
    </>
  );
};    

interface LayerButtonProps {
  number: number;
  title: string;
  icon: React.ReactNode;
  color: 'primary' | 'blue' | 'green' | 'purple';
  active: boolean;
  onClick: () => void;
}

const LayerButton = ({ number, title, icon, color, active, onClick }: LayerButtonProps) => {
  const colorClasses = {
    primary: 'bg-primary-500/20 border-primary-500/50 text-primary-500 hover:bg-primary-500/30',
    blue: 'bg-blue-500/20 border-blue-500/50 text-blue-500 hover:bg-blue-500/30',
    green: 'bg-green-500/20 border-green-500/50 text-green-500 hover:bg-green-500/30',
    purple: 'bg-purple-500/20 border-purple-500/50 text-purple-500 hover:bg-purple-500/30',
  };

  const activeClasses = {
    primary: 'ring-2 ring-primary-500 bg-primary-500/30',
    blue: 'ring-2 ring-blue-500 bg-blue-500/30',
    green: 'ring-2 ring-green-500 bg-green-500/30',
    purple: 'ring-2 ring-purple-500 bg-purple-500/30',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-300
        ${colorClasses[color]}
        ${active ? activeClasses[color] : ''}
      `}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/20">
        {icon}
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold opacity-60">CAMADA {number}</div>
        <div className="font-bold">{title}</div>
      </div>
    </motion.button>
  );
};

interface CoreFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const CoreFeatureCard = ({ icon, title, description, delay }: CoreFeatureCardProps) => {
  return (
    <motion.div
      className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
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
  id: string;
  flipped: boolean;
  onFlip: () => void;
  delay: number;
  link?: string; // ← ADICIONADO ESTA LINHA
}

const MVPCard = ({ name, description, focus, icon, color, flipped, onFlip, delay, link }: MVPCardProps) => {
  return (
    <motion.div
      className="relative h-80 cursor-pointer perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} p-6 flex flex-col items-center justify-center text-white`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-center mb-2">{name}</h3>
          <p className="text-center text-sm opacity-90">Clique para saber mais</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <h3 className="text-lg font-bold mb-3">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-primary-500" />
              <span className="font-semibold text-primary-500">{focus}</span>
            </div>
          </div>
          <div className="space-y-3">
  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
    <CircleDot className="w-3 h-3" />
    <span>20% participação</span>
  </div>
  
  {link && (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-lg transition-colors duration-300"
    >
      Visitar Site
      <ArrowRight className="w-4 h-4" />
    </a>
  )}
</div>
        </div>
        </motion.div>
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
      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform duration-300">
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
    <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
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
