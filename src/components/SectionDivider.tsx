import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FC } from 'react';

interface SectionDividerProps {
  delay?: number;
  liftIntoHero?: boolean;
  topSpacing?: 'tight' | 'normal' | 'loose';
}

const SectionDivider: FC<SectionDividerProps> = ({ delay = 0, liftIntoHero = false, topSpacing = 'normal' }) => {
  const spacingClasses = {
    tight: 'mt-2 sm:mt-3 md:mt-4 mb-8 sm:mb-10 md:mb-12',
    normal: 'my-8 sm:my-10 md:my-12',
    loose: 'my-12 sm:my-16 md:my-20',
  };

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center ${
        liftIntoHero ? '-mt-32 sm:-mt-48 md:-mt-64 lg:-mt-80' : spacingClasses[topSpacing]
      }`}
      initial={{ opacity: 0, y: -6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <motion.div
        className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-[#fff76a] bg-[#FFF200] text-[#0c121b] shadow-[0_8px_22px_rgba(0,0,0,0.38)]"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
      </motion.div>
    </motion.div>
  );
};

export default SectionDivider;
