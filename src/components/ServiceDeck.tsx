import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MoveUpRight } from 'lucide-react';
import { serviceCatalog } from '../data/serviceCatalog';
import BlackFridaySeal from '../bf-2026/BlackFridaySeal';
import './ServiceDeck.css';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const blackFridayExcluded = new Set(['estrategia', 'inovacao', 'marketing', 'dominio', 'design']);

export default function ServiceDeck() {
  const [active, setActive] = useState(0);
  const [opening, setOpening] = useState<string | null>(null);
  const navigate = useNavigate();
  const pointerStart = useRef<{ x: number; y: number; id: number; horizontal: boolean } | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const [dragX, setDragX] = useState(0);
  const select = (index: number) => {
    if (!opening) setActive((index + serviceCatalog.length) % serviceCatalog.length);
  };
  return <div className="service-deck">
    <nav aria-label="Escolher serviço" className="mb-8 flex flex-wrap gap-2">
      {serviceCatalog.map((service, index) => <button key={service.slug} type="button" aria-pressed={active === index} onClick={() => select(index)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF200] ${active === index ? 'border-[#FFF200] bg-[#FFF200] text-black' : 'border-white/20 text-white/70 hover:border-white/60 hover:text-white'}`}>{service.title}</button>)}
    </nav>
    <div className="service-deck-controls flex items-center justify-center">
      <p aria-live="polite" aria-atomic="true" className="text-sm text-white/65"><span className="font-semibold text-white">{String(active + 1).padStart(2, '0')}</span> / {serviceCatalog.length} <span className="ml-3">{serviceCatalog[active].title}</span></p>

    </div>
    <div className={`service-deck-stage ${opening ? 'is-gathering' : ''}`}>
    <button type="button" aria-label="Serviço anterior" onClick={() => select(active - 1)} className="service-deck-arrow service-deck-arrow--previous"><ArrowLeft className="h-5 w-5" /></button>
    <div role="region" aria-roledescription="carrossel" aria-label="Nossos serviços" tabIndex={0} className={`service-deck-track ${dragX ? 'is-dragging' : ''}`} style={{ '--deck-drag': `${dragX}px` } as CSSProperties} onClickCapture={event => {
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    }} onTouchStartCapture={event => {
      suppressClick.current = false;
      if (opening || event.touches.length !== 1) { touchStart.current = null; return; }
      touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }} onTouchMoveCapture={event => {
      const start = touchStart.current;
      if (!start || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { touchStart.current = null; return; }
      if (Math.abs(dx) < 6) return;
      suppressClick.current = true;
      setDragX(Math.max(-160, Math.min(160, dx)));
    }} onTouchEndCapture={event => {
      const start = touchStart.current;
      touchStart.current = null;
      setDragX(0);
      if (!start) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      if (Math.abs(dx) >= 16) select(active + (dx < 0 ? 1 : -1));
      if (suppressClick.current) window.setTimeout(() => { suppressClick.current = false; }, 400);
    }} onTouchCancelCapture={() => {
      touchStart.current = null;
      setDragX(0);
    }} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(active + (event.key === 'ArrowRight' ? 1 : -1)); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : serviceCatalog.length - 1); }
    }} onDragStart={event => event.preventDefault()} onPointerDown={event => {
      suppressClick.current = false;
      if (opening || event.pointerType === 'touch' || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0) || !window.matchMedia('(max-width: 767px)').matches) return;
      pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId, horizontal: false };
    }} onPointerMove={event => {
      const start = pointerStart.current;
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!start.horizontal) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { pointerStart.current = null; return; }
        if (Math.abs(dx) < 6) return;
        start.horizontal = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      suppressClick.current = true;
      setDragX(Math.max(-160, Math.min(160, dx)));
    }} onPointerUp={event => {
      const start = pointerStart.current;
      pointerStart.current = null;
      setDragX(0);
      if (!start || start.id !== event.pointerId) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      const dx = event.clientX - start.x;
      if (start.horizontal && Math.abs(dx) >= 16) select(active + (dx < 0 ? 1 : -1));
      if (suppressClick.current) window.setTimeout(() => { suppressClick.current = false; }, 400);
    }} onPointerCancel={() => { pointerStart.current = null; setDragX(0); }} onLostPointerCapture={() => { pointerStart.current = null; setDragX(0); }}>

      {serviceCatalog.map((service, index) => {
        const offset = (index - active + serviceCatalog.length) % serviceCatalog.length;
        const position = offset > serviceCatalog.length / 2 ? offset - serviceCatalog.length : offset;
        const cardClass = position === 0 ? 'is-active' : position === -1 ? 'is-before' : position === 1 ? 'is-after' : position === -2 ? 'is-far-before' : position === 2 ? 'is-far-after' : '';
        const price = service.pricing;
        const value = price?.fixed ?? price?.promotional ?? price?.startingAt;
        const hasBlackFridayOffer = !blackFridayExcluded.has(service.slug) && value !== undefined;
        const originalValue = hasBlackFridayOffer ? price?.original ?? value : undefined;
        const discountedValue = originalValue === undefined ? value : originalValue / 2;
        return <article key={service.slug} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${serviceCatalog.length}: ${service.title}`} aria-hidden={active !== index} aria-busy={opening === service.slug} className={`service-metal-card ${cardClass} ${opening === service.slug ? 'is-opening' : ''}`} onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName === 'service-deck-open' && opening === service.slug) navigate(`/servicos/${service.slug}`);
        }}>
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-5"><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">OrientoHub / Serviços</span><span className="font-mono text-sm text-[#FFF200]">{String(index + 1).padStart(2, '0')} / {serviceCatalog.length}</span></div>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.15em] text-[#FFF200]">{service.eyebrow}</p>
            <h3 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{service.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">{service.outcome}</p>
            <ul className="my-7 space-y-3">{service.deliverables.map(item => <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FFF200]" />{item}</li>)}</ul>
            <div className="mt-auto border-t border-white/20 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">{price?.startingAt !== undefined && price.fixed === undefined && price.promotional === undefined ? price.startingAtLabel ?? 'A partir de' : 'Investimento'}</p>
              {hasBlackFridayOffer && originalValue !== undefined && <span className="mt-1 block text-sm text-white/50 line-through">{money(originalValue)}</span>}
              {!hasBlackFridayOffer && price?.original !== undefined && price.promotional !== undefined && <span className="mt-1 block text-sm text-white/50 line-through">{money(price.original)}</span>}
              <div className="-mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-2xl font-bold">{price?.customText ?? (discountedValue !== undefined ? money(discountedValue) : 'Escopo personalizado')}<span className="text-sm font-normal text-white/65">{price?.suffix}</span></p>
                {hasBlackFridayOffer && <BlackFridaySeal className="h-12 w-auto shrink-0" />}
              </div>
              {price?.alternative && <p className="mt-2 text-xs text-white/65">{price.alternative.label}: {hasBlackFridayOffer ? <><span className="mr-1 line-through opacity-60">{money(price.alternative.value)}</span>{money(price.alternative.value / 2)}</> : money(price.alternative.value)}</p>}
              {price?.note && <p className="mt-2 text-xs leading-relaxed text-white/60">{price.note}</p>}
              <Link to={`/servicos/${service.slug}`} tabIndex={active === index ? 0 : -1} onClick={event => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                event.preventDefault();
                if (!opening) setOpening(service.slug);
              }} className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#FFF200] px-5 py-4 text-sm font-bold text-black transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Conhecer {service.title}<MoveUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </article>;
      })}
    </div>
    <button type="button" aria-label="Próximo serviço" onClick={() => select(active + 1)} className="service-deck-arrow service-deck-arrow--next"><ArrowRight className="h-5 w-5" /></button>
    </div>
    <p className="mt-3 text-xs text-white/50">Deslize as cartas ou selecione um serviço acima para explorar.</p>
  </div>;
}
