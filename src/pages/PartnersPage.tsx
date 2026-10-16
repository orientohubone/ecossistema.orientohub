import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowUpRight, BadgeCheck, Check, Gift, Handshake, Search } from 'lucide-react';
import { partnerCatalog } from '../data/partnerCatalog';

const PartnersPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const categories = useMemo(() => ['Todos', ...new Set(partnerCatalog.map((partner) => partner.category))], []);
  const partners = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return partnerCatalog.filter((partner) => {
      const matchesCategory = category === 'Todos' || partner.category === category;
      const searchable = `${partner.name} ${partner.formerName || ''} ${partner.category} ${partner.description} ${partner.highlights.join(' ')}`.toLocaleLowerCase('pt-BR');
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  return (
    <>
      <Helmet>
        <title>Nossos parceiros | Orientohub</title>
        <meta name="description" content="Soluções parceiras selecionadas pela Orientohub para apoiar a operação e o crescimento do seu negócio." />
      </Helmet>

      <main className="min-h-screen bg-[#080d14] text-white">
        <section className="relative overflow-hidden border-b border-white/[0.07]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(182,255,0,.08),transparent_24%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFF200 1px, transparent 0)', backgroundSize: '36px 36px' }} />
          <div className="container-custom relative py-16 sm:py-24">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FFF200]/25 bg-[#FFF200]/[0.06] px-3.5 py-2 text-[11px] font-black uppercase tracking-[.18em] text-[#FFF200]"><Handshake className="h-4 w-4" /> Rede de parceiros</span>
              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-7xl">Soluções que ampliam o que podemos <span className="text-[#FFF200]">construir juntos.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-xl">Uma seleção de ferramentas e empresas parceiras para resolver necessidades reais da operação, com acesso direto à contratação.</p>
              <div className="mt-9 flex flex-wrap gap-6 border-t border-white/10 pt-6 text-sm text-white/55">
                <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#FFF200]" /> Soluções selecionadas</span>
                <span className="flex items-center gap-2"><Gift className="h-4 w-4 text-[#FFF200]" /> Benefícios de parceria</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-custom py-12 sm:py-16">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#FFF200]">Catálogo</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Encontre a solução certa</h2>
            </div>
            <label className="flex w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-[#101722] px-4 py-3 text-white/45 transition focus-within:border-[#FFF200]/50">
              <Search className="h-4 w-4 shrink-0" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar parceiro ou solução…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Categorias de parceiros">
            {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? 'border-[#FFF200] bg-[#FFF200] text-black' : 'border-white/10 bg-white/[0.025] text-white/55 hover:border-white/25 hover:text-white'}`}>{item}</button>)}
          </div>

          {partners.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {partners.map((partner, index) => (
                <motion.article key={partner.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101722] transition hover:-translate-y-1 hover:border-white/20">
                  <div className="relative flex h-[210px] items-center justify-center overflow-hidden bg-black">
                    <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at center, ${partner.accent}55, transparent 62%)` }} />
                    <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: `linear-gradient(${partner.accent} 1px, transparent 1px), linear-gradient(90deg, ${partner.accent} 1px, transparent 1px)`, backgroundSize: '42px 42px' }} />
                    <img src={partner.image} alt={`Imagem de apresentação da ${partner.name}`} className={`relative transition duration-500 group-hover:scale-105 ${partner.imageFit === 'cover' ? 'h-full w-full object-cover' : 'h-28 w-28 object-contain drop-shadow-[0_0_32px_rgba(182,255,0,.16)] sm:h-32 sm:w-32'}`} />
                    {partner.imageFit === 'cover' && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />}
                    <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.15em] text-white/70 backdrop-blur">{partner.eyebrow}</span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black"><img src={partner.favicon} alt="" className="h-7 w-7 object-contain" /></span>
                        <div><h3 className="text-xl font-black tracking-tight">{partner.name}</h3>{partner.formerName && <p className="mt-0.5 text-[11px] text-white/40">{partner.formerName}</p>}</div>
                      </div>
                      <span className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold leading-none text-white/45">{partner.category}</span>
                    </div>
                    <p className="mt-4 min-h-[60px] text-sm leading-5 text-white/55">{partner.description}</p>
                    <ul className="mt-4 grid gap-2">
                      {partner.highlights.map((highlight) => <li key={highlight} className="flex items-center gap-2 text-xs font-semibold text-white/70"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B6FF00]/10 text-[#B6FF00]"><Check className="h-3 w-3" /></span>{highlight}</li>)}
                    </ul>
                    <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5">
                      <div><p className="text-[10px] font-black uppercase tracking-[.15em] text-white/30">Site oficial</p><p className="mt-1 text-sm font-semibold text-white/70">{partner.website}</p></div>
                      <div className="grid gap-2">
                        {partner.learnMoreUrl && <a href={partner.learnMoreUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-center text-xs font-bold leading-4 text-white/75 transition hover:border-white/30 hover:text-white">Conheça a {partner.name} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>}
                        <a href={partner.url} target="_blank" rel="sponsored noreferrer" className="group/link inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FFF200] px-4 py-2.5 text-center text-xs font-black leading-4 text-black transition hover:bg-[#fff64d]">{partner.ctaLabel} <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" /></a>
                        {partner.secondaryCta && <a href={partner.secondaryCta.url} target="_blank" rel="sponsored noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#FFF200]/35 bg-[#FFF200]/[0.05] px-4 py-2.5 text-center text-xs font-black leading-4 text-[#FFF200] transition hover:border-[#FFF200]/65 hover:bg-[#FFF200]/10">{partner.secondaryCta.label} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a>}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center"><Search className="mx-auto h-7 w-7 text-white/25" /><h3 className="mt-4 text-xl font-bold">Nenhum parceiro encontrado</h3><p className="mt-2 text-sm text-white/40">Tente outro termo ou limpe os filtros.</p><button type="button" onClick={() => { setQuery(''); setCategory('Todos'); }} className="mt-5 text-sm font-bold text-[#FFF200]">Limpar busca</button></div>
          )}

          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-white/35">Transparência: alguns links desta página são links de parceria ou afiliação. A Orientohub pode receber uma comissão quando uma contratação é realizada por eles, sem custo adicional para você.</p>
        </section>
      </main>
    </>
  );
};

export default PartnersPage;
