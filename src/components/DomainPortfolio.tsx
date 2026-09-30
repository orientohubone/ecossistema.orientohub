import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe2,
  Server,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Terminal,
  Zap,
  Link2,
  ArrowRight,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type RecordType = 'A' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'AAAA' | 'DKIM' | 'SPF';

type DnsRecord = {
  type: RecordType;
  name: string;
  value: string;
  ttl: string;
  priority?: number;
  note?: string;
};

type DnsGroup = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  domain: string;
  records: DnsRecord[];
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const dnsGroups: DnsGroup[] = [
  {
    id: 'hosting',
    label: 'Apontamento de hospedagem',
    Icon: Server,
    description: 'Conecta o domínio ao servidor ou CDN onde o site está hospedado.',
    domain: 'intentia.com.br',
    records: [
      { type: 'A',     name: '@',   value: '76.76.21.21',          ttl: 'Auto', note: 'Vercel' },
      { type: 'A',     name: 'www', value: '76.76.21.21',          ttl: 'Auto', note: 'Vercel' },
      { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', ttl: '3600' },
    ],
  },
  {
    id: 'email',
    label: 'Configuração de e-mail',
    Icon: Mail,
    description: 'Direciona e-mails para o provedor certo e garante entregabilidade.',
    domain: 'humansys.com.br',
    records: [
      { type: 'MX',  name: '@', value: 'aspmx.l.google.com',      ttl: '3600', priority: 1,  note: 'Google Workspace' },
      { type: 'MX',  name: '@', value: 'alt1.aspmx.l.google.com', ttl: '3600', priority: 5 },
      { type: 'MX',  name: '@', value: 'alt2.aspmx.l.google.com', ttl: '3600', priority: 10 },
      { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: '3600', note: 'SPF' },
    ],
  },
  {
    id: 'dkim',
    label: 'Autenticação DKIM & DMARC',
    Icon: ShieldCheck,
    description: 'Impede falsificação de identidade e melhora a reputação do e-mail.',
    domain: 'fernandoramalhobuilder.com.br',
    records: [
      { type: 'DKIM', name: 'google._domainkey', value: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A…', ttl: '3600' },
      { type: 'TXT',  name: '_dmarc',            value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@intentia.com.br', ttl: '3600' },
      { type: 'SPF',  name: '@',                 value: 'v=spf1 include:_spf.google.com include:sendgrid.net ~all', ttl: '3600' },
    ],
  },
  {
    id: 'subdomain-dns',
    label: 'Subdomínios via CNAME',
    Icon: Layers,
    description: 'Segmenta serviços, ferramentas e produtos em endereços próprios.',
    domain: 'orientohub.com.br',
    records: [
      { type: 'CNAME', name: 'consultoria',       value: 'cname.vercel-dns.com',                     ttl: 'Auto', note: 'Produto' },
      { type: 'CNAME', name: 'radartech',         value: 'cname.vercel-dns.com',                     ttl: 'Auto', note: 'Produto' },
      { type: 'CNAME', name: 'siteparapsicologa', value: 'cname.vercel-dns.com',                     ttl: 'Auto', note: 'Cliente' },
      { type: 'CNAME', name: 'api',               value: 'api.orientohub.com.br.cdn.cloudflare.net', ttl: 'Auto', note: 'API' },
    ],
  },
  {
    id: 'cdn',
    label: 'Cloudflare & CDN',
    Icon: Zap,
    description: 'Proxy com CDN global, SSL automático e proteção DDoS.',
    domain: 'studio.intentia.com.br',
    records: [
      { type: 'A',    name: '@',   value: '104.21.XX.XX',         ttl: 'Auto', note: 'Proxied' },
      { type: 'A',    name: 'www', value: '172.67.XX.XX',         ttl: 'Auto', note: 'Proxied' },
      { type: 'AAAA', name: '@',   value: '2606:4700::6815:XXXX', ttl: 'Auto', note: 'IPv6' },
    ],
  },
  {
    id: 'verification',
    label: 'Verificação de propriedade',
    Icon: CheckCircle2,
    description: 'Registros TXT para comprovar posse do domínio em diversas plataformas.',
    domain: 'intentia.com.br',
    records: [
      { type: 'TXT', name: '@',        value: 'google-site-verification=xXxXxXxXxXxXxXxX', ttl: '3600', note: 'Google' },
      { type: 'TXT', name: '_vercel',  value: 'vc-domain-verify=intentia.com.br,XXXXXXXXXX', ttl: '3600', note: 'Vercel' },
      { type: 'TXT', name: '_atproto', value: 'did=did:plc:XXXXXXXXXXXXXXXX',                ttl: '3600', note: 'Bluesky' },
    ],
  },
];

const subdomainUseCases = [
  { prefix: 'consultoria.',       domain: 'orientohub.com.br', purpose: 'Landing page dedicada a conversão', Icon: Link2 },
  { prefix: 'radartech.',         domain: 'orientohub.com.br', purpose: 'Portal de notícias e tecnologia',    Icon: Zap },
  { prefix: 'studio.',            domain: 'intentia.com.br',   purpose: 'Braço separado da marca principal', Icon: Layers },
  { prefix: 'app.',               domain: 'orientohub.com.br', purpose: 'Ambiente de usuário logado',        Icon: Terminal },
  { prefix: 'api.',               domain: 'orientohub.com.br', purpose: 'Endpoint para integrações externas',Icon: Link2 },
  { prefix: 'siteparapsicologa.', domain: 'orientohub.com.br', purpose: 'Site de demonstração em subdomínio',     Icon: Globe2 },
];

const domainPortfolio = [
  { domain: 'intentia.com.br',                     platform: 'Registro.br', category: 'Estratégia B2B' },
  { domain: 'humansys.com.br',                     platform: 'Registro.br', category: 'RH & Cultura' },
  { domain: 'studio.intentia.com.br',              platform: 'Cloudflare',  category: 'Subdomínio Estratégico' },
  { domain: 'fernandoramalhobuilder.com.br',       platform: 'Registro.br', category: 'Marca Pessoal' },
  { domain: 'radartech.orientohub.com.br',         platform: 'Cloudflare',  category: 'Portal de Tecnologia' },
  { domain: 'siteparapsicologa.orientohub.com.br', platform: 'Cloudflare',  category: 'Demonstração' },
  { domain: 'consultoria.orientohub.com.br',       platform: 'Cloudflare',  category: 'Serviço' },
  { domain: 'orientohub.com.br',                   platform: 'Cloudflare',  category: 'Hub Principal' },
];

/* ─── Flip Card ──────────────────────────────────────────────────────────── */

const DnsGroupCard = ({ group, index }: { group: DnsGroup; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const { Icon } = group;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.06 }}
      className="h-72"
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={group.label}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped((v) => !v)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        className="relative h-full w-full cursor-pointer outline-none"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── Frente ──────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-[#273548] bg-[#101722] p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#273548] bg-[#0c121b]">
              <Icon className="h-5 w-5 text-primary-300" />
            </span>
            <p className="mt-5 text-base font-bold text-white">{group.label}</p>
            <p className="mt-1 font-mono text-xs text-[#9ba9bc]">{group.domain}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-[#273548] bg-[#0c121b] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#9ba9bc]">
              {group.records.length} registros
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ba9bc]">
              <MousePointer2 className="h-3 w-3" /> ver registros
            </span>
          </div>
        </div>

        {/* ── Verso (amarelo) ─────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-primary-400 p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-black">{group.label}</p>
            <Icon className="h-4 w-4 text-black/40" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            {group.records.map((record, i) => (
              <div
                key={i}
                className="grid grid-cols-[auto_1fr] gap-x-2.5 rounded-lg bg-black/20 px-2.5 py-2 font-mono text-[11px]"
              >
                <span className="font-black text-black">{record.type}</span>
                <div className="min-w-0">
                  <span className="block truncate font-bold text-black">{record.name}</span>
                  <span className="block truncate text-black/70">{record.value}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-black/20 pt-2.5 text-[10px] font-medium leading-relaxed text-black/70">
            {group.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};


/* ─── Main Component ─────────────────────────────────────────────────────── */

const DomainPortfolio = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState<number[]>([0]);
  const hasMultiple = positions.length > 1;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const slides = Array.from(track.children) as HTMLElement[];
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const next = slides.reduce<number[]>((acc, slide) => {
        const pos = Math.min(slide.offsetLeft - slides[0].offsetLeft, maxScroll);
        if (!acc.length || pos - acc[acc.length - 1] > 1) acc.push(pos);
        return acc;
      }, []);
      setPositions(next);
      setActiveIndex(next.reduce((closest, pos, i) =>
        Math.abs(pos - track.scrollLeft) < Math.abs(next[closest] - track.scrollLeft) ? i : closest, 0));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + positions.length) % positions.length;
    track.scrollTo({ left: positions[next], behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Seção 1: Registros DNS ──────────────────────────────────── */}
      <section className="border-b border-[#273548] bg-[#101722]">
        <div className="container-custom py-12 sm:py-16">
          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-end justify-between gap-5"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
                Configurações DNS na prática
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Cada tipo de registro tem uma função.
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'DKIM', 'SPF', 'NS'].map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center rounded border border-[#34455a] bg-[#0c121b] px-2 py-1 font-mono text-[10px] font-bold text-[#d7e0ea]"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            {hasMultiple && (
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Card anterior" className="rounded-full border border-[#34455a] p-3 text-white transition hover:border-primary-400 hover:bg-primary-400/10">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Próximo card" className="rounded-full border border-[#34455a] p-3 text-white transition hover:border-primary-400 hover:bg-primary-400/10">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Carrossel */}
          <div
            ref={trackRef}
            onScroll={(e) => {
              const t = e.currentTarget;
              setActiveIndex(positions.reduce((closest, pos, i) =>
                Math.abs(pos - t.scrollLeft) < Math.abs(positions[closest] - t.scrollLeft) ? i : closest, 0));
            }}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {dnsGroups.map((group, index) => (
              <div
                key={group.id}
                className="w-full min-w-0 shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
                style={{ perspective: '1200px', overflow: 'visible' }}
              >
                <DnsGroupCard group={group} index={index} />
              </div>
            ))}
          </div>

          {/* Dots */}
          {hasMultiple && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {positions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Card ${i + 1}`}
                  aria-current={activeIndex === i ? 'true' : undefined}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                >
                  <span className={`h-2 rounded-full transition-all ${activeIndex === i ? 'w-6 bg-primary-300' : 'w-2 bg-[#34455a]'}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Seção 2: Subdomínios ────────────────────────────────────── */}
      <section className="border-b border-[#273548] bg-[#0c121b]">
        <div className="container-custom py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
                Arquitetura de subdomínios
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Subdomínios para finalidades estratégicas.
              </h2>
            </div>
            <p className="leading-relaxed text-[#9ba9bc]">
              Um subdomínio bem posicionado separa contextos, protege a marca principal e cria
              pontos de entrada independentes para produtos, serviços e campanhas.
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subdomainUseCases.map((item, index) => {
              const { Icon } = item;
              return (
                <motion.div
                  key={item.prefix}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 rounded-2xl border border-[#273548] bg-[#101722] p-5 transition hover:border-primary-400/40"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#273548] bg-[#0c121b]">
                    <Icon className="h-4 w-4 text-primary-300" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-sm">
                      <span className="font-bold text-primary-300">{item.prefix}</span>
                      <span className="text-[#9ba9bc]">{item.domain}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#d7e0ea]">{item.purpose}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Isolamento de produto',      desc: 'Cada produto ou serviço ganha sua própria URL, sem poluir o domínio raiz.' },
              { title: 'Rastreamento independente',  desc: 'Analytics e pixels separados por subdomínio permitem medir cada frente com precisão.' },
              { title: 'Flexibilidade de hospedagem',desc: 'Cada subdomínio pode apontar para um servidor ou CDN diferente.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3 rounded-xl border border-[#273548] bg-[#151f2b] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
                <div>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#9ba9bc]">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 3: Portfólio de domínios ─────────────────────────── */}
      <section className="border-b border-[#273548] bg-[#101722]">
        <div className="container-custom py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
              Portfólio de domínios gerenciados
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              Domínios que registramos e apontamos.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[#9ba9bc]">
              Do Registro.br ao Cloudflare — cada propriedade gerenciada com atenção ao detalhe.
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {domainPortfolio.map((item, index) => (
              <motion.div
                key={item.domain}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: index * 0.04 }}
                className="group rounded-xl border border-[#273548] bg-[#0c121b] p-4 transition hover:border-primary-400/30"
              >
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff605c]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#ffbd44]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#00ca4e]" aria-hidden="true" />
                </div>

                <div className="flex items-start gap-2">
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-semibold text-white">{item.domain}</p>
                    <p className="mt-1 text-xs text-[#9ba9bc]">{item.category}</p>
                  </div>
                </div>

                <div className="mt-3 border-t border-[#273548] pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-300">
                    {item.platform}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ba9bc]">
              Plataformas que operamos:
            </p>
            {['Registro.br', 'Cloudflare', 'GoDaddy', 'Namecheap', 'AWS Route 53', 'Hostgator', 'Locaweb'].map((p) => (
              <span key={p} className="rounded-full border border-[#34455a] bg-[#151f2b] px-3 py-1 text-xs font-semibold text-[#d7e0ea]">
                {p}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-primary-400/20 bg-primary-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-semibold text-[#d7e0ea]">
              Precisa organizar seus domínios, e-mails ou subdomínios?
            </p>
            <a
              href="/contato"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-[#0c121b] transition hover:bg-primary-400"
            >
              Falar com a OrientoHub <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DomainPortfolio;
