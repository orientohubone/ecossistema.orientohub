import type {Idea, IdeaHypothesis} from '../src/services/ideasService';
import productCollage from '../public/Colagem de Dashboard em Preto e Amarelo.png';
import dashboardReference from '../public/videos/dashboard-v2-click.png';

const now = '2026-10-13T18:00:00.000Z';

export const ideasShowcaseData: Idea[] = [
  {
    id: 'idea-smart-followup', user_id: 'showcase', title: 'Copiloto de follow-up para pequenos negócios',
    description: 'Um assistente que transforma conversas comerciais em próximos passos claros.',
    audience: 'Pequenas equipes comerciais e fundadores B2B',
    problem: 'Oportunidades são perdidas porque decisões, objeções e próximos passos ficam dispersos entre mensagens e anotações.',
    proposed_solution: 'Copiloto que resume cada conversa, sugere a próxima ação e acompanha o prazo automaticamente.',
    evidence: null,
    curation_notes: 'Validar disposição de pagamento com equipes que hoje controlam o processo em planilhas.',
    image_urls: [productCollage, dashboardReference], stage: 'discovery', curation_score: 62, promoted_project_id: null, created_at: now, updated_at: now,
  },
  {
    id: 'idea-mentor-marketplace', user_id: 'showcase', title: 'Marketplace de mentores por desafio', description: 'Conexões rápidas com especialistas.', audience: 'Fundadores em estágio inicial', problem: 'É difícil encontrar o mentor certo para um problema específico.', proposed_solution: 'Match por desafio e estágio do negócio.', evidence: '12 fundadores entrevistados.', curation_notes: null, image_urls: [], stage: 'validation', curation_score: 74, promoted_project_id: null, created_at: now, updated_at: now,
  },
  {
    id: 'idea-finance', user_id: 'showcase', title: 'Radar financeiro semanal', description: 'Visão simples de caixa e alertas.', audience: 'Microempresas', problem: 'Gestores descobrem problemas de caixa tarde demais.', proposed_solution: 'Resumo semanal com cenários e alertas.', evidence: 'Protótipo testado com 5 negócios.', curation_notes: null, image_urls: [], stage: 'incubation', curation_score: 82, promoted_project_id: null, created_at: now, updated_at: now,
  },
  {
    id: 'idea-community', user_id: 'showcase', title: 'Comunidade de compras locais', description: 'Benefícios para consumidores e comércio.', audience: 'Comércios de bairro', problem: 'Baixa recorrência e pouca colaboração local.', proposed_solution: 'Clube compartilhado de benefícios.', evidence: null, curation_notes: null, image_urls: [], stage: 'capture', curation_score: 35, promoted_project_id: null, created_at: now, updated_at: now,
  },
  {
    id: 'idea-onboarding', user_id: 'showcase', title: 'Onboarding guiado por resultado', description: 'Ativação personalizada.', audience: 'SaaS B2B', problem: 'Clientes abandonam antes do primeiro resultado.', proposed_solution: 'Trilhas adaptativas por objetivo.', evidence: 'Conversão 18% maior no piloto.', curation_notes: null, image_urls: [], stage: 'ready', curation_score: 92, promoted_project_id: null, created_at: now, updated_at: now,
  },
  {
    id: 'idea-archive', user_id: 'showcase', title: 'Agenda social automática', description: 'Experimento pausado.', audience: 'Criadores independentes', problem: 'Planejamento repetitivo.', proposed_solution: 'Geração automática de calendário.', evidence: 'Baixa intenção de pagamento.', curation_notes: null, image_urls: [], stage: 'archived', curation_score: 48, promoted_project_id: null, created_at: now, updated_at: now,
  },
];

export const ideasShowcaseHypotheses: IdeaHypothesis[] = [
  {id: 'hypothesis-payment', idea_id: 'idea-smart-followup', user_id: 'showcase', statement: 'Equipes com até 5 vendedores pagariam R$ 149/mês para não perder follow-ups.', evidence: null, status: 'open', created_at: now},
  {id: 'hypothesis-time', idea_id: 'idea-smart-followup', user_id: 'showcase', statement: 'O resumo automático economiza pelo menos 3 horas por semana.', evidence: '4 entrevistas apontaram retrabalho recorrente.', status: 'validated', created_at: now},
];
