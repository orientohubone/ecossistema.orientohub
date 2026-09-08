import { supabase } from '../config/supabase';

export type CrmStage = 'novo' | 'qualificando' | 'proposta' | 'negociação' | 'ganho' | 'perdido';

export interface CrmClient {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  cnpj?: string | null;
  address?: string | null;
  services?: string[] | null;
  demand?: string | null;
  source: string;
  stage: CrmStage;
  estimated_value?: number | null;
  next_step?: string | null;
  next_contact_on?: string | null;
  last_contact_at?: string | null;
  created_at: string;
}

export interface CrmNote { id: string; client_id: string; body: string; created_at: string; }
export interface CrmTask { id: string; client_id: string; title: string; completed: boolean; sort_order: number; created_at: string; completed_at?: string | null; }

export const crmService = {
  async getClients() {
    const { data, error } = await supabase.from('crm_clients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as CrmClient[];
  },
  async createClient(client: Pick<CrmClient, 'name' | 'email' | 'phone' | 'company' | 'cnpj' | 'address' | 'services' | 'demand'>) {
    const { data, error } = await supabase.from('crm_clients').insert({ ...client, source: 'manual' }).select().single();
    if (error) throw error;
    return data as CrmClient;
  },
  async updateClient(id: string, updates: Partial<Pick<CrmClient, 'stage' | 'estimated_value' | 'next_step' | 'next_contact_on' | 'demand' | 'last_contact_at'>>) {
    const { data, error } = await supabase.from('crm_clients').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as CrmClient;
  },
  async deleteClient(id: string) {
    const { error } = await supabase.from('crm_clients').delete().eq('id', id);
    if (error) throw error;
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
  async getTasks(clientId: string) {
    const { data, error } = await supabase.from('crm_tasks').select('*').eq('client_id', clientId).order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []) as CrmTask[];
  },
  async addTask(clientId: string, title: string, sortOrder: number) {
    const { data, error } = await supabase.from('crm_tasks').insert({ client_id: clientId, title, sort_order: sortOrder }).select().single();
    if (error) throw error;
    return data as CrmTask;
  },
  async toggleTask(id: string, completed: boolean) {
    const { data, error } = await supabase.from('crm_tasks').update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', id).select().single();
    if (error) throw error;
    return data as CrmTask;
  },
  async deleteTask(id: string) {
    const { error } = await supabase.from('crm_tasks').delete().eq('id', id);
    if (error) throw error;
  },
  async reorderTasks(tasks: Pick<CrmTask, 'id' | 'sort_order'>[]) {
    await Promise.all(tasks.map(async (task) => {
      const { error } = await supabase.from('crm_tasks').update({ sort_order: task.sort_order }).eq('id', task.id);
      if (error) throw error;
    }));
  },
};
