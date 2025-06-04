import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

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

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Lock },
    { id: 'preferences', name: 'Preferências', icon: Globe },
  ];

  return (
    <>
      <Helmet>
        <title>Configurações | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-700/50">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-medium mb-6">Informações do Perfil</h2>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        defaultValue={user?.user_metadata?.name || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        defaultValue={user?.email}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                        defaultValue={user?.user_metadata?.bio || ''}
                      />
                    </div>
                    <div>
                      <button type="submit" className="btn-primary">
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-medium mb-6">Preferências de Notificação</h2>
                  <div className="space-y-4">
                    {['E-mail', 'Push', 'In-app'].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{type}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receba notificações via {type.toLowerCase()}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-medium mb-6">Segurança da Conta</h2>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <button type="submit" className="btn-primary">
                        Alterar Senha
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-lg font-medium mb-6">Preferências</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Tema</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Escolha entre tema claro ou escuro
                        </p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {darkMode ? (
                          <Sun className="h-5 w-5" />
                        ) : (
                          <Moon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Idioma</h3>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700">
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en-US">English (US)</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Fuso Horário</h3>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700">
                        <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                        <option value="America/New_York">América/Nova York (GMT-4)</option>
                        <option value="Europe/London">Europa/Londres (GMT+1)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;