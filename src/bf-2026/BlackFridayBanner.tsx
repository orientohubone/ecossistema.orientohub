import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlackFridaySeal from './BlackFridaySeal';

const BlackFridayBanner = () => (
  <aside className="relative isolate overflow-hidden border-b border-[#FFF200]/30 bg-[#090909] text-white">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_50%,rgba(255,242,0,0.16),transparent_38%),radial-gradient(ellipse_at_88%_50%,rgba(255,242,0,0.1),transparent_34%)]" />
    <div className="mx-auto flex min-h-[68px] max-w-7xl flex-col items-center justify-center gap-2 px-3 py-3 text-center sm:min-h-[76px] sm:flex-row sm:gap-4 sm:px-6 sm:py-2 lg:px-8">
      <div className="flex items-center gap-2.5">
        <BlackFridaySeal className="h-9 w-auto shrink-0 sm:h-11" />
        <span className="text-left">
          <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-[#FFF200] sm:text-[10px]">OrientoHub apresenta</span>
          <span className="block text-sm font-black uppercase leading-tight tracking-wide sm:text-base">Black Friday <span className="text-[#FFF200]">2026</span></span>
        </span>
      </div>

      <span className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />

      <p className="max-w-xl text-[11px] leading-snug text-white/75 sm:text-xs">
        Tire seu próximo projeto do papel com <strong className="font-bold text-white">condições especiais</strong> nesta Black Friday.
      </p>

      <Link to="/servicos" className="shrink-0 sm:ml-1">
        <motion.span
          className="group relative inline-flex items-center gap-1.5 rounded-full bg-[#FFF200] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-black transition-colors hover:bg-white sm:py-2.5 sm:text-[11px]"
          animate={{ boxShadow: ['0 0 0 0 rgba(255,242,0,0.6)', '0 0 0 8px rgba(255,242,0,0)', '0 0 0 0 rgba(255,242,0,0)'] }}
          transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.5 }}
        >
          Confira as ofertas
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </motion.span>
      </Link>
    </div>
  </aside>
);

export default BlackFridayBanner;
