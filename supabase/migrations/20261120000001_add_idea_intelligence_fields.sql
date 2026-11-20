-- Adiciona campos de inteligência à tabela ideas
alter table public.ideas
  add column if not exists market_analysis text,
  add column if not exists customer_persona text,
  add column if not exists business_model_notes text,
  add column if not exists competitive_analysis text,
  add column if not exists insight_tags text[] default '{}';

comment on column public.ideas.market_analysis is 'Análise do mercado: tamanho, tendências, oportunidade';
comment on column public.ideas.customer_persona is 'Perfil do cliente ideal: dores, comportamentos, jornada';
comment on column public.ideas.business_model_notes is 'Modelo de negócio: proposta de valor, canais, receita';
comment on column public.ideas.competitive_analysis is 'Análise de competidores: diretos, indiretos, diferenciais';
comment on column public.ideas.insight_tags is 'Tags de insight categorizadas pelo usuário';
