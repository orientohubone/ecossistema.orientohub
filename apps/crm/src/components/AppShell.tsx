import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { BarChart3, Building2, ChevronDown, Handshake, ListTodo, Loader2, LogOut, Menu, MessageSquareText, Search, UserRound, Users, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { crm } from '../services/crm';

const items = [
  { to: '/', label: 'Negociações', icon: Handshake }, { to: '/empresas', label: 'Empresas', icon: Building2 },
  { to: '/contatos', label: 'Contatos', icon: Users }, { to: '/tarefas', label: 'Tarefas', icon: ListTodo },
  { to: '/metricas', label: 'Métricas', icon: BarChart3 },
  { to: '/playbook', label: 'Playbook', icon: MessageSquareText },
];
type SearchResults = Awaited<ReturnType<typeof crm.globalSearch>>;
const emptyResults: SearchResults = { deals: [], companies: [], contacts: [] };

export const AppShell = ({ user }: { user: User }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Founder';
  const company = user.user_metadata?.company || 'OrientoHub';

  const Sidebar = () => <>
    <div className="shell-brand"><Link to="/"><img className="shell-logo-full" src="/orientohub.png" alt="OrientoHub" /><img className="shell-logo-mark" src="/isotipo-orientohub.png" alt="OrientoHub" /></Link><button onClick={() => setCollapsed((current) => !current)} aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}>{collapsed ? <ChevronDown size={18} /> : <Menu size={18} />}</button></div>
    <div className="shell-profile"><div className="shell-avatar"><img src="/fernando.jpg" alt={name} /></div><div><strong>{name}</strong><span>Founder • {company}</span></div></div>
    <nav>{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} title={collapsed ? label : undefined}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
    <button className="nav-link logout" onClick={() => supabase.auth.signOut()}><LogOut size={19} /><span>Sair</span></button>
  </>;

  return <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
    {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}><Sidebar /></aside>
    <section className="workspace">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><GlobalSearch /></div><div className="top-profile"><div className="shell-avatar small"><img src="/fernando.jpg" alt={name} /></div><div><strong>{name}</strong><span>{company}</span></div><ChevronDown size={16} /></div></header>
      <main className="content"><Outlet /></main>
    </section>
    {mobileOpen && <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></button>}
  </div>;
};

const GlobalSearch = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); setQuery(''); }, [location.pathname]);
  useEffect(() => {
    if (query.trim().length < 2) { setResults(emptyResults); setLoading(false); setOpen(false); return; }
    setLoading(true); setOpen(true);
    const timer = window.setTimeout(() => crm.globalSearch(query).then(setResults).catch(() => setResults(emptyResults)).finally(() => setLoading(false)), 280);
    return () => window.clearTimeout(timer);
  }, [query]);
  const total = results.deals.length + results.companies.length + results.contacts.length;
  return <div className="global-search">
    <div className="top-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => query.length >= 2 && setOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }} placeholder="Buscar negociações, empresas e contatos..." />{loading && <Loader2 className="search-loader" size={16} />}{query && !loading && <button onClick={() => { setQuery(''); setResults(emptyResults); setOpen(false); }} aria-label="Limpar busca"><X size={14} /></button>}</div>
    {open && <div className="search-results">{loading ? <div className="search-status"><span className="loading-spinner" />Buscando…</div> : total ? <>{results.deals.length > 0 && <SearchGroup title="Negociações">{results.deals.map((item) => <Link key={item.id} to={`/negociacoes/${item.id}`}><Handshake /><div><strong>{item.name}</strong><span>{item.company?.name || item.stage}</span></div></Link>)}</SearchGroup>}{results.companies.length > 0 && <SearchGroup title="Empresas">{results.companies.map((item) => <Link key={item.id} to={`/empresas/${item.id}`}><Building2 /><div><strong>{item.name}</strong><span>{item.segment || 'Empresa'}</span></div></Link>)}</SearchGroup>}{results.contacts.length > 0 && <SearchGroup title="Contatos">{results.contacts.map((item) => <Link key={item.id} to={`/contatos/${item.id}`}><UserRound /><div><strong>{item.name}</strong><span>{item.company?.name || item.email || 'Contato'}</span></div></Link>)}</SearchGroup>}</> : <div className="search-status">Nenhum resultado para “{query}”.</div>}</div>}
  </div>;
};

const SearchGroup = ({ title, children }: { title: string; children: React.ReactNode }) => <section><p>{title}</p>{children}</section>;
