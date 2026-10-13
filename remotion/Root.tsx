import {Composition} from 'remotion';
import {JourneyShowcase} from './JourneyShowcase';
import {DashboardShowcase} from './DashboardShowcase';
import {IdeasShowcase} from './IdeasShowcase';

export const RemotionRoot = () => (
  <>
    <Composition id="JornadaEmpreendedora" component={JourneyShowcase} durationInFrames={480} fps={30} width={1920} height={1080} />
    <Composition id="Dashboard" component={DashboardShowcase} durationInFrames={600} fps={30} width={1920} height={1080} />
    <Composition id="Ideias" component={IdeasShowcase} durationInFrames={600} fps={30} width={1920} height={1080} />
  </>
);
