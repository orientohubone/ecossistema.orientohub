import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = await readFile(join(dist, 'index.html'), 'utf8');
const origin = 'https://orientohub.com.br';

const services = [
  ['estrategia', 'Estratégia', 'Clareza para escolher os próximos movimentos do seu negócio.', 'Diagnóstico, posicionamento, plano tático e acompanhamento para transformar contexto em direção executável.'],
  ['inovacao', 'Inovação', 'Tire boas ideias do papel com menos risco e mais aprendizado.', 'Mapeamento de oportunidades, proposta de valor, experimentos, protótipos e evolução de produtos.'],
  ['marketing', 'Marketing', 'Transforme estratégia em presença digital consistente.', 'Posicionamento, conteúdo, direção criativa e indicadores conectados ao crescimento do negócio.'],
  ['midia-paga', 'Mídia paga', 'Invista em mídia com uma estratégia que conversa com o seu funil.', 'Planejamento, anúncios, criativos, audiências e otimização orientada por resultados.'],
  ['google-meu-negocio', 'Google Meu Negócio', 'Transforme buscas locais em visitas, contatos e oportunidades.', 'Estruturação e gestão do Perfil da Empresa no Google para fortalecer presença e reputação local.'],
  ['design', 'Design', 'Faça cada interação comunicar valor e facilitar escolhas.', 'Identidade visual, interfaces, materiais de comunicação e sistemas visuais consistentes.'],
  ['sistemas-inteligentes', 'Sistemas inteligentes', 'Transforme processos e ideias em sistemas que trabalham pelo negócio.', 'Sistemas personalizados, inteligência artificial, prototipação e automação de fluxos e dados.'],
  ['marcas', 'Marcas', 'Proteja o ativo que carrega a reputação do seu negócio.', 'Orientação para registro no INPI, organização de classes, documentos e acompanhamento do processo.'],
  ['naming', 'Naming', 'Encontre um nome que expresse a essência do seu negócio.', 'Pesquisa, estratégia e criatividade para construir nomes relevantes, memoráveis e preparados para avançar.'],
  ['dominio', 'Domínio', 'Mantenha sua presença digital segura e sob seu controle.', 'Gestão de domínios, acessos, e-mails, renovações e propriedades digitais.'],
  ['sites', 'Sites', 'Seu site deve explicar, convencer e abrir a próxima conversa.', 'Sites institucionais e landing pages com clareza de mensagem, navegação e conversão.'],
  ['e-commerce', 'E-commerce', 'Transforme catálogo e operação em uma loja pronta para vender.', 'Lojas virtuais com catálogo, pagamentos, frete, integrações e experiência de compra estruturada.'],
];

const pages = [
  { path: '/', breadcrumb: 'Início', title: 'OrientoHub | Estratégia, inovação e tecnologia', description: 'Ecossistema de estratégia, inovação, tecnologia e execução para transformar ideias em negócios.', heading: 'Orientação e evolução para transformar ideias em negócios.', body: 'A OrientoHub conecta serviços, plataforma, produtos e iniciativas para apoiar empreendedores e empresas da estratégia à execução.', links: [['/servicos', 'Conheça nossas soluções'], ['/ecossistema', 'Explore o ecossistema'], ['/plataforma', 'Conheça a plataforma'], ['/contato', 'Fale com a OrientoHub']] },
  { path: '/servicos', breadcrumb: 'Serviços', title: 'Soluções e serviços | OrientoHub', description: 'Estratégia, inovação, marketing, design, tecnologia, sites e soluções para empresas.', heading: 'Soluções conectadas ao momento do seu negócio.', body: 'Escolha uma frente de atuação ou converse conosco para estruturar uma combinação sob medida.', links: services.map(([slug, title]) => [`/servicos/${slug}`, title]) },
  { path: '/sobre', breadcrumb: 'Sobre', title: 'Sobre Nós | OrientoHub', description: 'Conheça a história, a visão e a forma de atuação da OrientoHub.', heading: 'Um ecossistema criado para orientar quem constrói.', body: 'A OrientoHub aproxima estratégia e execução para transformar desafios empresariais em movimentos claros e possíveis.', links: [['/manifesto', 'Leia nosso manifesto'], ['/ecossistema', 'Explore o ecossistema'], ['/contato', 'Entre em contato']] },
  { path: '/ecossistema', breadcrumb: 'Ecossistema', title: 'Ecossistema OrientoHub | Quatro camadas conectadas', description: 'Conheça o núcleo, a plataforma, os MVPs e as verticais da OrientoHub.', heading: 'Um ecossistema conectado para construir e acelerar negócios.', body: 'Serviços, ferramentas, produtos em validação e iniciativas de educação e empreendedorismo conectados em uma mesma estrutura.', links: [['/servicos', 'Serviços'], ['/plataforma', 'Plataforma'], ['/academy', 'Academy']] },
  { path: '/parceiros', breadcrumb: 'Parceiros', title: 'Nossos parceiros | OrientoHub', description: 'Soluções parceiras selecionadas pela OrientoHub para apoiar a operação e o crescimento do seu negócio.', heading: 'Soluções que ampliam o que podemos construir juntos.', body: 'Conheça ferramentas e empresas parceiras selecionadas para resolver necessidades reais da operação.', links: [['/servicos', 'Conheça nossos serviços'], ['/contato', 'Fale com a OrientoHub']] },
  { path: '/manifesto', breadcrumb: 'Manifesto', title: 'Manifesto | OrientoHub', description: 'Pense, crie e acelere com método, ambição e execução.', heading: 'Pense. Crie. Acelere.', body: 'Acreditamos em orientação prática, aprendizado contínuo e execução consistente para construir negócios de impacto.', links: [['/sobre', 'Sobre a OrientoHub'], ['/contato', 'Converse conosco']] },
  { path: '/plataforma', breadcrumb: 'Plataforma', title: 'Plataforma OrientoHub - Da ideia à execução', description: 'Ferramentas e metodologias para conduzir projetos da ideia à escala.', heading: 'Uma plataforma para transformar intenção em execução.', body: 'Organize ideias, valide hipóteses, acompanhe projetos e avance pela jornada empreendedora com método.', links: [['/planos', 'Conhecer planos'], ['/contato', 'Falar com a equipe']] },
  { path: '/academy', breadcrumb: 'Academy', title: 'Oriento Academy | OrientoHub', description: 'Conteúdos e experiências para desenvolver empreendedores e negócios.', heading: 'Conhecimento aplicado para quem está construindo.', body: 'Aprenda conceitos, métodos e ferramentas para tomar decisões melhores e executar com clareza.', links: [['/plataforma', 'Conheça a plataforma'], ['/contato', 'Fale conosco']] },
  { path: '/blog', breadcrumb: 'Blog', title: 'Blog | Ideias em movimento — OrientoHub', description: 'Conteúdos sobre estratégia, inovação, startups, marketing e construção de negócios.', heading: 'Ideias práticas para construir e evoluir negócios.', body: 'Artigos, guias e aprendizados sobre validação, produto, crescimento, estratégia e execução.', links: [['/blog/50-ideias-negocios-baixo-investimento', '50 ideias de negócios para começar com pouco dinheiro'], ['/blog/validacao-problema-startup', 'Como validar o problema da sua startup em 5 passos'], ['/blog/mvp-lean-startup', 'MVP: o guia completo da metodologia Lean Startup']] },
  { path: '/contato', breadcrumb: 'Contato', title: 'Contato | OrientoHub', description: 'Converse com a OrientoHub sobre estratégia, tecnologia, marketing e novos projetos.', heading: 'Vamos conversar sobre o próximo movimento do seu negócio.', body: 'Conte seu desafio, projeto ou ideia. Nossa equipe responderá para entender o contexto e indicar o melhor caminho.', links: [['/servicos', 'Conhecer soluções']] },
  { path: '/glossario', breadcrumb: 'Glossário', title: 'Glossário | OrientoHub', description: 'Conceitos de empreendedorismo, inovação, marketing, tecnologia e startups.', heading: 'Glossário para quem constrói negócios.', body: 'Definições claras para compreender conceitos importantes de estratégia, inovação, produto, métricas e crescimento.', links: [['/blog', 'Conteúdos'], ['/servicos', 'Soluções']] },
  { path: '/planos', breadcrumb: 'Planos', title: 'Planos e Preços | OrientoHub', description: 'Conheça os planos e possibilidades da plataforma OrientoHub.', heading: 'Escolha a estrutura certa para avançar.', body: 'Planos e recursos para diferentes momentos da jornada empreendedora.', links: [['/plataforma', 'Conhecer a plataforma'], ['/contato', 'Tirar dúvidas']] },
  { path: '/soa', breadcrumb: 'SoA — Share of Attention', title: 'SoA — Share of Attention | OrientoHub', description: 'Um guia estratégico e prático para entender, medir e conquistar atenção relevante no Instagram.', heading: 'SoA — Share of Attention', body: 'Seguidores não garantem atenção. Aprenda critérios práticos para observar sua presença e construir relevância no Instagram.', links: [['/servicos/marketing', 'Serviço de Marketing'], ['/contato', 'Falar com a OrientoHub']] },
  { path: '/novidades', breadcrumb: 'Novidades', title: 'Novidades | OrientoHub', description: 'Acompanhe a evolução da OrientoHub: novas funcionalidades, melhorias e marcos da plataforma.', heading: 'Novidades e evolução da OrientoHub.', body: 'Acompanhe lançamentos, melhorias na plataforma, novos serviços e atualizações do ecossistema.', links: [['/plataforma', 'Conhecer a plataforma'], ['/blog', 'Ler o blog']] },
  { path: '/regulamento-black-friday', breadcrumb: 'Regulamento Black Friday 2026', title: 'Regulamento Black Friday 2026 | OrientoHub', description: 'Confira as condições da campanha Black Friday 2026 da OrientoHub e o prazo para contratar com 50% OFF.', heading: 'Regulamento da Campanha Black Friday 2026', body: 'Condições, serviços participantes e prazos da campanha promocional de 50% OFF da OrientoHub.', links: [['/servicos', 'Ver serviços participantes'], ['/contato', 'Solicitar atendimento']] },
  { path: '/termos', breadcrumb: 'Termos de Serviço', title: 'Termos de Serviço | OrientoHub', description: 'Leia os termos de serviço da OrientoHub. Conheça seus direitos e responsabilidades ao usar nossa plataforma.', heading: 'Termos de Serviço da OrientoHub', body: 'Direitos, deveres, condições de uso e responsabilidades aplicáveis à plataforma e aos serviços da OrientoHub.', links: [['/privacidade', 'Política de Privacidade'], ['/cookies', 'Política de Cookies']] },
  { path: '/privacidade', breadcrumb: 'Política de Privacidade', title: 'Política de Privacidade | OrientoHub', description: 'Saiba como a OrientoHub protege seus dados pessoais em conformidade com a LGPD.', heading: 'Política de Privacidade e Proteção de Dados', body: 'Transparência sobre coleta, tratamento, armazenamento e direitos dos titulares conforme a LGPD.', links: [['/termos', 'Termos de Serviço'], ['/cookies', 'Política de Cookies']] },
  { path: '/cookies', breadcrumb: 'Política de Cookies', title: 'Política de Cookies | OrientoHub', description: 'Descubra como os cookies da OrientoHub funcionam e como gerenciar suas preferências.', heading: 'Política de Cookies', body: 'Informações sobre cookies essenciais, analíticos e de preferências utilizados no ecossistema OrientoHub.', links: [['/privacidade', 'Política de Privacidade'], ['/termos', 'Termos de Serviço']] },
];

for (const [slug, title, heading, body] of services) {
  pages.push({
    path: `/servicos/${slug}`,
    breadcrumb: title,
    parent: { name: 'Serviços', path: '/servicos' },
    title: `${title} | Serviços OrientoHub`,
    description: body,
    heading,
    body,
    links: [['/servicos', 'Ver todas as soluções'], [`/contato?service=${encodeURIComponent(title)}`, 'Solicitar atendimento']],
  });
}

const articles = [
  ['validacao-problema-startup', 'Como validar o problema da sua startup em 5 passos', 'Aprenda técnicas práticas para validar se o problema que sua startup resolve realmente existe e vale a pena ser solucionado.'],
  ['pitch-deck-perfeito', 'Estrutura do pitch deck perfeito para conquistar investidores', 'Conheça os elementos essenciais para apresentar sua startup e aumentar suas chances diante de investidores.'],
  ['mvp-lean-startup', 'MVP: o guia completo da metodologia Lean Startup', 'Entenda como criar um produto mínimo viável eficiente usando os princípios da metodologia Lean Startup.'],
  ['product-market-fit', 'Como alcançar Product-Market Fit', 'Conheça os sinais de Product-Market Fit e estratégias para aproximar produto, mercado e crescimento.'],
  ['metricas-startup', '10 métricas essenciais que toda startup deve acompanhar', 'Conheça indicadores importantes para medir crescimento, eficiência e evolução de uma startup.'],
  ['growth-hacking', 'Growth Hacking: estratégias práticas para startups', 'Táticas para experimentar canais, aprender rapidamente e acelerar o crescimento com orçamento controlado.'],
];
for (const [slug, title, description] of articles) {
  pages.push({
    path: `/blog/${slug}`,
    breadcrumb: title,
    parent: { name: 'Blog', path: '/blog' },
    title: `${title} | OrientoHub Blog`,
    description,
    heading: title,
    body: description,
    links: [['/blog', 'Ver todos os artigos'], ['/contato', 'Fale com a OrientoHub']],
  });
}

const escape = (value = '') =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const renderBodyFallback = (page) => {
  const linkItems = (page.links || [])
    .map(([href, label]) => `<li><a href="${escape(href)}">${escape(label)}</a></li>`)
    .join('');

  return `<main data-prerender="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"><h1>${escape(page.heading)}</h1><p>${escape(page.body)}</p>${linkItems ? `<nav aria-label="Links relacionados"><ul>${linkItems}</ul></nav>` : ''}</main>`;
};

const buildSchemas = (page, canonical) => {
  const mainSchema = {
    '@context': 'https://schema.org',
    '@type': page.path.startsWith('/servicos/')
      ? 'Service'
      : page.path.startsWith('/blog/')
        ? 'Article'
        : page.path === '/'
          ? 'Organization'
          : page.path === '/plataforma'
            ? 'SoftwareApplication'
            : page.path === '/contato'
              ? 'ContactPage'
              : 'WebPage',
    name: page.path === '/' ? 'OrientoHub' : page.title,
    headline: page.path.startsWith('/blog/') ? page.heading : undefined,
    description: page.description,
    url: canonical,
    applicationCategory: page.path === '/plataforma' ? 'BusinessApplication' : undefined,
    operatingSystem: page.path === '/plataforma' ? 'Web' : undefined,
    author: page.path.startsWith('/blog/') ? { '@type': 'Person', name: 'Fernando Ramalho' } : undefined,
    publisher: page.path.startsWith('/blog/') ? { '@type': 'Organization', name: 'OrientoHub', url: origin } : undefined,
    provider: page.path.startsWith('/servicos/') ? { '@type': 'Organization', name: 'OrientoHub', url: origin } : undefined,
    areaServed: page.path.startsWith('/servicos/') ? 'BR' : undefined,
  };

  if (page.path === '/') {
    return [mainSchema];
  }

  const breadcrumbItems = [{ name: 'Início', path: '/' }];
  if (page.parent) breadcrumbItems.push(page.parent);
  breadcrumbItems.push({ name: page.breadcrumb || page.heading, path: page.path });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path === '/' ? '/' : item.path}`,
    })),
  };

  return [mainSchema, breadcrumbSchema];
};

const render = (page) => {
  const canonical = `${origin}${page.path === '/' ? '/' : page.path}`;
  const schemas = buildSchemas(page, canonical)
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('');

  return template
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, '')
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escape(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escape(page.description)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escape(page.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escape(page.description)}" />`)
    .replace('</head>', `<link rel="canonical" href="${canonical}" />${schemas}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderBodyFallback(page)}</div>`);
};

for (const page of pages) {
  const target = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(page));
}

console.log(`Pré-render concluído: ${pages.length} rotas públicas.`);
