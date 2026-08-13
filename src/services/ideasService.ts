import { supabase } from '../config/supabase';

export type IdeaStage = 'capture' | 'discovery' | 'validation' | 'incubation' | 'ready' | 'archived';
export type HypothesisStatus = 'open' | 'testing' | 'validated' | 'invalidated';
export interface Idea { id: string; user_id: string; title: string; description: string | null; audience: string | null; problem: string | null; proposed_solution: string | null; evidence: string | null; curation_notes: string | null; stage: IdeaStage; curation_score: number; promoted_project_id: string | null; created_at: string; updated_at: string; }
export interface IdeaHypothesis { id: string; idea_id: string; user_id: string; statement: string; evidence: string | null; status: HypothesisStatus; created_at: string; }
const userId = async () => { const { data } = await supabase.auth.getUser(); if (!data.user) throw new Error('Faça login para gerenciar suas ideias.'); return data.user.id; };
export const ideasService = {
  async getAll() { const { data, error } = await supabase.from('ideas').select('*').order('updated_at', { ascending: false }); if (error) throw error; return (data || []) as Idea[]; },
  async create(data: Pick<Idea, 'title' | 'description' | 'audience' | 'problem' | 'proposed_solution'>) { const { data: idea, error } = await supabase.from('ideas').insert({ ...data, user_id: await userId() }).select().single(); if (error) throw error; return idea as Idea; },
  async update(id: string, data: Partial<Idea>) { const { data: idea, error } = await supabase.from('ideas').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single(); if (error) throw error; return idea as Idea; },
  async getHypotheses(ideaId: string) { const { data, error } = await supabase.from('idea_hypotheses').select('*').eq('idea_id', ideaId).order('created_at', { ascending: false }); if (error) throw error; return (data || []) as IdeaHypothesis[]; },
  async addHypothesis(ideaId: string, statement: string) { const { data, error } = await supabase.from('idea_hypotheses').insert({ idea_id: ideaId, statement, user_id: await userId() }).select().single(); if (error) throw error; return data as IdeaHypothesis; },
  async updateHypothesis(id: string, data: Partial<IdeaHypothesis>) { const { data: hypothesis, error } = await supabase.from('idea_hypotheses').update(data).eq('id', id).select().single(); if (error) throw error; return hypothesis as IdeaHypothesis; },
};
