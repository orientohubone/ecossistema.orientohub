import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MercadoLibre from '@thesvg/react/mercado-libre';
import { siGoogle, siInstagram, siMeta, siShopee, siTiktok } from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

type Brand = {
  name: string;
  icon?: SimpleIcon;
  customIcon?: typeof MercadoLibre;
  color: string;
};

const brands: Brand[] = [
  { name: 'Instagram', icon: siInstagram, color: '#E4405F' },
  { name: 'TikTok', icon: siTiktok, color: '#FFFFFF' },
  { name: 'Shopee', icon: siShopee, color: '#EE4D2D' },
  { name: 'Mercado Livre', customIcon: MercadoLibre, color: '#FFE600' },
  { name: 'Google', icon: siGoogle, color: '#4285F4' },
  { name: 'Meta', icon: siMeta, color: '#0866FF' },
];

const BrandIcon = ({ brand }: { brand: Brand }) => {
  if (brand.customIcon) {
    const Icon = brand.customIcon;
    return <Icon className="h-8 w-8" aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true" fill="currentColor">
      <path d={brand.icon?.path} />
    </svg>
  );
};

const IntegrationsSection = () => (
  <section className="relative overflow-hidden pb-16 pt-6 sm:pb-20 sm:pt-8" aria-labelledby="tools-title">
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
    <div className="container-custom relative">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} className="order-2 lg:order-1">
          <div className="mx-auto grid max-w-[390px] grid-cols-2 gap-3 sm:grid-cols-3">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative flex min-h-28 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#101722]/90 p-4 text-center shadow-xl shadow-black/20 transition-colors hover:border-primary-400/40"
              >
                <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/30 transition-transform group-hover:scale-110" style={{ color: brand.color }}>
                  <BrandIcon brand={brand} />
                </span>
                <span className="text-xs font-semibold text-gray-300">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} className="order-1 text-center lg:order-2 lg:text-left">
          <div className="inline-flex rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-300">
            Ferramentas do ecossistema
          </div>
          <h2 id="tools-title" className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Trabalhamos onde o seu negócio acontece.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0">
            Estratégia e execução conectadas às principais plataformas de presença, conteúdo, anúncios e vendas digitais.
          </p>
          <Link to="/servicos" className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border border-primary-400/40 bg-primary-500/10 px-5 py-3 text-sm font-bold text-primary-300 transition hover:bg-primary-500 hover:text-black">
            Conhecer nossos serviços <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default IntegrationsSection;
