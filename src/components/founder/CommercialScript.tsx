import { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Copy,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

type ScriptBlock = {
  id: string;
  title: string;
  moment: string;
  channel: string;
  content: string;
};

const scripts: ScriptBlock[] = [
  {
    id: 'indicacao',
    title: 'Abordagem por indicação',
    moment: 'Primeiro contato',
    channel: 'WhatsApp',
    content: `Oi, [nome]. Tudo bem? O [indicador] comentou sobre a [empresa] e me chamou atenção [observação real sobre o negócio].\n\nEu ajudo empresas a organizar [área/problema percebido] para gerar mais oportunidades e não perder vendas por falta de estrutura.\n\nAntes de falar em qualquer solução, queria entender como vocês fazem isso hoje. Faz sentido uma conversa rápida de 20 minutos nesta semana?`,
  },
  {
    id: 'prospeccao',
    title: 'Prospecção direta',
    moment: 'Primeiro contato',
    channel: 'WhatsApp / LinkedIn',
    content: `Olá, [nome]. Tudo bem? Sou Fernando Ramalho, fundador da Orientohub.\n\nAo longo da minha trajetória, já atendi mais de 100 empresas de diversos segmentos e percebi algo em comum entre muitos empreendedores: a dificuldade de encontrar um parceiro estratégico que realmente entenda o negócio como um todo.\n\nFoi por isso que criei a Orientohub, um ecossistema completo de soluções empresariais. Para cada problema, existe uma solução — e nossa flexibilidade nos permite atuar na causa raiz, conectando estratégia e execução de acordo com a realidade de cada empresa.\n\nConheça: https://orientohub.com.br\n\nQuando surgir um desafio no seu negócio, pode contar comigo.`,
  },
  {
    id: 'reuniao',
    title: 'Abertura da reunião',
    moment: 'Diagnóstico',
    channel: 'Call / presencial',
    content: `Obrigado pelo tempo, [nome]. Minha ideia hoje não é apresentar a Orientohub nem tentar te vender um pacote. Quero entender como o negócio funciona, onde vocês querem chegar e o que está travando esse avanço.\n\nSe eu enxergar uma forma concreta de ajudar, no final eu te explico o caminho que recomendo. Se não fizer sentido, eu também vou te dizer. Combinado?`,
  },
  {
    id: 'fechamento',
    title: 'Transição para a oferta',
    moment: 'Fechamento',
    channel: 'Call / presencial',
    content: `Pelo que você me contou, o problema central não é [sintoma]. É [causa diagnosticada], e isso hoje está custando [impacto citado pelo cliente].\n\nMinha recomendação é começar por [serviço], porque ele resolve primeiro [prioridade] e cria a base para [resultado desejado].\n\nO escopo inicial inclui [entregáveis], acontece em [prazo] e o investimento é [valor]. Se iniciarmos até [data], conseguimos ter [primeiro marco] em [data]. Faz sentido avançarmos assim?`,
  },
  {
    id: 'followup',
    title: 'Follow-up da proposta',
    moment: 'Após proposta',
    channel: 'WhatsApp',
    content: `Oi, [nome]. Retomando nossa conversa: você comentou que [dor nas palavras do cliente] e que precisa [resultado desejado].\n\nA proposta que enviei foi desenhada justamente para sair de [estado atual] e chegar a [estado futuro], começando por [primeiro passo].\n\nFicou alguma dúvida sobre o caminho ou existe algo impedindo a decisão agora?`,
  },
  {
    id: 'reativacao',
    title: 'Reativação sem pressão',
    moment: 'Lead parado',
    channel: 'WhatsApp',
    content: `Oi, [nome]. Lembrei da nossa conversa sobre [problema]. Isso ainda é uma prioridade para a [empresa] ou o cenário mudou?\n\nEstou reorganizando os projetos deste mês e, se ainda fizer sentido, posso atualizar a recomendação com um primeiro passo mais enxuto.`,
  },
];

const diagnosticQuestions = [
  ['Contexto', 'Como a empresa gera clientes hoje? O que já funciona bem?'],
  ['Meta', 'Qual resultado vocês precisam alcançar nos próximos 90 dias?'],
  ['Problema', 'O que mais impede esse resultado hoje? Há quanto tempo?'],
  ['Impacto', 'O que esse problema custa em vendas, tempo ou oportunidades?'],
  ['Tentativas', 'O que vocês já tentaram e por que não resolveu?'],
  ['Decisão', 'Além de você, quem participa da decisão e o que precisa estar claro?'],
  ['Urgência', 'O que acontece se nada mudar nos próximos seis meses?'],
  ['Investimento', 'Existe uma faixa reservada para resolver essa prioridade?'],
];

const objections = [
  {
    title: '“Está caro.”',
    answer: 'Entendo. Caro em relação ao orçamento disponível ou ao retorno que ficou pouco claro? Quero separar as duas coisas. Pelo impacto que você citou, precisamos comparar o investimento com o custo de manter o problema. Se o escopo estiver grande, podemos começar pela etapa de maior retorno — sem desmontar a solução.',
  },
  {
    title: '“Preciso pensar.”',
    answer: 'Claro. Para eu não ficar fazendo follow-up sem contexto: o que exatamente você precisa avaliar — prioridade, confiança na solução, investimento ou alinhamento com outra pessoa? Posso ajudar a responder isso agora.',
  },
  {
    title: '“Vou falar com meu sócio.”',
    answer: 'Perfeito. O que ele precisa enxergar para se sentir seguro com a decisão? Se preferir, fazemos uma conversa curta juntos para que a análise não chegue até ele pela metade.',
  },
  {
    title: '“Agora não é o momento.”',
    answer: 'Entendi. O que precisaria acontecer para virar o momento certo? Pergunto porque adiar também mantém o impacto que você mencionou. Podemos definir uma data objetiva ou um primeiro passo menor.',
  },
  {
    title: '“Já tenho alguém que faz isso.”',
    answer: 'Ótimo — não quero substituir algo que funciona. Onde você sente que ainda existe uma lacuna? Podemos atuar em uma frente complementar, com objetivo e responsabilidade bem definidos.',
  },
];

const cadence = [
  ['D0', 'Enviar proposta no mesmo dia', 'Recapitule dor, impacto, resultado, escopo, prazo e próximo passo.'],
  ['D2', 'Confirmar entendimento', 'Pergunte se algo ficou pouco claro. Não envie apenas “viu a proposta?”.'],
  ['D5', 'Retomar a consequência', 'Use a dor nas palavras do cliente e responda uma possível objeção.'],
  ['D9', 'Adicionar valor', 'Envie uma observação, exemplo ou ação útil ligada ao diagnóstico.'],
  ['D14', 'Fechar o ciclo', 'Peça uma decisão honesta: avançar, reagendar ou encerrar por agora.'],
  ['D30', 'Reativar', 'Volte com contexto novo e verifique se a prioridade mudou.'],
];

const offerLadder = [
  ['Entrada rápida', 'Baixa fricção e resultado visível', 'Google Meu Negócio · Design · Naming · Domínio', 'R$ 40–450+'],
  ['Projeto de caixa', 'Resolve um gargalo comercial concreto', 'Site · E-commerce · Sistemas inteligentes', 'R$ 849–2.549+'],
  ['Receita recorrente', 'Execução contínua e previsibilidade', 'Marketing · Mídia paga', 'R$ 600–5.997/mês'],
  ['Expansão', 'Aprofunda a relação após confiança', 'Estratégia · Inovação · novas frentes', 'Sob diagnóstico'],
];

export const CommercialScript = () => {
  const [section, setSection] = useState<'scripts' | 'diagnostic' | 'objections' | 'cadence'>('scripts');
  const [copied, setCopied] = useState<string | null>(null);
  const [openObjection, setOpenObjection] = useState(0);

  const copyText = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="space-y-5" spellCheck={false}>
      <header className="overflow-hidden rounded-2xl border border-primary-400/20 bg-[#101722]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-300">Máquina de vendas · serviços primeiro</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-black text-white sm:text-3xl">Não apresente a plataforma. Revele o problema, quantifique o impacto e venda o próximo avanço.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#9ba9bc]">A Orientohub entra como parceira que diagnostica e executa. A plataforma é a infraestrutura que sustenta a entrega — uma prova de método, não o produto de abertura.</p>
          </div>
          <div className="rounded-2xl border border-primary-400/20 bg-primary-500/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-200">Regra de ouro</p>
            <p className="mt-2 text-lg font-bold leading-snug text-white">O cliente compra a travessia, não o ecossistema.</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary-100"><Target className="h-4 w-4" />Dor → impacto → prioridade → serviço → resultado</div>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[#273548] bg-[#101722] p-5">
        <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary-300" /><div><h3 className="font-bold text-white">Escada de ofertas para gerar caixa</h3><p className="text-xs text-[#9ba9bc]">Comece pequeno, prove valor e expanda a conta.</p></div></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {offerLadder.map(([name, purpose, offers, price], index) => (
            <article key={name} className="relative rounded-xl border border-[#273548] bg-[#151f2b] p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500 text-xs font-black text-[#0c121b]">{index + 1}</span>
              <h4 className="mt-3 font-bold text-white">{name}</h4><p className="mt-1 text-xs text-[#9ba9bc]">{purpose}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#d7e0ea]">{offers}</p><p className="mt-3 text-xs font-bold text-primary-300">{price}</p>
              {index < offerLadder.length - 1 && <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden h-5 w-5 text-primary-400 lg:block" />}
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#273548] bg-[#101722] p-2 sm:grid-cols-4" role="tablist" aria-label="Etapas do playbook comercial">
        {([
          ['scripts', 'Scripts', MessageCircle],
          ['diagnostic', 'Diagnóstico', ClipboardCheck],
          ['objections', 'Objeções', ShieldCheck],
          ['cadence', 'Cadência', RefreshCw],
        ] as const).map(([id, label, Icon]) => <button key={id} onClick={() => setSection(id)} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${section === id ? 'bg-primary-500 text-[#0c121b]' : 'text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}
      </div>

      {section === 'scripts' && <div className="grid gap-4 lg:grid-cols-2">{scripts.map((script) => <article key={script.id} className="flex flex-col rounded-2xl border border-[#273548] bg-[#101722] p-5"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><span className="rounded-md bg-primary-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-300">{script.moment}</span><span className="rounded-md bg-[#1d2938] px-2 py-1 text-[10px] font-semibold text-[#9ba9bc]">{script.channel}</span></div><h3 className="mt-3 text-lg font-bold text-white">{script.title}</h3></div><button onClick={() => copyText(script.id, script.content)} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#34455a] px-2.5 py-2 text-xs font-bold text-[#d7e0ea] hover:border-primary-400/50">{copied === script.id ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}{copied === script.id ? 'Copiado' : 'Copiar'}</button></div><p className="mt-4 flex-1 whitespace-pre-wrap rounded-xl bg-[#0c121b] p-4 text-sm leading-relaxed text-[#d7e0ea]">{script.content}</p></article>)}</div>}

      {section === 'diagnostic' && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><section className="rounded-2xl border border-[#273548] bg-[#101722] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary-300">Roteiro de descoberta</p><h3 className="mt-1 text-xl font-bold text-white">Pergunte, aprofunde e anote as palavras exatas</h3><div className="mt-5 space-y-2">{diagnosticQuestions.map(([label, question], index) => <div key={label} className="grid gap-2 rounded-xl border border-[#273548] bg-[#151f2b] p-4 sm:grid-cols-[32px_100px_1fr] sm:items-center"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-xs font-black text-primary-300">{index + 1}</span><span className="text-xs font-bold uppercase tracking-wide text-[#718096]">{label}</span><p className="text-sm text-[#d7e0ea]">{question}</p></div>)}</div></section><aside className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5"><Phone className="h-6 w-6 text-amber-300" /><h3 className="mt-3 text-lg font-bold text-white">Só apresente depois</h3><p className="mt-2 text-sm leading-relaxed text-[#9ba9bc]">Antes da oferta, você precisa conseguir completar estas frases:</p><div className="mt-4 space-y-3">{['O cliente quer…', 'Hoje ele perde…', 'A causa principal é…', 'A prioridade agora é…', 'A decisão depende de…'].map((item) => <p key={item} className="flex gap-2 text-sm text-[#d7e0ea]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />{item}</p>)}</div><div className="mt-5 rounded-xl bg-[#0c121b] p-3 text-xs leading-relaxed text-[#9ba9bc]">Se você ainda não sabe preencher uma delas, continue perguntando. Não faça demonstração da plataforma para compensar um diagnóstico incompleto.</div></aside></div>}

      {section === 'objections' && <section className="rounded-2xl border border-[#273548] bg-[#101722] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary-300">Objeção não é rejeição</p><h3 className="mt-1 text-xl font-bold text-white">Descubra o risco que o cliente ainda não resolveu</h3><div className="mt-5 space-y-2">{objections.map((item, index) => { const open = openObjection === index; return <article key={item.title} className="overflow-hidden rounded-xl border border-[#273548] bg-[#151f2b]"><button onClick={() => setOpenObjection(open ? -1 : index)} className="flex w-full items-center justify-between gap-3 p-4 text-left font-bold text-white"><span>{item.title}</span><ChevronDown className={`h-4 w-4 text-primary-300 transition ${open ? 'rotate-180' : ''}`} /></button>{open && <div className="border-t border-[#273548] p-4"><p className="text-sm leading-relaxed text-[#d7e0ea]">{item.answer}</p><button onClick={() => copyText(`objection-${index}`, item.answer)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-300">{copied === `objection-${index}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied === `objection-${index}` ? 'Copiado' : 'Copiar resposta'}</button></div>}</article>; })}</div></section>}

      {section === 'cadence' && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><section className="rounded-2xl border border-[#273548] bg-[#101722] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary-300">Régua de follow-up</p><h3 className="mt-1 text-xl font-bold text-white">Persistência com contexto, nunca cobrança vazia</h3><div className="mt-5 space-y-3">{cadence.map(([day, action, detail]) => <div key={day} className="flex gap-4 rounded-xl border border-[#273548] bg-[#151f2b] p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-xs font-black text-[#0c121b]">{day}</span><div><p className="font-bold text-white">{action}</p><p className="mt-1 text-sm text-[#9ba9bc]">{detail}</p></div></div>)}</div></section><aside className="space-y-4"><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5"><h3 className="font-bold text-emerald-200">Toda conversa termina com</h3><div className="mt-3 space-y-2 text-sm text-[#d7e0ea]">{['Próxima ação definida', 'Responsável nomeado', 'Data combinada', 'Critério de decisão claro'].map((item) => <p key={item} className="flex gap-2"><Check className="h-4 w-4 text-emerald-300" />{item}</p>)}</div></div><div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5"><h3 className="font-bold text-red-200">Nunca faça</h3><div className="mt-3 space-y-2 text-sm text-[#d7e0ea]">{['Abrir com tour da plataforma', 'Despejar todos os serviços', 'Dar preço antes de criar valor', 'Encerrar com “qualquer coisa me avisa”'].map((item) => <p key={item} className="flex gap-2"><X className="h-4 w-4 text-red-300" />{item}</p>)}</div></div></aside></div>}
    </div>
  );
};
