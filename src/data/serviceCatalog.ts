export type ServiceCatalogItem = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  hero: string;
  outcome: string;
  accent: 'primary' | 'orange' | 'emerald' | 'pink' | 'violet' | 'sky' | 'amber' | 'cyan' | 'green';
  deliverables: string[];
  process: { title: string; description: string }[];
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    slug: 'estrategia', title: 'Estratégia', eyebrow: 'Direção para crescer',
    description: 'Planejamento de manobras táticas e visão clara de longo prazo.',
    hero: 'Clareza para escolher os próximos movimentos do seu negócio.',
    outcome: 'Transformamos contexto, ambição e dados em uma rota de execução possível.', accent: 'primary',
    deliverables: ['Diagnóstico de negócio e prioridades', 'Posicionamento e objetivos claros', 'Plano tático por frente de atuação', 'Rituais de acompanhamento'],
    process: [{ title: 'Entender', description: 'Mapeamos cenário, gargalos e oportunidades.' }, { title: 'Priorizar', description: 'Definimos o que gera mais impacto agora.' }, { title: 'Executar', description: 'Organizamos um plano que seu time consegue sustentar.' }],
  },
  {
    slug: 'inovacao', title: 'Inovação', eyebrow: 'Novos caminhos de negócio',
    description: 'Criação de novos produtos e modelos para abrir caminho no seu mercado.',
    hero: 'Tire boas ideias do papel com menos risco e mais aprendizado.',
    outcome: 'Da oportunidade ao teste: desenhamos experimentos que ajudam a decidir com evidências.', accent: 'orange',
    deliverables: ['Mapeamento de oportunidades', 'Desenho de proposta de valor', 'Testes de hipótese e protótipos', 'Plano de evolução do produto'],
    process: [{ title: 'Explorar', description: 'Identificamos problemas reais e espaços de oportunidade.' }, { title: 'Validar', description: 'Testamos valor antes de investir em escala.' }, { title: 'Evoluir', description: 'Transformamos aprendizados em próximos ciclos.' }],
  },
  {
    slug: 'marketing', title: 'Marketing', eyebrow: 'Marketing e posicionamento digital',
    description: 'Posicionamento certo e construção de autoridade para sua marca.',
    hero: 'Transforme estratégia em presença digital consistente.',
    outcome: 'Não entregamos apenas posts: conectamos posicionamento, conteúdo e indicadores para sua marca crescer com coerência.', accent: 'emerald',
    deliverables: ['Diagnóstico de presença e posicionamento', 'Pilares editoriais e calendário de conteúdo', 'Direção criativa e produção de ativos', 'Acompanhamento de métricas e ajustes de rota'],
    process: [{ title: 'Diagnóstico', description: 'Lemos marca, público, mercado e canais para encontrar a melhor direção.' }, { title: 'Estratégia', description: 'Definimos mensagem, pauta, formato e cadência que fazem sentido para o negócio.' }, { title: 'Consistência', description: 'Executamos, medimos e refinamos para construir autoridade com o tempo.' }],
  },
  {
    slug: 'midia-paga', title: 'Mídia paga', eyebrow: 'Escala com intenção',
    description: 'Escala de verdade usando o poder dos algoritmos de anúncios.',
    hero: 'Invista em mídia com uma estratégia que conversa com o seu funil.',
    outcome: 'Campanhas, criativos e dados trabalhando juntos para gerar demanda qualificada.', accent: 'pink',
    deliverables: ['Planejamento de campanhas por objetivo', 'Configuração e gestão de anúncios', 'Testes de criativos e audiências', 'Relatórios com aprendizados acionáveis'],
    process: [{ title: 'Preparar', description: 'Organizamos oferta, rastreamento e páginas de destino.' }, { title: 'Ativar', description: 'Colocamos campanhas no ar com hipótese e critério.' }, { title: 'Otimizar', description: 'Ajustamos investimento com base no que realmente performa.' }],
  },
  {
    slug: 'design', title: 'Design', eyebrow: 'Experiências que fluem', description: 'Design sistêmico que elimina fricção e acelera cada decisão.', hero: 'Faça cada interação comunicar valor e facilitar escolhas.', outcome: 'Unimos estética, clareza e função para tornar sua marca e produto mais fáceis de usar.', accent: 'violet', deliverables: ['Identidade e sistemas visuais', 'Interfaces e fluxos digitais', 'Materiais para comunicação e vendas', 'Direção de design contínua'], process: [{ title: 'Entender', description: 'Conhecemos usuários, contexto e objetivo.' }, { title: 'Desenhar', description: 'Criamos soluções visuais com lógica de uso.' }, { title: 'Refinar', description: 'Evoluímos o sistema com consistência.' }],
  },
  {
    slug: 'vibe-coding', title: 'Vibe coding', eyebrow: 'Construção assistida por IA', description: 'Desenvolvimento ágil usando inteligência artificial e LLMs.', hero: 'Construa produtos digitais com velocidade e intenção.', outcome: 'Usamos IA como alavanca para prototipar, validar e evoluir soluções digitais com agilidade.', accent: 'sky', deliverables: ['Prototipação de produto', 'Desenvolvimento de interfaces', 'Automação de fluxos e dados', 'Evolução técnica orientada ao negócio'], process: [{ title: 'Definir', description: 'Transformamos a necessidade em escopo enxuto.' }, { title: 'Construir', description: 'Criamos uma primeira versão utilizável.' }, { title: 'Aprender', description: 'Evoluímos a partir do uso real.' }],
  },
  {
    slug: 'marcas', title: 'Marcas', eyebrow: 'Proteção e valor', description: 'Registro no INPI, proteção e valorização da sua marca.', hero: 'Proteja o ativo que carrega a reputação do seu negócio.', outcome: 'Orientação estratégica para registrar, organizar e valorizar a sua marca.', accent: 'amber', deliverables: ['Análise inicial de viabilidade', 'Orientação para registro no INPI', 'Organização de classes e documentos', 'Acompanhamento estratégico do processo'], process: [{ title: 'Analisar', description: 'Verificamos o cenário e os riscos iniciais.' }, { title: 'Estruturar', description: 'Preparamos a documentação e o caminho adequado.' }, { title: 'Acompanhar', description: 'Mantemos visibilidade sobre cada etapa.' }],
  },
  {
    slug: 'dominio', title: 'Domínio', eyebrow: 'Propriedade digital', description: 'Gestão estratégica das suas propriedades digitais.', hero: 'Mantenha sua presença digital segura, organizada e sob seu controle.', outcome: 'Cuidamos dos fundamentos que deixam sua marca disponível e preparada para crescer.', accent: 'cyan', deliverables: ['Mapeamento de domínios e acessos', 'Configuração e renovação estratégica', 'Organização de e-mails e propriedades', 'Boas práticas de segurança digital'], process: [{ title: 'Mapear', description: 'Identificamos ativos e responsáveis.' }, { title: 'Organizar', description: 'Centralizamos acesso, registros e prioridades.' }, { title: 'Proteger', description: 'Criamos rotinas para evitar perdas e indisponibilidade.' }],
  },
  {
    slug: 'sites', title: 'Sites', eyebrow: 'Presença que converte', description: 'Sites institucionais e landing pages que convertem visita em cliente.', hero: 'Seu site deve explicar, convencer e abrir a próxima conversa.', outcome: 'Criamos experiências digitais que unem clareza de mensagem, boa navegação e conversão.', accent: 'violet', deliverables: ['Arquitetura de conteúdo e páginas', 'Copy orientada à conversão', 'Design e desenvolvimento responsivo', 'Integrações essenciais e publicação'], process: [{ title: 'Planejar', description: 'Definimos mensagem, jornada e objetivos da página.' }, { title: 'Criar', description: 'Desenhamos e construímos a experiência.' }, { title: 'Publicar', description: 'Validamos os detalhes e deixamos tudo pronto para operar.' }],
  },
  {
    slug: 'e-commerce', title: 'E-commerce', eyebrow: 'Venda digital estruturada', description: 'Lojas virtuais completas com pagamento e frete integrados.', hero: 'Transforme catálogo, operação e experiência em uma loja pronta para vender.', outcome: 'Da vitrine ao checkout, estruturamos uma operação digital que facilita a compra.', accent: 'green', deliverables: ['Estratégia de catálogo e navegação', 'Design e implementação da loja', 'Pagamentos, frete e integrações', 'Acompanhamento de conversão inicial'], process: [{ title: 'Estruturar', description: 'Organizamos produtos, categorias e regras da operação.' }, { title: 'Construir', description: 'Criamos a loja e conectamos os serviços essenciais.' }, { title: 'Evoluir', description: 'Melhoramos a experiência a partir dos dados de venda.' }],
  },
];

export const getServiceBySlug = (slug?: string) => serviceCatalog.find((service) => service.slug === slug);
