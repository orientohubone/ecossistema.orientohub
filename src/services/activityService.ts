import { supabase } from '../config/supabase';

export type UserActivity = { id: string; action: string; target: string; entity_type: string; entity_id: string | null; xp: number; icon: string; created_at: string };
export const activityService = {
  async log(action: string, target: string, entityType: string, entityId: string, xp = 0, icon = 'Activity') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('user_activity').insert({ user_id: user.id, action, target, entity_type: entityType, entity_id: entityId, xp, icon });
  },
  async getRecent(limit = 5) {
    const { data, error } = await supabase.from('user_activity').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return (data || []) as UserActivity[];
  },
};
