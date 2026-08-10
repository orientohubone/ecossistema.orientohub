import { supabase } from '../config/supabase';

export type CrmStage = 'novo' | 'qualificando' | 'proposta' | 'negociação' | 'ganho' | 'perdido';

export interface CrmClient {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  demand?: string | null;
  source: string;
  stage: CrmStage;
  estimated_value?: number | null;
  next_step?: string | null;
  last_contact_at?: string | null;
  created_at: string;
}

export interface CrmNote { id: string; client_id: string; body: string; created_at: string; }

export const crmService = {
  async getClients() {
    const { data, error } = await supabase.from('crm_clients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as CrmClient[];
  },
  async createClient(client: Pick<CrmClient, 'name' | 'email' | 'phone' | 'company' | 'demand'>) {
    const { data, error } = await supabase.from('crm_clients').insert({ ...client, source: 'manual' }).select().single();
    if (error) throw error;
    return data as CrmClient;
  },
  async updateClient(id: string, updates: Partial<Pick<CrmClient, 'stage' | 'estimated_value' | 'next_step' | 'demand' | 'last_contact_at'>>) {
    const { data, error } = await supabase.from('crm_clients').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as CrmClient;
  },
  async getNotes(clientId: string) {
    const { data, error } = await supabase.from('crm_notes').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as CrmNote[];
  },
  async addNote(clientId: string, body: string) {
    const { data, error } = await supabase.from('crm_notes').insert({ client_id: clientId, body }).select().single();
    if (error) throw error;
    return data as CrmNote;
  },
};
