// Import necessary dependencies
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Calendar, User, GripVertical } from 'lucide-react';

// Define Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
  assignee: string;
}

// Define KanbanBoardProps interface
interface KanbanBoardProps {
  initialTasks: Task[];
}

// KanbanBoard component
const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialTasks }) => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    // Here you can add visual feedback, e.g., change the opacity of the item
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newColumn: string) => {
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, status: newColumn as 'todo' | 'doing' | 'done' } : t
        )
      );
    }
  };

  // Task form state
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
    assignee: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTasks([...tasks, { ...newTask, id: `${Date.now()}` }]);
    setNewTask({ id: '', title: '', description: '', status: 'todo', dueDate: '', assignee: '' });
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4">
      {['todo', 'doing', 'done'].map(column => (
        <div key={column} className={`column ${column}`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column)}>
          <h2>{t(column)}</h2>
          <div>
            {tasks.filter(task => task.status === column).map(task => (
              <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)}>
                <GripVertical />
                <div>{task.title}</div>
                <div>{task.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="new-task-form">
        <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder={t('Title')} required />
        <input value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder={t('Description')} required />
        <input value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} type="date" required />
        <input value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} placeholder={t('Assignee')} required />
        <button type="submit"><PlusCircle /> {t('Add Task')}</button>
      </form>
    </div>
  );
};

export default KanbanBoard;
