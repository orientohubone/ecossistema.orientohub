import { supabase } from '../config/supabase';

export interface Event {
  id: string;
  title: string;
  type: 'mentoria' | 'workshop' | 'evento' | 'reuniao';
  date: string;
  duration: string;
  description?: string;
  location?: string;
  is_virtual: boolean;
  meeting_url?: string;
  max_participants?: number;
  current_participants?: number;
  mentor_id?: string;
  mentor_name?: string;
  mentor_avatar?: string;
  created_at: string;
  user_id: string;
}

export interface CreateEventData {
  title: string;
  type: 'mentoria' | 'workshop' | 'evento' | 'reuniao';
  date: string;
  duration: string;
  description?: string;
  location?: string;
  is_virtual: boolean;
  meeting_url?: string;
  max_participants?: number;
  mentor_id?: string;
  mentor_name?: string;
  mentor_avatar?: string;
}

export interface UpdateEventData {
  title?: string;
  type?: 'mentoria' | 'workshop' | 'evento' | 'reuniao';
  date?: string;
  duration?: string;
  description?: string;
  location?: string;
  is_virtual?: boolean;
  meeting_url?: string;
  max_participants?: number;
  mentor_id?: string;
  mentor_name?: string;
  mentor_avatar?: string;
}

class EventsService {
  // Buscar todos os eventos do usuário
  async getAll(): Promise<Event[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      // Retornar eventos mockados se a tabela não existir
      return this.getMockEvents();
    }
  }

  // Buscar próximos eventos
  async getUpcoming(limit: number = 5): Promise<Event[]> {
    try {
      const events = await this.getAll();
      const now = new Date();
      
      return events
        .filter(event => new Date(event.date) >= now)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return this.getMockEvents().slice(0, limit);
    }
  }

  // Criar novo evento
  async create(eventData: CreateEventData): Promise<Event> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Não foi possível criar o evento');
    }
  }

  // Atualizar evento
  async update(id: string, eventData: UpdateEventData): Promise<Event> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Não foi possível atualizar o evento');
    }
  }

  // Excluir evento
  async delete(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Não foi possível excluir o evento');
    }
  }

  // Gerar eventos mockados para fallback
  private getMockEvents(): Event[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: '1',
        title: 'Mentoria com Especialista em Startups',
        type: 'mentoria',
        date: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
        duration: '45 min',
        description: 'Sessão de mentoria para discutir estratégias de crescimento',
        is_virtual: true,
        meeting_url: 'https://meet.google.com/abc-xyz',
        mentor_name: 'João Silva',
        mentor_avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=FFD700&color=000',
        created_at: new Date().toISOString(),
        user_id: 'mock-user'
      },
      {
        id: '2',
        title: 'Workshop: Validação de Problemas',
        type: 'workshop',
        date: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
        duration: '2h',
        description: 'Aprenda técnicas avançadas para validar problemas de mercado',
        is_virtual: true,
        meeting_url: 'https://zoom.us/j/123456789',
        max_participants: 50,
        current_participants: 23,
        mentor_name: 'Maria Santos',
        mentor_avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=6366F1&color=fff',
        created_at: new Date().toISOString(),
        user_id: 'mock-user'
      },
      {
        id: '3',
        title: 'Networking com Investidores',
        type: 'evento',
        date: new Date(nextWeek.setHours(18, 0, 0, 0)).toISOString(),
        duration: '3h',
        description: 'Evento de networking para apresentar seu projeto a investidores',
        is_virtual: false,
        location: 'WeWork São Paulo',
        max_participants: 100,
        current_participants: 67,
        mentor_name: 'Equipe Orientohub',
        mentor_avatar: 'https://ui-avatars.com/api/?name=Orientohub&background=10B981&color=fff',
        created_at: new Date().toISOString(),
        user_id: 'mock-user'
      }
    ];
  }

  // Formatar data para exibição
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()} ${date.toLocaleDateString('pt-BR', { month: 'short' })}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }

  // Gerar avatar baseado no nome
  generateAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&bold=true`;
  }
}

export const eventsService = new EventsService();
