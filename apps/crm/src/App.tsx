import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Login } from './components/Login';
import { CRM_ALLOWED_EMAIL, supabase } from './lib/supabase';
import { CompaniesPage, ContactsPage, PlaceholderPage } from './pages/DirectoryPages';
import { PipelinePage } from './pages/PipelinePage';
import { DealPage } from './pages/DealPage';
import { TasksPage } from './pages/TasksPage';
import { CompanyDetailPage, ContactDetailPage } from './pages/EntityDetailPages';
import { PlaybookPage } from './pages/PlaybookPage';
import { MetricsPage } from './pages/MetricsPage';
import { MaterialsPage } from './pages/MaterialsPage';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); }); const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next)); return () => data.subscription.unsubscribe(); }, []);
  if (!ready) return <div className="splash">Carregando CRM…</div>;
  const allowed = session?.user.email?.toLowerCase() === CRM_ALLOWED_EMAIL;
  return <BrowserRouter><Routes><Route path="/login" element={allowed ? <Navigate to="/" replace /> : <Login />} /><Route element={allowed && session ? <AppShell user={session.user} /> : <Navigate to="/login" replace />}><Route index element={<PipelinePage />} /><Route path="negociacoes/:dealId" element={<DealPage />} /><Route path="empresas" element={<CompaniesPage />} /><Route path="empresas/:companyId" element={<CompanyDetailPage />} /><Route path="contatos" element={<ContactsPage />} /><Route path="contatos/:contactId" element={<ContactDetailPage />} /><Route path="tarefas" element={<TasksPage />} /><Route path="metricas" element={<MetricsPage />} /><Route path="playbook" element={<PlaybookPage />} /><Route path="materiais" element={<MaterialsPage />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>;
}
