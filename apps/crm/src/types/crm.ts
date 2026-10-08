export type DealStage = 'novo' | 'qualificando' | 'proposta' | 'negociação' | 'ganho' | 'perdido';

export interface Deal {
  id: string;
  company_id?: string | null;
  primary_contact_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source: string;
  stage: DealStage;
  estimated_value?: number | null;
  services?: string[] | null;
  next_step?: string | null;
  next_contact_on?: string | null;
  last_contact_at?: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  segment?: string | null;
  cnpj?: string | null;
  website?: string | null;
  summary?: string | null;
  address?: string | null;
  created_at: string;
  deals_count: number;
  open_value: number;
  last_contact_at?: string | null;
}

export interface Contact {
  id: string;
  company_id?: string | null;
  company?: string | null;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp_username?: string | null;
  communication_consent: 'not_informed' | 'authorized' | 'revoked';
  deals_count: number;
  created_at: string;
}
