import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, Sparkles, Trophy, Zap} from 'lucide-react';
import {MemoryRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import DashboardLayout from '../src/layouts/DashboardLayout';
import DashboardPage from '../src/pages/DashboardPage';
import orientohubLogo from '../public/orientohub.png';
import orientohubIsotipo from '../public/isotipo-orientohub.png';
import founderAvatar from '../public/fernando.jpg';
import {dashboardShowcaseData} from './dashboardShowcaseData';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const cinematicEase = Easing.bezier(.22, 1, .36, 1);

const sceneLabel = (frame: number) => {
  if (frame < 120) return ['VISÃO GERAL', 'Tudo o que importa, em um só lugar'];
  if (frame < 205) return ['JORNADA', 'Cada etapa mostra o próximo movimento'];
  if (frame < 345) return ['EXECUÇÃO', 'Transforme prioridade em progresso'];
  if (frame < 425) return ['EVOLUÇÃO', 'Cada ação fortalece o seu nível'];
  if (frame < 500) return ['FRAMEWORKS', 'Progresso atualizado em tempo real'];
  return ['CONQUISTAS', 'Seu avanço vira histórico e reconhecimento'];
};

export const DashboardShowcase = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, config: {damping: 18, stiffness: 90, mass: .8}});
  const pageY = interpolate(
    frame,
    [0, 90, 135, 185, 215, 335, 390, 420, 460, 590],
    [0, 0, -300, -300, -690, -690, 0, 0, -900, -900],
    {...clamp, easing: cinematicEase},
  );
  const cameraScale = interpolate(frame, [0, 35, 90, 180, 235, 345, 390, 460, 540, 590], [.965, 1, 1.018, 1.025, 1, 1, 1.01, 1.025, 1.018, 1], {...clamp, easing: cinematicEase});
  const cameraX = interpolate(frame, [0, 160, 230, 345, 420, 500, 590], [0, 0, 20, 20, 0, -12, 0], {...clamp, easing: cinematicEase});
  const cursorX = interpolate(frame, [235, 275, 310, 342], [520, 300, 196, 196], {...clamp, easing: cinematicEase});
  const cursorY = interpolate(frame, [235, 275, 310, 342], [760, 410, 220, 220], {...clamp, easing: cinematicEase});
  const cursorScale = interpolate(frame, [312, 320, 330, 338], [1, 1, .68, 1], clamp);
  const clickPulse = interpolate(frame, [318, 328, 344], [0, 1, 0], clamp);
  const labelOpacity = interpolate(frame % 100, [0, 12, 82, 99], [0, 1, 1, 0], clamp);
  const success = spring({frame: frame - 330, fps, config: {damping: 12, stiffness: 180, mass: .55}});
  const xpFlight = interpolate(frame, [330, 352, 386], [0, .55, 1], {...clamp, easing: cinematicEase});
  const xpOpacity = interpolate(frame, [328, 338, 378, 395], [0, 1, 1, 0], clamp);
  const toast = spring({frame: frame - 502, fps, config: {damping: 16, stiffness: 115}});
  const fadeOut = interpolate(frame, [575, 599], [1, 0], clamp);
  const [eyebrow, caption] = sceneLabel(frame);
  const showcaseUser = {
    email: 'fersouluramal@gmail.com',
    user_metadata: {name: 'Fernando Luiz Souza Ramalho', company: 'OrientoHub', avatar_url: founderAvatar},
  };

  const content = (
    <div style={{transform: `translate3d(0, ${pageY}px, 0)`, minHeight: 2800, willChange: 'transform'}}>
      <DashboardPage initialDashboardData={dashboardShowcaseData} showcaseFrame={frame} />
    </div>
  );

  return (
    <AbsoluteFill style={{background: '#070b11', overflow: 'hidden', opacity: fadeOut, fontFamily: 'Inter, ui-sans-serif, system-ui'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${cameraX}px) scale(${cameraScale})`, opacity: intro, filter: `blur(${(1 - intro) * 10}px)`, willChange: 'transform, filter'}}>
        <HelmetProvider>
          <MemoryRouter initialEntries={['/dashboard']}>
            <DashboardLayout
              showcaseContent={content}
              showcaseUser={showcaseUser}
              showcasePlan="free"
              showcaseLogo={orientohubLogo}
              showcaseIsotipo={orientohubIsotipo}
              initialCollapsed
              hideContactFab
            />
          </MemoryRouter>
        </HelmetProvider>
      </div>

      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(circle at 55% 48%, transparent 52%, rgba(3,6,10,.34) 100%)', boxShadow: 'inset 0 0 130px rgba(0,0,0,.3)'}} />

      <div style={{position: 'absolute', left: 116, bottom: 54, opacity: labelOpacity, transform: `translateY(${(1 - labelOpacity) * 14}px)`, zIndex: 70}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, color: '#facc15', fontSize: 13, fontWeight: 800, letterSpacing: '0.18em'}}>
          <span style={{width: 32, height: 2, background: '#facc15'}} />{eyebrow}
        </div>
        <div style={{marginTop: 8, color: 'white', fontSize: 25, fontWeight: 650, letterSpacing: '-.025em', textShadow: '0 4px 20px rgba(0,0,0,.7)'}}>{caption}</div>
      </div>

      {frame >= 230 && frame < 350 && (
        <div style={{position: 'absolute', left: cursorX, top: cursorY, width: 30, height: 40, transform: `scale(${cursorScale})`, transformOrigin: 'top left', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.75))', zIndex: 90}}>
          <svg viewBox="0 0 28 38" width="30" height="40" aria-hidden="true">
            <path d="M2 2v29l8-7 6 12 6-3-6-11h10L2 2Z" fill="white" stroke="#0c121b" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {frame >= 316 && frame < 350 && (
        <div style={{position: 'absolute', left: 194, top: 218, width: 28, height: 28, borderRadius: '50%', border: '3px solid #facc15', opacity: clickPulse, transform: `translate(-50%, -50%) scale(${.4 + clickPulse * 3.8})`, boxShadow: '0 0 36px #facc15', zIndex: 80}} />
      )}

      {frame >= 327 && frame < 370 && (
        <div style={{position: 'absolute', left: 195, top: 220, width: 50, height: 50, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#04130b', background: '#34d399', boxShadow: '0 0 0 8px rgba(52,211,153,.14), 0 0 42px rgba(52,211,153,.8)', transform: `translate(-50%, -50%) scale(${success})`, zIndex: 82}}>
          <Check size={30} strokeWidth={4} />
        </div>
      )}

      {frame >= 328 && frame < 398 && (
        <div style={{position: 'absolute', left: interpolate(xpFlight, [0, 1], [218, 724]), top: interpolate(xpFlight, [0, 1], [190, 145]), opacity: xpOpacity, transform: `translate(-50%, -50%) scale(${1 + Math.sin(xpFlight * Math.PI) * .22})`, display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 999, background: 'linear-gradient(135deg,#facc15,#eab308)', color: '#090d13', fontWeight: 900, fontSize: 17, boxShadow: '0 10px 32px rgba(250,204,21,.45)', zIndex: 85}}>
          <Zap size={18} fill="currentColor" /> +100 XP
        </div>
      )}

      {frame >= 500 && frame < 590 && (
        <div style={{position: 'absolute', right: 44, top: 92, width: 360, padding: 18, borderRadius: 18, border: '1px solid rgba(250,204,21,.45)', background: 'linear-gradient(135deg,rgba(20,28,39,.98),rgba(11,17,25,.98))', boxShadow: '0 24px 70px rgba(0,0,0,.5), 0 0 42px rgba(250,204,21,.12)', transform: `translateX(${(1 - toast) * 430}px) scale(${.94 + toast * .06})`, opacity: toast, zIndex: 88}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', color: '#facc15', background: 'rgba(250,204,21,.12)', boxShadow: 'inset 0 0 0 1px rgba(250,204,21,.2)'}}><Trophy size={28} /></div>
            <div style={{flex: 1}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 7, color: '#facc15', fontSize: 11, fontWeight: 900, letterSpacing: '.12em'}}><Sparkles size={13} /> CONQUISTA DESBLOQUEADA</div>
              <div style={{marginTop: 5, color: 'white', fontSize: 20, fontWeight: 800}}>Validador</div>
              <div style={{marginTop: 3, color: '#9ba9bc', fontSize: 13}}>Primeira hipótese validada com sucesso</div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
