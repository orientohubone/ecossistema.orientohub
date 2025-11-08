import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  Lightbulb 
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>  
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary-500">Orientohub</span>
            </div>
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <SidebarContent location={location} onLogout={handleLogout} />
          </nav>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r dark:border-gray-700">
            <div className="flex items-center h-16 px-4 border-b dark:border-gray-700">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-primary-500">Orientohub</span>
              </Link>
            </div>
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
              <SidebarContent location={location} onLogout={handleLogout} />
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center lg:hidden">
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <Menu size={24} />
                </button>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div>
                    <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-black font-medium">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{user?.email}</span>
                      <ChevronDown size={16} className="ml-1 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main 
          className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  location: { pathname: string };
  onLogout: () => void;
}

const SidebarContent = ({ location, onLogout }: SidebarContentProps) => {
  const { t } = useTranslation();

  const navItems = [
    { name: t('common.dashboard'), icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: t('dashboard.insights'), icon: <BarChart2 size={20} />, href: '/dashboard/insights' },
    { name: t('dashboard.frameworks'), icon: <FileText size={20} />, href: '/dashboard/frameworks' },
    { name: t('projects.title'), icon: <Lightbulb size={20} />, href: '/dashboard/projects' },
    { name: 'Soluções', icon: <Link2 size={20} />, href: '/dashboard/solutions' },
    { name: t('common.settings'), icon: <Settings size={20} />, href: '/dashboard/settings' },
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            location.pathname === item.href
              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
          }`}
        >
          <span className={`mr-3 ${
            location.pathname === item.href
              ? 'text-primary-500'
              : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
          }`}>
            {item.icon}
          </span>
          {item.name}
        </Link>
      ))}
      <button
        onClick={onLogout}
        className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
      >
        <span className="mr-3 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
          <LogOut size={20} />
        </span>
        {t('common.signOut')}
      </button>
    </div>
  );
};

export default DashboardLayout;