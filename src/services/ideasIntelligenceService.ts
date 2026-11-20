import type { Idea } from './ideasService';

// ─── Tipos de sugestão ─────────────────────────────────────────
export interface Suggestion {
  id: string;
  section: 'hypothesis' | 'market' | 'customer' | 'business_model' | 'competitive' | 'insight';
  title: string;
  description: string;
  template: string; // texto sugerido que pode ser aplicado com um clique
  priority: 'high' | 'medium' | 'low';
  applied?: boolean;
}

export interface IntelligenceSections {
  hypothesisSuggestions: Suggestion[];
  marketSuggestions: Suggestion[];
  customerSuggestions: Suggestion[];
  businessModelSuggestions: Suggestion[];
  competitiveSuggestions: Suggestion[];
  smartInsights: Suggestion[];
}

// ─── Templates de hipóteses por padrão de problema ─────────────
const hypothesisTemplates: Array<{
  match: (problem: string, solution: string) => boolean;
  templates: { title: string; description: string; template: string }[];
}> = [
  {
    match: (p, s) => /tempo|demora|lento|manual|trabalh/i.test(p + ' ' + s),
    templates: [
      {
        title: 'Redução de tempo operacional',
        description: 'Usuários gastam tempo excessivo em tarefas manuais repetitivas que poderiam ser automatizadas.',
        template: 'Acreditamos que profissionais que realizam {tarefa_manual} estão dispostos a pagar por uma solução que reduz esse tempo em pelo menos 50%, porque isso libera horas para atividades de maior valor.',
      },
    ],
  },
  {
    match: (p, s) => /custo|caro|despensa|gasto|preju[ií]zo/i.test(p + ' ' + s),
    templates: [
      {
        title: 'Economia de custos',
        description: 'O problema representa um custo mensurável que cresce com o volume.',
        template: 'Acreditamos que empresas que gastam mais de R$ {valor}/mês com {dor} adotariam uma solução que reduza esse custo em pelo menos 30%, porque o ROI se paga em até {meses} meses.',
      },
    ],
  },
  {
    match: (p, s) => /complexo|dif[ií]cil|confuso|complica|erro|falha/i.test(p + ' ' + s),
    templates: [
      {
        title: 'Simplificação de processo complexo',
        description: 'O processo atual é complicado e propenso a erros humanos.',
        template: 'Acreditamos que {público} que considera {processo} "complexo ou confuso" migraria para uma solução mais intuitiva se ela reduzisse a curva de aprendizado para menos de {minutos} minutos.',
      },
    ],
  },
  {
    match: (p, s) => /comunica[çc][ãa]o|informa[çc][ãa]o|dado|desencontro|falta/i.test(p + ' ' + s),
    templates: [
      {
        title: 'Gap de comunicação/informação',
        description: 'Falta de informação sincronizada entre partes causa retrabalho.',
        template: 'Acreditamos que {público} que depende de {tipo_info} dispersos pagaria por uma plataforma centralizada que elimine desencontros e reduza retrabalho em pelo menos 40%.',
      },
    ],
  },
  {
    match: (p, s) => /escala|crescer|pequeno|micro|pequena empresa|startup/i.test(p + ' ' + s),
    templates: [
      {
        title: 'Acesso a ferramentas enterprise para pequenos',
        description: 'Ferramentas poderosas existem, mas são caras ou complexas para pequenos operadores.',
        template: 'Acreditamos que {público} com faturamento entre R$ {min} e R$ {max}/mês adotaria uma versão simplificada e acessível de {ferramenta_enterprise}, porque hoje eles usam planilhas ou nada.',
      },
    ],
  },
  {
    match: (p, s) => /seguran[çc]a|risco|compliance|regulat|lei|lgpd/i.test(p + ' ' + s),
    templates: [
      {
        title: 'Redução de risco e conformidade',
        description: 'A falta de controle gera risco regulatório ou de segurança.',
        template: 'Acreditamos que {público} sujeitos a {regulamento} adotaria uma solução de {área} que automatize conformidade e reduza o risco de multas ou incidentes.',
      },
    ],
  },
  {
    match: (p, _s) => /experi[êe]ncia|cliente|satisfa[çc][ãa]o|NPS|reten[çc][ãa]o|churn/i.test(p),
    templates: [
      {
        title: 'Melhoria de experiência do cliente',
        description: 'A experiência atual frustra clientes e causa perda de receita.',
        template: 'Acreditamos que {público} com NPS abaixo de {nps} investiria em uma solução que melhore a experiência de {ponto_toque}, porque cada ponto de atrito representa perda de receita.',
      },
    ],
  },
];

// ─── Templates de análise de mercado ──────────────────────────
const marketTemplates: { title: string; description: string; template: string; condition?: (idea: Idea) => boolean }[] = [
  {
    title: 'Tamanho do mercado (TAM/SAM/SOM)',
    description: 'Quantifique o mercado endereçável para validar o potencial.',
    template: 'TAM (mercado total): {estimativa} pessoas/empresas no Brasil.\nSAM (mercado alcançável): {estimativa} com nossos canais.\nSOM (mercado obtível): {estimativa} no primeiro ano.',
  },
  {
    title: 'Tendências de mercado',
    description: 'Identifique movimentos macro que favorecem ou ameaçam a ideia.',
    template: 'Tendências favoráveis:\n1. {tendencia_1}\n2. {tendencia_2}\n3. {tendencia_3}\n\nRiscos de mercado:\n1. {risco_1}',
    condition: (idea) => !!idea.market_analysis && idea.market_analysis.length > 50,
  },
  {
    title: 'Sinais de demanda',
    description: 'Registre evidências de que pessoas realmente querem isso.',
    template: 'Evidências de demanda coletadas:\n- {evidencia_1} (fonte: {fonte_1})\n- {evidencia_2} (fonte: {fonte_2})\n\nNúmero de pessoas entrevistadas: {num_entrevistas}\nTaxa de interesse: {taxa}%',
  },
];

// ─── Templates de perfil de cliente ───────────────────────────
const customerTemplates: { title: string; description: string; template: string }[] = [
  {
    title: 'Persona primária',
    description: 'Quem é exatamente a pessoa que mais sente essa dor?',
    template: 'Nome da persona: {nome}\nIdade: {idade}\nCargo/função: {cargo}\nRenda/faturamento: {renda}\n\nPrincipais dores:\n1. {dor_1}\n2. {dor_2}\n3. {dor_3}\n\nObjetivos:\n1. {objetivo_1}\n2. {objetivo_2}\n\nComo descobre soluções: {canais_descoberta}',
  },
  {
    title: 'Jornada do cliente',
    description: 'Mapa do momento da dor até a descoberta de uma solução.',
    template: '1. Despertar da dor: {etapa_1}\n2. Busca de solução: {etapa_2}\n3. Avaliação de opções: {etapa_3}\n4. Decisão de compra: {etapa_4}\n5. Pós-uso: {etapa_5}',
  },
  {
    title: 'Critérios de decisão',
    description: 'O que faz o cliente escolher uma solução em vez de outra?',
    template: 'Critérios por ordem de importância:\n1. {criterio_1} (peso: {peso_1}%)\n2. {criterio_2} (peso: {peso_2}%)\n3. {criterio_3} (peso: {peso_3}%)\n\nBarreira de entrada mais comum: {barreira}',
  },
];

// ─── Templates de modelo de negócio ───────────────────────────
const businessModelTemplates: { title: string; description: string; template: string }[] = [
  {
    title: 'Proposta de valor',
    description: 'Qual promessa única e mensurável você faz ao cliente?',
    template: 'Proposta de valor: "{promessa}"\n\nPara: {segmento_cliente}\nQue {dor_principal}\nNossa solução {beneficio_1} e {beneficio_2}\nDiferente de {alternativa}\nNós {diferencial_unico}',
  },
  {
    title: 'Modelo de precificação',
    description: 'Como você cobra e por quê?',
    template: 'Modelo: {modelo_preco} (ex: assinatura, por uso, freemium, one-time)\nFaixa de preço: R$ {preco_min} – R$ {preco_max}/{periodo}\nJustificativa: {justificativa_preco}',
  },
  {
    title: 'Canais de distribuição',
    description: 'Como o cliente descobre, avalia e adquire sua solução?',
    template: 'Descoberta: {canal_descoberta}\nAvaliação: {canal_avaliacao}\nCompra: {canal_compra}\nEntrega/onboarding: {canal_entrega}\nRetenção: {canal_retencao}',
  },
];

// ─── Templates de análise competitiva ─────────────────────────
const competitiveTemplates: { title: string; description: string; template: string }[] = [
  {
    title: 'Competidores diretos',
    description: 'Quem resolve o mesmo problema para o mesmo público?',
    template: 'Competidor 1: {nome_1} — diferencial: {diff_1}\nCompetidor 2: {nome_2} — diferencial: {diff_2}\nCompetidor 3: {nome_3} — diferencial: {diff_3}\n\nNossa vantagem: {vantagem}',
  },
  {
    title: 'Alternativas indiretas',
    description: 'Como o cliente resolve o problema HOJE sem uma solução dedicada?',
    template: 'Alternativa 1: {alt_1} (ex: planilha, agência, nada) — por que é insuficiente: {insuf_1}\nAlternativa 2: {alt_2} — por que é insuficiente: {insuf_2}',
  },
  {
    title: 'Barreiras de entrada e diferenciais',
    description: 'O que é difícil de copiar na sua solução?',
    template: 'Diferenciais sustentáveis:\n1. {dif_1}\n2. {dif_2}\n3. {dif_3}\n\nBarreira para competidores copiarem: {barreira}',
  },
];

// ─── Função principal de geração de sugestões ──────────────────
export function generateIntelligenceSuggestions(idea: Idea): IntelligenceSections {
  const problem = (idea.problem || '').toLowerCase();
  const solution = (idea.proposed_solution || '').toLowerCase();
  const audience = (idea.audience || '').toLowerCase();
  const description = (idea.description || '').toLowerCase();
  const combined = `${problem} ${solution} ${audience} ${description}`;

  // ─── Hipóteses sugeridas ────────────────────────────────────
  const hypothesisSuggestions: Suggestion[] = hypothesisTemplates
    .filter((tpl) => tpl.match(problem, solution))
    .slice(0, 2)
    .map((tpl, i) => ({
      id: `hyp-${i}`,
      section: 'hypothesis',
      title: tpl.templates[0].title,
      description: tpl.templates[0].description,
      template: tpl.templates[0].template,
      priority: i === 0 ? 'high' : 'medium',
    }));

  if (hypothesisSuggestions.length === 0 && (problem || solution)) {
    hypothesisSuggestions.push({
      id: 'hyp-generic',
      section: 'hypothesis',
      title: 'Hipótese genérica de valor',
      description: 'Transforme a ideia em uma afirmação testável sobre o que o cliente valoriza.',
      template: `Acreditamos que ${audience || 'o público-alvo'} que sofre com "${problem || 'este problema'}" está disposto a pagar por uma solução que ${solution || 'resolva essa dor'}, porque isso representa ${'uma economia de tempo, redução de custos ou menos frustração'}.`,
      priority: 'high',
    });
  }

  // ─── Sugestões de mercado ───────────────────────────────────
  const marketSuggestions: Suggestion[] = [];
  if (!idea.market_analysis || idea.market_analysis.length < 80) {
    marketSuggestions.push({
      id: 'market-1',
      section: 'market',
      title: 'Quantifique o mercado',
      description: 'Tente estimar TAM/SAM/SOM mesmo de forma aproximada. Números geram clareza.',
      template: `TAM (Brasil): Estime quantos ${audience || 'usuários/empresas'} existem no mercado alvo.\nSAM: Quantos você consegue alcançar com seus canais.\nSOM: Quantos você espera conquistar no primeiro ano.`,
      priority: 'high',
    });
  }
  if (!idea.market_analysis?.includes('evidência') && !idea.market_analysis?.includes('entrevista') && !idea.evidence) {
    marketSuggestions.push({
      id: 'market-2',
      section: 'market',
      title: 'Colete sinais de demanda',
      description: 'Nenhuma evidência de mercado registrada. Entrevistas e testes são o começo.',
      template: `Sinais de demanda:\n- Quais entrevistas ou conversas você já teve?\n- Quais números ou pesquisas apoiam esse problema?\n- Há pedidos, reclamações ou comentários públicos?`,
      priority: 'medium',
    });
  }

  // ─── Sugestões de cliente ───────────────────────────────────
  const customerSuggestions: Suggestion[] = [];
  if (!idea.customer_persona || idea.customer_persona.length < 80) {
    customerSuggestions.push({
      id: 'cust-1',
      section: 'customer',
      title: 'Defina a persona primária',
      description: 'Quem é exatamente a pessoa que mais sente essa dor? Seja específico.',
      template: `Persona: ${audience ? `"${audience}"` : 'Nome fictício'}\nIdade/cargo: ___\nRenda/faturamento: ___\nPrincipais dores:\n1. ${problem || '___'}\n2. ___\n3. ___\nComo descobre soluções: ___`,
      priority: 'high',
    });
  }
  if (!combined.includes('jornada') && !combined.includes('etapa') && !combined.includes('processo')) {
    customerSuggestions.push({
      id: 'cust-2',
      section: 'customer',
      title: 'Mapeie a jornada do cliente',
      description: 'Do despertar da dor até o pós-uso — cada etapa é uma oportunidade de intervenção.',
      template: `Jornada:\n1. Despertar da dor: ___\n2. Busca de solução: ___\n3. Avaliação de opções: ___\n4. Decisão de compra: ___\n5. Pós-uso: ___`,
      priority: 'medium',
    });
  }

  // ─── Sugestões de modelo de negócio ─────────────────────────
  const businessModelSuggestions: Suggestion[] = [];
  if (!idea.business_model_notes || idea.business_model_notes.length < 60) {
    businessModelSuggestions.push({
      id: 'biz-1',
      section: 'business_model',
      title: 'Defina a proposta de valor',
      description: 'Qual promessa única e mensurável você faz ao cliente?',
      template: `Proposta de valor:\nPara: ${audience || '[segmento]'}\nQue ${problem || '[dor principal]'}\nNossa solução ${solution || '[benefício]'}\nDiferente de [alternativa]\nNós [diferencial único]`,
      priority: 'high',
    });
  }
  if (!idea.business_model_notes?.includes('preço') && !idea.business_model_notes?.includes('R$') && !idea.business_model_notes?.includes('assinatura')) {
    businessModelSuggestions.push({
      id: 'biz-2',
      section: 'business_model',
      title: 'Pense no modelo de precificação',
      description: 'Como você cobra e por quê? Defina isso cedo para alinhar expectativas.',
      template: `Modelo de precificação:\nTipo: [assinatura / por uso / freemium / one-time]\nFaixa: R$ ___ – R$ ___\nJustificativa: Por que esse valor faz sentido para o público?`,
      priority: 'medium',
    });
  }

  // ─── Sugestões de análise competitiva ───────────────────────
  const competitiveSuggestions: Suggestion[] = [];
  if (!idea.competitive_analysis || idea.competitive_analysis.length < 60) {
    competitiveSuggestions.push({
      id: 'comp-1',
      section: 'competitive',
      title: 'Mapeie os competidores',
      description: 'Quem já resolve esse problema, mesmo que de forma imperfeita?',
      template: `Competidores diretos:\n1. [Nome] — o que fazem bem: ___, o que falta: ___\n2. [Nome] — o que fazem bem: ___, o que falta: ___\n\nAlternativas indiretas (planilhas, agências, "nada"):\n1. [Nome] — por que é insuficiente: ___`,
      priority: 'high',
    });
  }
  if (combined.includes('diferencial') || combined.includes('único')) {
    competitiveSuggestions.push({
      id: 'comp-2',
      section: 'competitive',
      title: 'Valide seu diferencial',
      description: 'Você mencionou diferenciais — verifique se são realmente únicos e valorizados.',
      template: 'Diferenciais declarados:\n1. [___] — o cliente realmente pagaria mais por isso?\n2. [___] — é fácil de copiar?\n3. [___] — como você protege isso?\n\nBarreira para competidores: ___',
      priority: 'medium',
    });
  }

  // ─── Insights inteligentes ──────────────────────────────────
  const smartInsights: Suggestion[] = [];

  if (!idea.evidence && !idea.curation_notes) {
    smartInsights.push({
      id: 'ins-1',
      section: 'insight',
      title: 'Comece a coletar evidências',
      description: 'Ideias sem evidências são apenas opiniões. Agende 5 entrevistas esta semana.',
      template: 'Plano de validação:\n1. [Entrevistar] 5 pessoas do público-alvo\n2. [Testar] problema com landing page ou formulário\n3. [Validar] solução com protótipo ou mockup\nPrazo: [data]',
      priority: 'high',
    });
  }

  if (idea.curation_score < 30 && (problem || solution)) {
    smartInsights.push({
      id: 'ins-2',
      section: 'insight',
      title: 'Aumente a confiança no dossiê',
      description: `A curadoria está em ${idea.curation_score}%. Valide ao menos 3 hipóteses antes de promover a projeto.`,
      template: 'Próximos passos para subir a curadoria:\n1. Validar hipótese de problema (entrevista)\n2. Validar hipótese de solução (protótipo)\n3. Validar hipótese de mercado (tamanho e tendências)\nMeta de curadoria: 70%+',
      priority: 'high',
    });
  }

  if (hypothesisSuggestions.length > 0 && !idea.market_analysis) {
    smartInsights.push({
      id: 'ins-3',
      section: 'insight',
      title: 'Conecte hipótese ao mercado',
      description: 'Você tem hipóteses interessantes. Agora valide se o mercado é grande o suficiente para justificar.',
      template: `Para cada hipótese, pergunte:\n- Quantas pessoas no Brasil sofrem desse problema?\n- Quanto elas pagariam para resolvê-lo?\n- Quem mais está tentando resolver isso?`,
      priority: 'medium',
    });
  }

  if ((idea.audience?.length || 0) > 3 && !idea.customer_persona) {
    smartInsights.push({
      id: 'ins-4',
      section: 'insight',
      title: 'Transforme público em persona',
      description: 'Você já tem um público-alvo. Agora aprofunde em comportamento, dores e jornada.',
      template: `A partir de "${idea.audience}", aprofunde:\n- Quem exatamente (cargo, idade, contexto)?\n- O que essa pessoa faz em um dia típico?\n- Quais ferramentas ela já usa?\n- O que a frustra no processo atual?`,
      priority: 'medium',
    });
  }

  if (idea.stage === 'capture' && (description || problem)) {
    smartInsights.push({
      id: 'ins-5',
      section: 'insight',
      title: 'Estruture a ideia antes de avançar',
      description: 'A ideia está em "Captura". Acesse a aba Inteligência para desenvolver hipóteses, mercado e cliente.',
      template: 'Checklist para sair de Captura:\n- [ ] Problema claramente definido\n- [ ] Público-alvo identificado\n- [ ] 2+ hipóteses formuladas\n- [ ] Análise de mercado iniciada\n- [ ] Persona do cliente esboçada',
      priority: 'medium',
    });
  }

  return {
    hypothesisSuggestions,
    marketSuggestions,
    customerSuggestions,
    businessModelSuggestions,
    competitiveSuggestions,
    smartInsights,
  };
}
