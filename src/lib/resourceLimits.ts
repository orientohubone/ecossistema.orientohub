export const resources = [
  { key: 'ideas', column: 'max_ideas', label: 'Ideias' },
  { key: 'projects', column: 'max_projects', label: 'Projetos' },
  { key: 'solutions', column: 'max_solutions', label: 'Soluções' },
] as const;
export type Resource = typeof resources[number]['key'];
export const plans = ['free', 'pro', 'enterprise'] as const;
export type Plan = typeof plans[number];
export function parseResourceLimit(value: string): number | null {
  if (!value.trim()) return null;
  if (!/^\d+$/.test(value.trim())) throw new Error('Informe uma quantidade inteira, igual ou maior que zero.');
  const limit = Number(value);
  if (!Number.isSafeInteger(limit) || limit > 2147483647) throw new Error('A quantidade máxima permitida é 2.147.483.647.');
  return limit;
}
export const limitLabel = (value: number | null) => value === null ? 'Sem limite' : String(value);
