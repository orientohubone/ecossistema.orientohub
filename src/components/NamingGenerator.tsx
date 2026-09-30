import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, ArrowRight, RotateCcw, Copy, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Sonoridade = 'curto' | 'classico' | 'moderno';

type NamingOption = {
  nome: string;
  tecnica: string;
  formula: string;
  racional: string;
  fonetica: string;
  rota: 1 | 2 | 3;
};

type FormState = {
  nicho: string;
  atributos: string;
  sonoridade: Sonoridade;
};

/* ─── Motor de Naming (lógica isolada) ───────────────────────────────────── */

const RADICAIS: Record<string, string[]> = {
  saude: ['san', 'sal', 'vita', 'med'],
  digital: ['dig', 'bit', 'net', 'flux'],
  negocio: ['corp', 'mer', 'com', 'ventor'],
  educacao: ['doc', 'sab', 'men', 'peda'],
  financas: ['fin', 'cap', 'aur', 'pecun'],
  tech: ['tec', 'inn', 'ver', 'syst'],
  design: ['form', 'vis', 'creat', 'est'],
  juridico: ['lex', 'jur', 'norm', 'arb'],
  default: ['orb', 'vers', 'iter', 'gen'],
};

const SUFIXOS: Record<Sonoridade, string[]> = {
  curto: ['ix', 'ex', 'us', 'or'],
  classico: ['um', 'ia', 'is', 'ium'],
  moderno: ['io', 'ly', 'fy', 'hub'],
};

const DOMINIOS_CRUZADOS = [
  { dominio: 'arquitetura', radicais: ['arc', 'vest', 'pier', 'pylon'] },
  { dominio: 'botânica', radicais: ['flora', 'rhiz', 'foli', 'sylv'] },
  { dominio: 'navegação', radicais: ['nav', 'rota', 'helm', 'stem'] },
  { dominio: 'física', radicais: ['kinet', 'flux', 'quant', 'ion'] },
];

const DOMAIN_KEYWORDS: [string, string][] = [
  ['saúde', 'saude'], ['clínica', 'saude'], ['médic', 'saude'], ['odonto', 'saude'],
  ['digital', 'digital'], ['software', 'digital'], ['app', 'digital'], ['tech', 'tech'],
  ['tecnol', 'tech'], ['financ', 'financas'], ['invest', 'financas'], ['contab', 'financas'],
  ['educ', 'educacao'], ['escola', 'educacao'], ['ensino', 'educacao'],
  ['design', 'design'], ['criativ', 'design'], ['visual', 'design'],
  ['juríd', 'juridico'], ['advocac', 'juridico'], ['direito', 'juridico'],
  ['negócio', 'negocio'], ['empresa', 'negocio'], ['consult', 'negocio'],
];

function seed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function detectDomain(nicho: string): string[] {
  const lower = nicho.toLowerCase();
  for (const [kw, key] of DOMAIN_KEYWORDS) {
    if (lower.includes(kw)) return RADICAIS[key];
  }
  return RADICAIS.default;
}

function gerarNomes(form: FormState): NamingOption[] {
  const s = seed(form.nicho + form.atributos + form.sonoridade);
  const radicais = detectDomain(form.nicho);
  const sufixos = SUFIXOS[form.sonoridade];
  const domCruz = DOMINIOS_CRUZADOS[s % DOMINIOS_CRUZADOS.length];

  // Rota 1: Aglutinação / Portmanteau
  const a1 = pick(radicais, s);
  const a2 = pick(radicais, s + 1);
  const nomeRota1 = capitalize(a1.slice(0, Math.ceil(a1.length / 2)) + a2.slice(Math.floor(a2.length / 2)));

  // Rota 2: Neologismo Derivacional
  const base2 = pick(radicais, s + 2);
  const suf2 = pick(sufixos, s + 3);
  const nomeRota2 = capitalize(base2 + suf2);

  // Rota 3: Deslocamento Semântico Metatópico
  const base3 = pick(domCruz.radicais, s + 4);
  const suf3 = pick(sufixos, s + 5);
  const nomeRota3 = capitalize(base3 + suf3);

  const sufLabel: Record<Sonoridade, string> = {
    curto: 'terminação sintética: precisão e corte',
    classico: 'desinência latina: autoridade e permanência',
    moderno: 'sufixo contemporâneo: agilidade e abstração',
  };

  return [
    {
      rota: 1,
      nome: nomeRota1,
      tecnica: 'Aglutinação · Portmanteau',
      formula: `"${capitalize(a1)}" (conceito A) ⊕ "${capitalize(a2)}" (conceito B) → fusão silábica balanceada`,
      racional: `A sobreposição de dois radicais semânticos do nicho cria uma palavra-marca única, com sonoridade própria e memória associativa ao território de atuação.`,
      fonetica: nomeRota1.length <= 6 ? 'Dissílabo · dicção limpa e memorável' : 'Trissílabo paroxítono · alta fluidez fonética',
    },
    {
      rota: 2,
      nome: nomeRota2,
      tecnica: 'Neologismo Derivacional',
      formula: `Radical "${capitalize(base2)}" + sufixo "-${suf2}" (${sufLabel[form.sonoridade]})`,
      racional: `O sufixo amplia o radical etimológico sem afastá-lo do nicho, gerando nomenclatura técnica recognoscível com carga semântica própria.`,
      fonetica: `${nomeRota2.length <= 5 ? 'Bissílabo' : 'Trissílabo'} · terminação "-${suf2}" favorece autoridade oral`,
    },
    {
      rota: 3,
      nome: nomeRota3,
      tecnica: `Deslocamento Semântico · ${capitalize(domCruz.dominio)}`,
      formula: `Radical de ${domCruz.dominio} ("${capitalize(base3)}") + sufixo "-${suf3}" → transposição de domínio cruzado`,
      racional: `Usar um radical de um domínio paralelo (${domCruz.dominio}) desloca a percepção da marca para um território de conotação mais rica, criando diferenciação por contraste semântico.`,
      fonetica: `${nomeRota3.length <= 6 ? 'Dissílabo' : 'Polissílabo moderado'} · consonância evocativa`,
    },
  ];
}

/* ─── Loading Steps ──────────────────────────────────────────────────────── */

const LOADING_STEPS = [
  'Decompondo conceitos semânticos...',
  'Mapeando étimos greco-latinos...',
  'Aplicando fórmulas morfológicas...',
  'Avaliando padrões fonéticos...',
  'Consolidando rotas construtivas...',
];

/* ─── Custom Select Component ────────────────────────────────────────────── */

function CustomSelect({
  id,
  value,
  options,
  placeholder,
  onChange,
  disabled,
}: {
  id?: string;
  value: string;
  options: { value: string; label: string }[];
  placeholder: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-xl border bg-[#0c121b] px-4 py-3 text-sm outline-none transition ${
          open ? 'border-primary-400/60 ring-1 ring-primary-400/20' : 'border-[#273548]'
        } ${!selectedOption ? 'text-[#9ba9bc]/40' : 'text-white'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#9ba9bc] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-[#273548] bg-[#0c121b] shadow-xl shadow-black/50"
          >
            <div className="max-h-60 overflow-y-auto p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    value === opt.value
                      ? 'bg-primary-500/10 font-bold text-primary-300'
                      : 'font-medium text-[#d7e0ea] hover:bg-[#151f2b] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── ResultCard ─────────────────────────────────────────────────────────── */

function ResultCard({ option, index }: { option: NamingOption; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(option.nome);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#273548] bg-[#0c121b]"
    >
      {/* Rota badge */}
      <div className="flex items-center justify-between border-b border-[#273548] bg-[#101722] px-5 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-300">
          Rota 0{option.rota}
        </span>
        <span className="max-w-[180px] truncate rounded-full border border-[#34455a] bg-[#0c121b] px-2.5 py-0.5 text-[10px] font-semibold text-[#9ba9bc]">
          {option.tecnica}
        </span>
      </div>

      {/* Nome + copiar */}
      <div className="flex items-center justify-between gap-3 px-5 py-5">
        <p className="text-3xl font-black tracking-tight text-white">{option.nome}</p>
        <button
          type="button"
          onClick={copy}
          aria-label="Copiar nome"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#273548] bg-[#151f2b] text-[#9ba9bc] transition hover:border-primary-400/40 hover:text-primary-300"
        >
          {copied ? <Check className="h-4 w-4 text-primary-300" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Detalhes */}
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="rounded-xl border border-[#273548] bg-[#151f2b] px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">
            Fórmula Morfológica
          </p>
          <p className="font-mono text-xs leading-relaxed text-[#d7e0ea]">{option.formula}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
            Racional Semântico
          </p>
          <p className="text-sm leading-relaxed text-[#d7e0ea]">{option.racional}</p>
        </div>
        <div className="mt-auto rounded-lg border border-[#273548] bg-[#101722] px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9ba9bc]">
            Índice Fonético:{' '}
          </span>
          <span className="text-[10px] text-[#d7e0ea]">{option.fonetica}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

const NamingGenerator = () => {
  const [form, setForm] = useState<FormState>({ nicho: '', atributos: '', sonoridade: 'curto' });
  const [step, setStep] = useState<'idle' | 'loading' | 'result'>('idle');
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
  const [results, setResults] = useState<NamingOption[]>([]);
  const [uses, setUses] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const MAX_USES = 3;
  const canGenerate =
    form.nicho.trim().length >= 5 &&
    form.atributos.trim().length >= 3 &&
    uses < MAX_USES &&
    step !== 'loading';

  const handleGenerate = () => {
    if (!canGenerate) return;
    setStep('loading');
    setUses((u) => u + 1);
    setLoadingText(LOADING_STEPS[0]);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < LOADING_STEPS.length) {
        setLoadingText(LOADING_STEPS[i]);
      } else {
        clearInterval(interval);
        setResults(gerarNomes(form));
        setStep('result');
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }, 520);
  };

  const handleReset = () => {
    setStep('idle');
    setResults([]);
  };

  return (
    <section className="border-b border-[#273548] bg-[#0c121b]">
      <div className="container-custom py-12 sm:py-16">

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
              Motor Simbólico de Naming
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Gere nomes de marca com rigor morfológico.
            </h2>
          </div>
          <p className="leading-relaxed text-[#9ba9bc]">
            Não é um sorteador aleatório. Aplicamos regras formais de morfologia, etimologia e
            semântica estrutural para construir 3 rotas distintas de naming a partir do seu briefing.
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[#273548] bg-[#101722] p-6 sm:p-8"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
            {/* Nicho */}
            <div className="lg:col-span-1">
              <label htmlFor="ng-nicho" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
                O que sua empresa faz?
              </label>
              <input
                id="ng-nicho"
                type="text"
                maxLength={100}
                placeholder="Ex.: Clínica odontológica de estética"
                value={form.nicho}
                onChange={(e) => setForm((f) => ({ ...f, nicho: e.target.value }))}
                disabled={step === 'loading'}
                className="w-full rounded-xl border border-[#273548] bg-[#0c121b] px-4 py-3 text-sm text-white placeholder-[#9ba9bc]/40 outline-none transition focus:border-primary-400/60 focus:ring-1 focus:ring-primary-400/20 disabled:opacity-50"
              />
            </div>

            {/* Atributos */}
            <div>
              <label htmlFor="ng-atributos" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
                Sensação desejada
              </label>
              <input
                id="ng-atributos"
                type="text"
                maxLength={80}
                placeholder="Ex.: Autoridade, precisão, sofisticação"
                value={form.atributos}
                onChange={(e) => setForm((f) => ({ ...f, atributos: e.target.value }))}
                disabled={step === 'loading'}
                className="w-full rounded-xl border border-[#273548] bg-[#0c121b] px-4 py-3 text-sm text-white placeholder-[#9ba9bc]/40 outline-none transition focus:border-primary-400/60 focus:ring-1 focus:ring-primary-400/20 disabled:opacity-50"
              />
            </div>

            {/* Sonoridade */}
            <div>
              <label htmlFor="ng-sonoridade" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
                Tipo de sonoridade
              </label>
              <CustomSelect
                id="ng-sonoridade"
                value={form.sonoridade}
                placeholder="Selecione..."
                options={[
                  { value: 'curto', label: 'Curto e direto' },
                  { value: 'classico', label: 'Clássico e imponente' },
                  { value: 'moderno', label: 'Moderno e abstrato' },
                ]}
                onChange={(val) => setForm((f) => ({ ...f, sonoridade: val as Sonoridade }))}
                disabled={step === 'loading'}
              />
            </div>

            {/* Botão */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                {uses >= MAX_USES ? 'Limite atingido' : 'Gerar nomes'}
              </button>
            </div>
          </div>

          {uses > 0 && (
            <p className="mt-3 text-right text-[10px] text-[#9ba9bc]">
              {MAX_USES - uses} {MAX_USES - uses === 1 ? 'geração restante' : 'gerações restantes'}
            </p>
          )}
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {step === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-center gap-5 rounded-2xl border border-[#273548] bg-[#101722] py-12"
            >
              <div className="relative h-12 w-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                  className="h-12 w-12 rounded-full border-2 border-[#273548] border-t-primary-300"
                />
                <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-primary-300" />
              </div>
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-sm text-[#9ba9bc]"
              >
                ⏳ {loadingText}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        <AnimatePresence>
          {step === 'result' && results.length > 0 && (
            <motion.div ref={resultRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">

              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-300">
                  3 rotas morfológicas geradas
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#9ba9bc] transition hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Novo briefing
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {results.map((opt, i) => (
                  <ResultCard key={opt.rota} option={opt} index={i} />
                ))}
              </div>

              {/* Aviso INPI */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-5 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-xs leading-relaxed text-[#d7e0ea]">
                  <span className="font-bold text-amber-300">Diagnóstico de Viabilidade: </span>
                  Nomes construídos morfologicamente reduzem atrito fonético, mas exigem checagem de
                  anterioridade na base do INPI — marcas idênticas e colidência fonética na Classe
                  Nice correspondente — para garantir exclusividade e registro legal.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 rounded-2xl border border-[#273548] bg-[#101722] p-6"
              >
                <p className="text-sm font-semibold text-white">Gostou de alguma das direções?</p>
                <p className="mt-2 text-sm leading-relaxed text-[#9ba9bc]">
                  Um bom nome é apenas 20% do processo. O maior risco é investir em identidade visual
                  para depois ser notificado por colidência fonética no INPI.
                </p>
                <ul className="mt-4 space-y-1.5">
                  {[
                    'Briefing aprofundado de posicionamento',
                    'Busca formal de anterioridade no INPI (Classes Nice)',
                    'Relatório de risco jurídico e viabilidade de registro',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#d7e0ea]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-col items-start gap-3 border-t border-[#273548] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-2xl font-black text-primary-300">
                    R$ 349,00
                    <span className="ml-2 text-sm font-semibold text-[#9ba9bc]">· análise completa</span>
                  </p>
                  <Link
                    to="/contato?service=Naming&message=Ol%C3%A1%2C%20gostaria%20de%20contratar%20a%20an%C3%A1lise%20completa%20de%20Naming%20%26%20Viabilidade%20INPI."
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400"
                  >
                    Contratar análise completa <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default NamingGenerator;
