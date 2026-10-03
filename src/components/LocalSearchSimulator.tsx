import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, BarChart2, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Segmento = 'alimentacao' | 'beleza_saude' | 'automotivo' | 'servicos_locais' | 'varejo_fisico';
type Status = 'nenhum' | 'abandonado' | 'incompleto';

type FormState = {
  cep: string;
  segmento: Segmento | '';
  status: Status | '';
};

type ViaCEPResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
};

/* ─── Motor Heurístico ───────────────────────────────────────────────────── */

const MATRIZ_DIAGNOSTICO = {
  nenhum: {
    probabilidadeAtual: 2,
    raio: '0 metros',
    taxaFuga: 100,
    probabilidadeProjetada: 80,
    cenarioAtual: 'Invisibilidade algorítmica total nas buscas por proximidade.',
  },
  abandonado: {
    probabilidadeAtual: 15,
    raio: 'até 350 metros',
    taxaFuga: 82,
    probabilidadeProjetada: 82,
    cenarioAtual: 'Perfil passivo. Perfis completos e atualizados recebem até 7x mais cliques e capturam as buscas antes do seu negócio.',
  },
  incompleto: {
    probabilidadeAtual: 30,
    raio: 'até 800 metros',
    taxaFuga: 65,
    probabilidadeProjetada: 88,
    cenarioAtual: 'Perda frequente para perfis verificados e ativos com fotos atualizadas e horários precisos.',
  },
};

const SEGMENTOS_LABELS: Record<Segmento, string> = {
  alimentacao: 'Alimentação (Restaurante, Bar, Delivery)',
  beleza_saude: 'Saúde & Estética (Clínica, Salão, Barbearia)',
  automotivo: 'Automotivo (Oficina, Lava-rápido)',
  servicos_locais: 'Serviços Especializados (Escritório, Assistência)',
  varejo_fisico: 'Comércio Varejista (Loja Física, Depósito)',
};

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

/* ─── Main Component ─────────────────────────────────────────────────────── */

const LocalSearchSimulator = () => {
  const [form, setForm] = useState<FormState>({ cep: '', segmento: '', status: '' });
  const [step, setStep] = useState<'idle' | 'loading' | 'result'>('idle');
  const [loadingText, setLoadingText] = useState('');
  const [location, setLocation] = useState<{ bairro: string; cidade: string } | null>(null);
  const [cepError, setCepError] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, cep: formatCep(e.target.value) });
    setCepError(false);
  };

  const fetchCepData = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await response.json();
      if (data.erro) return null;
      return { bairro: data.bairro || 'Centro', cidade: data.localidade };
    } catch {
      return null;
    }
  };

  const canGenerate = form.cep.length === 9 && form.segmento !== '' && form.status !== '' && step !== 'loading';

  const handleSimulate = async () => {
    if (!canGenerate) return;
    
    setStep('loading');
    setLoadingText('Buscando dados da região...');
    
    const locData = await fetchCepData(form.cep);
    if (!locData) {
      setCepError(true);
      setStep('idle');
      return;
    }
    
    setLocation(locData);
    
    const steps = [
      `Mapeando densidade comercial em ${locData.bairro}...`,
      `Calculando raio de cobertura para ${SEGMENTOS_LABELS[form.segmento as Segmento]}...`,
      'Processando índice de concorrência no Local Pack...',
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('result');
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }, 800);
      }
    }, 800);
  };

  const handleReset = () => {
    setStep('idle');
    setLocation(null);
  };

  const stats = form.status ? MATRIZ_DIAGNOSTICO[form.status as Status] : MATRIZ_DIAGNOSTICO.nenhum;

  return (
    <section className="border-b border-[#273548] bg-[#0c121b]">
      <div className="container-custom py-12 sm:py-16">

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
              Simulador de Visibilidade Local
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Sua empresa aparece quando o cliente procura perto dele?
            </h2>
            <p className="mt-4 leading-relaxed text-[#9ba9bc]">
              No Google Maps, apenas os 3 primeiros perfis (Local Pack) capturam até 80% das ligações e cliques. 
              Descubra o potencial de captura da sua marca na sua região atualizando os pilares de Relevância, Distância e Proeminência.
            </p>
          </div>
          <LocalSimulatorSeal />
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[#273548] bg-[#101722] p-6 sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-3">
            {/* CEP */}
            <div>
              <label htmlFor="sim-cep" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
                CEP da Empresa
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ba9bc]" />
                <input
                  id="sim-cep"
                  type="text"
                  placeholder="00000-000"
                  maxLength={9}
                  value={form.cep}
                  onChange={handleCepChange}
                  disabled={step === 'loading'}
                  className={`w-full rounded-xl border bg-[#0c121b] py-3 pl-10 pr-4 text-sm text-white placeholder-[#9ba9bc]/40 outline-none transition focus:ring-1 disabled:opacity-50 ${
                    cepError 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-[#273548] focus:border-primary-400/60 focus:ring-primary-400/20'
                  }`}
                />
              </div>
              {cepError && (
                <p className="mt-1.5 text-[10px] font-semibold text-red-400">
                  CEP inválido ou não encontrado. Tente novamente.
                </p>
              )}
            </div>

            {/* Segmento */}
            <div>
              <label htmlFor="sim-segmento" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
                Nicho de Mercado
              </label>
              <CustomSelect
                id="sim-segmento"
                value={form.segmento}
                placeholder="Selecione seu segmento..."
                options={Object.entries(SEGMENTOS_LABELS).map(([val, label]) => ({ value: val, label }))}
                onChange={(val) => setForm({ ...form, segmento: val as Segmento })}
                disabled={step === 'loading'}
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="sim-status" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#9ba9bc]">
                Presença Atual no Google
              </label>
              <CustomSelect
                id="sim-status"
                value={form.status}
                placeholder="Selecione seu status..."
                options={[
                  { value: 'nenhum', label: 'Ainda não possuo perfil cadastrado' },
                  { value: 'abandonado', label: 'Criei um perfil básico, mas sem atualizações' },
                  { value: 'incompleto', label: 'Possuo perfil, mas não sei se está otimizado' },
                ]}
                onChange={(val) => setForm({ ...form, status: val as Status })}
                disabled={step === 'loading'}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSimulate}
              disabled={!canGenerate}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-6 py-3 text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <Search className="h-4 w-4" />
              Analisar Potencial de Captura Local
            </button>
          </div>
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
                <MapPin className="absolute inset-0 m-auto h-5 w-5 text-primary-300" />
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
          {step === 'result' && location && (
            <motion.div ref={resultRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
              
              {/* Header Diagnóstico */}
              <div className="rounded-t-2xl border border-b-0 border-[#273548] bg-[#151f2b] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-300" />
                      <h3 className="text-xl font-bold text-white">
                        Diagnóstico: {location.bairro}, {location.cidade}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-[#9ba9bc]">
                      Segmento: <span className="font-semibold text-[#d7e0ea]">{SEGMENTOS_LABELS[form.segmento as Segmento]}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-[#9ba9bc] hover:text-white transition"
                  >
                    Fazer nova consulta
                  </button>
                </div>
              </div>

              {/* Corpo Diagnóstico */}
              <div className="rounded-b-2xl border border-[#273548] bg-[#101722] p-6">
                
                {/* Barras de Índice */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#34455a] bg-[#0c121b] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9ba9bc]">Índice de Captura Atual</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-3xl font-black text-white">{stats.probabilidadeAtual}%</span>
                      <span className="mb-1 text-[10px] text-[#9ba9bc]">probabilidade no Top 3</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#273548]">
                      <div className="h-full rounded-full bg-[#9ba9bc]" style={{ width: `${stats.probabilidadeAtual}%` }} />
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl border border-primary-500/30 bg-primary-500/5 p-4">
                    <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary-500/20 blur-xl" />
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-300">Potencial Otimizado</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-3xl font-black text-white">{stats.probabilidadeProjetada}%</span>
                      <span className="mb-1 text-[10px] text-primary-300/80">probabilidade no Top 3</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#273548]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.probabilidadeProjetada}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary-400" 
                      />
                    </div>
                  </div>
                </div>

                {/* Raio e Comportamento */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                      <MapPin className="h-4 w-4 text-primary-300" /> Raio de Descoberta Comercial
                    </h4>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-lg border border-[#273548] bg-[#0c121b] p-3 text-sm">
                        <span className="block font-semibold text-[#9ba9bc]">Cenário Atual: {stats.raio}</span>
                        <span className="mt-1 block text-[#d7e0ea]">{stats.cenarioAtual}</span>
                      </div>
                      <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-3 text-sm">
                        <span className="block font-semibold text-primary-300">Cenário Otimizado: 3 a 7 km</span>
                        <span className="mt-1 block text-[#d7e0ea]">Com categorias secundárias corretas e geolocalização de imagens, o raio de relevância se expande cobrindo os principais eixos do município.</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                      <BarChart2 className="h-4 w-4 text-primary-300" /> Comportamento do Consumidor
                    </h4>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start gap-3 rounded-lg border border-[#273548] bg-[#0c121b] p-3 text-sm text-[#d7e0ea]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
                        <span>Perfis que contêm fotos recentes e dados precisos recebem até <strong className="text-white">7x mais solicitações de rota</strong> e <strong className="text-white">4x mais ligações</strong> pelo Google Maps.</span>
                      </li>
                      <li className="flex items-start gap-3 rounded-lg border border-[#273548] bg-[#0c121b] p-3 text-sm text-[#d7e0ea]">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                        <span>A cada 10 pessoas pesquisando na região, <strong className="text-white">{stats.taxaFuga}% tomam a decisão entre os concorrentes</strong> que aparecem no Top 3 do mapa.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Bloco Comercial */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 overflow-hidden rounded-2xl border border-primary-500/30 bg-gradient-to-b from-[#151f2b] to-[#101722]"
              >
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    Coloque sua marca no radar de quem já está procurando pelo seu serviço
                  </h3>
                  <p className="mt-3 leading-relaxed text-[#9ba9bc]">
                    Estar invisível no mapa custa vendas todos os dias para estabelecimentos próximos a você. 
                    A estruturação profissional do seu perfil resolve os pilares que o algoritmo exige para priorizar a sua empresa.
                  </p>
                  
                  <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <ul className="space-y-3">
                      {[
                        'Reivindicação e Verificação Oficial da posse no Google.',
                        'Alinhamento de Categorias & Atributos para ativar relevância máxima.',
                        'Curadoria e Upload Estruturado de Imagens otimizadas.',
                        'Integração de WhatsApp, links e horários sem ruído.',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#d7e0ea]">
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-[10px] font-bold text-primary-300">
                            {idx + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col justify-center rounded-xl border border-[#273548] bg-[#0c121b] p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#9ba9bc]">Investimento Único</p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-3xl font-black text-primary-300">R$ 249,00</span>
                      </div>
                      <p className="mt-1 text-[10px] text-[#9ba9bc]">* Sem cobranças recorrentes</p>
                      <p className="mt-4 text-[11px] font-medium leading-relaxed text-[#d7e0ea]">
                        Basta 1 a 2 novos clientes atraídos pelo mapa para a estruturação se pagar integralmente.
                      </p>
                      <Link
                        to={`/contato?origem=simulador-gmn&cep=${form.cep}&bairro=${location.bairro}&nicho=${form.segmento}&servico=google-meu-negocio-249`}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-5 py-3 text-sm font-bold text-black transition hover:bg-white"
                      >
                        Ativar Perfil no Google <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

const LocalSimulatorSeal = () => (
  <div className="mx-auto h-36 w-36 shrink-0 drop-shadow-[0_16px_24px_rgba(0,0,0,0.38)] sm:h-40 sm:w-40" aria-label="Simulador de visibilidade local 100% grátis">
    <svg viewBox="0 0 180 180" role="img" className="h-full w-full rotate-6">
      <defs>
        <radialGradient id="local-seal-metal" cx="34%" cy="24%" r="78%">
          <stop offset="0%" stopColor="#fffbd0" />
          <stop offset="18%" stopColor="#fff76a" />
          <stop offset="48%" stopColor="#FFF200" />
          <stop offset="76%" stopColor="#d0b900" />
          <stop offset="100%" stopColor="#766400" />
        </radialGradient>
        <linearGradient id="local-seal-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffbd5" />
          <stop offset="30%" stopColor="#9b8500" />
          <stop offset="55%" stopColor="#fff86b" />
          <stop offset="100%" stopColor="#665600" />
        </linearGradient>
        <path id="local-seal-path" d="M 90,90 m -65,0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0" />
      </defs>
      <circle cx="90" cy="90" r="84" fill="url(#local-seal-edge)" />
      <circle cx="90" cy="90" r="78" fill="url(#local-seal-metal)" stroke="#fff899" strokeWidth="1.5" />
      <circle cx="90" cy="90" r="59" fill="none" stroke="#241f00" strokeWidth="1.5" opacity="0.42" />
      <circle cx="90" cy="90" r="53" fill="#111111" stroke="#fff76a" strokeWidth="2" />
      <text fill="#111111" fontSize="10.5" fontWeight="900" letterSpacing="1.8">
        <textPath href="#local-seal-path" startOffset="1%">SIMULADOR LOCAL • VISIBILIDADE LOCAL • 100% GRÁTIS •</textPath>
      </text>
      <text x="90" y="75" textAnchor="middle" fill="#FFF200" fontSize="13" fontWeight="900" letterSpacing="1.5">LOCAL</text>
      <text x="90" y="101" textAnchor="middle" fill="#ffffff" fontSize="27" fontWeight="900">100%</text>
      <text x="90" y="119" textAnchor="middle" fill="#FFF200" fontSize="12" fontWeight="900" letterSpacing="2">GRÁTIS</text>
      <path d="M45 43 C70 20 113 18 139 42" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.38" />
    </svg>
  </div>
);

export default LocalSearchSimulator;
