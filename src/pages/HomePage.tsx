import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Zap, ArrowRight, Play, Users, BarChart2, Award, Target, CheckCircle, TrendingUp, Brain } from 'lucide-react';

// Componente de texto rotativo -->>
      
const RotatingText = () => {
  const words = ['metodologia', 'inovação', 'tecnologia', 'agilidade'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent transition-all duration-500 ${
        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
      style={{ paddingBottom: '0.15em', lineHeight: '1.2' }}
    >
      com {words[currentIndex]}
    </span>
  );
};

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Orientohub - {t('home.hero.title')}</title>
        <meta name="description" content={t('home.hero.subtitle')} />
      </Helmet>

     {/* Hero Section */}
<section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse [animation-delay:700ms]" />
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
  </div>

  {/* Grid pattern overlay */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)',
      backgroundSize: '40px 40px'
    }} />
  </div>

  {/* Content */}
  <div className="relative z-10 container-custom pt-32 pb-24">...