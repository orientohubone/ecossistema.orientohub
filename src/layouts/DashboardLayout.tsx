import { useState, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = useMemo(() => [
    { id: 'dashboard', name: t('common.dashboard'), icon: <LayoutDashboard size={18} />, href: '/dashboard' },
    { id: 'insights', name: t('dashboard.insights'), icon: <BarChart2 size={18} />, href: '/dashboard/insights' },
    { id: 'frameworks', name: t('dashboard.frameworks'), icon: <FileText size={18} />, href: '/dashboard/frameworks' },
    { id: 'projects', name: t('projects.title'), icon: <Lightbulb size={18} />, href: '/dashboard/projects' },
    { id: 'solutions', name: 'Soluções', icon: <Link2 size={18} />, href: '/dashboard/solutions' },
    { id: 'community', name: 'Comunidade', icon: <Users size={18} />, href: '/dashboard/community' },
    { id: 'settings', name: t('common.settings'), icon: <Settings size={18} />, href: '/dashboard/settings' }
  ], [t]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar} />
            <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', stiffness: 300 }} className="relative w-72 max-w-xs h-full bg-white dark:bg-gray-800 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-2"><span className="text-lg font-bold text-primary-500">Orientohub</span></div>
                <button onClick={toggleSidebar} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
              </div>
              <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100%-64px)]">
                <SidebarHeader user={user} />
                <SearchBox />
                <nav className="space-y-1">{navItems.map(item => <SidebarLink key={item.id} item={item} pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} />)}</nav>
                <div className="mt-auto space-y-3"><PlanCTA compact /><LogoutButton onLogout={handleLogout} /></div>
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col ${collapsed ? 'w-20' : 'w-72'} transition-width duration-200 ease-in-out bg-white dark:bg-gray-800 border-r dark:border-gray-700`}>
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <Link to="/" className="flex items-center gap-3">
            {collapsed ? (
              <span className="text-primary-500 text-2xl font-extrabold">O</span>
            ) : (
              <span className="text-xl font-bold text-primary-500">Orientohub</span>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleCollapse} title={collapsed ? 'Expandir' : 'Recolher'} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              {collapsed ? <ChevronDown size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <SidebarHeader user={user} collapsed={collapsed} />
          <SearchBox collapsed={collapsed} />
          <nav className="flex-1 space-y-1 mt-2">{navItems.map(item => <SidebarLink key={item.id} item={item} pathname={location.pathname} collapsed={collapsed} />)}</nav>
          <div className="mt-4"><PlanCTA compact={collapsed} /></div>
          <div className="mt-auto"><LogoutButton onLogout={handleLogout} compact={collapsed} /></div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleSidebar}><Menu size={20} /></button>
                <div className="hidden md:flex items-center gap-3 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg">
                  <Search size={16} className="text-gray-500" />
                  <input type="search" placeholder="Buscar projetos, soluções, insights..." className="bg-transparent text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Plano: <strong className="ml-1 text-primary-600 dark:text-primary-400">Free</strong></span>
                  <button className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-black rounded-md text-sm font-medium">Upgrade</button>
                </div>
                <div className="flex items-center gap-3"><UserMenu user={user} /></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><Outlet /></div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

/* --------------------------
   Reusable subcomponents
   -------------------------- */

const SidebarHeader = ({ user, collapsed = false }: { user?: any; collapsed?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
      <div className={`h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-black font-bold`}>
        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
      </div>
      {!collapsed && (
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.user_metadata?.name || user?.email?.split('@')[0]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Founder • {user?.user_metadata?.company || '—'}</p>
        </div>
      )}
    </div>
  );
};

const SearchBox = ({ collapsed = false }: { collapsed?: boolean }) => {
  if (collapsed) return null;
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-md">
      <Search size={16} className="text-gray-500" />
      <input type="search" placeholder="Buscar..." className="bg-transparent outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 w-full" />
    </div>
  );
};

const SidebarLink = ({ item, pathname, collapsed = false, onNavigate }: { item: any; pathname: string; collapsed?: boolean; onNavigate?: () => void }) => {
  const active = pathname === item.href;
  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
      aria-current={active ? 'page' : undefined}
    >
      {collapsed ? (
        <Tooltip.Root delayDuration={100}>
          <Tooltip.Trigger asChild>
            <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{item.icon}</span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="right" sideOffset={8} className="z-50 px-2 py-1 text-xs rounded bg-gray-900 text-white shadow-lg">
              {item.name}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      ) : (
        <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{item.icon}</span>
      )}
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
};

const PlanCTA = ({ compact = false }: { compact?: boolean }) => {
  return compact ? (
    <div className="flex items-center justify-center p-2"><Crown className="w-5 h-5 text-yellow-400" /></div>
  ) : (
    <div className="p-3 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-400" />
          <div><p className="text-sm font-semibold">Plano Atual</p><p className="text-xs text-gray-500">Gratuito</p></div>
        </div>
        <Sparkles className="w-5 h-5 text-primary-500" />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-black rounded-md text-sm font-medium">Upgrade</button>
        <button className="px-3 py-2 border rounded-md text-sm">Detalhes</button>
      </div>
    </div>
  );
};

const LogoutButton = ({ onLogout, compact = false }: { onLogout: () => void; compact?: boolean }) => {
  if (compact) return (<button onClick={onLogout} className="w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><LogOut size={18} /></button>);
  return (
    <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
      <LogOut size={16} className="text-gray-600 dark:text-gray-300" />
      <span className="text-sm text-gray-700 dark:text-gray-300">Sair</span>
    </button>
  );
};

const UserMenu = ({ user }: { user?: any }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-black font-medium">{user?.email?.charAt(0)?.toUpperCase() || 'U'}</div>
      <div className="hidden sm:flex flex-col text-sm">
        <span className="text-gray-700 dark:text-gray-200">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
      </div>
    </div>
  );
};

export default DashboardLayout;
