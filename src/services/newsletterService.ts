import { supabase } from '../config/supabase';

export interface NewsletterSubscription {
  id?: string;
  email: string;
  created_at?: string;
}

export const newsletterService = {
  async subscribe(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Validar e-mail básico
      if (!email || !email.includes('@')) {
        return { success: false, error: 'E-mail inválido' };
      }

      // 2. Inserir na tabela newsletter_subscriptions
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        // Se o erro for de duplicidade (e-mail já cadastrado)
        if (error.code === '23505') {
          return { success: false, error: 'Este e-mail já está cadastrado!' };
        }
        
        console.error('Erro ao subscrever na newsletter:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Erro inesperado na newsletter:', err);
      return { success: false, error: err.message || 'Ocorreu um erro inesperado.' };
    }
  },

  async getAll(): Promise<NewsletterSubscription[]> {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
