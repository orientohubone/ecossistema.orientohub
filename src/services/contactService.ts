import { supabase } from '../config/supabase';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  created_at?: string;
}

export const contactService = {
  async sendMessage(data: ContactMessage): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Validação simples
      if (!data.name || !data.email || !data.message) {
        return { success: false, error: 'Por favor, preencha todos os campos obrigatórios.' };
      }

      // 2. Inserir no Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([data]);

      if (error) {
        console.error('Erro ao salvar mensagem de contato:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Erro inesperado no serviço de contato:', err);
      return { success: false, error: err.message || 'Ocorreu um erro inesperado ao enviar sua mensagem.' };
    }
  },

  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
