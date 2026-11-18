import seal from './selo-bf.png';
import { motion } from 'framer-motion';

const BlackFridaySeal = ({ className = 'h-12 w-auto' }: { className?: string }) => (
  <motion.img
    src={seal}
    alt="Black Friday: 50% OFF"
    className={`origin-center object-contain ${className}`}
    animate={{ rotate: [-2, 2, -2] }}
    transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
  />
);

export default BlackFridaySeal;
