import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoShowcaseProps {
  image: string;
  videoUrl: string;
  alt?: string;
}

const VideoShowcase = ({ image, videoUrl, alt }: VideoShowcaseProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
        <img
          src={image}
          alt={alt || 'Demo'}
          className="w-full h-auto object-cover rounded-3xl border-4 border-gray-800"
        />
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-0 m-auto flex items-center justify-center w-24 h-24 bg-white/80 hover:bg-white/90 rounded-full shadow-xl border-4 border-primary-500 transition-all duration-200 cursor-pointer z-10"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          aria-label="Assistir vídeo"
        >
          <Play className="w-14 h-14 text-primary-500 drop-shadow-lg" />
        </motion.button>
      </div>
      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <iframe
                width="700"
                height="400"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[400px] bg-black"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
                aria-label="Fechar"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoShowcase;
