import { supabase } from '../config/supabase';

// Types
export interface Project {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  stage: 'ideation' | 'validation' | 'mvp' | 'traction' | 'growth';
  progress: number;
  validation_score: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithRelations extends Project {
  hypotheses: Hypothesis[];
  experiments: Experiment[];
  interviews: Interview[];
  tasks: Task[];
  customer_interviews: number;
  validated_assumptions: number;
  pivot_count: number;
}

export interface Hypothesis {
  id: number;
  project_id: number;
  user_id: string;
  statement: string;
  validated: boolean;
  confidence: number;
  created_at: string;
  updated_at: string;
}

export interface Experiment {
  id: number;
  hypothesis_id: number | null;
  user_id: string;
  title: string;
  method: string | null;
  results: string | null;
  learnings: string | null;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
  success_rate: number | null;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: number;
  experiment_id: number | null;
  user_id: string;
  customer_name: string | null;
  script: string | null;
  notes: string | null;
  responses: Record<string, any>;
  insights: string[];
  status: 'scheduled' | 'completed';
  sentiment: 'positive' | 'neutral' | 'negative' | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CreateProjectData {
  name: string;
  description?: string;
  stage?: 'ideation' | 'validation' | 'mvp' | 'traction' | 'growth';
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  stage?: 'ideation' | 'validation' | 'mvp' | 'traction' | 'growth';
  progress?: number;
  validation_score?: number;
}

export interface CreateHypothesisData {
  project_id: number;
  statement: string;
  validated?: boolean;
  confidence?: number;
}

export interface UpdateHypothesisData {
  statement?: string;
  validated?: boolean;
  confidence?: number;
}

export interface CreateExperimentData {
  hypothesis_id?: number | null;
  title: string;
  method?: string;
  results?: string;
  learnings?: string;
  status?: 'planned' | 'in_progress' | 'completed';
  date?: string;
  success_rate?: number;
}

export interface UpdateExperimentData {
  hypothesis_id?: number | null;
  title?: string;
  method?: string;
  results?: string;
  learnings?: string;
  status?: 'planned' | 'in_progress' | 'completed';
  date?: string;
  success_rate?: number;
}

export interface CreateInterviewData {
  experiment_id?: number | null;
  customer_name?: string;
  script?: string;
  notes?: string;
  responses?: Record<string, any>;
  insights?: string[];
  status?: 'scheduled' | 'completed';
  sentiment?: 'positive' | 'neutral' | 'negative';
  date?: string;
}

export interface UpdateInterviewData {
  experiment_id?: number | null;
  customer_name?: string;
  script?: string;
  notes?: string;
  responses?: Record<string, any>;
  insights?: string[];
  status?: 'scheduled' | 'completed';
  sentiment?: 'positive' | 'neutral' | 'negative';
  date?: string;
}

// Projects Service
export const projectsService = {
  // Get all projects for current user
  async getAll(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single project with all relations
  async getById(id: number): Promise<ProjectWithRelations> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError) throw projectError;
    if (!project) throw new Error('Project not found');

    // Get related data
    const [hypotheses, experiments, interviews] = await Promise.all([
      this.getHypothesesByProject(id),
      this.getExperimentsByProject(id),
      this.getInterviewsByProject(id),
    ]);

    // Calculate derived fields
    const customer_interviews = interviews.length;
    const validated_assumptions = hypotheses.filter(h => h.validated).length;
    const pivot_count = 0; // TODO: Implement pivot tracking

    return {
      ...project,
      hypotheses,
      experiments,
      interviews,
      tasks: [], // TODO: Implement tasks table
      customer_interviews,
      validated_assumptions,
      pivot_count,
    };
  },

  // Create new project
  async create(data: CreateProjectData): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: data.name,
        description: data.description || null,
        stage: data.stage || 'ideation',
        progress: 0,
        validation_score: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  // Update project
  async update(id: number, data: UpdateProjectData): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return project;
  },

  // Delete project
  async delete(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Hypotheses
  async getHypothesesByProject(projectId: number): Promise<Hypothesis[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('hypotheses')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createHypothesis(data: CreateHypothesisData): Promise<Hypothesis> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: hypothesis, error } = await supabase
      .from('hypotheses')
      .insert({
        user_id: user.id,
        project_id: data.project_id,
        statement: data.statement,
        validated: data.validated || false,
        confidence: data.confidence || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return hypothesis;
  },

  async updateHypothesis(id: number, data: UpdateHypothesisData): Promise<Hypothesis> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: hypothesis, error } = await supabase
      .from('hypotheses')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return hypothesis;
  },

  async deleteHypothesis(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('hypotheses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Experiments
  async getExperimentsByProject(projectId: number): Promise<Experiment[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get experiments through hypotheses
    const { data: hypotheses } = await supabase
      .from('hypotheses')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    if (!hypotheses || hypotheses.length === 0) return [];

    const hypothesisIds = hypotheses.map(h => h.id);

    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .in('hypothesis_id', hypothesisIds)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createExperiment(data: CreateExperimentData): Promise<Experiment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: experiment, error } = await supabase
      .from('experiments')
      .insert({
        user_id: user.id,
        hypothesis_id: data.hypothesis_id || null,
        title: data.title,
        method: data.method || null,
        results: data.results || null,
        learnings: data.learnings || null,
        status: data.status || 'planned',
        date: data.date || new Date().toISOString(),
        success_rate: data.success_rate || null,
      })
      .select()
      .single();

    if (error) throw error;
    return experiment;
  },

  async updateExperiment(id: number, data: UpdateExperimentData): Promise<Experiment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: experiment, error } = await supabase
      .from('experiments')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return experiment;
  },

  async deleteExperiment(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Interviews
  async getInterviewsByProject(projectId: number): Promise<Interview[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get interviews through experiments -> hypotheses
    const { data: hypotheses } = await supabase
      .from('hypotheses')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    if (!hypotheses || hypotheses.length === 0) return [];

    const hypothesisIds = hypotheses.map(h => h.id);

    const { data: experiments } = await supabase
      .from('experiments')
      .select('id')
      .in('hypothesis_id', hypothesisIds)
      .eq('user_id', user.id);

    if (!experiments || experiments.length === 0) return [];

    const experimentIds = experiments.map(e => e.id);

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .in('experiment_id', experimentIds)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(interview => ({
      ...interview,
      insights: Array.isArray(interview.insights) ? interview.insights : [],
    }));
  },

  async createInterview(data: CreateInterviewData): Promise<Interview> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: interview, error } = await supabase
      .from('interviews')
      .insert({
        user_id: user.id,
        experiment_id: data.experiment_id || null,
        customer_name: data.customer_name || null,
        script: data.script || null,
        notes: data.notes || null,
        responses: data.responses || {},
        insights: data.insights || [],
        status: data.status || 'scheduled',
        sentiment: data.sentiment || null,
        date: data.date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...interview,
      insights: Array.isArray(interview.insights) ? interview.insights : [],
    };
  },

  async updateInterview(id: number, data: UpdateInterviewData): Promise<Interview> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: interview, error } = await supabase
      .from('interviews')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...interview,
      insights: Array.isArray(interview.insights) ? interview.insights : [],
    };
  },

  async deleteInterview(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },
};
