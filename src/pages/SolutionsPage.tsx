import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Link as LinkIcon, Image, X } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../stores/authStore';

interface Solution {
  id: string;
  name: string;
  logo_url: string;
  solution_url: string;
  founder_name: string | null;
  stage: string | null;
  git_url: string | null;
  ide_url: string | null;
  database_url: string | null;
  instagram_url: string | null;
}

const SolutionsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSolution, setNewSolution] = useState({
    name: '',
    logo_url: '',
    solution_url: '',
    founder_name: '',
    stage: '',
    git_url: '',
    ide_url: '',
    database_url: '',
    instagram_url: '',
  });

  useEffect(() => {
    fetchSolutions();
  }, [user]);

  const fetchSolutions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSolutions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSolution = async () => {
    if (!newSolution.name || !newSolution.solution_url) return;

    try {
      setError(null);
      const solution = {
        user_id: user?.id,
        name: newSolution.name,
        logo_url: newSolution.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(newSolution.name)}&background=FFD700&color=000000`,
        solution_url: newSolution.solution_url,
        founder_name: newSolution.founder_name || null,
        stage: newSolution.stage || null,
        git_url: newSolution.git_url || null,
        ide_url: newSolution.ide_url || null,
        database_url: newSolution.database_url || null,
        instagram_url: newSolution.instagram_url || null,
      };

      const { error } = await supabase
        .from('solutions')
        .insert([solution]);

      if (error) throw error;

      setNewSolution({ 
        name: '', 
        logo_url: '', 
        solution_url: '',
        founder_name: '',
        stage: '',
        git_url: '',
        ide_url: '',
        database_url: '',
        instagram_url: '',
      });
      setShowAddModal(false);
      fetchSolutions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveSolution = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSolutions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Soluções | Orientohub</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Soluções</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus size={20} className="mr-2" />
            Adicionar Solução
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <motion.div
              key={solution.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={solution.logo_url}
                    alt={solution.name}
                    className="h-12 w-12 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(solution.name)}&background=FFD700&color=000000`;
                    }}
                  />
                  <button
                    onClick={() => handleRemoveSolution(solution.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-lg font-semibold mb-2">{solution.name}</h3>
                <a
                  href={solution.solution_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 flex items-center"
                >
                  <LinkIcon size={16} className="mr-1" />
                  Acessar solução
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Solution Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Adicionar Solução</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome do Fundador
                  </label>
                  <input
                    type="text"
                    value={newSolution.founder_name}
                    onChange={(e) => setNewSolution({ ...newSolution, founder_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome da Solução
                  </label>
                  <input
                    type="text"
                    value={newSolution.name}
                    onChange={(e) => setNewSolution({ ...newSolution, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="Ex: Minha Solução"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Estágio da Startup
                  </label>
                  <select
                    value={newSolution.stage}
                    onChange={(e) => setNewSolution({ ...newSolution, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  >
                    <option value="">Selecione o estágio</option>
                    <option value="Ideação">Ideação</option>
                    <option value="Validação">Validação</option>
                    <option value="MVP">MVP</option>
                    <option value="Tração">Tração</option>
                    <option value="Crescimento">Crescimento</option>
                    <option value="Escala">Escala</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL do Logotipo
                  </label>
                  <input
                    type="text"
                    value={newSolution.logo_url}
                    onChange={(e) => setNewSolution({ ...newSolution, logo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL da Solução
                  </label>
                  <input
                    type="text"
                    value={newSolution.solution_url}
                    onChange={(e) => setNewSolution({ ...newSolution, solution_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://minhasolucao.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL do Git
                  </label>
                  <input
                    type="url"
                    value={newSolution.git_url}
                    onChange={(e) => setNewSolution({ ...newSolution, git_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://github.com/usuario/repositorio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL da IDE
                  </label>
                  <input
                    type="url"
                    value={newSolution.ide_url}
                    onChange={(e) => setNewSolution({ ...newSolution, ide_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://replit.com/@usuario/projeto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL do Banco de Dados
                  </label>
                  <input
                    type="url"
                    value={newSolution.database_url}
                    onChange={(e) => setNewSolution({ ...newSolution, database_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://supabase.com/dashboard/project/xyz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL do Instagram
                  </label>
                  <input
                    type="url"
                    value={newSolution.instagram_url}
                    onChange={(e) => setNewSolution({ ...newSolution, instagram_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://instagram.com/usuario"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddSolution}
                    className="btn-primary"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SolutionsPage;