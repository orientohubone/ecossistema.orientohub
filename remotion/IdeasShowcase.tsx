import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, Lightbulb, Sparkles} from 'lucide-react';
import {MemoryRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import DashboardLayout from '../src/layouts/DashboardLayout';
import IdeasPage from '../src/pages/IdeasPage';
import orientohubLogo from '../public/orientohub.png';
import orientohubIsotipo from '../public/isotipo-orientohub.png';
import founderAvatar from '../public/fernando.jpg';
import {ideasShowcaseData, ideasShowcaseHypotheses} from './ideasShowcaseData';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(.22, 1, .36, 1);

export const IdeasShowcase = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, config: {damping: 18, stiffness: 85}});
  const modalShift = interpolate(frame, [455, 520], [0, -150], {...clamp, easing: ease});
  const scale = interpolate(frame, [0, 35, 140, 290, 330, 455, 520, 590], [.965, 1, 1.018, 1.025, 1, 1, 1.035, 1], {...clamp, easing: ease});
  const dragProgress = interpolate(frame, [150, 215], [0, 1], {...clamp, easing: ease});
  const dragX = interpolate(dragProgress, [0, 1], [555, 850]);
  const dragY = 520 - Math.sin(dragProgress * Math.PI) * 70;
  const dragOpacity = interpolate(frame, [142, 150, 211, 225], [0, 1, 1, 0], clamp);
  const cursorX = interpolate(frame, [115, 150, 215, 270, 292], [780, 540, 835, 850, 850], {...clamp, easing: ease});
  const cursorY = interpolate(frame, [115, 150, 215, 270, 292], [750, 535, 535, 535, 535], {...clamp, easing: ease});
  const click = interpolate(frame, [276, 283, 292], [1, .68, 1], clamp);
  const hypothesisPulse = interpolate(frame, [402, 416, 438], [0, 1, 0], clamp);
  const quality = Math.round(interpolate(frame, [430, 490], [62, 90], clamp));
  const toast = spring({frame: frame - 465, fps, config: {damping: 14, stiffness: 120}});
  const fade = interpolate(frame, [575, 599], [1, 0], clamp);
  const showcaseUser = {email: 'fersouluramal@gmail.com', user_metadata: {name: 'Fernando Luiz Souza Ramalho', avatar_url: founderAvatar}};

  return (
    <AbsoluteFill style={{background: '#070b11', overflow: 'hidden', opacity: fade, fontFamily: 'Inter, ui-sans-serif, system-ui'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${modalShift}px) scale(${scale})`, opacity: intro, filter: `blur(${(1 - intro) * 10}px)`, willChange: 'transform'}}>
        <HelmetProvider>
          <MemoryRouter initialEntries={['/dashboard/ideas']}>
            <DashboardLayout showcaseContent={<IdeasPage initialIdeas={ideasShowcaseData} initialHypotheses={ideasShowcaseHypotheses} showcaseFrame={frame} />} showcaseUser={showcaseUser} showcasePlan="free" showcaseLogo={orientohubLogo} showcaseIsotipo={orientohubIsotipo} initialCollapsed hideContactFab />
          </MemoryRouter>
        </HelmetProvider>
      </div>

      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(circle at 52% 50%, transparent 55%, rgba(2,5,9,.38) 100%)'}} />

      {frame >= 140 && frame < 226 && <div style={{position: 'absolute', left: dragX, top: dragY, width: 250, padding: 16, borderRadius: 16, border: '1px solid rgba(250,204,21,.7)', background: 'rgba(21,31,43,.96)', boxShadow: '0 22px 60px rgba(0,0,0,.55),0 0 35px rgba(250,204,21,.18)', opacity: dragOpacity, transform: `translate(-50%,-50%) rotate(${interpolate(dragProgress,[0,1],[-2,2])}deg)`, zIndex: 80}}>
        <div style={{display: 'flex', gap: 10, color: 'white', fontWeight: 800}}><Lightbulb size={18} color="#fde047" />Copiloto de follow-up</div>
        <div style={{marginTop: 9, color: '#9ba9bc', fontSize: 13}}>Movendo para Validação</div>
        <div style={{marginTop: 12, textAlign: 'right', color: '#fde047', fontSize: 12, fontWeight: 800}}>Curadoria 62%</div>
      </div>}

      {frame >= 110 && frame < 300 && <div style={{position: 'absolute', left: cursorX, top: cursorY, width: 30, height: 40, transform: `scale(${click})`, transformOrigin: 'top left', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.75))', zIndex: 90}}><svg viewBox="0 0 28 38" width="30" height="40"><path d="M2 2v29l8-7 6 12 6-3-6-11h10L2 2Z" fill="white" stroke="#0c121b" strokeWidth="2.4" strokeLinejoin="round" /></svg></div>}

      {frame >= 398 && frame < 442 && <div style={{position: 'absolute', right: 192, top: 457, width: 210, height: 62, borderRadius: 14, border: '2px solid #a78bfa', opacity: hypothesisPulse, transform: `scale(${.96 + hypothesisPulse * .05})`, boxShadow: '0 0 36px rgba(167,139,250,.7)', zIndex: 75}} />}

      {frame >= 450 && frame < 555 && <div style={{position: 'absolute', right: 48, top: 86, width: 350, padding: 18, borderRadius: 18, border: '1px solid rgba(250,204,21,.42)', background: 'rgba(12,18,27,.96)', boxShadow: '0 24px 65px rgba(0,0,0,.5)', transform: `translateX(${(1 - toast) * 430}px)`, opacity: toast, zIndex: 95}}>
        <div style={{display: 'flex', gap: 13, alignItems: 'center'}}><div style={{width: 48, height: 48, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#34d399', background: 'rgba(52,211,153,.12)'}}><Check size={27} strokeWidth={3}/></div><div><div style={{display: 'flex', alignItems: 'center', gap: 6, color: '#facc15', fontSize: 11, fontWeight: 900, letterSpacing: '.1em'}}><Sparkles size={13}/> DOSSIÊ EVOLUINDO</div><div style={{marginTop: 5, color: 'white', fontSize: 19, fontWeight: 800}}>Qualidade {quality}%</div><div style={{marginTop: 2, color: '#9ba9bc', fontSize: 13}}>Hipótese em teste e evidência registrada</div></div></div>
      </div>}

      <div style={{position: 'absolute', left: 116, bottom: 48, zIndex: 92}}><div style={{display: 'flex', alignItems: 'center', gap: 9, color: '#facc15', fontSize: 12, fontWeight: 900, letterSpacing: '.16em'}}><span style={{width: 28, height: 2, background: '#facc15'}} />{frame < 140 ? 'MAPEIE OPORTUNIDADES' : frame < 300 ? 'MOVIMENTE A IDEIA' : frame < 445 ? 'TESTE HIPÓTESES' : 'CONSOLIDE EVIDÊNCIAS'}</div><div style={{marginTop: 7, color: 'white', fontSize: 25, fontWeight: 750}}>{frame < 140 ? 'Do sinal inicial ao mapa de oportunidades' : frame < 300 ? 'O kanban acompanha a maturidade de cada ideia' : frame < 445 ? 'Detalhes transformam suposições em experimentos' : 'Curadoria clara antes de virar projeto'}</div></div>
    </AbsoluteFill>
  );
};
