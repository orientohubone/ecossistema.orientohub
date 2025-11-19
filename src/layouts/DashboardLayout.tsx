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
  Check,
  GraduationCap
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
    { id: 'academy', name: 'Conheça Oriento Academy', icon: <GraduationCap size={18} />, href: '/dashboard/academy', protected: true },
    { id: 'solutions', name: 'Soluções', icon: <Link2 size={18} />, href: '/dashboard/solutions' },
    { id: 'community', name: 'Comunidade', icon: <Users size={18} />, href: '/dashboard/community' },
    { id: 'settings', name: t('common.settings'), icon: <Settings size={18} />, href: '/dashboard/settings' }
  ], [t]);

  return (
    <Tooltip.Provider delayDuration={100}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          <Link
            to={item.href}
            onClick={onNavigate}
            className={`relative z-10 group flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-xl transition-all duration-300
              border border-yellow-300/80 dark:border-yellow-700/60
              focus:outline-none focus:ring-2 focus:ring-yellow-400/90
              ${active
                ? 'shadow-lg ring-2 ring-yellow-400/80'
                : 'shadow-md hover:shadow-lg hover:ring-2 hover:ring-yellow-400/60'}
              bg-[linear-gradient(90deg,_#fffbe6_0%,_#ffe7fa_40%,_#f9e7ff_70%,_#fffbe6_100%)]
              dark:bg-yellow-400
              dark:text-black
            `}
            aria-current={active ? 'page' : undefined}
            style={
              active
                ? {
                    background: 'linear-gradient(90deg, #fffbe6 0%, #ffe7fa 40%, #f9e7ff 70%, #fffbe6 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'academyGlow 2.5s ease-in-out infinite alternate',
                    boxShadow: '0 0 0 3px #FFD60055, 0 2px 8px 0 #FFD60033'
                  }
                : {
                    background: 'linear-gradient(90deg, #fffbe6 0%, #f9e7ff 40%, #e6e6fa 70%, #fffbe6 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'academyGlow 4s ease-in-out infinite alternate',
                    boxShadow: '0 0 0 2px #FFD60022, 0 1.5px 4px 0 #FFD60022'
                  }
            }
          >
            {collapsed ? (
              <Tooltip.Root delayDuration={100}>
                <Tooltip.Trigger asChild>
                  <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-yellow-700 dark:text-black' : 'text-yellow-700 group-hover:text-yellow-900 dark:text-black'}`}>{item.icon}</span>
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
              <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-yellow-700 dark:text-black' : 'text-yellow-700 group-hover:text-yellow-900 dark:text-black'}`}>{item.icon}</span>
            )}
            {!collapsed && <span className="truncate">{item.name}</span>}
          </Link>
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
    </Tooltip.Provider>
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
  // Protege rota se item.protected e não houver user
  const { user } = useAuthStore();
  if (item.protected && !user) return null;
  const active = pathname === item.href;
  const isAcademy = item.id === 'academy';

  // Custom premium effect for Oriento Academy
  if (isAcademy) {
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
          `}
          aria-current={active ? 'page' : undefined}
          style={{
            background: active
              ? 'linear-gradient(90deg, #fffbe6 0%, #ffe7fa 40%, #f9e7ff 70%, #fffbe6 100%)'
              : 'linear-gradient(90deg, #fffbe6 0%, #f9e7ff 40%, #e6e6fa 70%, #fffbe6 100%)',
            backgroundSize: '200% 200%',
            animation: active ? 'academyGlow 2.5s ease-in-out infinite alternate' : 'academyGlow 4s ease-in-out infinite alternate',
            boxShadow: active
              ? '0 0 0 3px #FFD60055, 0 2px 8px 0 #FFD60033'
              : '0 0 0 2px #FFD60022, 0 1.5px 4px 0 #FFD60022'
          }}
        >
          {collapsed ? (
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-yellow-600 dark:text-yellow-200' : 'text-yellow-500 group-hover:text-yellow-700 dark:group-hover:text-yellow-300'}`}>{item.icon}</span>
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
            <span className={`flex items-center justify-center w-6 h-6 rounded ${active ? 'text-yellow-600 dark:text-yellow-200' : 'text-yellow-500 group-hover:text-yellow-700 dark:group-hover:text-yellow-300'}`}>{item.icon}</span>
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
