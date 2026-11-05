import { supabase, supabaseProjectUrl } from '../config/supabase';
import { activityService } from './activityService';
import { privateIdeaImagePath } from '../lib/privateIdeaImages';

export type IdeaStage = 'capture' | 'discovery' | 'validation' | 'incubation' | 'ready' | 'archived';
export type HypothesisStatus = 'open' | 'testing' | 'validated' | 'invalidated';
export interface Idea { id: string; user_id: string; title: string; description: string | null; audience: string | null; problem: string | null; proposed_solution: string | null; evidence: string | null; curation_notes: string | null; image_urls: string[]; image_sources?: string[]; image_error?: string | null; stage: IdeaStage; curation_score: number; promoted_project_id: string | null; created_at: string; updated_at: string; }
export interface IdeaHypothesis { id: string; idea_id: string; user_id: string; statement: string; evidence: string | null; status: HypothesisStatus; created_at: string; }
const userId = async () => { const { data } = await supabase.auth.getUser(); if (!data.user) throw new Error('Faça login para gerenciar suas ideias.'); return data.user.id; };
const privateImages = async (idea: Idea): Promise<Idea> => {
  const sources = idea.image_sources ?? idea.image_urls ?? [];
  if (!sources.length) return { ...idea, image_sources: [], image_urls: [], image_error: null };
  const paths = sources.map(value => privateIdeaImagePath(value, idea.user_id, supabaseProjectUrl));
  try {
    const urls = await Promise.all(paths.map(async path => {
      if (!path) return '';
      try {
        const { data, error } = await supabase.storage.from('idea-images').createSignedUrl(path, 3600);
        return error ? '' : data?.signedUrl || '';
      } catch { return ''; }
    }));
    return { ...idea, image_sources: [...sources], image_urls: urls, image_error: urls.some(url => !url) ? 'Não foi possível carregar todas as imagens privadas. Tente renovar o acesso; as referências foram preservadas.' : null };
  } catch {
    return { ...idea, image_sources: [...sources], image_urls: sources.map(() => ''), image_error: 'As imagens não carregaram. Verifique sua conexão e tente novamente; os anexos foram preservados.' };
  }
};
export const ideasService = {
  async getById(id: string) { const owner = await userId(); const { data, error } = await supabase.from('ideas').select('*').eq('id', id).eq('user_id', owner).single(); if (error) throw error; return privateImages(data as Idea); },
  async recoverImages(id: string) {
    const idea = await ideasService.getById(id);
    if ((idea.image_sources ?? []).length) throw new Error('Esta ideia já possui referências vinculadas. Tente renovar o acesso às imagens.');
    const folder = `${idea.user_id}/${idea.id}`;
    const { data, error } = await supabase.storage.from('idea-images').list(folder, { limit: 100 });
    if (error) throw new Error('Não foi possível consultar a pasta privada desta ideia. Tente novamente.');
    const files = (data || []).filter(file => file.id && /\.(?:png|jpe?g|webp|gif)$/i.test(file.name));
    if (!files.length) return idea;
    if (files.length > 2) throw new Error('Há mais de duas imagens nesta pasta. Solicite suporte para identificar as referências corretas antes de restaurar.');
    return ideasService.update(id, { image_urls: files.map(file => `${folder}/${file.name}`) });
  },
  async getAll() { const owner = await userId(); const { data, error } = await supabase.from('ideas').select('*').eq('user_id', owner).order('updated_at', { ascending: false }); if (error) throw error; return Promise.all(((data || []) as Idea[]).map(privateImages)); },
  async create(data: Pick<Idea, 'title' | 'description' | 'audience' | 'problem' | 'proposed_solution'>) { const { data: idea, error } = await supabase.from('ideas').insert({ ...data, user_id: await userId() }).select().single(); if (error) throw error; const created = idea as Idea; await activityService.log('Registrou a ideia', created.title, 'idea', created.id, 10, 'Lightbulb'); return created; },
  async update(id: string, data: Partial<Idea>) {
    const owner = await userId();
    const payload = { ...data };
    delete payload.user_id; delete payload.id; delete payload.image_sources; delete payload.image_error;
    if (payload.image_urls) {
      const paths = payload.image_urls.map(value => privateIdeaImagePath(value, owner, supabaseProjectUrl));
      if (paths.some(path => !path)) throw new Error('Uma referência de imagem é inválida. Os anexos existentes não foram alterados.');
      payload.image_urls = paths as string[];
    }
    const { data: idea, error } = await supabase.from('ideas').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', owner).select().single();
    if (error) throw error;
    const updated = idea as Idea;
    if (data.stage) await activityService.log('Moveu a ideia para', updated.stage, 'idea', updated.id, 15, 'Lightbulb');
    return privateImages(updated);
  },
  async uploadImages(ideaId: string, files: File[]) {
    if (!files.length) return [];
    if (files.length > 2 || files.some((file) => !file.type.startsWith('image/'))) throw new Error('Escolha no máximo duas imagens válidas.');
    const ownerId = await userId();
    const uploads = await Promise.all(files.map(async (file) => {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `${ownerId}/${ideaId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from('idea-images').upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      return path;
    }));
    return uploads;
  },
  async getHypotheses(ideaId: string) { const { data, error } = await supabase.from('idea_hypotheses').select('*').eq('idea_id', ideaId).order('created_at', { ascending: false }); if (error) throw error; return (data || []) as IdeaHypothesis[]; },
  async addHypothesis(ideaId: string, statement: string) { const { data, error } = await supabase.from('idea_hypotheses').insert({ idea_id: ideaId, statement, user_id: await userId() }).select().single(); if (error) throw error; const hypothesis = data as IdeaHypothesis; await activityService.log('Formulou uma hipótese', statement, 'idea_hypothesis', hypothesis.id, 15, 'Beaker'); return hypothesis; },
  async updateHypothesis(id: string, data: Partial<IdeaHypothesis>) { const { data: hypothesis, error } = await supabase.from('idea_hypotheses').update(data).eq('id', id).select().single(); if (error) throw error; return hypothesis as IdeaHypothesis; },
};
