import { motion } from 'framer-motion';
import type { FC } from 'react';

interface SectionDividerProps {
  delay?: number;
  liftIntoHero?: boolean;
}

const SectionDivider: FC<SectionDividerProps> = ({ delay = 0, liftIntoHero = false }) => {
  return (
    <motion.div
      className={`relative py-6 flex flex-col items-center justify-center ${
        liftIntoHero ? '-mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24' : 'my-8 sm:my-10 md:my-12'
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay }}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient halo */}
        <motion.div
          className="absolute h-24 w-24 rounded-full bg-[#FFD700]/12 blur-2xl"
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: delay + 0.05 }}
        />

        {/* Top connector */}
        <div className="relative h-4 w-px overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD700] to-[#FFD700]/55"
            initial={{ y: '-100%' }}
            whileInView={{ y: '100%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: delay + 0.1, ease: 'easeInOut' }}
          />
        </div>

        {/* Premium core */}
        <div className="relative my-0.5 h-10 w-10">
          <motion.div
            className="absolute inset-0 rounded-full border border-[#FFD700]/35 bg-white/[0.06] shadow-[0_0_28px_rgba(255,215,0,0.22)] backdrop-blur-md"
            initial={{ scale: 0.82, opacity: 0, rotate: -12 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: delay + 0.2, ease: 'easeOut' }}
          />
          <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-[#FFD700]/40 via-[#FFD700]/25 to-transparent blur-md" />
          <div className="absolute inset-[5px] rounded-full border border-[#FFD700]/25 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.18),transparent_70%)]" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: [0, 6, 0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFE45C] to-[#FFC400] text-black shadow-[0_0_16px_rgba(255,215,0,0.45)]">
              <div className="h-1.5 w-1.5 rounded-full bg-black/80" />
            </div>
          </motion.div>
        </div>

        {/* Bottom connector */}
        <div className="relative h-5 w-px overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#FFD700] via-[#FFD700]/85 to-transparent"
            initial={{ y: '-100%' }}
            whileInView={{ y: '100%' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: delay + 0.25, ease: 'easeInOut' }}
          />
        </div>

        {/* Subtle horizontal grain lines for a more premium bridge */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-px w-[18rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FFD700]/28 to-transparent blur-[0.5px]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-px w-[10rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      </div>
    </motion.div>
  );
};

export default SectionDivider;
