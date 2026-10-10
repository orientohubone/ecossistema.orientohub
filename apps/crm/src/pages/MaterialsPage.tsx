import { useEffect, useMemo, useRef, useState } from 'react';
import { Briefcase, Check, Copy, ExternalLink, Maximize2, Presentation, Search } from 'lucide-react';

type MaterialCategory = 'apresentacoes' | 'servicos';
type ServiceType = 'estrategias' | 'inovacao' | 'ecommerce';

type CommercialMaterial = {
  id: string;
  title: string;
  description: string;
  category: MaterialCategory;
  categoryLabel: string;
  service?: ServiceType;
  serviceLabel?: string;
  platform: string;
  url: string;
  embedUrl: string;
};

const materials: CommercialMaterial[] = [
  {
    id: 'apresentacao-comercial-orientohub',
    title: 'Sobre o fundador',
    description: 'Apresentação institucional sobre o fundador, sua trajetória e a construção da OrientoHub.',
    category: 'apresentacoes',
    categoryLabel: 'Apresentações',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXjkpedV4/UE-dSdNxHs99LmrdqTTVrg/view',
    embedUrl: 'https://www.canva.com/design/DAHXjkpedV4/UE-dSdNxHs99LmrdqTTVrg/view?embed',
  },
  {
    id: 'apresentacao-comercial-orientohub-02',
    title: 'Nossas soluções',
    description: 'Apresentação das soluções da OrientoHub para reuniões e conversas com potenciais clientes.',
    category: 'apresentacoes',
    categoryLabel: 'Apresentações',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXjnCKMN8/dITF2mCd15zp6FepxWEkuQ/view',
    embedUrl: 'https://www.canva.com/design/DAHXjnCKMN8/dITF2mCd15zp6FepxWEkuQ/view?embed',
  },
  {
    id: 'servico-estrategias',
    title: 'Estratégias',
    description: 'Material comercial para apresentar o serviço de estratégias e suas entregas.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'estrategias',
    serviceLabel: 'Estratégias',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXmMZ8ZXc/wi7R7dShwYA-Upd2WnORYA/view',
    embedUrl: 'https://www.canva.com/design/DAHXmMZ8ZXc/wi7R7dShwYA-Upd2WnORYA/view?embed',
  },
  {
    id: 'proposta-comercial-estrategias',
    title: 'Proposta comercial de estratégias',
    description: 'Proposta comercial para apresentar o escopo, as entregas e as condições do serviço de estratégias.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'estrategias',
    serviceLabel: 'Estratégias',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXmY_san8/nqnr7MiEAVfIGeU9QKSd3Q/view',
    embedUrl: 'https://www.canva.com/design/DAHXmY_san8/nqnr7MiEAVfIGeU9QKSd3Q/view?embed',
  },
  {
    id: 'servico-inovacao',
    title: 'Inovação',
    description: 'Material comercial para apresentar o serviço de inovação e suas entregas.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'inovacao',
    serviceLabel: 'Inovação',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXnCDZi1E/PZc5TLRj-s41Pm9xZKblmw/view',
    embedUrl: 'https://www.canva.com/design/DAHXnCDZi1E/PZc5TLRj-s41Pm9xZKblmw/view?embed',
  },
  {
    id: 'proposta-comercial-inovacao',
    title: 'Proposta comercial de inovação',
    description: 'Proposta comercial para apresentar o escopo, as entregas e as condições do serviço de inovação.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'inovacao',
    serviceLabel: 'Inovação',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXnZYSTzE/GjNllULTfMBBy2xBxuyOYQ/view',
    embedUrl: 'https://www.canva.com/design/DAHXnZYSTzE/GjNllULTfMBBy2xBxuyOYQ/view?embed',
  },
  {
    id: 'template-poc-v1',
    title: 'Template PoC v.1',
    description: 'Template para estruturar e apresentar uma prova de conceito durante o processo de inovação.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'inovacao',
    serviceLabel: 'Inovação',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXnQeWW9I/nl-vpT902me7Btmmj3_xNA/view',
    embedUrl: 'https://www.canva.com/design/DAHXnQeWW9I/nl-vpT902me7Btmmj3_xNA/view?embed',
  },
  {
    id: 'servico-ecommerce',
    title: 'E-commerce',
    description: 'Material comercial para apresentar o serviço de e-commerce e suas entregas.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'ecommerce',
    serviceLabel: 'E-commerce',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXotrq56A/S1FMMlmCtVg5hNdRGAkxcQ/view',
    embedUrl: 'https://www.canva.com/design/DAHXotrq56A/S1FMMlmCtVg5hNdRGAkxcQ/view?embed',
  },
  {
    id: 'proposta-comercial-ecommerce',
    title: 'Proposta comercial de E-commerce',
    description: 'Proposta comercial para apresentar o escopo, as entregas e as condições do serviço de e-commerce.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'ecommerce',
    serviceLabel: 'E-commerce',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXopAm4WU/T-qSAJPH8-asNZerprE6oQ/view',
    embedUrl: 'https://www.canva.com/design/DAHXopAm4WU/T-qSAJPH8-asNZerprE6oQ/view?embed',
  },
  {
    id: 'tabela-cadastro-produtos-ecommerce',
    title: 'Tabela de cadastro de produtos',
    description: 'Material de apoio para organizar e padronizar as informações necessárias ao cadastro de produtos no e-commerce.',
    category: 'servicos',
    categoryLabel: 'Serviços',
    service: 'ecommerce',
    serviceLabel: 'E-commerce',
    platform: 'Canva',
    url: 'https://www.canva.com/design/DAHXoordqaw/oickynj0TixlAgaaHjYetg/view',
    embedUrl: 'https://www.canva.com/design/DAHXoordqaw/oickynj0TixlAgaaHjYetg/view?embed',
  },
];

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'apresentacoes', label: 'Apresentações' },
  { id: 'servicos', label: 'Serviços' },
] as const;

const services = [
  { id: 'todos', label: 'Todos os serviços' },
  { id: 'estrategias', label: 'Estratégias' },
  { id: 'inovacao', label: 'Inovação' },
  { id: 'ecommerce', label: 'E-commerce' },
] as const;

const CanvaPreview = ({ material }: { material: CommercialMaterial }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const thumbnailUrl = material.url.replace(/\/view$/, '/screen?type=thumbnail');

  useEffect(() => {
    const syncFullscreen = () => {
      if (document.fullscreenElement !== iframeRef.current) {
        setExpanded(false);
        if (iframeRef.current) iframeRef.current.src = 'about:blank';
      }
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const focusPreview = () => iframeRef.current?.focus();
    const immediate = window.requestAnimationFrame(focusPreview);
    const afterMount = window.setTimeout(focusPreview, 180);
    return () => { window.cancelAnimationFrame(immediate); window.clearTimeout(afterMount); };
  }, [expanded]);

  const expand = () => {
    const iframe = iframeRef.current;
    if (!iframe?.requestFullscreen) { window.open(material.url, '_blank', 'noopener,noreferrer'); return; }
    iframe.src = material.embedUrl;
    setExpanded(true);
    void iframe.requestFullscreen().then(() => iframe.focus()).catch(() => { iframe.src = 'about:blank'; setExpanded(false); window.open(material.url, '_blank', 'noopener,noreferrer'); });
  };

  return <div ref={previewRef} className={`material-cover material-embed material-thumbnail ${loaded ? 'is-loaded' : 'is-loading'} ${expanded ? 'is-expanded' : ''}`}>
    {!loaded && <div className="material-preview-loading"><span className="loading-spinner" /><strong>Carregando prévia</strong><small>{material.title}</small></div>}
    <img src={thumbnailUrl} alt={`Prévia de ${material.title}`} loading="eager" decoding="async" onLoad={() => setLoaded(true)} />
    <iframe ref={iframeRef} src="about:blank" title={`Prévia expandida de ${material.title}`} allowFullScreen allow="fullscreen" tabIndex={0} onLoad={() => { if (expanded) iframeRef.current?.focus(); }} />
    <button className="material-expand" onClick={expand} aria-label={`Expandir prévia de ${material.title}`} title="Expandir prévia"><Maximize2 size={16} /></button>
    <span className="material-platform">{material.platform}</span>
  </div>;
};

export const MaterialsPage = () => {
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('todos');
  const [service, setService] = useState<(typeof services)[number]['id']>('todos');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visibleMaterials = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    return materials.filter((material) => {
      const matchesCategory = category === 'todos' || material.category === category;
      const matchesService = service === 'todos' || material.service === service;
      const matchesQuery = !normalizedQuery || `${material.title} ${material.description} ${material.categoryLabel} ${material.serviceLabel || ''}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery);
      return matchesCategory && matchesService && matchesQuery;
    });
  }, [category, query, service]);

  const groups = useMemo(() => {
    const grouped = new Map<string, { title: string; eyebrow: string; category: MaterialCategory; materials: CommercialMaterial[] }>();
    visibleMaterials.forEach((material) => {
      const key = material.service ? `${material.category}-${material.service}` : material.category;
      const current = grouped.get(key);
      if (current) current.materials.push(material);
      else grouped.set(key, { title: material.serviceLabel || material.categoryLabel, eyebrow: material.service ? material.categoryLabel : 'Categoria', category: material.category, materials: [material] });
    });
    return [...grouped.values()];
  }, [visibleMaterials]);

  const copyLink = async (material: CommercialMaterial) => {
    await navigator.clipboard.writeText(material.url);
    setCopiedId(material.id);
    window.setTimeout(() => setCopiedId((current) => current === material.id ? null : current), 1800);
  };

  return <div className="materials-page">
    <header className="page-header materials-header">
      <div><p className="eyebrow">Biblioteca comercial</p><h1>Materiais</h1><span>Conteúdos organizados para apoiar todas as etapas do processo comercial.</span></div>
      <div className="materials-summary"><strong>{materials.length}</strong><span>{materials.length === 1 ? 'material disponível' : 'materiais disponíveis'}</span></div>
    </header>

    <section className="materials-controls" aria-label="Filtros de materiais">
      <div className="materials-filter-stack"><div className="materials-categories">{categories.map((item) => <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => { setCategory(item.id); if (item.id === 'apresentacoes') setService('todos'); }}>{item.label}<span>{item.id === 'todos' ? materials.length : materials.filter((material) => material.category === item.id).length}</span></button>)}</div>{(category === 'servicos' || category === 'todos') && <div className="materials-services" aria-label="Filtrar por serviço"><span>Serviço</span>{services.map((item) => <button key={item.id} className={service === item.id ? 'active' : ''} onClick={() => setService(item.id)}>{item.label}</button>)}</div>}</div>
      <label className="materials-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar material..." /></label>
    </section>

    {visibleMaterials.length ? <div className="materials-sections">{groups.map((group) => <section className="materials-section" key={`${group.category}-${group.title}`}>
      <div className="materials-section-title"><div className="materials-section-icon">{group.category === 'servicos' ? <Briefcase size={20} /> : <Presentation size={20} />}</div><div><p>{group.eyebrow}</p><h2>{group.title}</h2></div><span>{group.materials.length}</span></div>
      <div className="materials-grid">{group.materials.map((material) => <article className="material-card" key={material.id}>
        <CanvaPreview material={material} />
        <div className="material-body"><span className="material-category">{material.category === 'servicos' ? <Briefcase size={13} /> : <Presentation size={13} />}{material.categoryLabel}{material.serviceLabel ? ` · ${material.serviceLabel}` : ''}</span><h3>{material.title}</h3><p>{material.description}</p><div className="material-actions"><a className="primary" href={material.url} target="_blank" rel="noreferrer">Visualizar <ExternalLink size={15} /></a><button className={`material-copy ${copiedId === material.id ? 'copied' : ''}`} onClick={() => void copyLink(material)}>{copiedId === material.id ? <Check size={15} /> : <Copy size={15} />}{copiedId === material.id ? 'Link copiado' : 'Copiar link'}</button></div></div>
      </article>)}</div>
    </section>)}</div> : <section className="materials-empty"><Search size={28} /><h2>Nenhum material encontrado</h2><p>Tente buscar outro termo ou selecionar uma categoria diferente.</p><button onClick={() => { setQuery(''); setCategory('todos'); setService('todos'); }}>Limpar filtros</button></section>}
  </div>;
};
