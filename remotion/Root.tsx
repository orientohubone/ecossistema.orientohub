import {Composition} from 'remotion';
import {JourneyShowcase} from './JourneyShowcase';

export const RemotionRoot = () => (
  <Composition
    id="JornadaEmpreendedora"
    component={JourneyShowcase}
    durationInFrames={480}
    fps={30}
    width={1920}
    height={1080}
  />
);
