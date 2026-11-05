import React from 'react';
import { createRoot } from 'react-dom/client';
import IdeaWorkspaceModal from '../src/components/modals/IdeaWorkspaceModal';
import '../src/index.css';
const idea = { id: 'preview', user_id: 'preview', title: 'Método CED', description: 'Uma abordagem prática para conectar contexto, estratégia e desenvolvimento de negócios.', audience: 'Empreendedores e equipes em fase de estruturação.', problem: 'Transformar ideias e prioridades em uma rotina clara de execução.', proposed_solution: 'Organizar o diagnóstico, definir experimentos e acompanhar a evolução com evidências.', evidence: 'Hipóteses e observações reunidas durante a descoberta.', curation_notes: '', stage: 'discovery' as const, curation_score: 65, image_sources: ['preview/one.png','preview/two.png'], image_urls: ['/IDEIAS DE NEGÓCIO.png', '/AMOSTRA GUIA.png'], promoted_project_id: null, created_at: '', updated_at: '' };
const noop = async () => {};
createRoot(document.getElementById('root')!).render(<IdeaWorkspaceModal idea={idea} hypotheses={[]} onClose={() => {}} onSave={noop} onRefresh={noop} onUpload={noop} onRemove={noop} onRecover={async () => 0} onAddHypothesis={noop} onHypothesisStatus={noop} onPromote={noop} />);
if (new URLSearchParams(location.search).get('tab') === 'images') window.setTimeout(() => { document.querySelectorAll('nav button')[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, 1200);
