import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlackFridaySeal from './BlackFridaySeal';

const BlackFridayBanner = () => (
  <aside className="relative isolate overflow-hidden border-b border-[#FFF200]/30 bg-[#090909] text-white">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_50%,rgba(255,242,0,0.16),transparent_38%),radial-gradient(ellipse_at_88%_50%,rgba(255,242,0,0.1),transparent_34%)]" />
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-3 py-2 text-center sm:min-h-[76px] sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-2 lg:px-8">
      <div className="order-1 flex min-w-0 items-center gap-1.5 sm:order-none sm:gap-2.5">
        <BlackFridaySeal className="h-8 w-auto shrink-0 sm:h-11" />
        <span className="text-left">
          <span className="block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-[#FFF200] sm:text-[10px] sm:tracking-[0.24em]">OrientoHub apresenta</span>
          <span className="block whitespace-nowrap text-xs font-black uppercase leading-tight tracking-wide sm:text-base">Black Friday <span className="text-[#FFF200]">2026</span></span>
        </span>
      </div>

      <span className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />

      <p className="order-3 basis-full text-[9px] leading-snug text-white/65 sm:order-none sm:max-w-xl sm:basis-auto sm:text-xs sm:text-white/75">
        Tire seu próximo projeto do papel com <strong className="font-bold text-white">condições especiais</strong> nesta Black Friday.
      </p>

      <Link to="/servicos" className="order-2 shrink-0 sm:order-none sm:ml-1">
        <motion.span
          className="group relative inline-flex items-center gap-1 rounded-full bg-[#FFF200] px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wide text-black transition-colors hover:bg-white sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-wider"
          animate={{ boxShadow: ['0 0 0 0 rgba(255,242,0,0.6)', '0 0 0 8px rgba(255,242,0,0)', '0 0 0 0 rgba(255,242,0,0)'] }}
          transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.5 }}
        >
          Confira as ofertas
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        </motion.span>
      </Link>
    </div>
  </aside>
);

export default BlackFridayBanner;
