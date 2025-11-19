import { useState } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { GlowBorder } from './GlowBorder';

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
        {/* Depth glow backdrop */}
        <div className="absolute -inset-10 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 via-amber-300/30 to-transparent blur-3xl opacity-80" />
          <div className="absolute inset-10 bg-yellow-300/20 blur-[120px]" />
        </div>

        {/* Container with animated border */}
        <div className="relative rounded-3xl overflow-hidden">
          <GlowBorder duration={3600} rx={28} ry={28} />

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

export default VideoShowcase;
