import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';

interface GlowBorderProps {
  duration?: number;
  rx?: number | string;
  ry?: number | string;
  glowElement?: ReactNode;
  className?: string;
  borderRadiusClass?: string;
}

export const GlowBorder = ({
  duration = 3600,
  rx = 28,
  ry = 28,
  glowElement,
  className = '',
  borderRadiusClass = 'rounded-3xl'
}: GlowBorderProps) => (
  <div className={`absolute inset-0 pointer-events-none ${borderRadiusClass} ${className}`}>
    <div
      className={`absolute inset-0 border border-yellow-400/30 bg-gradient-to-br from-yellow-300/15 via-transparent to-amber-400/20 ${borderRadiusClass}`}
    />
    <MovingBorder duration={duration} rx={rx} ry={ry}>
      {glowElement ?? (
        <div className="h-32 w-32 opacity-80 bg-[radial-gradient(circle,rgba(255,209,92,0.95)_0%,rgba(255,209,92,0)_65%)] blur-2xl" />
      )}
    </MovingBorder>
  </div>
);

interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  rx?: number | string;
  ry?: number | string;
}

export const MovingBorder = ({ children, duration = 2000, rx = 0, ry = 0 }: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time: number) => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    if (!length) return;
    const pxPerMillisecond = length / duration;
    progress.set((time * pxPerMillisecond) % length);
  });

  const x = useTransform(progress, (val: number) => {
    if (!pathRef.current) return 0;
    return pathRef.current.getPointAtLength(val).x;
  });

  const y = useTransform(progress, (val: number) => {
    if (!pathRef.current) return 0;
    return pathRef.current.getPointAtLength(val).y;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        aria-hidden
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform,
          filter: 'drop-shadow(0 0 35px rgba(255, 214, 94, 0.8))',
          mixBlendMode: 'screen',
          pointerEvents: 'none'
        }}
        aria-hidden
      >
        {children}
      </motion.div>
    </>
  );
};
