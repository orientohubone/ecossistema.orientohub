import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Link as LinkIcon, Image, X } from 'lucide-react';

interface Solution {
  id: string;
  name: string;
  logo: string;
  url: string;
}

const SolutionsPage = () => {
  const { t } = useTranslation();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSolution, setNewSolution] = useState({
    name: '',
    logo: '',
    url: '',
  });

  const handleAddSolution = () => {
    if (!newSolution.name || !newSolution.url) return;

    const solution: Solution = {
      id: Date.now().toString(),
      name: newSolution.name,
      logo: newSolution.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(newSolution.name)}&background=FFD700&color=000000`,
      url: newSolution.url,
    };

    setSolutions([...solutions, solution]);
    setNewSolution({ name: '', logo: '', url: '' });
    setShowAddModal(false);
  };

  const handleRemoveSolution = (id: string) => {
    setSolutions(solutions.filter(s => s.id !== id));
  };

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
                    src={solution.logo}
                    alt={solution.name}
                    className="h-12 w-12 rounded-lg object-cover"
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
                  href={solution.url}
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
                    URL do Logotipo
                  </label>
                  <input
                    type="text"
                    value={newSolution.logo}
                    onChange={(e) => setNewSolution({ ...newSolution, logo: e.target.value })}
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
                    value={newSolution.url}
                    onChange={(e) => setNewSolution({ ...newSolution, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    placeholder="https://minhasolucao.com"
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