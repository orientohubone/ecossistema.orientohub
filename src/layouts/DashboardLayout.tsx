import { useState, useMemo, useEffect } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  BarChart2,
  FileText,
  Settings,
  LogOut,
  Link2,
  Lightbulb,
  Users,
  Search,
  Crown,
  Sparkles,
  User as UserIcon,
  RefreshCw,
  Save,
  Check,
  GraduationCap,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import ContactFab from '../components/layout/ContactFab';
import { supabase } from '../config/supabase';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    // Initialize dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = useMemo(() => [
    { id: 'dashboard', name: t('common.dashboard'), icon: <LayoutDashboard size={18} />, href: '/dashboard' },
    { id: 'insights', name: t('dashboard.insights'), icon: <BarChart2 size={18} />, href: '/dashboard/insights' },
    { id: 'frameworks', name: t('dashboard.frameworks'), icon: <FileText size={18} />, href: '/dashboard/frameworks' },
    { id: 'ideas', name: 'Ideias', icon: <Sparkles size={18} />, href: '/dashboard/ideas' },
    { id: 'projects', name: t('projects.title'), icon: <Lightbulb size={18} />, href: '/dashboard/projects' },
    { id: 'academy', name: 'Oriento Academy', icon: <GraduationCap size={18} />, href: '/dashboard/academy', protected: true },
    { id: 'founder', name: 'Dashboard Founder', icon: <Crown size={18} />, href: '/dashboard/founder', protected: true, isFounder: true },
    { id: 'solutions', name: 'Soluções', icon: <Link2 size={18} />, href: '/dashboard/solutions' },
    { id: 'community', name: 'Comunidade', icon: <Users size={18} />, href: '/dashboard/community' },
    { id: 'settings', name: t('common.settings'), icon: <Settings size={18} />, href: '/dashboard/settings' }
  ], [t]);

  return (
    <Tooltip.Provider delayDuration={100}>
      <div className="dashboard-shell dark flex h-screen bg-[#0c121b] text-white">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar} />
              <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', stiffness: 300 }} className="relative h-full w-72 max-w-xs border-r border-[#273548] bg-[#101722] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#273548] p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary-500 dark:hidden">Orientohub</span>
                    <img
                      src="/orientohub.png"
                      alt="Orientohub"
                      className="hidden dark:block h-6 w-auto"
                    />
                  </div>
                  <button onClick={toggleSidebar} className="rounded-lg p-2 text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100%-64px)]">
                  <SidebarHeader user={user} />
                  <SearchBox />
                  <nav className="space-y-1">{navItems.map(item => <SidebarLink key={item.id} item={item} pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} />)}</nav>
                  <div className="mt-auto space-y-3">
                <DarkModeToggle />
                <PlanCTA compact />
                <LogoutButton onLogout={handleLogout} />
              </div>
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex lg:flex-col ${collapsed ? 'w-20' : 'w-72'} border-r border-[#273548] bg-[#101722] transition-width duration-200 ease-in-out`}>
          <div className={`relative flex h-16 items-center border-b border-[#273548] ${collapsed ? 'justify-start px-2' : 'justify-between px-4'}`}>
            <Link to="/" className={`flex items-center gap-3 ${collapsed ? 'justify-start w-12 h-12 flex-shrink-0' : ''}`}>
              {collapsed ? (
                <>
                  <span className="text-primary-500 text-2xl font-extrabold dark:hidden">O</span>
                  <img
                    src="/isotipo-orientohub.png"
                    alt="Orientohub"
                    className="hidden dark:block w-12 h-12 object-contain flex-shrink-0"
                  />
                </>
              ) : (
                <>
                  <span className="text-xl font-bold text-primary-500 dark:hidden">Orientohub</span>
                  <img
                    src="/orientohub.png"
                    alt="Orientohub"
                    className="hidden dark:block h-6 w-auto"
                  />
                </>
              )}
            </Link>
            <div className={`flex items-center gap-2 ${collapsed ? 'absolute right-2' : ''}`}>
              <button onClick={toggleCollapse} title={collapsed ? 'Expandir' : 'Recolher'} className="rounded-lg p-2 text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white">
                {collapsed ? <ChevronDown size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <SidebarHeader user={user} collapsed={collapsed} />
            <SearchBox collapsed={collapsed} />
            <nav className="flex-1 space-y-1 mt-2">{navItems.map(item => <SidebarLink key={item.id} item={item} pathname={location.pathname} collapsed={collapsed} />)}</nav>
            <div className="mt-4"><PlanCTA compact={collapsed} /></div>
            <div className="mt-auto">
              <DarkModeToggle collapsed={collapsed} />
              <LogoutButton onLogout={handleLogout} compact={collapsed} />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navbar */}
          <header className="sticky top-0 z-20 border-b border-[#273548] bg-[#101722]/95 backdrop-blur-xl">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <button className="rounded-lg p-2 text-[#9ba9bc] hover:bg-[#151f2b] hover:text-white lg:hidden" onClick={toggleSidebar}><Menu size={20} /></button>
                  <div className="hidden items-center gap-3 rounded-xl border border-[#34455a] bg-[#0c121b] px-3 py-2 md:flex">
                    <Search size={16} className="text-[#718096]" />
                    <input type="search" placeholder="Buscar projetos, soluções, insights..." className="bg-transparent text-sm text-white outline-none placeholder:text-[#718096]" />
                  </div>
                  </div>

                <div className="flex items-center gap-4">
                  <TopPlanBadge />
                  <div className="flex items-center gap-3"><UserMenu user={user} /></div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <motion.main className="dashboard-main min-w-0 flex-1 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div>
              <div className="dashboard-content w-full px-4 sm:px-6 lg:px-8"><Outlet /></div>
            </div>
          </motion.main>
        </div>
      </div>
      <ContactFab />
    </Tooltip.Provider>
  );
};

/* --------------------------
   Reusable subcomponents
   -------------------------- */

const SidebarHeader = ({ user, collapsed = false }: { user?: any; collapsed?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary-400/35 text-black font-bold">
      {user?.user_metadata?.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback para iniciais se a imagem falhar
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div className={`w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ${user?.user_metadata?.avatar_url ? 'hidden' : ''}`}>
        {user?.user_metadata?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    </div>
      {!collapsed && (
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{user?.user_metadata?.name || user?.email?.split('@')[0]}</p>
          <p className="text-xs text-[#9ba9bc]">Founder • {user?.user_metadata?.company || '—'}</p>
        </div>
      )}
    </div>
  );
};

const SearchBox = ({ collapsed = false }: { collapsed?: boolean }) => {
  if (collapsed) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#34455a] bg-[#0c121b] p-2.5">
      <Search size={16} className="text-[#718096]" />
      <input type="search" placeholder="Buscar..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#718096]" />
    </div>
  );
};

const SidebarLink = ({ item, pathname, collapsed = false, onNavigate }: { item: any; pathname: string; collapsed?: boolean; onNavigate?: () => void }) => {
  // Protege rota se item.protected e não houver user
  const { user } = useAuthStore();
  if (item.protected && !user) return null;

  // Verificar se é founder para Dashboard Founder
  if (item.isFounder) {
    const isFounder = user?.email?.toLowerCase() === 'fersouluramal@gmail.com';
    if (!isFounder) return null;
  }

  const active = pathname === item.href;
  const isAcademy = item.id === 'academy';
  const isFounderDashboard = item.id === 'founder';

  // Dashboard Founder - estilo simples com badge
  if (isFounderDashboard) {
    return (
      <Link
        to={item.href}
        onClick={onNavigate}
        className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
          ${active ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/50 dark:text-primary-100' :
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
        `}
        aria-current={active ? 'page' : undefined}
      >
        {collapsed ? (
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <span className={`flex h-6 w-6 items-center justify-center rounded ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{item.icon}</span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={10}
                className="z-50 px-3 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white border border-primary-500 shadow-xl animate-fadein"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.25), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
                  transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)'
                }}
              >
                {item.name} <span className="ml-2 text-xs bg-primary-500 text-black px-1.5 py-0.5 rounded">FOUNDER</span>
                <Tooltip.Arrow className="fill-primary-500" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ) : (
          <>
            <span className={`flex h-6 w-6 items-center justify-center rounded ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{item.icon}</span>
            <span className="truncate flex-1">{item.name}</span>
            <span className="text-[10px] bg-primary-500/20 text-primary-700 dark:text-primary-400 px-1.5 py-0.5 rounded font-bold border border-primary-500/30">FOUNDER</span>
          </>
        )}
      </Link>
    );
  }

  // Custom premium effect for Oriento Academy
  if (isAcademy) {
    const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (
      <div className={`relative my-1 group ${collapsed ? 'flex justify-center' : ''}`}>
        <div
          className={`absolute inset-0 z-0 rounded-xl pointer-events-none transition-all duration-700
            ${active ? 'opacity-100 scale-105' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}
          `}
        >
          {/* Multi-layered conic-gradient border effect */}
          <div className="absolute inset-0 rounded-xl blur-[2.5px]" style={{
            background: 'conic-gradient(from 120deg, #FFD600 0%, #cf30aa 30%, #18116a 60%, #FFD600 100%)',
            filter: 'brightness(1.15)',
            opacity: 0.7
          }} />
          <div className="absolute inset-0 rounded-xl blur-[6px]" style={{
            background: 'conic-gradient(from 60deg, #fffbe6 0%, #cf30aa33 40%, #18116a22 80%, #FFD600 100%)',
            opacity: 0.5
          }} />
        </div>
        <Link
          to={item.href}
          onClick={onNavigate}
          className={`relative z-10 group flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-300
            border border-yellow-300/80 dark:border-yellow-700/60
            focus:outline-none focus:ring-2 focus:ring-yellow-400/90
            ${active
              ? 'shadow-lg ring-2 ring-yellow-400/80'
              : 'shadow-md hover:shadow-lg hover:ring-2 hover:ring-yellow-400/60'}
            ${isDark ? 'bg-[#FFD600] text-black' : ''}
          `}
          aria-current={active ? 'page' : undefined}
          style={
            isDark
              ? {
                background: '#FFD600',
                color: '#18181b',
                boxShadow: active
                  ? '0 0 0 3px #FFD60099, 0 2px 8px 0 #FFD60033'
                  : '0 0 0 2px #FFD60022, 0 1.5px 4px 0 #FFD60022'
              }
              : {
                background: active
                  ? 'linear-gradient(90deg, #fffbe6 0%, #ffe7fa 40%, #f9e7ff 70%, #fffbe6 100%)'
                  : 'linear-gradient(90deg, #fffbe6 0%, #f9e7ff 40%, #e6e6fa 70%, #fffbe6 100%)',
                backgroundSize: '200% 200%',
                animation: active ? 'academyGlow 2.5s ease-in-out infinite alternate' : 'academyGlow 4s ease-in-out infinite alternate',
                color: '#7a5600',
                boxShadow: active
                  ? '0 0 0 3px #FFD60055, 0 2px 8px 0 #FFD60033'
                  : '0 0 0 2px #FFD60022, 0 1.5px 4px 0 #FFD60022'
              }
          }
        >
          {collapsed ? (
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? (isDark ? 'text-black' : 'text-yellow-600') : (isDark ? 'text-black' : 'text-yellow-500 group-hover:text-yellow-700')}`}>{item.icon}</span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={10}
                  className="z-50 px-3 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white border border-yellow-400 shadow-xl animate-fadein"
                  style={{
                    boxShadow: '0 8px 32px 0 #FFD60033, 0 1.5px 4px 0 #FFD60022',
                    transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)'
                  }}
                >
                  {item.name}
                  <Tooltip.Arrow className="fill-yellow-400" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ) : (
            <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? (isDark ? 'text-black' : 'text-yellow-600') : (isDark ? 'text-black' : 'text-yellow-500 group-hover:text-yellow-700')}`}>{item.icon}</span>
          )}
          {!collapsed && <span className="truncate">{item.name}</span>}
        </Link>
        {/* Keyframes for animated gradient background */}
        <style>{`
          @keyframes academyGlow {
            0% { background-position: 0% 50%; filter: brightness(1.05); }
            50% { background-position: 100% 50%; filter: brightness(1.18); }
            100% { background-position: 0% 50%; filter: brightness(1.05); }
          }
        `}</style>
      </div>
    );
  }

  // Default link for other items
  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${active ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' :
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
      `}
      aria-current={active ? 'page' : undefined}
    >
      {collapsed ? (
        <Tooltip.Root delayDuration={100}>
          <Tooltip.Trigger asChild>
            <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{item.icon}</span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={10}
              className="z-50 px-3 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white border border-primary-500 shadow-xl animate-fadein"
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.25), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
                transition: 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)'
              }}
            >
              {item.name}
              <Tooltip.Arrow className="fill-primary-500" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      ) : (
        <span className={`flex h-6 w-6 items-center justify-center rounded ${active ? 'text-[#0c121b]' : 'text-[#718096] group-hover:text-primary-300'}`}>{item.icon}</span>
      )}
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
};

const useCurrentPlan = () => {
  const { user } = useAuthStore();
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    if (!user) return;

    const loadPlan = () => supabase
      .from('billing_subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setPlan(data?.plan || 'free'));

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') loadPlan();
    };

    loadPlan();
    window.addEventListener('focus', loadPlan);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.removeEventListener('focus', loadPlan);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [user]);

  return plan;
};

const TopPlanBadge = () => {
  const plan = useCurrentPlan();
  const label = plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Free';

  return (
    <div className="hidden sm:flex items-center gap-3 text-sm">
      <span className="text-[#9ba9bc]">Plano: <strong className="ml-1 text-primary-300">{label}</strong></span>
      <Link to={plan === 'free' ? '/planos' : '/dashboard/settings?tab=plan'} className="rounded-lg bg-primary-500 px-3 py-2 text-sm font-bold text-[#0c121b] hover:bg-primary-400">
        {plan === 'free' ? 'Upgrade' : 'Meu plano'}
      </Link>
    </div>
  );
};

const PlanCTA = ({ compact = false }: { compact?: boolean }) => {
  const plan = useCurrentPlan();

  return compact ? (
    <div className="flex items-center justify-center p-2"><Crown className="w-5 h-5 text-yellow-400" /></div>
  ) : (
    <div className="rounded-xl border border-primary-400/20 bg-primary-500/10 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-400" />
          <div><p className="text-sm font-semibold text-white">Plano Atual</p><p className="text-xs text-primary-200/70">{plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Gratuito'}</p></div>
        </div>
        <Sparkles className="w-5 h-5 text-primary-500" />
      </div>
      <div className="flex items-center gap-2">
        <Link to="/planos" className="flex-1 rounded-lg bg-primary-500 px-3 py-2 text-center text-sm font-bold text-[#0c121b] hover:bg-primary-400">{plan === 'free' ? 'Upgrade' : 'Ver planos'}</Link>
        <Link to="/dashboard/settings?tab=plan" className="rounded-lg border border-primary-400/25 px-3 py-2 text-sm text-primary-100 hover:bg-primary-500/10">Detalhes</Link>
      </div>
    </div>
  );
};

const DarkModeToggle = ({ collapsed = false }: { collapsed?: boolean }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (collapsed) {
    return (
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Alternar tema"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
            sideOffset={5}
          >
            Alternar tema
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#9ba9bc] transition-colors hover:bg-[#151f2b] hover:text-white"
    >
      <span className="flex items-center justify-center w-5 h-5">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </span>
      <span>Tema</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
        {darkMode ? 'Escuro' : 'Claro'}
      </span>
    </button>
  );
};

const LogoutButton = ({ onLogout, compact = false }: { onLogout: () => void; compact?: boolean }) => {
  if (compact) return (<button onClick={onLogout} className="w-full rounded-lg p-2 text-[#9ba9bc] hover:bg-red-400/10 hover:text-red-300"><LogOut size={18} /></button>);
  return (
    <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-red-400/10">
      <LogOut size={16} className="text-red-300" />
      <span className="text-sm text-red-200">Sair</span>
    </button>
  );
};

const UserMenu = ({ user }: { user?: any }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary-400/35 text-black font-medium">
      {user?.user_metadata?.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback para iniciais se a imagem falhar
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div className={`w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs ${user?.user_metadata?.avatar_url ? 'hidden' : ''}`}>
        {user?.user_metadata?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    </div>
      <div className="hidden sm:flex flex-col text-sm">
        <span className="text-[#d7e0ea]">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
        <span className="text-xs text-[#718096]">{user?.email}</span>
      </div>
    </div>
  );
};

export default DashboardLayout;
