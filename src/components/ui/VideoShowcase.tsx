import { useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface VideoShowcaseProps {
  image: string;
  videoUrl: string;
  alt?: string;
  playerOffsetX?: string; // Ex: '-80px', '10%'
  playerOffsetY?: string; // Ex: '20px', '-5%'
}

const VideoShowcase = ({ image, videoUrl, alt, playerOffsetX = '0px', playerOffsetY = '0px' }: VideoShowcaseProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="relative group max-w-5xl mx-auto w-full">
        {/* Container with animated border */}
        <div className="relative rounded-3xl overflow-hidden">
          <BorderGlow />

          {/* Inner content with padding for border */}
          <div className="absolute inset-[3px] rounded-3xl bg-white dark:bg-gray-900" />

          {/* Image container */}
          <div className="relative m-[3px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={image}
              alt={alt || 'Demo'}
              className="relative w-full h-auto object-cover rounded-3xl min-h-[420px] max-h-[600px] object-top"
            />
            
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

            {/* Play button - CENTRALIZADO */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.button
                onClick={() => setOpen(true)}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-yellow-500 rounded-full shadow-2xl border-4 border-white/90 transition-all duration-300 cursor-pointer z-10 group-hover:shadow-[0_0_40px_rgba(255,183,3,0.6)] pointer-events-auto"
                style={{
                  marginLeft: playerOffsetX,
                  marginTop: playerOffsetY
                }}
                aria-label="Assistir vídeo"
              >
                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary-500/30"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Second pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-yellow-400/30"
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                <Play className="w-10 h-10 text-white drop-shadow-lg ml-1" fill="white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              {/* Video container with aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-3 bg-black/80 hover:bg-black text-white rounded-full transition-colors backdrop-blur-sm"
                aria-label="Fechar"
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

const BorderGlow = ({ duration = 3600 }: { duration?: number }) => (
  <div className="absolute inset-0 rounded-3xl pointer-events-none">
    <div className="absolute inset-0 rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-300/15 via-transparent to-amber-400/20" />
    <MovingBorder duration={duration} rx="28" ry="28">
      <div className="h-32 w-32 opacity-80 bg-[radial-gradient(circle,rgba(255,209,92,0.95)_0%,rgba(255,209,92,0)_65%)] blur-2xl" />
    </MovingBorder>
  </div>
);

interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}

const MovingBorder = ({ children, duration = 2000, rx = '0', ry = '0' }: MovingBorderProps) => {
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
          filter: 'drop-shadow(0 0 35px rgba(255, 193, 59, 0.65))',
          pointerEvents: 'none'
        }}
        aria-hidden
      >
        {children}
      </motion.div>
    </>
  );
};

export default VideoShowcase;
