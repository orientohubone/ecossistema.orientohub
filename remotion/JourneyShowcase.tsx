import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {MemoryRouter} from 'react-router-dom';
import DashboardLayout from '../src/layouts/DashboardLayout';
import JourneyPage from '../src/pages/JourneyPage';
import orientohubLogo from '../public/orientohub.png';
import orientohubIsotipo from '../public/isotipo-orientohub.png';
import founderAvatar from '../public/fernando.jpg';
import {journeyShowcaseData} from './journeyShowcaseData';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const JourneyShowcase = () => {
  const frame = useCurrentFrame();
  const selectedPhase = frame < 255 ? 0 : 1;
  const expandedMission = frame >= 355 ? 6 : null;
  const pageY = interpolate(frame, [0, 90, 115, 205, 225, 295, 325, 405, 455], [0, 0, -350, -350, -350, -650, -650, -1030, -1030], clamp);
  const cursorX = interpolate(frame, [220, 255, 315, 355, 395], [670, 670, 920, 920, 1450], clamp);
  const cursorY = interpolate(frame, [220, 255, 315, 355, 395], [300, 300, 520, 520, 870], clamp);
  const cursorScale = interpolate(frame, [247, 254, 261, 347, 354, 361], [1, .72, 1, 1, .72, 1], clamp);
  const fadeOut = interpolate(frame, [458, 479], [1, 0], clamp);
  const showcaseUser = {
    email: 'fersouluramal@gmail.com',
    user_metadata: {name: 'Fernando Luiz Souza Ramalho', company: 'OrientoHub', avatar_url: founderAvatar},
  };

  const journeyContent = (
    <div
      className="dark"
      style={{
        width: '100%',
        minHeight: 2200,
        transform: `translateY(${pageY}px)`,
        transformOrigin: 'top center',
        opacity: 1,
      }}
    >
      <JourneyPage
        initialJourneyPhases={journeyShowcaseData}
        showcaseSelectedPhase={selectedPhase}
        showcaseExpandedMission={expandedMission}
        showcaseFrame={frame}
      />
    </div>
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#080d15', overflow: 'hidden', opacity: fadeOut}}>
      <MemoryRouter initialEntries={['/dashboard/jornada']}>
        <DashboardLayout
          showcaseContent={journeyContent}
          showcaseUser={showcaseUser}
          showcasePlan="free"
          showcaseLogo={orientohubLogo}
          showcaseIsotipo={orientohubIsotipo}
          initialCollapsed
          hideContactFab
        />
      </MemoryRouter>

      {frame >= 210 && frame < 435 && (
        <div style={{
          position: 'absolute', left: cursorX, top: cursorY, width: 30, height: 40,
          transform: `scale(${cursorScale})`, transformOrigin: 'top left',
          filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.65))', zIndex: 20,
        }}>
          <svg viewBox="0 0 28 38" width="30" height="40" aria-hidden="true">
            <path d="M2 2v29l8-7 6 12 6-3-6-11h10L2 2Z" fill="white" stroke="#0c121b" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
