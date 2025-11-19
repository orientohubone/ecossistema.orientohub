import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoShowcaseProps {
  image: string;
  videoUrl: string;
  alt?: string;
  playerOffsetX?: string; // Ex: '-80px', '10%'
}

const VideoShowcase = ({ image, videoUrl, alt, playerOffsetX }: VideoShowcaseProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto min-h-[420px]">
        <img
          src={image}
          alt={alt || 'Demo'}
          className="w-full h-auto object-cover rounded-3xl border-8 border-primary-700/60 shadow-2xl min-h-[420px] max-h-[520px] object-top"
        />
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.18, boxShadow: '0 0 0 8px #FFD70044, 0 0 32px #FFD70099' }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 via-primary-500 to-yellow-500 animate-pulse hover:animate-none rounded-full shadow-2xl border-4 border-white/80 ring-4 ring-primary-500/30 transition-all duration-300 cursor-pointer z-10 group"
          style={{ left: `calc(50% + ${playerOffsetX || '0px'})`, transform: 'translate(-50%, -50%)' }}
          aria-label="Assistir vídeo"
        >
          <span className="absolute inset-0 rounded-full bg-white/30 blur-2xl opacity-60 group-hover:opacity-80 transition-all" />
          <Play className="w-20 h-20 text-primary-900 drop-shadow-xl group-hover:scale-110 transition-transform duration-200" />
        </motion.button>
      </div>
      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <iframe
                width="900"
                height="500"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[500px] bg-black"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
                aria-label="Fechar"
              >
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoShowcase;
