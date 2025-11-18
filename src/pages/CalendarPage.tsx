import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import { Plus, Bell, Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string; // ISO string
  time: string;
  description?: string;
}

const initialEvents: Event[] = [
  {
    id: 1,
    title: 'Mentoria com João Silva',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    description: 'Sessão de mentoria sobre validação de ideias.'
  },
  {
    id: 2,
    title: 'Workshop: Validação de Problemas',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    description: 'Aprenda técnicas avançadas de validação.'
  }
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | Date[]>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});
  const [notification, setNotification] = useState<string | null>(null);

  // Notifica eventos do dia
  const today = new Date().toISOString().split('T')[0];
  const todaysEvents = events.filter(e => e.date === today);

  // Exibe notificação simples
  const notifyToday = () => {
    if (todaysEvents.length > 0) {
      setNotification(`Você tem ${todaysEvents.length} evento(s) hoje!`);
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification('Nenhum evento para hoje.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Criação de novo evento
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description || ''
      }
    ]);
    setShowModal(false);
    setNewEvent({});
  };

  // Eventos do dia selecionado
  const selectedDate = Array.isArray(date) ? date[0] : date;
  const selectedEvents = events.filter(e => e.date === selectedDate.toISOString().split('T')[0]);

  return (
    <>
      <Helmet>
        <title>Calendário - Orientohub</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-primary-500" />
              Calendário de Eventos
            </h1>
            <div className="flex gap-2">
              <button
                className="p-3 bg-primary-500 text-black rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all"
                onClick={() => setShowModal(true)}
              >
                <Plus className="w-5 h-5" /> Novo Evento
              </button>
              <button
                className="p-3 bg-yellow-100 text-yellow-800 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-200 transition-all"
                onClick={notifyToday}
              >
                <Bell className="w-5 h-5" /> Notificar Hoje
              </button>
            </div>
          </div>

          {notification && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">{notification}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Calendar
                onChange={setDate}
                value={date}
                tileClassName={({ date: d }) =>
                  events.some(e => e.date === d.toISOString().split('T')[0])
                    ? 'bg-primary-100 text-primary-700 font-bold rounded-full' : ''
                }
              />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Eventos do Dia</h2>
              {selectedEvents.length === 0 ? (
                <p className="text-gray-500">Nenhum evento para este dia.</p>
              ) : (
                <ul className="space-y-4">
                  {selectedEvents.map(ev => (
                    <li key={ev.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-lg">{ev.title}</h3>
                      <p className="text-gray-600">{ev.time}</p>
                      {ev.description && <p className="text-gray-500 mt-1">{ev.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Modal de novo evento */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Novo Evento</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                    placeholder="Título do evento"
                    value={newEvent.title || ''}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                    value={newEvent.date || ''}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                  <input
                    type="time"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                    value={newEvent.time || ''}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                    placeholder="Descrição (opcional)"
                    value={newEvent.description || ''}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      className="px-6 py-2 bg-primary-500 text-black font-bold rounded-xl hover:bg-primary-600"
                      onClick={handleCreateEvent}
                    >
                      Salvar
                    </button>
                    <button
                      className="px-6 py-2 bg-gray-200 font-bold rounded-xl hover:bg-gray-300"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CalendarPage;
