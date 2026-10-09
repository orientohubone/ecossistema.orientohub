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
  { path: '/', title: 'Orientohub | Estratégia, inovação e tecnologia', description: 'Ecossistema de estratégia, inovação, tecnologia e execução para transformar ideias em negócios.', heading: 'Orientação e evolução para transformar ideias em negócios.', body: 'A Orientohub conecta serviços, plataforma, produtos e iniciativas para apoiar empreendedores e empresas da estratégia à execução.', links: [['/servicos', 'Conheça nossas soluções'], ['/ecossistema', 'Explore o ecossistema'], ['/contato', 'Fale com a Orientohub']] },
  { path: '/servicos', title: 'Soluções e serviços | Orientohub', description: 'Estratégia, inovação, marketing, design, tecnologia, sites e soluções para empresas.', heading: 'Soluções conectadas ao momento do seu negócio.', body: 'Escolha uma frente de atuação ou converse conosco para estruturar uma combinação sob medida.', links: services.map(([slug, title]) => [`/servicos/${slug}`, title]) },
  { path: '/sobre', title: 'Sobre a Orientohub', description: 'Conheça a história, a visão e a forma de atuação da Orientohub.', heading: 'Um ecossistema criado para orientar quem constrói.', body: 'A Orientohub aproxima estratégia e execução para transformar desafios empresariais em movimentos claros e possíveis.', links: [['/manifesto', 'Leia nosso manifesto'], ['/contato', 'Entre em contato']] },
  { path: '/ecossistema', title: 'Ecossistema Orientohub', description: 'Conheça o núcleo, a plataforma, os MVPs e as verticais da Orientohub.', heading: 'Um ecossistema conectado para construir e acelerar negócios.', body: 'Serviços, ferramentas, produtos em validação e iniciativas de educação e empreendedorismo conectados em uma mesma estrutura.', links: [['/servicos', 'Serviços'], ['/plataforma', 'Plataforma'], ['/academy', 'Academy']] },
  { path: '/manifesto', title: 'Manifesto | Orientohub', description: 'Pense, crie e acelere com método, ambição e execução.', heading: 'Pense. Crie. Acelere.', body: 'Acreditamos em orientação prática, aprendizado contínuo e execução consistente para construir negócios de impacto.', links: [['/sobre', 'Sobre a Orientohub'], ['/contato', 'Converse conosco']] },
  { path: '/plataforma', title: 'Plataforma Orientohub', description: 'Ferramentas e metodologias para conduzir projetos da ideia à escala.', heading: 'Uma plataforma para transformar intenção em execução.', body: 'Organize ideias, valide hipóteses, acompanhe projetos e avance pela jornada empreendedora com método.', links: [['/cadastro', 'Criar conta'], ['/planos', 'Conhecer planos']] },
  { path: '/academy', title: 'Oriento Academy', description: 'Conteúdos e experiências para desenvolver empreendedores e negócios.', heading: 'Conhecimento aplicado para quem está construindo.', body: 'Aprenda conceitos, métodos e ferramentas para tomar decisões melhores e executar com clareza.', links: [['/academy/login', 'Acessar Academy'], ['/contato', 'Fale conosco']] },
  { path: '/blog', title: 'Blog | Orientohub', description: 'Conteúdos sobre estratégia, inovação, startups, marketing e construção de negócios.', heading: 'Ideias práticas para construir e evoluir negócios.', body: 'Artigos, guias e aprendizados sobre validação, produto, crescimento, estratégia e execução.', links: [['/blog/50-ideias-negocios-baixo-investimento', '50 ideias de negócios para começar com pouco dinheiro']] },
  { path: '/contato', title: 'Contato | Orientohub', description: 'Converse com a Orientohub sobre estratégia, tecnologia, marketing e novos projetos.', heading: 'Vamos conversar sobre o próximo movimento do seu negócio.', body: 'Conte seu desafio, projeto ou ideia. Nossa equipe responderá para entender o contexto e indicar o melhor caminho.', links: [['/servicos', 'Conhecer soluções']] },
  { path: '/glossario', title: 'Glossário de negócios e inovação | Orientohub', description: 'Conceitos de empreendedorismo, inovação, marketing, tecnologia e startups.', heading: 'Glossário para quem constrói negócios.', body: 'Definições claras para compreender conceitos importantes de estratégia, inovação, produto e crescimento.', links: [['/blog', 'Conteúdos'], ['/servicos', 'Soluções']] },
  { path: '/planos', title: 'Planos | Orientohub', description: 'Conheça os planos e possibilidades da plataforma Orientohub.', heading: 'Escolha a estrutura certa para avançar.', body: 'Planos e recursos para diferentes momentos da jornada empreendedora.', links: [['/cadastro', 'Começar'], ['/contato', 'Tirar dúvidas']] },
];

for (const [slug, title, heading, body] of services) pages.push({ path: `/servicos/${slug}`, title: `${title} | Orientohub`, description: body, heading, body, links: [['/servicos', 'Ver todas as soluções'], [`/contato?service=${encodeURIComponent(title)}`, 'Solicitar atendimento']] });

const articles = [
  ['validacao-problema-startup', 'Como validar o problema da sua startup em 5 passos', 'Aprenda técnicas práticas para validar se o problema que sua startup resolve realmente existe e vale a pena ser solucionado.'],
  ['pitch-deck-perfeito', 'Estrutura do pitch deck perfeito para conquistar investidores', 'Conheça os elementos essenciais para apresentar sua startup e aumentar suas chances diante de investidores.'],
  ['mvp-lean-startup', 'MVP: o guia completo da metodologia Lean Startup', 'Entenda como criar um produto mínimo viável eficiente usando os princípios da metodologia Lean Startup.'],
  ['product-market-fit', 'Como alcançar Product-Market Fit', 'Conheça os sinais de Product-Market Fit e estratégias para aproximar produto, mercado e crescimento.'],
  ['metricas-startup', '10 métricas essenciais que toda startup deve acompanhar', 'Conheça indicadores importantes para medir crescimento, eficiência e evolução de uma startup.'],
  ['growth-hacking', 'Growth Hacking: estratégias práticas para startups', 'Táticas para experimentar canais, aprender rapidamente e acelerar o crescimento com orçamento controlado.'],
];
for (const [slug, title, description] of articles) pages.push({ path: `/blog/${slug}`, title: `${title} | Orientohub`, description, heading: title, body: description, links: [['/blog', 'Ver todos os artigos'], ['/contato', 'Fale com a Orientohub']] });

const escape = (value = '') => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const renderContent = (page) => `<div data-static-content="true" style="min-height:100vh;background:#0c121b;color:#fff;font-family:Inter,Arial,sans-serif;padding:48px 24px"><main style="max-width:960px;margin:0 auto"><a href="/" style="color:#fff200;font-weight:800;text-decoration:none">ORIENTOHUB</a><p style="margin-top:72px;color:#fff200;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase">Estratégia, inovação e execução</p><h1 style="max-width:850px;margin:16px 0;font-size:clamp(36px,7vw,72px);line-height:1.05">${escape(page.heading)}</h1><p style="max-width:720px;color:#cbd5e1;font-size:20px;line-height:1.65">${escape(page.body)}</p><nav aria-label="Links relacionados" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:32px">${page.links.map(([href, label]) => `<a href="${escape(href)}" style="border:1px solid #fff200;border-radius:10px;padding:12px 16px;color:#fff200;text-decoration:none;font-weight:700">${escape(label)}</a>`).join('')}</nav></main></div>`;

const render = (page) => {
  const canonical = `${origin}${page.path === '/' ? '/' : page.path}`;
  const structured = JSON.stringify({ '@context': 'https://schema.org', '@type': page.path.startsWith('/servicos/') ? 'Service' : page.path.startsWith('/blog/') ? 'Article' : page.path === '/' ? 'Organization' : 'WebPage', name: page.title, headline: page.path.startsWith('/blog/') ? page.heading : undefined, description: page.description, url: canonical, author: page.path.startsWith('/blog/') ? { '@type': 'Person', name: 'Fernando Ramalho' } : undefined, publisher: page.path.startsWith('/blog/') ? { '@type': 'Organization', name: 'Orientohub', url: origin } : undefined, provider: page.path.startsWith('/servicos/') ? { '@type': 'Organization', name: 'Orientohub', url: origin } : undefined });
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(page.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escape(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escape(page.description)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escape(page.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escape(page.description)}" />`)
    .replace('</head>', `<link rel="canonical" href="${canonical}" /><script type="application/ld+json">${structured}</script></head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderContent(page)}</div>`);
};

for (const page of pages) {
  const target = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(page));
}

console.log(`Pré-render concluído: ${pages.length} rotas públicas.`);
