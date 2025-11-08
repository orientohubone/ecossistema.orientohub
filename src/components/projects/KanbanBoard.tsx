import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Calendar, User, GripVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  assignee?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

const KanbanBoard = ({ tasks, onUpdate }: KanbanBoardProps) => {
  const { t } = useTranslation();
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns = {
    todo: {
      title: 'A Fazer',
      items: tasks.filter(task => task.status === 'todo')
    },
    doing: {
      title: 'Fazendo',
      items: tasks.filter(task => task.status === 'doing')
    },
    done: {
      title: 'Concluído',
      items: tasks.filter(task => task.status === 'done')
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: 'todo' | 'doing' | 'done') => {
    e.preventDefault();
    if (!draggedTask) return;

    const updatedTasks = tasks.map(t => 
      t.id === draggedTask ? { ...t, status } : t
    );
    onUpdate(updatedTasks);
    setDraggedTask(null);
  };

  const handleNewTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description || '',
      status: 'todo',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      assignee: newTask.assignee
    };

    onUpdate([...tasks, task]);
    setNewTask({});
    setShowNewTaskForm(false);
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Kanban</h3>
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Tarefa
        </button>
      </div>

      {showNewTaskForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título da tarefa"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              value={newTask.title || ''}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              value={newTask.description || ''}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                value={newTask.dueDate || ''}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <input
                type="text"
                placeholder="Responsável"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                value={newTask.assignee || ''}
                onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleNewTask} className="btn-primary">
                {t('common.save')}
              </button>
              <button
                onClick={() => {
                  setShowNewTaskForm(false);
                  setNewTask({});
                }}
                className="btn-secondary"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnId as 'todo' | 'doing' | 'done')}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{column.title}</h4>
              <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                {column.items.length}
              </span>
            </div>
            <div className="space-y-2 min-h-[300px]">
              {column.items.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                  Arraste tarefas aqui
                </div>
              ) : (
                column.items.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-all ${
                      draggedTask === task.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium mb-2 text-gray-900 dark:text-white">
                          {task.title}
                        </h5>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </div>
                          {task.assignee && (
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {task.assignee}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;