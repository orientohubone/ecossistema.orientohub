import { useEffect, useState } from 'react';
import { ArrowLeft, Briefcase, Building2, ExternalLink, Mail, MapPin, Pencil, Phone, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CreateDrawer } from '../components/CreateDrawer';
import { crm } from '../services/crm';
import type { Company, Contact, Deal } from '../types/crm';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const CompanyDetailPage = () => {
  const { companyId = '' } = useParams();
  const [data, setData] = useState<{ company: Company; contacts: Contact[]; deals: Deal[] } | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const load = () => crm.getCompany(companyId).then(setData).catch(() => setError('Não foi possível carregar esta empresa.'));
  useEffect(() => { load(); }, [companyId]);
  if (error) return <DetailError message={error} back="/empresas" />;
  if (!data) return <div className="detail-loading">Carregando empresa…</div>;
  const { company, contacts, deals } = data;
  const open = deals.filter((deal) => !['ganho', 'perdido'].includes(deal.stage));
  return <div className="entity-detail">
    <DetailHeader back="/empresas" eyebrow="Empresa" title={company.name} onEdit={() => setEditing(true)} />
    <div className="entity-grid">
      <aside className="entity-profile"><div className="entity-icon"><Building2 /></div><Info label="CNPJ" value={company.cnpj || 'Não informado'} /><Info label="Segmento" value={company.segment || 'Não informado'} /><Info label="Site" value={company.website || 'Não informado'} link={company.website || undefined} /><Info label="Endereço" value={company.address || 'Não informado'} icon={<MapPin size={14} />} />{company.summary && <div className="entity-summary"><span>Resumo</span><p>{company.summary}</p></div>}</aside>
      <main className="entity-content">
        <div className="entity-metrics"><Metric label="Negociações" value={String(deals.length)} /><Metric label="Em andamento" value={money.format(open.reduce((sum, deal) => sum + Number(deal.estimated_value || 0), 0))} /><Metric label="Contatos" value={String(contacts.length)} /></div>
        <Related title="Negociações"><div className="related-list">{deals.map((deal) => <Link key={deal.id} to={`/negociacoes/${deal.id}`}><Briefcase size={17} /><div><strong>{deal.name}</strong><span>{deal.stage} · {money.format(Number(deal.estimated_value || 0))}</span></div></Link>)}{!deals.length && <Empty text="Nenhuma negociação vinculada." />}</div></Related>
        <Related title="Contatos associados"><div className="related-list">{contacts.map((contact) => <Link key={contact.id} to={`/contatos/${contact.id}`}><UserRound size={17} /><div><strong>{contact.name}</strong><span>{contact.role || contact.email || 'Sem informações adicionais'}</span></div></Link>)}{!contacts.length && <Empty text="Nenhum contato vinculado." />}</div></Related>
      </main>
    </div>
    {editing && <CreateDrawer kind="company" initial={company} onClose={() => setEditing(false)} onCreated={load} />}
  </div>;
};

type ContactDetail = Contact & { company?: { name?: string } | null; deal_links?: { deal?: Deal | null }[] };
export const ContactDetailPage = () => {
  const { contactId = '' } = useParams();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const load = () => crm.getContact(contactId).then((item) => setContact(item as ContactDetail)).catch(() => setError('Não foi possível carregar este contato.'));
  useEffect(() => { load(); }, [contactId]);
  if (error) return <DetailError message={error} back="/contatos" />;
  if (!contact) return <div className="detail-loading">Carregando contato…</div>;
  const deals = (contact.deal_links || []).flatMap((link) => link.deal ? [link.deal] : []);
  return <div className="entity-detail">
    <DetailHeader back="/contatos" eyebrow="Contato" title={contact.name} onEdit={() => setEditing(true)} />
    <div className="entity-grid">
      <aside className="entity-profile"><div className="entity-icon"><UserRound /></div><Info label="Cargo" value={contact.role || 'Não informado'} /><Info label="Empresa" value={contact.company?.name || 'Não vinculada'} /><Info label="E-mail" value={contact.email || 'Não informado'} icon={<Mail size={14} />} /><Info label="Telefone" value={contact.phone || 'Não informado'} icon={<Phone size={14} />} /><Info label="WhatsApp" value={contact.whatsapp_username || 'Não informado'} /><Info label="Comunicação" value={consentLabel(contact.communication_consent)} /></aside>
      <main className="entity-content"><div className="entity-metrics"><Metric label="Negociações" value={String(deals.length)} /><Metric label="Empresa" value={contact.company?.name || '—'} /></div><Related title="Negociações relacionadas"><div className="related-list">{deals.map((deal) => <Link key={deal.id} to={`/negociacoes/${deal.id}`}><Briefcase size={17} /><div><strong>{deal.name}</strong><span>{deal.stage} · {money.format(Number(deal.estimated_value || 0))}</span></div></Link>)}{!deals.length && <Empty text="Nenhuma negociação vinculada." />}</div></Related></main>
    </div>
    {editing && <CreateDrawer kind="contact" initial={contact} onClose={() => setEditing(false)} onCreated={load} />}
  </div>;
};

const DetailHeader = ({ back, eyebrow, title, onEdit }: { back: string; eyebrow: string; title: string; onEdit: () => void }) => <header className="entity-heading"><div><Link to={back}><ArrowLeft size={17} />Voltar</Link><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div><button className="primary" onClick={onEdit}><Pencil size={16} />Editar</button></header>;
const Info = ({ label, value, link, icon }: { label: string; value: string; link?: string; icon?: React.ReactNode }) => <div className="entity-info"><span>{label}</span>{link ? <a href={link} target="_blank" rel="noreferrer">{value}<ExternalLink size={12} /></a> : <strong>{icon}{value}</strong>}</div>;
const Metric = ({ label, value }: { label: string; value: string }) => <div><span>{label}</span><strong>{value}</strong></div>;
const Related = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="detail-panel"><div className="panel-title"><div><h2>{title}</h2></div></div>{children}</section>;
const Empty = ({ text }: { text: string }) => <div className="detail-empty">{text}</div>;
const DetailError = ({ message, back }: { message: string; back: string }) => <section className="detail-error"><p>{message}</p><Link to={back}>Voltar</Link></section>;
const consentLabel = (value: Contact['communication_consent']) => ({ authorized: 'Autorizado', revoked: 'Revogado', not_informed: 'Não informado' }[value]);
