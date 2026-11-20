import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlackFridaySeal from './BlackFridaySeal';

const BlackFridayBanner = () => (
  <aside className="relative overflow-hidden border-b border-[#FFF200]/30 bg-[#090909] text-white">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1.5 px-3 py-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-2 lg:px-8">
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <BlackFridaySeal className="h-8 w-auto shrink-0 sm:h-11" />
        <span className="text-left">
          <span className="block whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-[#FFF200] sm:text-[10px] sm:tracking-[0.24em]">OrientoHub apresenta</span>
          <span className="block whitespace-nowrap text-xs font-black uppercase leading-tight tracking-wide sm:text-base">Black Friday <span className="text-[#FFF200]">2026</span></span>
        </span>
      </div>

      <p className="text-[9px] leading-snug text-white/65 sm:max-w-xl sm:text-xs sm:text-white/75">
        Tire seu próximo projeto do papel com <strong className="font-bold text-white">condições especiais</strong> nesta Black Friday.
      </p>

      <Link to="/servicos" className="shrink-0">
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
