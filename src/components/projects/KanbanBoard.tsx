import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Flag,
  Clock,
  User,
  X,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

const KanbanBoard = ({ tasks, onUpdate }: KanbanBoardProps) => {
  const [showAddTask, setShowAddTask] = useState<'todo' | 'doing' | 'done' | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium' as const
  });

  const columns = [
    { 
      id: 'todo', 
      title: 'A Fazer', 
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-300 dark:border-gray-600'
    },
    { 
      id: 'doing', 
      title: 'Fazendo', 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-300 dark:border-blue-600'
    },
    { 
      id: 'done', 
      title: 'Concluído', 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-300 dark:border-green-600'
    }
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = (status: Task['status']) => {
    if (!newTask.title) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status,
      dueDate: newTask.dueDate,
      assignee: newTask.assignee || undefined,
      priority: newTask.priority
    };

    onUpdate([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      priority: 'medium'
    });
    setShowAddTask(null);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    onUpdate(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    onUpdate(tasks.filter(task => task.id !== taskId));
  };

  const handleDragEnd = (taskId: string, newStatus: Task['status']) => {
    handleUpdateTask(taskId, { status: newStatus });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    const heights = {
      low: 'h-2',
      medium: 'h-3',
      high: 'h-4'
    };
    return heights[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Quadro Kanban</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie suas tarefas de validação
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {tasks.filter(t => t.status === 'done').length} de {tasks.length} concluídas
          </span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className={`p-4 ${column.bgColor} border-2 ${column.borderColor} rounded-xl`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold flex items-center gap-2">
                  {column.title}
                  <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${column.color} text-white`}>
                    {getTasksByStatus(column.id as Task['status']).length}
                  </span>
                </h4>
                <button
                  onClick={() => setShowAddTask(column.id as Task['status'])}
                  className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add Task Form */}
            {showAddTask === column.id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-3"
              >
                <input
                  type="text"
                  placeholder="Título da tarefa"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTask(column.id as Task['status'])}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddTask(null)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tasks List */}
            <div className="space-y-3 min-h-[200px]">
              {getTasksByStatus(column.id as Task['status']).map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onUpdate={(updates) => handleUpdateTask(task.id, updates)}
                  onDelete={() => handleDeleteTask(task.id)}
                  getPriorityColor={getPriorityColor}
                  getPriorityIcon={getPriorityIcon}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma tarefa criada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Adicione tarefas nas colunas acima para começar
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  index: number;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  getPriorityColor: (priority: Task['priority']) => string;
  getPriorityIcon: (priority: Task['priority']) => string;
}

const TaskCard = ({ 
  task, 
  index, 
  onUpdate, 
  onDelete,
  getPriorityColor,
  getPriorityIcon
}: TaskCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority
  });

  const handleSaveEdit = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-xl transition-all cursor-pointer"
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            />
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Task['priority'] })}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-sm flex-1 pr-2">{task.title}</h4>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority */}
            <div className="flex items-center gap-1">
              <Flag className={`w-3 h-3 ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                {isOverdue && <span className="ml-1 text-red-600 dark:text-red-400 font-semibold">⚠️</span>}
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <User className="w-3 h-3" />
                {task.assignee}
              </div>
            )}
          </div>

          {/* Move buttons */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.status !== 'todo' && (
              <button
                onClick={() => onUpdate({ status: task.status === 'done' ? 'doing' : 'todo' })}
                className="flex-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                ← Mover
              </button>
            )}
            {task.status !== 'done' && (
              <button
                onClick={() => onUpdate({ status: task.status === 'todo' ? 'doing' : 'done' })}
                className="flex-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded transition-colors"
              >
                Mover →
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default KanbanBoard;
