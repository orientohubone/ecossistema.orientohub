import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Calendar, User } from 'lucide-react';

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

  const columns = {
    todo: {
      title: t('kanban.todo'),
      items: tasks.filter(task => task.status === 'todo')
    },
    doing: {
      title: t('kanban.doing'),
      items: tasks.filter(task => task.status === 'doing')
    },
    done: {
      title: t('kanban.done'),
      items: tasks.filter(task => task.status === 'done')
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    const taskToMove = tasks.find(t => t.id === result.draggableId);

    if (taskToMove) {
      const updatedTasks = tasks.map(t => 
        t.id === taskToMove.id
          ? { ...t, status: destCol as Task['status'] }
          : t
      );
      onUpdate(updatedTasks);
    }
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
        <h3 className="text-lg font-semibold">{t('kanban.title')}</h3>
        <button
          onClick={() => setShowNewTaskForm(true)}
          className="btn-primary"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {t('kanban.newTask')}
        </button>
      </div>

      {showNewTaskForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('kanban.taskTitle')}
              className="w-full p-2 border rounded"
              value={newTask.title || ''}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder={t('kanban.taskDescription')}
              className="w-full p-2 border rounded"
              value={newTask.description || ''}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="flex space-x-4">
              <input
                type="date"
                className="p-2 border rounded"
                value={newTask.dueDate || ''}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <input
                type="text"
                placeholder={t('kanban.assignee')}
                className="p-2 border rounded"
                value={newTask.assignee || ''}
                onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <button onClick={handleNewTask} className="btn-primary">
                {t('common.save')}
              </button>
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="btn-secondary"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <h4 className="font-medium mb-4">{column.title}</h4>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px]"
                  >
                    {column.items.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm"
                          >
                            <h5 className="font-medium mb-2">{task.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              {task.assignee && (
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {task.assignee}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;