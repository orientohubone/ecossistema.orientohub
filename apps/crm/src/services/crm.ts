import { supabase } from '../lib/supabase';
import type { Company, Contact, Deal, DealStage } from '../types/crm';

type DealRow = Omit<Deal, 'company'> & { company?: { name?: string | null } | null };

export const crm = {
  async globalSearch(term: string) {
    const query = term.trim();
    if (query.length < 2) return { deals: [], companies: [], contacts: [] };
    const pattern = `%${query.replace(/[%_]/g, '')}%`;
    const [dealsResult, companiesResult, contactsResult] = await Promise.all([
      supabase.from('crm_deals').select('id, name, stage, company:crm_companies(name)').ilike('name', pattern).limit(5),
      supabase.from('crm_companies').select('id, name, segment').or(`name.ilike.${pattern},cnpj.ilike.${pattern}`).limit(5),
      supabase.from('crm_contacts').select('id, name, email, company:crm_companies(name)').or(`name.ilike.${pattern},email.ilike.${pattern}`).limit(5),
    ]);
    if (dealsResult.error) throw dealsResult.error;
    if (companiesResult.error) throw companiesResult.error;
    if (contactsResult.error) throw contactsResult.error;
    const normalizeCompany = (value: { name?: string | null } | { name?: string | null }[] | null) => Array.isArray(value) ? value[0] || null : value;
    return {
      deals: (dealsResult.data || []).map((item) => ({ ...item, company: normalizeCompany(item.company) })),
      companies: companiesResult.data || [],
      contacts: (contactsResult.data || []).map((item) => ({ ...item, company: normalizeCompany(item.company) })),
    };
  },
  async listDeals() {
    const { data, error } = await supabase.from('crm_deals').select('*, company:crm_companies(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return ((data || []) as DealRow[]).map((deal) => ({ ...deal, company: deal.company?.name || null })) as Deal[];
  },
  async moveDeal(id: string, stage: DealStage) {
    const { data: current } = await supabase.from('crm_deals').select('stage').eq('id', id).maybeSingle();
    const status = stage === 'ganho' ? 'won' : stage === 'perdido' ? 'lost' : 'open';
    const { data, error } = await supabase.from('crm_deals').update({ stage, status, closed_at: status === 'open' ? null : new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
    if (error) throw error;
    if (current?.stage && current.stage !== stage) {
      const labels: Record<string, string> = { novo: 'Sem contato', qualificando: 'Contato feito', proposta: 'Proposta', negociação: 'Negociação', ganho: 'Ganho', perdido: 'Perdido' };
      await supabase.from('crm_notes').insert({ deal_id: id, client_id: null, body: `Etapa alterada de ${labels[current.stage] || current.stage} para ${labels[stage] || stage}` });
    }
    return data as Deal;
  },
  async getDeal(id: string) {
    const { data, error } = await supabase.from('crm_deals').select('*, company:crm_companies!crm_deals_company_id_fkey(*), primary_contact:crm_contacts!crm_deals_primary_contact_id_fkey(*)').eq('id', id).single();
    if (error) throw error;
    return data as Deal & { company: Company | null; primary_contact: Contact | null; demand?: string | null; campaign?: string | null; status: 'open' | 'won' | 'lost' };
  },
  async getDealNotes(dealId: string) {
    const { data, error } = await supabase.from('crm_notes').select('id, body, created_at').eq('deal_id', dealId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getDealTasks(dealId: string) {
    const { data, error } = await supabase.from('crm_tasks').select('id, title, description, completed, starts_at, ends_at, due_at, sort_order, created_at').eq('deal_id', dealId).order('sort_order').order('created_at');
    if (error) throw error;
    return data || [];
  },
  async reorderTasks(taskIds: string[]) {
    const results = await Promise.all(taskIds.map((id, index) => supabase.from('crm_tasks').update({ sort_order: index }).eq('id', id)));
    const failed = results.find((result) => result.error);
    if (failed?.error) throw failed.error;
  },
  async toggleTask(id: string, completed: boolean) {
    const { error } = await supabase.from('crm_tasks').update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', id);
    if (error) throw error;
  },
  async updateTaskPeriod(id: string, startsAt: string | null, endsAt: string | null) {
    const { error } = await supabase.from('crm_tasks').update({ starts_at: startsAt, ends_at: endsAt, due_at: endsAt }).eq('id', id);
    if (error) throw error;
  },
  async createTask(input: { deal_id: string; title: string; description?: string | null; starts_at?: string | null; ends_at?: string | null; task_type?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: lastTask } = await supabase.from('crm_tasks').select('sort_order').eq('deal_id', input.deal_id).order('sort_order', { ascending: false }).limit(1).maybeSingle();
    const { data, error } = await supabase.from('crm_tasks').insert({ ...input, client_id: null, assigned_to: user?.id || null, due_at: input.ends_at || null, sort_order: Number(lastTask?.sort_order ?? -1) + 1 }).select().single();
    if (error) throw error;
    return data;
  },
  async listTasks() {
    const { data, error } = await supabase.from('crm_tasks').select('id, deal_id, title, description, completed, starts_at, ends_at, due_at, task_type, created_at, deal:crm_deals!crm_tasks_deal_id_fkey(name, company:crm_companies!crm_deals_company_id_fkey(name))').order('completed').order('starts_at');
    if (error) throw error;
    return data || [];
  },
  async addDealNote(dealId: string, body: string) {
    const { data, error } = await supabase.from('crm_notes').insert({ deal_id: dealId, client_id: null, body }).select('id, body, created_at').single();
    if (error) throw error;
    return data;
  },
  async listCompanies() {
    const [{ data: companies, error }, { data: deals, error: dealsError }] = await Promise.all([
      supabase.from('crm_companies').select('*').order('name'),
      supabase.from('crm_deals').select('company_id, estimated_value, last_contact_at, status'),
    ]);
    if (error) throw error;
    if (dealsError) throw dealsError;
    return (companies || []).map((company) => {
      const related = (deals || []).filter((deal) => deal.company_id === company.id);
      return {
        ...company,
        deals_count: related.length,
        open_value: related.filter((deal) => deal.status === 'open').reduce((sum, deal) => sum + Number(deal.estimated_value || 0), 0),
        last_contact_at: related.map((deal) => deal.last_contact_at).filter(Boolean).sort().at(-1) || null,
      } as Company;
    });
  },
  async getCompany(id: string) {
    const [{ data: company, error }, { data: contacts, error: contactsError }, { data: deals, error: dealsError }] = await Promise.all([
      supabase.from('crm_companies').select('*').eq('id', id).single(),
      supabase.from('crm_contacts').select('*').eq('company_id', id).order('name'),
      supabase.from('crm_deals').select('*').eq('company_id', id).order('created_at', { ascending: false }),
    ]);
    if (error) throw error; if (contactsError) throw contactsError; if (dealsError) throw dealsError;
    return { company: company as Company, contacts: (contacts || []) as Contact[], deals: (deals || []) as Deal[] };
  },
  async updateCompany(id: string, input: Partial<Pick<Company, 'name' | 'segment' | 'cnpj' | 'website' | 'summary' | 'address'>>) {
    const { data, error } = await supabase.from('crm_companies').update(input).eq('id', id).select().single();
    if (error) throw error; return data as Company;
  },
  async listContacts() {
    const [{ data: contacts, error }, { data: links, error: linksError }] = await Promise.all([
      supabase.from('crm_contacts').select('*, company:crm_companies(name)').order('name'),
      supabase.from('crm_deal_contacts').select('contact_id'),
    ]);
    if (error) throw error;
    if (linksError) throw linksError;
    return (contacts || []).map((contact) => ({
      ...contact,
      company: contact.company?.name || null,
      deals_count: (links || []).filter((link) => link.contact_id === contact.id).length,
    })) as Contact[];
  },
  async getContact(id: string) {
    const { data, error } = await supabase.from('crm_contacts').select('*, company:crm_companies(name), deal_links:crm_deal_contacts(deal:crm_deals(*))').eq('id', id).single();
    if (error) throw error; return data;
  },
  async updateContact(id: string, input: Partial<Pick<Contact, 'name' | 'company_id' | 'role' | 'email' | 'phone' | 'whatsapp_username' | 'communication_consent'>>) {
    const { data, error } = await supabase.from('crm_contacts').update(input).eq('id', id).select().single();
    if (error) throw error; return data as Contact;
  },
  async createCompany(input: Pick<Company, 'name' | 'segment' | 'cnpj' | 'website' | 'summary' | 'address'>) {
    const { data, error } = await supabase.from('crm_companies').insert(input).select().single();
    if (error) throw error;
    return data as Company;
  },
  async createContact(input: Pick<Contact, 'name' | 'company_id' | 'role' | 'email' | 'phone' | 'whatsapp_username' | 'communication_consent'>) {
    const { data, error } = await supabase.from('crm_contacts').insert(input).select().single();
    if (error) throw error;
    return data as Contact;
  },
  async createDeal(input: { name: string; company_id?: string | null; primary_contact_id?: string | null; source: string; campaign?: string | null; stage: DealStage; estimated_value?: number | null; demand?: string | null }) {
    const status = input.stage === 'ganho' ? 'won' : input.stage === 'perdido' ? 'lost' : 'open';
    const { data, error } = await supabase.from('crm_deals').insert({ ...input, status }).select().single();
    if (error) throw error;
    if (input.primary_contact_id) {
      const { error: linkError } = await supabase.from('crm_deal_contacts').insert({ deal_id: data.id, contact_id: input.primary_contact_id });
      if (linkError) throw linkError;
    }
    await supabase.from('crm_notes').insert({ deal_id: data.id, client_id: null, body: 'Negociação criada' });
    return data as Deal;
  },
};
