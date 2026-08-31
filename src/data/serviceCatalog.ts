export type ServiceCatalogItem = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  hero: string;
  outcome: string;
  accent: 'primary' | 'orange' | 'emerald' | 'pink' | 'violet' | 'sky' | 'amber' | 'cyan' | 'green';
  pricing?: {
    customText?: string;
    fixed?: number;
    original?: number;
    promotional?: number;
    startingAt?: number;
    startingAtLabel?: string;
    suffix?: string;
    note?: string;
    alternative?: {
      label: string;
      value: number;
    };
  };
  deliverables: string[];
  options?: {
    title: string;
    description?: string;
    price: number;
    prefix?: string;
    suffix?: string;
  }[];
  plans?: {
    name: string;
    subtitle: string;
    audience: string;
    price: number;
    startingAt?: boolean;
    featured?: boolean;
    features: string[];
  }[];
  process: { title: string; description: string }[];
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    slug: 'estrategia', title: 'Estratégia', eyebrow: 'Direção para crescer',
    description: 'Planejamento de manobras táticas e visão clara de longo prazo.',
    hero: 'Clareza para escolher os próximos movimentos do seu negócio.',
    outcome: 'Transformamos contexto, ambição e dados em uma rota de execução possível.', accent: 'primary',
    pricing: { customText: 'Sob demanda', note: 'Investimento definido após diagnóstico e definição do escopo.' },
    deliverables: ['Diagnóstico de negócio e prioridades', 'Posicionamento e objetivos claros', 'Plano tático por frente de atuação', 'Rituais de acompanhamento'],
    process: [{ title: 'Entender', description: 'Mapeamos cenário, gargalos e oportunidades.' }, { title: 'Priorizar', description: 'Definimos o que gera mais impacto agora.' }, { title: 'Executar', description: 'Organizamos um plano que seu time consegue sustentar.' }],
  },
  {
    slug: 'inovacao', title: 'Inovação', eyebrow: 'Novos caminhos de negócio',
    description: 'Criação de novos produtos e modelos para abrir caminho no seu mercado.',
    hero: 'Tire boas ideias do papel com menos risco e mais aprendizado.',
    outcome: 'Da oportunidade ao teste: desenhamos experimentos que ajudam a decidir com evidências.', accent: 'orange',
    pricing: { customText: 'Sob demanda', note: 'Investimento definido após diagnóstico e definição do escopo.' },
    deliverables: ['Mapeamento de oportunidades', 'Desenho de proposta de valor', 'Testes de hipótese e protótipos', 'Plano de evolução do produto'],
    process: [{ title: 'Explorar', description: 'Identificamos problemas reais e espaços de oportunidade.' }, { title: 'Validar', description: 'Testamos valor antes de investir em escala.' }, { title: 'Evoluir', description: 'Transformamos aprendizados em próximos ciclos.' }],
  },
  {
    slug: 'marketing', title: 'Marketing', eyebrow: 'Marketing e posicionamento digital',
    description: 'Posicionamento certo e construção de autoridade para sua marca.',
    hero: 'Transforme estratégia em presença digital consistente.',
    outcome: 'Não entregamos apenas posts: conectamos posicionamento, conteúdo e indicadores para sua marca crescer com coerência.', accent: 'emerald',
    pricing: { startingAt: 1497, startingAtLabel: 'Planos a partir de', suffix: '/mês' },
    deliverables: ['Diagnóstico de presença e posicionamento', 'Pilares editoriais e calendário de conteúdo', 'Direção criativa e produção de ativos', 'Acompanhamento de métricas e ajustes de rota'],
    plans: [
      { name: 'Essencial', subtitle: 'Presença estratégica', audience: 'Ideal para empresas que estão iniciando sua estrutura digital.', price: 1497, features: ['Planejamento mensal', 'Calendário editorial', 'Design profissional', 'Produção de conteúdos', 'Reels e artes estáticas', 'Agendamento das publicações', 'Relatório simplificado'] },
      { name: 'Growth', subtitle: 'Crescimento digital', audience: 'Ideal para empresas que desejam crescer através de conteúdo estratégico.', price: 2497, featured: true, features: ['Tudo do plano Essencial', 'Produção intensiva de Reels', 'Conteúdos para Instagram e TikTok', 'Stories estratégicos', 'Otimização de perfil', 'Acompanhamento de métricas', 'Reunião estratégica mensal', 'Ajustes contínuos'] },
      { name: 'Authority', subtitle: 'Autoridade digital', audience: 'Para empresas que desejam dominar seu mercado.', price: 3997, features: ['Estratégia completa', 'Produção diária de conteúdo', 'Cobertura de eventos', 'Conteúdos para múltiplas plataformas', 'Planejamento de campanhas', 'Estratégia de geração de leads', 'Dashboard de indicadores', 'Consultoria contínua', 'Suporte prioritário'] },
      { name: 'Scale', subtitle: 'Marketing como departamento', audience: 'A OrientoHub atua como o setor de marketing da empresa.', price: 5997, startingAt: true, features: ['Planejamento estratégico', 'Gestão completa das redes', 'Produção audiovisual', 'Campanhas patrocinadas*', 'Landing Pages*', 'Copywriting', 'SEO', 'Automações', 'IA aplicada ao Marketing', 'Growth', 'Consultoria semanal'] },
    ],
    process: [{ title: 'Diagnóstico', description: 'Lemos marca, público, mercado e canais para encontrar a melhor direção.' }, { title: 'Estratégia', description: 'Definimos mensagem, pauta, formato e cadência que fazem sentido para o negócio.' }, { title: 'Consistência', description: 'Executamos, medimos e refinamos para construir autoridade com o tempo.' }],
  },
  {
    slug: 'midia-paga', title: 'Mídia paga', eyebrow: 'Escala com intenção',
    description: 'Escala de verdade usando o poder dos algoritmos de anúncios.',
    hero: 'Invista em mídia com uma estratégia que conversa com o seu funil.',
    outcome: 'Campanhas, criativos e dados trabalhando juntos para gerar demanda qualificada.', accent: 'pink',
    pricing: { startingAt: 600, suffix: '/mês', note: 'Verba de anúncios por conta do contratante.', alternative: { label: 'Campanha avulsa', value: 170 } },
    deliverables: ['Planejamento de campanhas por objetivo', 'Configuração e gestão de anúncios', 'Testes de criativos e audiências', 'Relatórios com aprendizados acionáveis'],
    process: [{ title: 'Preparar', description: 'Organizamos oferta, rastreamento e páginas de destino.' }, { title: 'Ativar', description: 'Colocamos campanhas no ar com hipótese e critério.' }, { title: 'Otimizar', description: 'Ajustamos investimento com base no que realmente performa.' }],
  },
  {
    slug: 'google-meu-negocio', title: 'Google Meu Negócio', eyebrow: 'Presença local que aparece',
    description: 'Estruturação e gestão do seu perfil para ser encontrado por quem procura na sua região.',
    hero: 'Transforme buscas locais em visitas, contatos e novas oportunidades.',
    outcome: 'Organizamos sua presença no Google para transmitir confiança e tornar seu negócio mais fácil de encontrar.', accent: 'primary',
    pricing: { original: 499, promotional: 249 },
    deliverables: ['Diagnóstico do Perfil da Empresa no Google', 'Otimização de categorias, serviços e informações', 'Plano de fotos, publicações e avaliações', 'Acompanhamento de visibilidade e ações locais'],
    process: [{ title: 'Diagnosticar', description: 'Analisamos perfil, concorrência local e oportunidades de busca.' }, { title: 'Otimizar', description: 'Estruturamos todas as informações que ajudam clientes a escolher você.' }, { title: 'Evoluir', description: 'Criamos uma rotina de reputação e presença para manter o perfil relevante.' }],
  },
  {
    slug: 'design', title: 'Design', eyebrow: 'Experiências que fluem', description: 'Design sistêmico que elimina fricção e acelera cada decisão.', hero: 'Faça cada interação comunicar valor e facilitar escolhas.', outcome: 'Unimos estética, clareza e função para tornar sua marca e produto mais fáceis de usar.', accent: 'violet', pricing: { startingAt: 50 }, deliverables: ['Identidade e sistemas visuais', 'Interfaces e fluxos digitais', 'Materiais para comunicação e vendas', 'Direção de design contínua'], options: [{ title: 'Identidade visual', description: 'Uma linguagem visual coerente para sua marca ser reconhecida e lembrada.', price: 400, prefix: 'A partir de' }, { title: 'Criação de logotipo', description: 'Um símbolo profissional e versátil para representar o seu negócio.', price: 150, prefix: 'A partir de' }, { title: 'Peças publicitárias', description: 'Artes para campanhas, redes sociais e materiais de divulgação.', price: 50, suffix: '/cada' }, { title: 'Design system', description: 'Componentes e padrões visuais para dar consistência aos seus produtos digitais.', price: 500, prefix: 'A partir de' }], process: [{ title: 'Entender', description: 'Conhecemos usuários, contexto e objetivo.' }, { title: 'Desenhar', description: 'Criamos soluções visuais com lógica de uso.' }, { title: 'Refinar', description: 'Evoluímos o sistema com consistência.' }],
  },
  {
    slug: 'vibe-coding', title: 'Sistemas inteligentes', eyebrow: 'Tecnologia aplicada ao negócio', description: 'Sistemas personalizados e automações inteligentes para tornar sua operação mais ágil.', hero: 'Transforme processos e ideias em sistemas que trabalham a favor do seu negócio.', outcome: 'Usamos inteligência artificial e tecnologia para criar soluções digitais úteis, validar ideias e automatizar tarefas com agilidade.', accent: 'sky', pricing: { startingAt: 2549, note: 'Sujeito à análise prévia do escopo inicial.' }, deliverables: ['Prototipação de produto', 'Desenvolvimento de interfaces', 'Automação de fluxos e dados', 'Evolução técnica orientada ao negócio'], process: [{ title: 'Definir', description: 'Transformamos a necessidade em escopo enxuto.' }, { title: 'Construir', description: 'Criamos uma primeira versão utilizável.' }, { title: 'Aprender', description: 'Evoluímos a partir do uso real.' }],
  },
  {
    slug: 'marcas', title: 'Marcas', eyebrow: 'Proteção e valor', description: 'Registro no INPI, proteção e valorização da sua marca.', hero: 'Proteja o ativo que carrega a reputação do seu negócio.', outcome: 'Orientação estratégica para registrar, organizar e valorizar a sua marca.', accent: 'amber', pricing: { original: 850, promotional: 450, note: '+ taxa do INPI' }, deliverables: ['Análise inicial de viabilidade', 'Orientação para registro no INPI', 'Organização de classes e documentos', 'Acompanhamento estratégico do processo'], process: [{ title: 'Analisar', description: 'Verificamos o cenário e os riscos iniciais.' }, { title: 'Estruturar', description: 'Preparamos a documentação e o caminho adequado.' }, { title: 'Acompanhar', description: 'Mantemos visibilidade sobre cada etapa.' }],
  },
  {
    slug: 'naming', title: 'Naming', eyebrow: 'Um nome com significado',
    description: 'Criação estratégica de nomes alinhados à essência e ao futuro da sua marca.',
    hero: 'Encontre um nome que expresse a essência do seu negócio.',
    outcome: 'Unimos pesquisa, estratégia e criatividade para construir nomes relevantes, memoráveis e preparados para avançar.', accent: 'orange',
    pricing: { fixed: 349 },
    deliverables: ['Pesquisa de mercado e referências', 'Criação de repertório de nomes', 'Definição da essência da marca', 'Análise inicial de viabilidade no INPI'],
    process: [{ title: 'Investigar', description: 'Entendemos o negócio, o público, o mercado e a essência da marca.' }, { title: 'Criar', description: 'Exploramos caminhos criativos e construímos um repertório de nomes.' }, { title: 'Analisar', description: 'Avaliamos os nomes e realizamos a análise inicial de viabilidade no INPI.' }],
  },
  {
    slug: 'dominio', title: 'Domínio', eyebrow: 'Propriedade digital', description: 'Gestão estratégica das suas propriedades digitais.', hero: 'Mantenha sua presença digital segura, organizada e sob seu controle.', outcome: 'Cuidamos dos fundamentos que deixam sua marca disponível e preparada para crescer.', accent: 'cyan', pricing: { startingAt: 40, startingAtLabel: 'Registros a partir de' }, deliverables: ['Mapeamento de domínios e acessos', 'Configuração e renovação estratégica', 'Organização de e-mails e propriedades', 'Boas práticas de segurança digital'], process: [{ title: 'Mapear', description: 'Identificamos ativos e responsáveis.' }, { title: 'Organizar', description: 'Centralizamos acesso, registros e prioridades.' }, { title: 'Proteger', description: 'Criamos rotinas para evitar perdas e indisponibilidade.' }],
  },
  {
    slug: 'sites', title: 'Sites', eyebrow: 'Presença que converte', description: 'Sites institucionais e landing pages que convertem visita em cliente.', hero: 'Seu site deve explicar, convencer e abrir a próxima conversa.', outcome: 'Criamos experiências digitais que unem clareza de mensagem, boa navegação e conversão.', accent: 'violet', pricing: { startingAt: 997 }, deliverables: ['Arquitetura de conteúdo e páginas', 'Copy orientada à conversão', 'Design e desenvolvimento responsivo', 'Integrações essenciais e publicação'], process: [{ title: 'Planejar', description: 'Definimos mensagem, jornada e objetivos da página.' }, { title: 'Criar', description: 'Desenhamos e construímos a experiência.' }, { title: 'Publicar', description: 'Validamos os detalhes e deixamos tudo pronto para operar.' }],
  },
  {
    slug: 'e-commerce', title: 'E-commerce', eyebrow: 'Venda digital estruturada', description: 'Lojas virtuais completas com pagamento e frete integrados.', hero: 'Transforme catálogo, operação e experiência em uma loja pronta para vender.', outcome: 'Da vitrine ao checkout, estruturamos uma operação digital que facilita a compra.', accent: 'green', pricing: { startingAt: 849, note: 'Valor de implantação. Mensalidade da plataforma à parte e gestão recorrente opcional.' }, deliverables: ['Estratégia de catálogo e navegação', 'Design e implementação da loja', 'Pagamentos, frete e integrações', 'Acompanhamento de conversão inicial'], process: [{ title: 'Estruturar', description: 'Organizamos produtos, categorias e regras da operação.' }, { title: 'Construir', description: 'Criamos a loja e conectamos os serviços essenciais.' }, { title: 'Evoluir', description: 'Melhoramos a experiência a partir dos dados de venda.' }],
  },
];

export const getServiceBySlug = (slug?: string) => serviceCatalog.find((service) => service.slug === slug);
