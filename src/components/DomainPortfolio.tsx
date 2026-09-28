import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2,
  Server,
  Mail,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Terminal,
  Zap,
  Link2,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────────────── */

const domainPortfolio = [
  { domain: 'intentia.com.br',              platform: 'Registro.br',   category: 'Estratégia B2B' },
  { domain: 'humansys.com.br',              platform: 'Registro.br',   category: 'RH & Cultura' },
  { domain: 'studio.intentia.com.br',       platform: 'Cloudflare',    category: 'Subdomínio Estratégico' },
  { domain: 'fernandoramalhobuilder.com.br',platform: 'Registro.br',   category: 'Marca Pessoal' },
  { domain: 'radartech.orientohub.com.br',  platform: 'Cloudflare',    category: 'Subdomínio Produto' },
  { domain: 'siteparapsicologa.orientohub.com.br', platform: 'Cloudflare', category: 'Subdomínio Cliente' },
  { domain: 'consultoria.orientohub.com.br',platform: 'Cloudflare',    category: 'Subdomínio Serviço' },
  { domain: 'orientohub.com.br',            platform: 'Cloudflare',    category: 'Hub Principal' },
];

type RecordType = 'A' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'AAAA' | 'DKIM' | 'SPF';

type DnsRecord = {
  type: RecordType;
  name: string;
  value: string;
  ttl: string;
  priority?: number;
  tag?: string;
  tagColor?: string;
};

type DnsGroup = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  description: string;
  domain: string;
  records: DnsRecord[];
};

const dnsGroups: DnsGroup[] = [
  {
    id: 'hosting',
    label: 'Apontamento de Hospedagem',
    Icon: Server,
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    description: 'Conecta o domínio ao servidor ou CDN onde o site está hospedado.',
    domain: 'intentia.com.br',
    records: [
      { type: 'A',     name: '@',   value: '76.76.21.21',          ttl: 'Auto', tag: 'Vercel', tagColor: 'text-white bg-black/60' },
      { type: 'A',     name: 'www', value: '76.76.21.21',          ttl: 'Auto', tag: 'Vercel', tagColor: 'text-white bg-black/60' },
      { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com', ttl: '3600' },
    ],
  },
  {
    id: 'email',
    label: 'Configuração de E-mail',
    Icon: Mail,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    description: 'Direciona e-mails para o provedor certo e garante entregabilidade.',
    domain: 'humansys.com.br',
    records: [
      { type: 'MX',  name: '@', value: 'aspmx.l.google.com',        ttl: '3600', priority: 1,  tag: 'Google Workspace', tagColor: 'text-blue-200 bg-blue-500/20' },
      { type: 'MX',  name: '@', value: 'alt1.aspmx.l.google.com',   ttl: '3600', priority: 5 },
      { type: 'MX',  name: '@', value: 'alt2.aspmx.l.google.com',   ttl: '3600', priority: 10 },
      { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: '3600', tag: 'SPF', tagColor: 'text-emerald-200 bg-emerald-500/20' },
    ],
  },
  {
    id: 'dkim',
    label: 'Autenticação DKIM & DMARC',
    Icon: ShieldCheck,
    color: 'text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    description: 'Impede falsificação de identidade e melhora a reputação do e-mail.',
    domain: 'fernandoramalhobuilder.com.br',
    records: [
      { type: 'DKIM', name: 'google._domainkey', value: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A…', ttl: '3600', tag: 'DKIM', tagColor: 'text-violet-200 bg-violet-500/20' },
      { type: 'TXT',  name: '_dmarc',            value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@intentia.com.br', ttl: '3600', tag: 'DMARC', tagColor: 'text-pink-200 bg-pink-500/20' },
      { type: 'SPF',  name: '@',                 value: 'v=spf1 include:_spf.google.com include:sendgrid.net ~all', ttl: '3600' },
    ],
  },
  {
    id: 'subdomain',
    label: 'Subdomínios Estratégicos',
    Icon: Layers,
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    description: 'Segmenta serviços, ferramentas e produtos em endereços próprios.',
    domain: 'orientohub.com.br',
    records: [
      { type: 'CNAME', name: 'consultoria',       value: 'cname.vercel-dns.com', ttl: 'Auto', tag: 'Produto',  tagColor: 'text-amber-200 bg-amber-500/20' },
      { type: 'CNAME', name: 'radartech',         value: 'cname.vercel-dns.com', ttl: 'Auto', tag: 'Produto',  tagColor: 'text-amber-200 bg-amber-500/20' },
      { type: 'CNAME', name: 'siteparapsicologa', value: 'cname.vercel-dns.com', ttl: 'Auto', tag: 'Cliente',  tagColor: 'text-cyan-200 bg-cyan-500/20' },
      { type: 'CNAME', name: 'app',               value: 'cname.vercel-dns.com', ttl: 'Auto', tag: 'App',      tagColor: 'text-blue-200 bg-blue-500/20' },
      { type: 'CNAME', name: 'api',               value: 'api.orientohub.com.br.cdn.cloudflare.net', ttl: 'Auto', tag: 'API', tagColor: 'text-orange-200 bg-orange-500/20' },
    ],
  },
  {
    id: 'cdn',
    label: 'Cloudflare & CDN',
    Icon: Zap,
    color: 'text-orange-300',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    description: 'Proxy com CDN global, SSL automático e proteção DDoS.',
    domain: 'studio.intentia.com.br',
    records: [
      { type: 'A',    name: '@',   value: '104.21.XX.XX',        ttl: 'Auto', tag: 'Proxied', tagColor: 'text-orange-200 bg-orange-500/20' },
      { type: 'A',    name: 'www', value: '172.67.XX.XX',        ttl: 'Auto', tag: 'Proxied', tagColor: 'text-orange-200 bg-orange-500/20' },
      { type: 'AAAA', name: '@',   value: '2606:4700::6815:XXXX',ttl: 'Auto', tag: 'IPv6',    tagColor: 'text-sky-200 bg-sky-500/20' },
    ],
  },
  {
    id: 'verification',
    label: 'Verificação de Propriedade',
    Icon: CheckCircle2,
    color: 'text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    description: 'Registros TXT para comprovar posse do domínio em diversas plataformas.',
    domain: 'intentia.com.br',
    records: [
      { type: 'TXT', name: '@',       value: 'google-site-verification=xXxXxXxXxXxXxXxX',  ttl: '3600', tag: 'Search Console', tagColor: 'text-blue-200 bg-blue-500/20' },
      { type: 'TXT', name: '_vercel', value: 'vc-domain-verify=intentia.com.br,XXXXXXXXXX',  ttl: '3600', tag: 'Vercel',         tagColor: 'text-white bg-black/60' },
      { type: 'TXT', name: '_atproto',value: 'did=did:plc:XXXXXXXXXXXXXXXX',                 ttl: '3600', tag: 'Bluesky',        tagColor: 'text-sky-200 bg-sky-500/20' },
    ],
  },
];

const subdomainUseCases = [
  { prefix: 'consultoria.',       domain: 'orientohub.com.br', purpose: 'Landing page dedicada a conversão',                    Icon: ArrowUpRight, color: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25' },
  { prefix: 'radartech.',         domain: 'orientohub.com.br', purpose: 'Produto SaaS próprio com acesso direto',               Icon: Zap,          color: 'text-cyan-300',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25' },
  { prefix: 'studio.',            domain: 'intentia.com.br',   purpose: 'Braço de design separado da marca principal',          Icon: Layers,       color: 'text-violet-300',  bg: 'bg-violet-500/10',  border: 'border-violet-500/25' },
  { prefix: 'app.',               domain: 'orientohub.com.br', purpose: 'Acesso ao ambiente de usuário logado',                 Icon: Terminal,     color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  { prefix: 'api.',               domain: 'orientohub.com.br', purpose: 'Endpoint de API para integrações externas',           Icon: Link2,        color: 'text-sky-300',     bg: 'bg-sky-500/10',     border: 'border-sky-500/25' },
  { prefix: 'siteparapsicologa.', domain: 'orientohub.com.br', purpose: 'Site de cliente hospedado em subdomínio',              Icon: Globe2,       color: 'text-pink-300',    bg: 'bg-pink-500/10',    border: 'border-pink-500/25' },
];

const recordTypeColor: Record<string, string> = {
  A:     'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
  AAAA:  'bg-sky-500/20 text-sky-200 border-sky-500/40',
  CNAME: 'bg-violet-500/20 text-violet-200 border-violet-500/40',
  MX:    'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  TXT:   'bg-amber-500/20 text-amber-200 border-amber-500/40',
  NS:    'bg-orange-500/20 text-orange-200 border-orange-500/40',
  DKIM:  'bg-pink-500/20 text-pink-200 border-pink-500/40',
  SPF:   'bg-lime-500/20 text-lime-200 border-lime-500/40',
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const RecordRow = ({ record }: { record: DnsRecord }) => (
  <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-3 gap-y-1 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 font-mono text-xs">
    <span className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${recordTypeColor[record.type] ?? 'bg-gray-500/20 text-gray-200 border-gray-500/40'}`}>
      {record.type}
    </span>
    <div className="min-w-0">
      <span className="block truncate font-semibold text-white/90">{record.name}</span>
      <span className="block truncate text-[#9ba9bc]">{record.value}</span>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-1">
      <span className="text-[10px] text-[#9ba9bc]">TTL {record.ttl}</span>
      {record.priority !== undefined && (
        <span className="text-[10px] text-[#9ba9bc]">Pri {record.priority}</span>
      )}
      {record.tag && (
        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${record.tagColor}`}>
          {record.tag}
        </span>
      )}
    </div>
  </div>
);

const DnsGroupCard = ({ group, index }: { group: DnsGroup; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  const { Icon } = group;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.06 }}
      className={`overflow-hidden rounded-2xl border bg-[#0c121b] ${group.border}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/[0.02]"
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${group.border} ${group.bg}`}>
          <Icon className={`h-5 w-5 ${group.color}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${group.color}`}>
            {group.label}
          </p>
          <p className="mt-0.5 truncate font-mono text-xs text-[#9ba9bc]">{group.domain}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${group.border} ${group.bg} ${group.color}`}>
          {group.records.length} registros
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#9ba9bc] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.05] px-5 pb-5 pt-4">
              <p className="mb-4 text-sm leading-relaxed text-[#9ba9bc]">{group.description}</p>
              <div className="flex flex-col gap-2">
                {group.records.map((record, i) => (
                  <RecordRow key={i} record={record} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */

const DomainPortfolio = () => {
  return (
    <>
      {/* ── Section 1: DNS Records Mockups ─────────────────────────── */}
      <section className="border-b border-[#273548] bg-[#0e1520]">
        <div className="container-custom py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Configurações DNS na prática
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              Cada tipo de registro tem uma função.{' '}
              <span className="text-cyan-300">Dominamos todos eles.</span>
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#9ba9bc]">
              Configuramos registros DNS de forma correta, nas plataformas certas, conectando
              hospedagem, e-mail, segurança e integrações para cada domínio que gerenciamos.
            </p>

            {/* Record type legend */}
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(recordTypeColor).map(([type, cls]) => (
                <span key={type} className={`inline-flex items-center rounded border px-2 py-1 font-mono text-[10px] font-bold ${cls}`}>
                  {type}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            {dnsGroups.map((group, index) => (
              <DnsGroupCard key={group.id} group={group} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Subdomain Strategy ──────────────────────────── */}
      <section className="border-b border-[#273548] bg-[#101722]">
        <div className="container-custom py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              Arquitetura de subdomínios
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              Subdomínios para finalidades estratégicas.
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#9ba9bc]">
              Um subdomínio bem posicionado separa contextos, protege a marca principal, direciona
              campanhas e cria pontos de entrada independentes para produtos e serviços.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subdomainUseCases.map((item, index) => {
              const { Icon } = item;
              return (
                <motion.div
                  key={item.prefix}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.06 }}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition hover:-translate-y-1 ${item.border} ${item.bg}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${item.border} bg-[#0c121b]/60`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </span>

                  <div className="mt-4 font-mono">
                    <span className={`text-sm font-bold ${item.color}`}>{item.prefix}</span>
                    <span className="text-sm text-[#9ba9bc]">{item.domain}</span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-[#d7e0ea]">{item.purpose}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Explanation cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Isolamento de produto', desc: 'Cada produto ou serviço ganha sua própria URL, sem poluir o domínio raiz.' },
              { title: 'Rastreamento independente', desc: 'Analytics e pixels separados por subdomínio permitem medir cada frente com precisão.' },
              { title: 'Flexibilidade de hospedagem', desc: 'Cada subdomínio pode apontar para um servidor, plataforma ou CDN diferente.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 rounded-xl border border-[#273548] bg-[#0c121b] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#9ba9bc]">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Domain Portfolio ────────────────────────────── */}
      <section className="border-b border-[#273548] bg-[#0e1520]">
        <div className="container-custom py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Portfólio de domínios gerenciados
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
              Domínios que registramos e apontamos.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[#9ba9bc]">
              De registros no Registro.br a configurações avançadas no Cloudflare — gerenciamos
              cada propriedade com atenção ao detalhe e segurança.
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {domainPortfolio.map((item, index) => (
              <motion.div
                key={item.domain}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-[#273548] bg-[#101722] p-4 transition hover:border-cyan-500/40 hover:bg-cyan-500/5"
              >
                {/* Browser bar mockup */}
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff605c]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#ffbd44]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#00ca4e]" aria-hidden="true" />
                </div>

                <div className="flex items-start gap-2">
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-semibold text-white">
                      {item.domain}
                    </p>
                    <p className="mt-1 text-xs text-[#9ba9bc]">{item.category}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    {item.platform}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#9ba9bc] opacity-0 transition group-hover:opacity-100" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Platform badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ba9bc]">
              Plataformas que operamos:
            </p>
            {['Registro.br', 'Cloudflare', 'GoDaddy', 'Namecheap', 'AWS Route 53', 'Google Domains', 'Hostgator', 'Locaweb'].map((p) => (
              <span key={p} className="rounded-full border border-[#34455a] bg-[#151f2b] px-3 py-1 text-xs font-semibold text-[#d7e0ea]">
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DomainPortfolio;
