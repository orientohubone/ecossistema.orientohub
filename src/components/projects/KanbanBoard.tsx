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
  ListTodo,
  ArrowRight
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
  const fieldClassName = "w-full rounded-lg border border-[#34455a] bg-[#0c121b] px-3 py-2 text-white placeholder:text-[#718096] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";
  const compactFieldClassName = "rounded-lg border border-[#34455a] bg-[#0c121b] px-3 py-2 text-white outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

  const columns = [
    { 
      id: 'todo', 
      title: 'A Fazer', 
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-[#151f2b]',
      borderColor: 'border-[#34455a]'
    },
    { 
      id: 'doing', 
      title: 'Fazendo', 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-400/25'
    },
    { 
      id: 'done', 
      title: 'Concluído', 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/25'
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
      low: 'border border-primary-400/20 bg-primary-500/10 text-primary-200',
      medium: 'border border-amber-400/20 bg-amber-400/10 text-amber-200',
      high: 'border border-red-400/20 bg-red-400/10 text-red-200'
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
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9ba9bc]">Execução</p>
          <h3 className="text-lg font-bold text-white">Quadro Kanban</h3>
          <p className="text-sm text-[#9ba9bc]">
            Gerencie suas tarefas de validação
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#9ba9bc]">
            {tasks.filter(t => t.status === 'done').length} de {tasks.length} concluídas
          </span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className={`rounded-xl border ${column.borderColor} ${column.bgColor} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="flex items-center gap-2 font-bold text-white">
                  {column.title}
                  <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${column.color} text-white`}>
                    {getTasksByStatus(column.id as Task['status']).length}
                  </span>
                </h4>
                <button
                  onClick={() => setShowAddTask(column.id as Task['status'])}
                  className="rounded p-1 text-[#9ba9bc] transition-colors hover:bg-[#0c121b] hover:text-white"
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
                className="space-y-3 rounded-xl border border-[#273548] bg-[#151f2b] p-4"
              >
                <input
                  type="text"
                  placeholder="Título da tarefa"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className={fieldClassName}
                  autoFocus
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={2}
                  className={`${fieldClassName} resize-none`}
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className={`flex-1 text-sm ${compactFieldClassName}`}
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className={`text-sm ${compactFieldClassName}`}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTask(column.id as Task['status'])}
                    className="flex-1 rounded-lg bg-primary-500 px-4 py-2 font-medium text-[#0c121b] transition-colors hover:bg-primary-400"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddTask(null)}
                    className="rounded-lg border border-[#34455a] px-4 py-2 text-[#d7e0ea] transition-colors hover:bg-[#0c121b]"
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
          className="rounded-2xl border border-dashed border-primary-400/35 bg-[#151f2b] px-6 py-10 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
            <ListTodo className="h-7 w-7" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            Vamos organizar o próximo passo?
          </h3>
          <p className="mx-auto mb-5 max-w-lg text-[#9ba9bc]">
            Transforme sua validação em ações claras e acompanhe cada tarefa até a conclusão.
          </p>
          <button
            onClick={() => setShowAddTask('todo')}
            className="btn-primary inline-flex items-center"
          >
            Criar primeira tarefa
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
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
      className="group cursor-pointer rounded-xl border border-[#273548] bg-[#151f2b] p-4 transition-all hover:border-primary-400/45 hover:bg-[#182331]"
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className={fieldClassName}
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows={2}
            className={`${fieldClassName} resize-none`}
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              className={`flex-1 text-sm ${compactFieldClassName}`}
            />
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Task['priority'] })}
              className={`text-sm ${compactFieldClassName}`}
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
            <h4 className="flex-1 pr-2 text-sm font-semibold text-white">{task.title}</h4>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded p-1 text-[#9ba9bc] opacity-0 transition-opacity hover:bg-[#0c121b] hover:text-white group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 z-10 min-w-[150px] rounded-lg border border-[#34455a] bg-[#101722] shadow-xl">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#d7e0ea] hover:bg-[#151f2b]"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="mb-3 line-clamp-2 text-sm text-[#9ba9bc]">
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
          <div className="mt-3 flex gap-2 border-t border-[#273548] pt-3 opacity-0 transition-opacity group-hover:opacity-100">
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
