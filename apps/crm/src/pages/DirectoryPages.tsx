import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Briefcase, Building2, CircleDollarSign, Mail, Phone, Plus, Search, UserRound, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateDrawer, type CreateKind } from '../components/CreateDrawer';
import { crm } from '../services/crm';
import type { Company, Contact } from '../types/crm';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const Header = ({ title, subtitle, action, onAction }: { title: string; subtitle: string; action: string; onAction: () => void }) => <header className="page-header directory-header"><div><p className="eyebrow">Relacionamentos</p><h1>{title}</h1><span>{subtitle}</span></div><button className="primary" onClick={onAction}><Plus size={17} />{action}</button></header>;
const useCreation = (kind: CreateKind, load: () => void) => { const [open, setOpen] = useState(false); return { button: () => setOpen(true), drawer: open ? <CreateDrawer kind={kind} onClose={() => setOpen(false)} onCreated={load} /> : null }; };

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => { setLoading(true); setError(''); crm.listCompanies().then(setCompanies).catch(() => setError('Não foi possível carregar as empresas.')).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const creation = useCreation('company', load);
  const filtered = useMemo(() => companies.filter((company) => `${company.name} ${company.segment || ''} ${company.cnpj || ''}`.toLowerCase().includes(query.toLowerCase())), [companies, query]);
  const totalDeals = companies.reduce((sum, company) => sum + company.deals_count, 0);
  const openValue = companies.reduce((sum, company) => sum + company.open_value, 0);
  return <>
    <Header title="Empresas" subtitle="Organize contas, relacionamentos e oportunidades comerciais." action="Criar empresa" onAction={creation.button} />
    <div className="directory-overview"><Overview icon={<Building2 />} label="Empresas" value={companies.length.toLocaleString('pt-BR')} /><Overview icon={<Briefcase />} label="Negociações" value={totalDeals.toLocaleString('pt-BR')} /><Overview icon={<CircleDollarSign />} label="Valor em aberto" value={money.format(openValue)} accent /></div>
    <DirectoryToolbar query={query} setQuery={setQuery} placeholder="Buscar por empresa, segmento ou CNPJ" count={filtered.length} noun="empresas" />
    <section className="directory-card"><header className="company-list-head"><span>Empresa</span><span>Relacionamento</span><span>Pipeline</span><span>Última atividade</span><span /></header>
      {loading ? <DirectorySkeleton /> : error ? <DirectoryError message={error} retry={load} /> : filtered.length ? <div className="directory-list">{filtered.map((company) => <Link to={`/empresas/${company.id}`} className="company-row" key={company.id}><Identity name={company.name} subtitle={company.cnpj || company.website || 'Cadastro empresarial'} /><div className="directory-meta"><span>Segmento</span><strong>{company.segment || 'Não informado'}</strong></div><div className="pipeline-cell"><strong>{company.deals_count} {company.deals_count === 1 ? 'negociação' : 'negociações'}</strong><span>{money.format(company.open_value)} em aberto</span></div><div className="directory-meta"><span>Último contato</span><strong>{company.last_contact_at ? new Date(company.last_contact_at).toLocaleDateString('pt-BR') : 'Não realizado'}</strong></div><ArrowUpRight /></Link>)}</div> : <DirectoryEmpty icon={<Building2 />} title={query ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'} text={query ? 'Revise os termos da busca.' : 'Crie a primeira empresa para começar a organizar seus relacionamentos.'} />}
    </section>{creation.drawer}
  </>;
};

export const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => { setLoading(true); setError(''); crm.listContacts().then(setContacts).catch(() => setError('Não foi possível carregar os contatos.')).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const creation = useCreation('contact', load);
  const filtered = useMemo(() => contacts.filter((contact) => `${contact.name} ${contact.company || ''} ${contact.email || ''} ${contact.phone || ''} ${contact.role || ''}`.toLowerCase().includes(query.toLowerCase())), [contacts, query]);
  const linked = contacts.filter((contact) => contact.company_id).length;
  const deals = contacts.reduce((sum, contact) => sum + contact.deals_count, 0);
  return <>
    <Header title="Contatos" subtitle="Pessoas, decisores e conexões das suas negociações." action="Criar contato" onAction={creation.button} />
    <div className="directory-overview"><Overview icon={<Users />} label="Contatos" value={contacts.length.toLocaleString('pt-BR')} /><Overview icon={<Building2 />} label="Com empresa" value={linked.toLocaleString('pt-BR')} /><Overview icon={<Briefcase />} label="Em negociações" value={deals.toLocaleString('pt-BR')} accent /></div>
    <DirectoryToolbar query={query} setQuery={setQuery} placeholder="Buscar por nome, empresa, e-mail ou telefone" count={filtered.length} noun="contatos" />
    <section className="directory-card"><header className="contact-list-head"><span>Contato</span><span>Empresa e cargo</span><span>Comunicação</span><span>Pipeline</span><span /></header>
      {loading ? <DirectorySkeleton /> : error ? <DirectoryError message={error} retry={load} /> : filtered.length ? <div className="directory-list">{filtered.map((contact) => <Link to={`/contatos/${contact.id}`} className="contact-row" key={contact.id}><Identity name={contact.name} subtitle={contact.role || 'Cargo não informado'} contact /><div className="directory-meta"><span>Empresa</span><strong>{contact.company || 'Não vinculada'}</strong></div><div className="contact-channels">{contact.email && <span><Mail />{contact.email}</span>}{contact.phone && <span><Phone />{contact.phone}</span>}{!contact.email && !contact.phone && <small>Sem canais informados</small>}</div><div className="pipeline-cell"><strong>{contact.deals_count}</strong><span>{contact.deals_count === 1 ? 'negociação' : 'negociações'}</span></div><ArrowUpRight /></Link>)}</div> : <DirectoryEmpty icon={<UserRound />} title={query ? 'Nenhum contato encontrado' : 'Nenhum contato cadastrado'} text={query ? 'Revise os termos da busca.' : 'Adicione um contato e associe-o a uma empresa ou negociação.'} />}
    </section>{creation.drawer}
  </>;
};

const Overview = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) => <article className={accent ? 'accent' : ''}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>;
const DirectoryToolbar = ({ query, setQuery, placeholder, count, noun }: { query: string; setQuery: (value: string) => void; placeholder: string; count: number; noun: string }) => <div className="directory-toolbar"><div><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></div><span>{count} {noun}</span></div>;
const Identity = ({ name, subtitle, contact }: { name: string; subtitle: string; contact?: boolean }) => <div className="directory-identity"><span>{contact ? <UserRound /> : initials(name)}</span><div><strong>{name}</strong><small>{subtitle}</small></div></div>;
const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const DirectorySkeleton = () => <div className="directory-list skeleton-directory">{[0, 1, 2, 3].map((row) => <div key={row}>{[0, 1, 2, 3].map((column) => <span className={`skeleton-line skeleton-${(row + column) % 3}`} key={column} />)}</div>)}</div>;
const DirectoryError = ({ message, retry }: { message: string; retry: () => void }) => <div className="directory-state error-state"><strong>{message}</strong><button className="secondary" onClick={retry}>Tentar novamente</button></div>;
const DirectoryEmpty = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => <div className="directory-state"><span>{icon}</span><strong>{title}</strong><p>{text}</p></div>;

export const PlaceholderPage = ({ title }: { title: string }) => <><header className="page-header"><div><p className="eyebrow">Operação comercial</p><h1>{title}</h1></div></header><section className="placeholder"><div><h2>Módulo preparado</h2><p>Este domínio será conectado ao novo modelo de dados na próxima etapa.</p></div></section></>;
