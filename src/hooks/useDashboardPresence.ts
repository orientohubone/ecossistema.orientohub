import { useEffect } from 'react';
import { supabase } from '../config/supabase';

// Presence is auxiliary: a telemetry outage must never interrupt login or navigation.
export function useDashboardPresence(userId: string | undefined, pathname: string, disabled = false) {
  useEffect(() => {
    if (!userId || disabled) return;
    let inflight = false;
    const screen = pathname.split('/')[2] || 'dashboard';
    const send = async () => {
      if (document.visibilityState !== 'visible' || inflight) return;
      inflight = true;
      try {
        const { error } = await supabase.rpc('record_dashboard_presence', { screen_name: screen });
        if (error) console.warn('Presença do dashboard indisponível:', error.code);
      } catch { /* Auxiliary telemetry cannot block the application. */ }
      finally { inflight = false; }
    };
    void send();
    const timer = window.setInterval(() => void send(), 60000);
    const onVisible = () => void send();
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [userId, pathname, disabled]);
}
