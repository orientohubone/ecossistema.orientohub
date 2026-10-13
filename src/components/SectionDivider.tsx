import { motion } from 'framer-motion';
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
      <motion.svg
        width="16"
        height="22"
        viewBox="0 0 16 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Vertical line */}
        <line x1="8" y1="0" x2="8" y2="14" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
        {/* Chevron */}
        <polyline points="2,10 8,17 14,10" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
};

export default SectionDivider;
