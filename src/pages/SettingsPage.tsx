import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Crown,
  CreditCard,
  Shield,
  Zap,
  Mail,
  Smartphone,
  Key,
  LogOut,
  Trash2,
  Download,
  Upload,
  Settings as SettingsIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Sparkles,
  Award,
  Activity,
  Users,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  X,
  Check
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
}

import { supabase } from '../config/supabase';

const SettingsPage = () => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  // const { user } = useAuthStore(); // Removido para evitar duplicidade

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validação básica
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('O arquivo deve ser uma imagem.');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      console.log('Iniciando upload do avatar:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Erro no upload do Storage:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = publicUrlData?.publicUrl;

      if (!avatarUrl) throw new Error('Não foi possível gerar a URL pública da imagem.');

      console.log('Avatar URL gerada:', avatarUrl);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });

      if (updateError) {
        console.error('Erro ao atualizar perfil do usuário:', updateError);
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
      }

      // Recarregar para atualizar a UI
      window.location.reload();
    } catch (err: any) {
      console.error('Erro completo:', err);
      alert(err.message || 'Ocorreu um erro ao atualizar o avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  }
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // User data (mock - em produção viria do Supabase)
  const currentPlan = 'free';
  const accountCreatedAt = '2024-01-15';
  const totalProjects = 5;
  const totalSolutions = 2;
  const totalPoints = 2850;

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      period: 'para sempre',
      description: 'Perfeito para começar',
      current: currentPlan === 'free',
      features: [
        { name: 'Até 3 projetos', included: true },
        { name: '1 solução ativa', included: true },
        { name: 'Frameworks básicos', included: true },
        { name: 'Comunidade', included: true },
        { name: 'Mentorias 1:1', included: false },
        { name: 'Análises avançadas', included: false },
        { name: 'Suporte prioritário', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49.90,
      period: 'mês',
      description: 'Para founders sérios',
      popular: true,
      current: currentPlan === 'pro',
      features: [
        { name: 'Projetos ilimitados', included: true },
        { name: '5 soluções ativas', included: true },
        { name: 'Todos os frameworks', included: true },
        { name: 'Comunidade premium', included: true },
        { name: '2 mentorias/mês', included: true },
        { name: 'Análises avançadas', included: true },
        { name: 'Suporte prioritário', included: true }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199.90,
      period: 'mês',
      description: 'Para equipes e aceleradoras',
      current: currentPlan === 'enterprise',
      features: [
        { name: 'Tudo do Pro +', included: true },
        { name: 'Soluções ilimitadas', included: true },
        { name: 'White label', included: true },
        { name: 'API access', included: true },
        { name: 'Mentorias ilimitadas', included: true },
        { name: 'Onboarding dedicado', included: true },
        { name: 'Suporte 24/7', included: true }
      ]
    }
  ];

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User, badge: null },
    { id: 'account', name: 'Conta', icon: SettingsIcon, badge: null },
    { id: 'plan', name: 'Plano', icon: Crown, badge: currentPlan === 'free' ? 'Upgrade' : null },
    { id: 'notifications', name: 'Notificações', icon: Bell, badge: null },
    { id: 'security', name: 'Segurança', icon: Lock, badge: null },
    { id: 'preferences', name: 'Preferências', icon: Globe, badge: null },
    { id: 'integrations', name: 'Integrações', icon: LinkIcon, badge: null },
    { id: 'billing', name: 'Cobrança', icon: CreditCard, badge: null }
  ];

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

  const handleSave = async (message: string) => {
    setIsLoading(true);
    setErrorMessage('');

    // Simular salvamento
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await logout();
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL! Todos os seus dados serão perdidos. Tem certeza?')) {
      if (confirm('Digite "CONFIRMAR" para excluir sua conta permanentemente.')) {
        // Lógica de exclusão
        alert('Conta excluída com sucesso');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Configurações - Orientohub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Configurações
                  <Sparkles className="w-6 h-6 text-primary-500" />
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie sua conta e preferências
                </p>
              </div>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 font-medium">{errorMessage}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-4 sticky top-6">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          {tab.name}
                        </div>
                        {tab.badge && (
                          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Membro desde</span>
                    <span className="font-medium">{new Date(accountCreatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Projetos</span>
                    <span className="font-medium">{totalProjects}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Soluções</span>
                    <span className="font-medium">{totalSolutions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pontos XP</span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">{totalPoints}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Informações do Perfil</h2>
                      <p className="text-gray-600 dark:text-gray-400">Atualize suas informações pessoais</p>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&size=120&background=FFD700&color=000&bold=true`}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full border-4 border-primary-500 shadow-xl"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={avatarInputRef}
                          style={{ display: 'none' }}
                          onChange={handleAvatarChange}
                        />
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                        >
                          {isUploadingAvatar ? (
                            <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full inline-block" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{user?.user_metadata?.name || user?.email?.split('@')[0]}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentPlan === 'free' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                              currentPlan === 'pro' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                                'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            }`}>
                            <Crown className="w-3 h-3 inline mr-1" />
                            Plano {plans.find(p => p.id === currentPlan)?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nome Completo</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                            defaultValue={user?.user_metadata?.name || ''}
                            placeholder="Seu nome"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                            placeholder="@username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900 resize-none"
                          placeholder="Conte um pouco sobre você e sua jornada empreendedora..."
                          defaultValue={user?.user_metadata?.bio || ''}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Empresa/Startup</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                            placeholder="Nome da sua empresa"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Cargo</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                            placeholder="Ex: Founder, CEO"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Localização</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                          placeholder="Cidade, Estado"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleSave('Perfil atualizado com sucesso!')}
                          disabled={isLoading}
                          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Informações da Conta</h2>
                      <p className="text-gray-600 dark:text-gray-400">Gerencie os detalhes da sua conta</p>
                    </div>

                    {/* Account Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Projetos', value: totalProjects, icon: Lightbulb, color: 'blue' },
                        { label: 'Soluções', value: totalSolutions, icon: Rocket, color: 'purple' },
                        { label: 'Pontos XP', value: totalPoints, icon: Zap, color: 'yellow' },
                        { label: 'Nível', value: '12', icon: Award, color: 'green' }
                      ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                            <Icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-500`} />
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Account Info */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">E-mail</span>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verificado
                          </span>
                        </div>
                        <p className="font-medium">{user?.email}</p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Membro desde</span>
                        </div>
                        <p className="font-medium">{new Date(accountCreatedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ID da Conta</span>
                        </div>
                        <p className="font-mono text-sm">{user?.id || 'xxx-xxx-xxx'}</p>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Zona de Perigo
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 rounded-xl font-medium transition-all flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2">
                            <LogOut className="w-5 h-5" />
                            Sair da Conta
                          </span>
                          <span className="text-gray-400 group-hover:text-red-500">→</span>
                        </button>

                        <button
                          onClick={handleDeleteAccount}
                          className="w-full px-4 py-3 border-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium transition-all flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Excluir Conta Permanentemente
                          </span>
                          <span className="text-red-400">→</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Plan Tab */}
                {activeTab === 'plan' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Planos e Assinatura</h2>
                      <p className="text-gray-600 dark:text-gray-400">Escolha o melhor plano para você</p>
                    </div>

                    {/* Current Plan */}
                    <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            <h3 className="text-xl font-bold">Plano Atual: {plans.find(p => p.id === currentPlan)?.name}</h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {currentPlan === 'free' ? 'Upgrade para desbloquear recursos premium' : 'Obrigado por ser um membro premium!'}
                          </p>
                        </div>
                        {currentPlan !== 'enterprise' && (
                          <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Fazer Upgrade
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`relative p-6 rounded-2xl border-2 transition-all ${plan.current
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : plan.popular
                                ? 'border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-800 shadow-xl'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                            }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="px-4 py-1 bg-primary-500 text-black text-xs font-bold rounded-full shadow-lg">
                                MAIS POPULAR
                              </span>
                            </div>
                          )}

                          {plan.current && (
                            <div className="absolute -top-3 right-4">
                              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                ATIVO
                              </span>
                            </div>
                          )}

                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-2">
                              <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
                              <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                          </div>

                          <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                {feature.included ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                                )}
                                <span className={feature.included ? '' : 'text-gray-400 dark:text-gray-500'}>
                                  {feature.name}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <button
                            disabled={plan.current}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${plan.current
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                : plan.popular
                                  ? 'bg-primary-500 hover:bg-primary-600 text-black'
                                  : 'border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500'
                              }`}
                          >
                            {plan.current ? 'Plano Atual' : 'Selecionar Plano'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Preferências de Notificação</h2>
                      <p className="text-gray-600 dark:text-gray-400">Escolha como quer ser notificado</p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          id: 'email',
                          title: 'E-mail',
                          description: 'Receba atualizações importantes por e-mail',
                          icon: Mail
                        },
                        {
                          id: 'push',
                          title: 'Push Notifications',
                          description: 'Notificações no navegador ou app',
                          icon: Bell
                        },
                        {
                          id: 'sms',
                          title: 'SMS',
                          description: 'Alertas urgentes via SMS',
                          icon: Smartphone
                        }
                      ].map((channel) => {
                        const Icon = channel.icon;
                        return (
                          <div key={channel.id} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-primary-500" />
                                </div>
                                <div>
                                  <h3 className="font-bold">{channel.title}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{channel.description}</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>

                            {/* Sub-options */}
                            <div className="ml-13 space-y-2 text-sm">
                              {['Novos comentários', 'Mentorias agendadas', 'Conquistas desbloqueadas'].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                                  <span>{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleSave('Preferências de notificação salvas!')}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Salvar Preferências
                    </button>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Segurança da Conta</h2>
                      <p className="text-gray-600 dark:text-gray-400">Mantenha sua conta protegida</p>
                    </div>

                    {/* Change Password */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary-500" />
                        Alterar Senha
                      </h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Senha Atual</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Nova Senha</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Confirmar Nova Senha</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSave('Senha alterada com sucesso!')}
                          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all"
                        >
                          Alterar Senha
                        </button>
                      </form>
                    </div>

                    {/* Two-Factor Auth */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            Autenticação de Dois Fatores (2FA)
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Adicione uma camada extra de segurança
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all">
                          Ativar 2FA
                        </button>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-500" />
                        Sessões Ativas
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium">Chrome - Windows</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">São Paulo, Brasil • Agora</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                            Atual
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Preferências</h2>
                      <p className="text-gray-600 dark:text-gray-400">Personalize sua experiência</p>
                    </div>

                    {/* Theme */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold">Tema da Interface</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Escolha entre modo claro ou escuro</p>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className="p-3 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg transition-colors"
                        >
                          {darkMode ? (
                            <Sun className="w-6 h-6 text-primary-500" />
                          ) : (
                            <Moon className="w-6 h-6 text-primary-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold mb-4">Idioma</h3>
                      <select className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900">
                        <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                        <option value="en-US">🇺🇸 English (US)</option>
                        <option value="es-ES">🇪🇸 Español</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold mb-4">Fuso Horário</h3>
                      <select className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-0 bg-white dark:bg-gray-900">
                        <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                        <option value="America/New_York">América/Nova York (GMT-5)</option>
                        <option value="Europe/London">Europa/Londres (GMT+0)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleSave('Preferências salvas!')}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Salvar Preferências
                    </button>
                  </motion.div>
                )}

                {/* Integrations Tab */}
                {activeTab === 'integrations' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Integrações</h2>
                      <p className="text-gray-600 dark:text-gray-400">Conecte suas redes e ferramentas</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'GitHub', icon: Github, connected: false, color: 'bg-gray-900' },
                        { name: 'LinkedIn', icon: Linkedin, connected: true, color: 'bg-blue-600' },
                        { name: 'Twitter', icon: Twitter, connected: false, color: 'bg-sky-500' },
                        { name: 'Instagram', icon: Instagram, connected: true, color: 'bg-pink-600' }
                      ].map((integration) => {
                        const Icon = integration.icon;
                        return (
                          <div key={integration.name} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-bold">{integration.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {integration.connected ? 'Conectado' : 'Não conectado'}
                                </p>
                              </div>
                            </div>
                            <button className={`px-4 py-2 rounded-lg font-medium transition-all ${integration.connected
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                                : 'bg-primary-500 hover:bg-primary-600 text-black'
                              }`}>
                              {integration.connected ? 'Desconectar' : 'Conectar'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Cobrança e Pagamentos</h2>
                      <p className="text-gray-600 dark:text-gray-400">Gerencie suas formas de pagamento</p>
                    </div>

                    {/* Payment Method */}
                    <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm opacity-80">Cartão Principal</p>
                          <p className="text-2xl font-bold">•••• •••• •••• 4242</p>
                        </div>
                        <CreditCard className="w-12 h-12 opacity-50" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs opacity-60">Válido até</p>
                          <p className="font-medium">12/25</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60">Titular</p>
                          <p className="font-medium">{user?.user_metadata?.name || 'Nome do Usuário'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        Histórico de Pagamentos
                      </h3>
                      <div className="space-y-2">
                        {currentPlan === 'free' ? (
                          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                            Nenhum pagamento realizado ainda
                          </p>
                        ) : (
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                              <div>
                                <p className="font-medium">Plano Pro - Janeiro 2025</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">15 Jan 2025</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">R$ 49,90</p>
                              <button className="text-xs text-primary-500 hover:underline">Download</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
