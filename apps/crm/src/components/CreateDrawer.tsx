import { FormEvent, useEffect, useState } from 'react';
import { Building2, Handshake, UserRound, X } from 'lucide-react';
import { crm } from '../services/crm';
import type { Company, Contact, DealStage } from '../types/crm';
import { CustomSelect } from './CustomSelect';

export type CreateKind = 'company' | 'contact' | 'deal';

const titles: Record<CreateKind, string> = { company: 'Criar empresa', contact: 'Criar contato', deal: 'Criar negociação' };
const icons = { company: Building2, contact: UserRound, deal: Handshake };
const emptyCompany = { name: '', segment: '', cnpj: '', website: '', summary: '', address: '' };
const emptyContact: { name: string; company_id: string; role: string; email: string; phone: string; whatsapp_username: string; communication_consent: Contact['communication_consent'] } = { name: '', company_id: '', role: '', email: '', phone: '', whatsapp_username: '', communication_consent: 'not_informed' };
const emptyDeal = { name: '', company_id: '', primary_contact_id: '', source: 'manual', campaign: '', stage: 'novo' as DealStage, estimated_value: '', demand: '' };

export const CreateDrawer = ({ kind, onClose, onCreated, initial }: { kind: CreateKind; onClose: () => void; onCreated: () => void; initial?: Company | Contact }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [company, setCompany] = useState(emptyCompany);
  const [contact, setContact] = useState(emptyContact);
  const [deal, setDeal] = useState(emptyDeal);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const Icon = icons[kind];

  useEffect(() => {
    if (kind !== 'company') crm.listCompanies().then(setCompanies).catch(() => setError('Não foi possível carregar as empresas.'));
    if (kind === 'deal') crm.listContacts().then(setContacts).catch(() => setError('Não foi possível carregar os contatos.'));
  }, [kind]);
  useEffect(() => {
    if (!initial) return;
    if (kind === 'company') { const item = initial as Company; setCompany({ name: item.name, segment: item.segment || '', cnpj: item.cnpj || '', website: item.website || '', summary: item.summary || '', address: item.address || '' }); }
    if (kind === 'contact') { const item = initial as Contact; setContact({ name: item.name, company_id: item.company_id || '', role: item.role || '', email: item.email || '', phone: item.phone || '', whatsapp_username: item.whatsapp_username || '', communication_consent: item.communication_consent || 'not_informed' }); }
  }, [initial, kind]);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      if (kind === 'company') { const input = { ...company, segment: company.segment || null, cnpj: company.cnpj || null, website: company.website || null, summary: company.summary || null, address: company.address || null }; if (initial) await crm.updateCompany(initial.id, input); else await crm.createCompany(input); }
      if (kind === 'contact') { const input = { ...contact, company_id: contact.company_id || null, role: contact.role || null, email: contact.email || null, phone: contact.phone || null, whatsapp_username: contact.whatsapp_username || null }; if (initial) await crm.updateContact(initial.id, input); else await crm.createContact(input); }
      if (kind === 'deal') await crm.createDeal({ ...deal, company_id: deal.company_id || null, primary_contact_id: deal.primary_contact_id || null, campaign: deal.campaign || null, estimated_value: deal.estimated_value ? Number(deal.estimated_value) : null, demand: deal.demand || null });
      onCreated(); onClose();
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível salvar.'); }
    finally { setSaving(false); }
  };

  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="drawer" onMouseDown={(event) => event.stopPropagation()}><header><div><span><Icon size={19} /></span><div><p>Novo registro</p><h2>{titles[kind]}</h2></div></div><button type="button" onClick={onClose} aria-label="Fechar"><X /></button></header><form onSubmit={submit}><div className="drawer-body">
    {kind === 'company' && <><Field label="Nome da empresa" required value={company.name} onChange={(name) => setCompany({ ...company, name })} placeholder="Digite o nome da empresa" /><Field label="CNPJ" value={company.cnpj} onChange={(cnpj) => setCompany({ ...company, cnpj })} placeholder="00.000.000/0000-00" /><Field label="Segmento" value={company.segment} onChange={(segment) => setCompany({ ...company, segment })} placeholder="Ex.: Tecnologia" /><Field label="URL" type="url" value={company.website} onChange={(website) => setCompany({ ...company, website })} placeholder="https://empresa.com.br" /><Field label="Resumo" area value={company.summary} onChange={(summary) => setCompany({ ...company, summary })} placeholder="Descreva a empresa" /><Field label="Endereço" value={company.address} onChange={(address) => setCompany({ ...company, address })} placeholder="Endereço comercial" /></>}
    {kind === 'contact' && <><Field label="Nome" required value={contact.name} onChange={(name) => setContact({ ...contact, name })} placeholder="Nome do contato" /><Field label="Cargo" value={contact.role} onChange={(role) => setContact({ ...contact, role })} placeholder="Cargo do contato" /><Field label="E-mail" type="email" value={contact.email} onChange={(email) => setContact({ ...contact, email })} placeholder="contato@empresa.com" /><Field label="Telefone" value={contact.phone} onChange={(phone) => setContact({ ...contact, phone })} placeholder="(00) 00000-0000" /><Field label="Usuário no WhatsApp" value={contact.whatsapp_username} onChange={(whatsapp_username) => setContact({ ...contact, whatsapp_username })} placeholder="@usuario" /><Select label="Empresa" value={contact.company_id} onChange={(company_id) => setContact({ ...contact, company_id })} options={companies.map((item) => [item.id, item.name])} empty="Sem empresa" /><Select label="Contato e comunicação" value={contact.communication_consent} onChange={(communication_consent) => setContact({ ...contact, communication_consent: communication_consent as typeof contact.communication_consent })} options={[["not_informed", "Não informado"], ["authorized", "Autorizado"], ["revoked", "Revogado"]]} /></>}
    {kind === 'deal' && <><Field label="Nome da negociação" required value={deal.name} onChange={(name) => setDeal({ ...deal, name })} placeholder="Digite o nome da negociação" /><div className="form-grid"><Select label="Fonte" value={deal.source} onChange={(source) => setDeal({ ...deal, source })} options={[["manual", "Manual"], ["contato", "Formulário do site"], ["indicacao", "Indicação"], ["prospeccao", "Prospecção"]]} /><Select label="Etapa" value={deal.stage} onChange={(stage) => setDeal({ ...deal, stage: stage as DealStage })} options={[["novo", "Sem contato"], ["qualificando", "Contato feito"], ["proposta", "Proposta"], ["negociação", "Negociação"]]} /></div><Field label="Campanha" value={deal.campaign} onChange={(campaign) => setDeal({ ...deal, campaign })} placeholder="Campanha de origem" /><Select label="Empresa" value={deal.company_id} onChange={(company_id) => setDeal({ ...deal, company_id, primary_contact_id: '' })} options={companies.map((item) => [item.id, item.name])} empty="Sem empresa" /><Select label="Contato" value={deal.primary_contact_id} onChange={(primary_contact_id) => setDeal({ ...deal, primary_contact_id })} options={contacts.filter((item) => !deal.company_id || item.company_id === deal.company_id).map((item) => [item.id, item.name])} empty="Sem contato" /><Field label="Valor estimado" type="number" value={deal.estimated_value} onChange={(estimated_value) => setDeal({ ...deal, estimated_value })} placeholder="0,00" /><Field label="Demanda inicial" area value={deal.demand} onChange={(demand) => setDeal({ ...deal, demand })} placeholder="Contexto e necessidade do cliente" /></>}
    {error && <p className="drawer-error">{error}</p>}
  </div><footer><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary" disabled={saving}>{saving ? 'Salvando…' : titles[kind]}</button></footer></form></aside></div>;
};

const Field = ({ label, value, onChange, placeholder, required, area, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; area?: boolean; type?: string }) => <label className="drawer-field">{label}{required && <b> *</b>}{area ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />}</label>;
const Select = ({ label, value, onChange, options, empty }: { label: string; value: string; onChange: (value: string) => void; options: string[][]; empty?: string }) => <label className="drawer-field">{label}<CustomSelect value={value} onChange={onChange} placeholder={empty} options={[...(empty !== undefined ? [{ value: '', label: empty }] : []), ...options.map(([id, name]) => ({ value: id, label: name }))]} /></label>;
