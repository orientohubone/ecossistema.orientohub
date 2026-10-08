import { useEffect } from 'react';
import { Trophy } from 'lucide-react';

const colors = ['#fff200', '#34d399', '#ffffff', '#38bdf8', '#fbbf24'];
export const SaleCelebration = ({ dealName, onDone }: { dealName: string; onDone: () => void }) => {
  useEffect(() => { const timer = window.setTimeout(onDone, 3200); return () => window.clearTimeout(timer); }, [onDone]);
  return <div className="sale-celebration" role="status" aria-live="polite"><div className="celebration-confetti" aria-hidden="true">{Array.from({ length: 44 }, (_, index) => <i key={index} style={{ '--x': `${(index * 37) % 100}vw`, '--delay': `${(index % 11) * .055}s`, '--duration': `${1.8 + (index % 7) * .14}s`, '--rotate': `${(index * 47) % 360}deg`, '--color': colors[index % colors.length] } as React.CSSProperties} />)}</div><div className="celebration-card"><span><Trophy /></span><p>Parabéns!</p><strong>Venda registrada</strong><small>{dealName}</small></div></div>;
};
