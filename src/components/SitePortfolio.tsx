import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe2 } from 'lucide-react';
import { sitePortfolio } from '../data/sitePortfolio';

const SitePortfolio = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasMultipleSites = positions.length > 1;
  const autoplayActive = isPlaying && !isHovered && isVisible && isPageVisible && !reducedMotion && hasMultipleSites;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setIsPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    if (trackRef.current) observer.observe(trackRef.current);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!autoplayActive) return;
    const timer = window.setTimeout(() => {
      trackRef.current?.scrollTo({
        left: positions[(activeIndex + 1) % positions.length],
        behavior: 'smooth',
      });
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [autoplayActive, activeIndex, positions]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updatePositions = () => {
      const slides = Array.from(track.children) as HTMLElement[];
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const nextPositions = slides.reduce<number[]>((result, slide) => {
        const position = Math.min(slide.offsetLeft - slides[0].offsetLeft, maxScroll);
        if (!result.length || position - result[result.length - 1] > 1) result.push(position);
        return result;
      }, []);
      setPositions(nextPositions);
      setActiveIndex(nextPositions.reduce((closest, position, index) =>
        Math.abs(position - track.scrollLeft) < Math.abs(nextPositions[closest] - track.scrollLeft) ? index : closest, 0));
    };

    updatePositions();
    const observer = new ResizeObserver(updatePositions);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const goToSlide = (index: number) => {
    setIsPlaying(false);
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = (index + positions.length) % positions.length;
    track.scrollTo({
      left: positions[nextIndex],
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      aria-labelledby="site-portfolio-title"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsPlaying(false)}
      className="border-b border-[#273548] bg-[#101722]"
    >
      <div className="container-custom py-12 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">Sites que desenvolvemos</p>
            <h2 id="site-portfolio-title" className="mt-3 text-3xl font-bold sm:text-4xl">Do projeto ao ar.</h2>
            <p className="mt-3 leading-relaxed text-[#9ba9bc]">Conheça nosso trabalho e explore cada experiência de perto.</p>
          </div>
          {hasMultipleSites && (
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => goToSlide(activeIndex - 1)} aria-label="Site anterior" aria-controls="site-portfolio-track" className="rounded-full border border-[#34455a] p-3 text-white transition hover:border-violet-400 hover:bg-violet-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => goToSlide(activeIndex + 1)} aria-label="Próximo site" aria-controls="site-portfolio-track" className="rounded-full border border-[#34455a] p-3 text-white transition hover:border-violet-400 hover:bg-violet-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div role="region" aria-roledescription="carrossel" aria-label="Portfólio de sites">
          <div
            id="site-portfolio-track"
            ref={trackRef}
            onPointerDown={() => setIsPlaying(false)}
            onWheel={() => setIsPlaying(false)}
            tabIndex={hasMultipleSites ? 0 : undefined}
            onScroll={(event) => {
              const track = event.currentTarget;
              setActiveIndex(positions.reduce((closest, position, index) =>
                Math.abs(position - track.scrollLeft) < Math.abs(positions[closest] - track.scrollLeft) ? index : closest, 0));
            }}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget || !hasMultipleSites) return;
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                goToSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
              }
            }}
            className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
          >
            {sitePortfolio.map((site, index) => (
              <article key={site.url} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${sitePortfolio.length}: ${site.name}`} className="flex w-full min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#34455a] bg-[#0c121b] md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
                <div className="flex items-center gap-3 border-b border-[#273548] bg-[#151f2b] px-3 py-2.5">
                  <div aria-hidden="true" className="flex shrink-0 gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff605c]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd44]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00ca4e]" />
                  </div>
                  <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#0c121b] px-2 py-1 text-[11px] text-[#9ba9bc]"><Globe2 className="h-3 w-3 shrink-0" /><span className="truncate">{site.domain}</span></span>
                </div>
                <a href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`Visitar o site ${site.name} (abre em nova aba)`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-300">
                  <img src={site.screenshot} alt={`Captura da página inicial do site ${site.name}`} width={1918} height={1079} loading="lazy" decoding="async" className="aspect-video w-full object-contain transition-opacity group-hover:opacity-90" />
                </a>
                <div className="flex flex-1 flex-col items-start gap-4 border-t border-[#273548] p-4">
                  <div>
                    <h3 className="text-lg font-bold">{site.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#9ba9bc]">{site.description}</p>
                  </div>
                  <a href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`Visitar o site ${site.name} (abre em nova aba)`} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-200 transition hover:border-violet-300 hover:bg-violet-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">Visitar site <ArrowUpRight className="h-4 w-4" /></a>
                </div>
              </article>
            ))}
          </div>
          {hasMultipleSites && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {positions.map((position, index) => (
                <button key={position} type="button" onClick={() => goToSlide(index)} aria-label={`Ir para posição ${index + 1} do carrossel`} aria-controls="site-portfolio-track" aria-current={activeIndex === index ? 'true' : undefined} className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">
                  <span className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-6 bg-violet-300' : 'w-2 bg-[#34455a]'}`} />
                </button>
              ))}
              <span aria-live={autoplayActive ? 'off' : 'polite'} className="sr-only">Posição {activeIndex + 1} de {positions.length}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SitePortfolio;
