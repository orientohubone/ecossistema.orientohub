import { useState } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GlowBorder } from './GlowBorder';

export interface VideoShowcaseItem {
  image: string;
  videoUrl: string;
  alt?: string;
  title?: string;
  description?: string;
}

interface VideoShowcaseProps {
  image?: string;
  videoUrl?: string;
  alt?: string;
  items?: VideoShowcaseItem[];
  playerOffsetX?: string; // Ex: '-80px', '10%'
  playerOffsetY?: string; // Ex: '20px', '-5%'
}

const VideoShowcase = ({ image, videoUrl, alt, items, playerOffsetX = '0px', playerOffsetY = '0px' }: VideoShowcaseProps) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const slides: VideoShowcaseItem[] = items?.length
    ? items
    : image && videoUrl
      ? [{ image, videoUrl, alt }]
      : [];
  const activeSlide = slides[activeIndex] ?? slides[0];
  const isLocalVideo = activeSlide
    ? activeSlide.videoUrl.startsWith('/') || /\.(mp4|webm)(\?.*)?$/i.test(activeSlide.videoUrl)
    : false;
  const hasMultipleSlides = slides.length > 1;

  const goTo = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;
    setDirection(nextIndex >= activeIndex ? 1 : -1);
    setActiveIndex(normalizedIndex);
  };

  if (!activeSlide) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 sm:py-10 px-1 sm:px-0">
      <div className="relative group max-w-5xl mx-auto w-full">
        {/* Depth glow backdrop */}
        <div className="absolute -inset-6 sm:-inset-10 -z-10 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400/45 via-amber-300/25 to-transparent blur-2xl sm:blur-3xl opacity-85 rounded-full" />
          <div className="absolute inset-4 sm:inset-10 bg-yellow-300/20 blur-[60px] sm:blur-[120px] rounded-full" />
        </div>

        {hasMultipleSlides && (
          <div className="mb-5 flex items-end justify-between gap-4 px-1 sm:mb-7">
            <div className="min-w-0 text-left">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FFF200]">
                <span className="h-0.5 w-7 bg-[#FFF200]" />
                Showcase {String(activeIndex + 1).padStart(2, '0')}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeSlide.title || activeSlide.videoUrl}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-black text-white sm:text-3xl">{activeSlide.title}</h2>
                  {activeSlide.description && <p className="mt-1 max-w-2xl text-sm text-gray-400 sm:text-base">{activeSlide.description}</p>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-all hover:border-[#FFF200]/70 hover:bg-[#FFF200] hover:text-black sm:h-12 sm:w-12"
                aria-label="Showcase anterior"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-all hover:border-[#FFF200]/70 hover:bg-[#FFF200] hover:text-black sm:h-12 sm:w-12"
                aria-label="Próximo showcase"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        )}

        {/* Cada slide é uma tela independente */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
          <GlowBorder duration={3600} rx={28} ry={28} />

          {/* Inner content with padding for border */}
          <div className="absolute inset-[2px] sm:inset-[3px] rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900" />

          {/* Video carousel */}
          <div className="relative m-[2px] sm:m-[3px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeSlide.videoUrl}
                custom={direction}
                initial={{ opacity: 0, x: direction * 56, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -56, scale: 0.985 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full"
              >
                {isLocalVideo ? (
                  <video
                    src={activeSlide.videoUrl}
                    poster={activeSlide.image}
                    aria-label={activeSlide.alt || 'Demonstração da plataforma'}
                    autoPlay
                    muted
                    loop={!hasMultipleSlides}
                    playsInline
                    preload="metadata"
                    onEnded={() => hasMultipleSlides && goTo(activeIndex + 1)}
                    className="relative aspect-video w-full rounded-2xl object-cover sm:rounded-3xl"
                  />
                ) : (
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.alt || 'Demo'}
                    className="relative aspect-video w-full object-cover rounded-2xl sm:rounded-3xl object-top"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl" />

            {hasMultipleSlides && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-2 backdrop-blur-md sm:bottom-5">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.videoUrl}
                      type="button"
                      onClick={() => goTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-7 bg-[#FFF200]' : 'w-2 bg-white/45 hover:bg-white/75'}`}
                      aria-label={`Abrir showcase ${index + 1}: ${slide.title || slide.alt || 'vídeo'}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                    />
                  ))}
                </div>
            )}

            {/*
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
            */}
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
                  src={activeSlide.videoUrl}
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

