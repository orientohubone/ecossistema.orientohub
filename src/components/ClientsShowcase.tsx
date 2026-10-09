import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientShowcase } from '../data/clientShowcase';

type Client = (typeof clientShowcase)[number];

const logoSize = (client: Client) => client.compactCrop
  ? 'h-28 w-28 max-w-none scale-[1.8] object-contain'
  : client.canvasCrop
    ? 'h-28 w-28 max-w-none scale-[2.15] object-contain'
    : client.maximum
      ? 'h-28 max-h-[118px] w-auto max-w-[220px] scale-[1.38] object-contain'
      : client.extraLarge
        ? 'h-28 max-h-[118px] w-auto max-w-[220px] scale-[1.18] object-contain'
        : client.oversized
          ? 'h-28 max-h-[118px] w-auto max-w-[220px] object-contain'
          : client.mediumLogo
            ? 'h-16 max-h-full max-w-[165px] object-contain'
            : client.featured
              ? 'h-20 max-h-full max-w-[180px] object-contain sm:max-w-[210px]'
              : 'h-10 max-h-full max-w-[130px] object-contain sm:h-12';

const ClientCard = ({ client, className = '' }: { client: Client; className?: string }) => (
  <article className={`group h-40 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.42)] ${className}`}>
    <div className="flex h-full flex-col overflow-hidden rounded-[15px] bg-white">
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-3">
        <img src={client.logo} alt={`Logo ${client.name}`} loading="lazy" style={client.outlined ? { filter: 'drop-shadow(1px 0 0 #111820) drop-shadow(-1px 0 0 #111820) drop-shadow(0 1px 0 #111820) drop-shadow(0 -1px 0 #111820)' } : undefined} className={logoSize(client)} />
      </div>
      <span className="flex min-h-9 w-full items-center justify-center bg-[#111820] px-3 py-2 text-center text-[11px] font-bold leading-tight text-white">{client.name}</span>
    </div>
  </article>
);

const ClientsShowcase = () => {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const select = (index: number) => setActive((index + clientShowcase.length) % clientShowcase.length);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % clientShowcase.length), 3800);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return <section className="relative overflow-hidden bg-[#FFF200] py-16 text-black sm:py-20" aria-labelledby="clients-showcase-title">
    <div className="pointer-events-none absolute -left-8 top-8 h-44 w-44 opacity-20 [background-image:radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
    <div className="pointer-events-none absolute -bottom-10 right-0 h-44 w-56 opacity-20 [background-image:radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
    <div className="container-custom relative z-10">
      <motion.header className="mx-auto max-w-3xl text-center" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-black/55">Clientes atendidos</p>
        <h2 id="clients-showcase-title" className="mt-4 text-3xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">Marcas que fizeram parte do nosso trabalho.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-black/65 sm:text-lg">Uma seleção de clientes que já atendemos em projetos pontuais ou relações recorrentes e que fazem parte da nossa história.</p>
      </motion.header>

      <motion.div className="mt-12 hidden grid-cols-3 gap-4 sm:grid lg:grid-cols-5" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
        {clientShowcase.map((client) => <motion.article key={client.name} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="group h-40 overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-black/30 hover:shadow-[0_24px_45px_rgba(0,0,0,0.24)]">
          <div className="flex h-full flex-col overflow-hidden rounded-[15px] bg-white">
            <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-3">
              <img src={client.logo} alt={`Logo ${client.name}`} loading="lazy" style={client.outlined ? { filter: 'drop-shadow(1px 0 0 #111820) drop-shadow(-1px 0 0 #111820) drop-shadow(0 1px 0 #111820) drop-shadow(0 -1px 0 #111820)' } : undefined} className={logoSize(client)} />
            </div>
            <span className="flex min-h-9 w-full items-center justify-center bg-[#111820] px-3 py-2 text-center text-[11px] font-bold leading-tight text-white">{client.name}</span>
          </div>
        </motion.article>)}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
          <Link to="/servicos" onClick={() => window.scrollTo(0, 0)} className="group flex h-40 items-center justify-center rounded-2xl border-2 border-black bg-black p-5 text-white transition duration-300 hover:-translate-y-1 hover:bg-[#171717]">
            <span className="flex items-center gap-2 text-sm font-black">Nossas soluções <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-9 sm:hidden" aria-roledescription="carrossel" aria-label="Clientes atendidos">
        <div className="overflow-hidden px-4 py-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={clientShowcase[active].name} initial={reduceMotion ? false : { opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -34 }} transition={{ duration: 0.28 }}>
              <ClientCard client={clientShowcase[active]} className="h-48" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <button type="button" onClick={() => select(active - 1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/20 bg-black text-white shadow-md" aria-label="Cliente anterior"><ArrowLeft className="h-4 w-4" /></button>
          <div className="flex flex-wrap justify-center gap-1.5">{clientShowcase.map((client, index) => <button type="button" key={client.name} onClick={() => select(index)} aria-label={`Ver ${client.name}`} aria-current={active === index ? 'true' : undefined} className={`h-2 rounded-full transition-all ${active === index ? 'w-6 bg-black' : 'w-2 bg-black/25'}`} />)}</div>
          <button type="button" onClick={() => select(active + 1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/20 bg-black text-white shadow-md" aria-label="Próximo cliente"><ArrowRight className="h-4 w-4" /></button>
        </div>
        <Link to="/servicos" onClick={() => window.scrollTo(0, 0)} className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-black text-white">Nossas soluções <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  </section>;
};

export default ClientsShowcase;
