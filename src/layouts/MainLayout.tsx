import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();
  const slimScrollRoutes = new Set([
    '/',
    '/sobre',
    '/manifesto',
    '/ecossistema',
    '/planos',
    '/blog',
    '/glossario',
  ]);
  const usesSlimScrollIndicator = slimScrollRoutes.has(location.pathname);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(false);
  const scrollIndicatorTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle('home-scrollbar-hidden', usesSlimScrollIndicator);
    document.documentElement.classList.toggle('home-scrollbar-hidden', usesSlimScrollIndicator);

    return () => {
      document.body.classList.remove('home-scrollbar-hidden');
      document.documentElement.classList.remove('home-scrollbar-hidden');
    };
  }, [usesSlimScrollIndicator]);

  useEffect(() => {
    if (!usesSlimScrollIndicator) {
      setScrollProgress(0);
      setIsScrollIndicatorVisible(false);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;

      setScrollProgress(nextProgress);
      setIsScrollIndicatorVisible(scrollTop > 0);

      if (scrollIndicatorTimeoutRef.current) {
        window.clearTimeout(scrollIndicatorTimeoutRef.current);
      }

      scrollIndicatorTimeoutRef.current = window.setTimeout(() => {
        setIsScrollIndicatorVisible(false);
      }, 700);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollIndicatorTimeoutRef.current) {
        window.clearTimeout(scrollIndicatorTimeoutRef.current);
      }
    };
  }, [usesSlimScrollIndicator]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {usesSlimScrollIndicator && (
        <div className="pointer-events-none fixed right-0 top-24 bottom-0 z-40 hidden md:flex items-center">
          <div className="relative h-full w-[4px] rounded-full bg-transparent">
            <motion.div
              className="absolute left-0 w-[4px] rounded-full bg-primary-500 shadow-[0_0_10px_rgba(255,215,0,0.45)]"
              style={{
                height: '72px',
                top: `clamp(0px, calc(${scrollProgress * 100}% - 36px), calc(100% - 72px))`,
              }}
              animate={{
                opacity: isScrollIndicatorVisible ? 0.9 : 0,
              }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;
