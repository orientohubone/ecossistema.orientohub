import type { Solution } from '../services/solutionsService';

export const solutionStages = ['Ideação', 'Validação', 'MVP', 'Tração', 'Crescimento', 'Escala'] as const;
export const emptySolutionForm = {
  name: '', solution_url: '', description: '', category: '', founder_name: '',
  stage: 'Ideação' as Solution['stage'], logo_url: '', git_url: '', ide_url: '',
  database_url: '', instagram_url: '', mrr: '', active_users: '',
};
export type SolutionForm = typeof emptySolutionForm;
export type SolutionFormErrors = Partial<Record<keyof SolutionForm, string>>;

const solutionDrafts = new Map<string, SolutionForm>();
const draftKey = (userId: string) => `orientohub:solution-draft:v1:${userId}`;

export function readSolutionDraft(userId?: string): SolutionForm {
  if (!userId) return { ...emptySolutionForm };
  try {
    const raw = sessionStorage.getItem(draftKey(userId));
    if (raw) {
      const stored = JSON.parse(raw);
      const form = { ...emptySolutionForm };
      for (const key of Object.keys(form) as (keyof SolutionForm)[]) {
        if (key === 'stage') {
          if (solutionStages.includes(stored[key])) form.stage = stored[key];
        } else if (typeof stored[key] === 'string') form[key] = stored[key];
      }
      solutionDrafts.set(userId, form);
      return form;
    }
  } catch { /* Preserve the in-memory draft when browser storage is unavailable. */ }
  return { ...(solutionDrafts.get(userId) || emptySolutionForm) };
}

export function saveSolutionDraft(userId: string | undefined, form: SolutionForm) {
  if (!userId) return;
  solutionDrafts.set(userId, { ...form });
  try { sessionStorage.setItem(draftKey(userId), JSON.stringify(form)); } catch { /* Memory fallback. */ }
}

export function clearSolutionDraft(userId?: string) {
  if (!userId) return;
  solutionDrafts.delete(userId);
  try { sessionStorage.removeItem(draftKey(userId)); } catch { /* Storage may be disabled. */ }
}

export function validateSolutionForm(form: SolutionForm) {
  const errors: SolutionFormErrors = {};
  const payload: Partial<Solution> = { name: form.name.trim(), stage: form.stage };
  if (!payload.name) errors.name = 'Informe o nome da solução.';
  if (!solutionStages.includes(form.stage)) errors.stage = 'Selecione um estágio válido.';
  for (const field of ['description', 'category', 'founder_name'] as const) payload[field] = form[field].trim() || null;
  for (const field of ['solution_url', 'logo_url', 'git_url', 'ide_url', 'database_url', 'instagram_url'] as const) {
    const value = form[field].trim();
    if (!value) {
      if (field === 'solution_url') errors[field] = 'Informe o endereço do produto.';
      else if (field === 'logo_url') payload[field] = '';
      else payload[field] = null;
      continue;
    }
    try {
      const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error();
      if (field === 'git_url' && (url.hostname !== 'github.com' || url.pathname.split('/').filter(Boolean).length !== 2)) {
        errors[field] = 'Use a URL do repositório: github.com/organização/repositório.';
      } else payload[field] = url.href;
    } catch { errors[field] = 'Informe uma URL HTTP ou HTTPS válida, sem credenciais.'; }
  }
  for (const field of ['mrr', 'active_users'] as const) {
    const value = Number(form[field].trim().replace(',', '.') || 0);
    if (!Number.isFinite(value) || value < 0 || (field === 'active_users' && !Number.isInteger(value))) {
      errors[field] = field === 'active_users' ? 'Informe uma quantidade inteira, igual ou maior que zero.' : 'Informe um valor igual ou maior que zero.';
    } else payload[field] = value;
  }
  return { payload, errors };
}

export function solutionSaveError(error: unknown) {
  const failure = error as { code?: string; message?: string } | null;
  if (failure?.code === '42501') return 'Sua sessão não tem permissão para cadastrar esta solução. Entre novamente ou solicite a liberação do seu plano.';
  if (failure?.code === '42703' || failure?.code === 'PGRST204') return 'O cadastro de soluções precisa ser atualizado no banco. Solicite a aplicação da migração de metadados de soluções.';
  return failure?.message || 'Não foi possível cadastrar a solução. Seus dados foram mantidos; tente novamente.';
}
