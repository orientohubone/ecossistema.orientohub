import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Search,
  Calendar as CalendarIcon,
  Clock,
  X,
  MapPin,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

interface EventType {
  id: number;
  name: string;
  time: string;
  datetime: string;
  type?: 'mentoria' | 'workshop' | 'reuniao' | 'outro';
  location?: string;
}

interface CalendarData {
  day: Date;
  events: EventType[];
}

const initialEvents: CalendarData[] = [
  {
    day: startOfToday(),
    events: [
      {
        id: 1,
        name: "Mentoria com João Silva",
        time: "15:00",
        datetime: format(startOfToday(), "yyyy-MM-dd") + "T15:00",
        type: "mentoria",
        location: "Google Meet",
      },
    ],
  },
  {
    day: add(startOfToday(), { days: 1 }),
    events: [
      {
        id: 2,
        name: "Workshop: Validação de Problemas",
        time: "10:00",
        datetime: format(add(startOfToday(), { days: 1 }), "yyyy-MM-dd") + "T10:00",
        type: "workshop",
        location: "Sala Virtual",
      },
    ],
  },
];

const eventTypeColors = {
  mentoria: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  workshop: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  reuniao: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  outro: "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
};

type ViewMode = 'day' | 'month' | 'year';

export default function CalendarPage() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"));
  const [data, setData] = React.useState<CalendarData[]>(initialEvents);
  const [showModal, setShowModal] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('month');
  const [lastClick, setLastClick] = React.useState<number>(0);
  const [newEvent, setNewEvent] = React.useState({ 
    name: "", 
    time: "", 
    type: "outro" as EventType['type'],
    location: "" 
  });

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const selectedDayEvents = data.find((d: CalendarData) => isSameDay(d.day, selectedDay))?.events || [];

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
  }

  function handleDayClick(day: Date) {
    const now = Date.now();
    const timeSinceLastClick = now - lastClick;
    
    if (timeSinceLastClick < 300 && isSameDay(day, selectedDay)) {
      // Duplo clique - abre detalhes ou modal
      const dayEvents = data.find((d) => isSameDay(d.day, day))?.events || [];
      if (dayEvents.length > 0) {
        setViewMode('day');
      } else {
        setShowModal(true);
      }
    } else {
      // Clique simples - seleciona dia
      setSelectedDay(day);
    }
    
    setLastClick(now);
  }

  function handleAddEvent() {
    if (!newEvent.name || !newEvent.time) return;
    setData((prev: CalendarData[]) => {
      const idx = prev.findIndex((d: CalendarData) => isSameDay(d.day, selectedDay));
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].events.push({
          id: Date.now(),
          name: newEvent.name,
          time: newEvent.time,
          datetime: format(selectedDay, "yyyy-MM-dd") + "T" + newEvent.time,
          type: newEvent.type,
          location: newEvent.location,
        });
        return updated;
      } else {
        return [
          ...prev,
          {
            day: selectedDay,
            events: [
              {
                id: Date.now(),
                name: newEvent.name,
                time: newEvent.time,
                datetime: format(selectedDay, "yyyy-MM-dd") + "T" + newEvent.time,
                type: newEvent.type,
                location: newEvent.location,
              },
            ],
          },
        ];
      }
    });
    setShowModal(false);
    setNewEvent({ name: "", time: "", type: "outro", location: "" });
  }

  // Função para renderizar view de ano
  const renderYearView = () => {
    const currentYear = parse(currentMonth, "MMM-yyyy", new Date()).getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));
    
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-6">
        {months.map((month, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setCurrentMonth(format(month, "MMM-yyyy"));
              setViewMode('month');
            }}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize mb-2">
              {format(month, "MMMM", { locale: ptBR })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {eachDayOfInterval({
                start: startOfWeek(month),
                end: endOfWeek(endOfMonth(month)),
              }).map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={[
                    "aspect-square flex items-center justify-center rounded",
                    isSameMonth(day, month) ? "text-gray-700 dark:text-gray-300" : "text-gray-300 dark:text-gray-700",
                    isToday(day) ? "bg-primary-500 text-white font-bold" : "",
                  ].join(" ")}
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Função para renderizar view de dia
  const renderDayView = () => {
    const hourSlots = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="p-6">
        <div className="space-y-1">
          {hourSlots.map((hour) => {
            const hourEvents = selectedDayEvents.filter(e => 
              parseInt(e.time.split(':')[0]) === hour
            );
            
            return (
              <div key={hour} className="flex border-b border-gray-100 dark:border-gray-800">
                <div className="w-20 py-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 py-2 pl-4">
                  {hourEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={[
                        "p-3 rounded-lg mb-2 border-l-4",
                        eventTypeColors[event.type || 'outro']
                      ].join(" ")}
                    >
                      <h4 className="font-semibold text-sm">{event.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {event.time}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Calendário - Orientohub</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container-custom py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left side - Month info */}
              <div className="flex items-center gap-6">
                <motion.div 
                  className="hidden md:flex flex-col items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs uppercase text-white/80 font-semibold">
                    {format(today, "MMM", { locale: ptBR })}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {format(today, "d")}
                  </span>
                </motion.div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                    {format(firstDayCurrentMonth, "MMMM yyyy", { locale: ptBR })}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {format(firstDayCurrentMonth, "d 'de' MMM", { locale: ptBR })} - {format(endOfMonth(firstDayCurrentMonth), "d 'de' MMM yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('day')}
                    className={[
                      "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                      viewMode === 'day' 
                        ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                        : "text-gray-600 dark:text-gray-400"
                    ].join(" ")}
                  >
                    Dia
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('month')}
                    className={[
                      "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                      viewMode === 'month' 
                        ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                        : "text-gray-600 dark:text-gray-400"
                    ].join(" ")}
                  >
                    Mês
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('year')}
                    className={[
                      "px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                      viewMode === 'year' 
                        ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                        : "text-gray-600 dark:text-gray-400"
                    ].join(" ")}
                  >
                    Ano
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Search size={20} />
                </motion.button>

                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={previousMonth}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToToday}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Hoje
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <PlusCircle size={20} />
                  <span className="hidden md:inline">Novo Evento</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Renderiza a view apropriada */}
            {viewMode === 'year' && renderYearView()}
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'month' && (
              <>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {days.map((day, dayIdx) => {
                    const dayEvents = data.find((d) => isSameDay(d.day, day))?.events || [];
                    const isSelected = isEqual(day, selectedDay);
                    const isTodayDate = isToday(day);
                    const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);

                    return (
                      <motion.div
                        key={dayIdx}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleDayClick(day)}
                        className={[
                          dayIdx === 0 ? colStartClasses[getDay(day)] : "",
                          "relative min-h-[120px] p-3 border-r border-b border-gray-200 dark:border-gray-800 cursor-pointer transition-all",
                          isSelected 
                            ? "bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500 ring-inset" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                          !isCurrentMonth && "bg-gray-50/50 dark:bg-gray-800/20"
                        ].join(" ")}
                      >
                        {/* Day number */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={[
                            "text-sm font-semibold",
                            isTodayDate 
                              ? "w-7 h-7 flex items-center justify-center rounded-full bg-primary-500 text-white"
                              : isSelected
                              ? "text-primary-600 dark:text-primary-400"
                              : !isCurrentMonth
                              ? "text-gray-400 dark:text-gray-600"
                              : "text-gray-700 dark:text-gray-300"
                          ].join(" ")}>
                            {format(day, "d")}
                          </span>
                        </div>

                        {/* Events */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={[
                                "text-xs p-2 rounded-lg border font-medium truncate",
                                eventTypeColors[event.type || 'outro']
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-1">
                                <Clock size={10} />
                                <span>{event.time}</span>
                              </div>
                              <p className="truncate mt-0.5">{event.name}</p>
                            </motion.div>
                          ))}
                          {dayEvents.length > 2 && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium pl-2">
                              +{dayEvents.length - 2} mais
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Selected Day Events - só mostra na view de mês */}
          {viewMode === 'month' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'evento' : 'eventos'}
                    {selectedDayEvents.length === 0 && ' - Duplo clique para adicionar'}
                  </p>
                </div>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Nenhum evento agendado para este dia</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    <PlusCircle size={20} />
                    Adicionar Evento
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={[
                              "px-3 py-1 rounded-full text-xs font-semibold",
                              eventTypeColors[event.type || 'outro']
                            ].join(" ")}>
                              {event.type || 'outro'}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock size={16} />
                              <span className="font-semibold">{event.time}</span>
                            </div>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {event.name}
                          </h4>
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin size={16} />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <X size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Novo Evento</h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X size={24} className="text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Título do Evento
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Ex: Reunião de planejamento"
                      value={newEvent.name}
                      onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Horário
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors"
                      value={newEvent.time}
                      onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tipo
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors"
                      value={newEvent.type}
                      onChange={e => setNewEvent({ ...newEvent, type: e.target.value as EventType['type'] })}
                    >
                      <option value="mentoria">Mentoria</option>
                      <option value="workshop">Workshop</option>
                      <option value="reuniao">Reunião</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Local (opcional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Ex: Google Meet, Zoom, Sala 101"
                      value={newEvent.location}
                      onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddEvent}
                    className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg"
                  >
                    Criar Evento
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
