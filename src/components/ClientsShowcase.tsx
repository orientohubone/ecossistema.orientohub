import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clientShowcase } from '../data/clientShowcase';

type Client = (typeof clientShowcase)[number];

// Tamanhos responsivos para os logos dentro do carrossel.
const marqueeLogoSize = (client: Client) =>
  client.compactCrop
    ? 'h-20 w-20 max-w-none scale-[1.9] object-contain sm:h-28 sm:w-28 sm:scale-[1.8]'
    : client.canvasCrop
    ? 'h-20 w-20 max-w-none scale-[2.1] object-contain sm:h-28 sm:w-28 sm:scale-[2.15]'
    : client.maximum
    ? 'h-20 w-auto max-w-[120px] scale-[1.3] object-contain sm:h-28 sm:max-w-[200px] sm:scale-[1.38]'
    : client.extraLarge
    ? 'h-20 w-auto max-w-[120px] scale-[1.15] object-contain sm:h-28 sm:max-w-[200px] sm:scale-[1.18]'
    : client.oversized
    ? 'h-20 w-auto max-w-[118px] object-contain sm:h-28 sm:max-w-[200px]'
    : client.mediumLogo
    ? 'h-16 max-h-full max-w-[115px] object-contain sm:h-20 sm:max-w-[165px]'
    : client.featured
    ? 'h-18 max-h-full max-w-[118px] object-contain sm:h-24 sm:max-w-[180px]'
    : 'h-16 max-h-full max-w-[115px] object-contain sm:h-16 sm:max-w-[150px]';

const MarqueeCard = ({ client }: { client: Client }) => (
  <div className="mx-2 flex h-32 w-36 shrink-0 flex-col overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition duration-300 sm:mx-3 sm:h-48 sm:w-56 sm:rounded-3xl sm:shadow-[0_12px_28px_rgba(0,0,0,0.15)] lg:h-52 lg:w-64 lg:hover:-translate-y-1 lg:hover:shadow-[0_20px_38px_rgba(0,0,0,0.2)]">
    <div className="flex min-h-0 flex-1 items-center justify-center p-2 sm:p-5">
      <img src={client.logo} alt={`Logo ${client.name}`} loading="lazy"
        style={client.outlined ? { filter: 'drop-shadow(1px 0 0 #111820) drop-shadow(-1px 0 0 #111820) drop-shadow(0 1px 0 #111820) drop-shadow(0 -1px 0 #111820)' } : undefined}
        className={marqueeLogoSize(client)} />
    </div>
    <span className="flex min-h-7 w-full items-center justify-center bg-[#111820] px-2 py-1 text-center text-[9px] font-bold leading-tight text-white sm:min-h-11 sm:px-4 sm:py-2 sm:text-xs">{client.name}</span>
  </div>
);

const ClientsShowcase = () => (
  <section className="relative overflow-hidden bg-[#FFF200] py-16 text-black sm:py-20" aria-labelledby="clients-showcase-title">
    <div className="pointer-events-none absolute -left-8 top-8 h-44 w-44 opacity-20 [background-image:radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
    <div className="pointer-events-none absolute -bottom-10 right-0 h-44 w-56 opacity-20 [background-image:radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:18px_18px]" />

    <div className="container-custom relative z-10">
      <motion.header className="mx-auto max-w-3xl text-center" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-black">Clientes atendidos</p>
        <h2 id="clients-showcase-title" className="mt-4 text-3xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
          Marcas que fizeram parte do{' '}
          <span className="inline-block bg-black px-2.5 py-1 text-white sm:px-3 sm:py-1.5">nosso trabalho.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-black/80 sm:text-lg">Uma seleção de clientes que já atendemos em projetos pontuais ou relações recorrentes e que fazem parte da nossa história.</p>
      </motion.header>

    </div>

    <div className="mt-10 sm:mt-12">
      <div className="clients-marquee-viewport relative overflow-hidden py-2 sm:py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#FFF200] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#FFF200] to-transparent sm:w-20" />
        <div className="clients-marquee-track flex w-max py-2">
          {[...clientShowcase, ...clientShowcase].map((client, i) => (
            <MarqueeCard key={`${client.name}-${i}`} client={client} />
          ))}
        </div>
      </div>
      <div className="container-custom mt-6 flex justify-center sm:mt-8">
        <Link to="/servicos" onClick={() => window.scrollTo(0, 0)} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#171717] sm:w-auto sm:min-w-56">
          Nossas soluções <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default ClientsShowcase;
