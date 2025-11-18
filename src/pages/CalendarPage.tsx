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
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Search,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";


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
      },
    ],
  },
];

export default function CalendarPage() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"));
  const [data, setData] = React.useState<CalendarData[]>(initialEvents);
  const [showModal, setShowModal] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({ name: "", time: "" });

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

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
              },
            ],
          },
        ];
      }
    });
    setShowModal(false);
    setNewEvent({ name: "", time: "" });
  }

  const selectedDayEvents = data.find((d: CalendarData) => isSameDay(d.day, selectedDay))?.events || [];

  return (
    <>
      <Helmet>
        <title>Calendário - Orientohub</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
          <div className="flex flex-auto">
            <div className="flex items-center gap-4">
              <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
                <h1 className="p-1 text-xs uppercase text-muted-foreground">
                  {format(today, "MMM")}
                </h1>
                <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                  <span>{format(today, "d")}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-foreground">
                  {format(firstDayCurrentMonth, "MMMM, yyyy")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {format(firstDayCurrentMonth, "MMM d, yyyy")} - {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Button variant="outline" size="icon" className="hidden lg:flex">
              <Search size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Separator orientation="vertical" className="hidden h-6 lg:block" />
            <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
              <Button onClick={previousMonth} className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10" variant="outline" size="icon" aria-label="Anterior">
                <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              <Button onClick={goToToday} className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto" variant="outline">
                Hoje
              </Button>
              <Button onClick={nextMonth} className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10" variant="outline" size="icon" aria-label="Próximo">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>
            <Separator orientation="vertical" className="hidden h-6 md:block" />
            <Separator orientation="horizontal" className="block w-full md:hidden" />
            <Button className="w-full gap-2 md:w-auto" onClick={() => setShowModal(true)}>
              <PlusCircle size={16} strokeWidth={2} aria-hidden="true" />
              <span>Novo Evento</span>
            </Button>
          </div>
        </div>
        <div className="lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
            <div className="border-r py-2.5">Dom</div>
            <div className="border-r py-2.5">Seg</div>
            <div className="border-r py-2.5">Ter</div>
            <div className="border-r py-2.5">Qua</div>
            <div className="border-r py-2.5">Qui</div>
            <div className="border-r py-2.5">Sex</div>
            <div className="py-2.5">Sáb</div>
          </div>
          <div className="flex text-xs leading-6 lg:flex-auto">
            <div className="w-full border-x grid grid-cols-7 grid-rows-5">
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  onClick={() => setSelectedDay(day)}
                  className={[
                    dayIdx === 0 ? colStartClasses[getDay(day)] : "",
                    isEqual(day, selectedDay) ? "bg-primary-500 text-white" :
                    isToday(day) ? "bg-primary-100 text-primary-700 font-bold" :
                    !isSameMonth(day, firstDayCurrentMonth) ? "bg-gray-100 text-gray-400" :
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                    "relative flex flex-col border-b border-r hover:bg-primary-50 cursor-pointer transition-all min-h-[80px] p-2 group"
                  ].join(" ")}
                >
                  <header className="flex items-center justify-between">
                    <span className={[
                      isEqual(day, selectedDay) ? "font-bold" : "",
                      "text-xs"
                    ].join(" ")}>{format(day, "d")}</span>
                  </header>
                  <div className="flex-1 mt-1">
                    {data.filter((event) => isSameDay(event.day, day)).map((day) => (
                      <div key={day.day.toString()} className="space-y-1.5">
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="flex flex-col items-start gap-1 rounded-lg border bg-primary-100/60 p-2 text-xs leading-tight text-primary-900"
                          >
                            <p className="font-medium leading-none">{event.name}</p>
                            <p className="leading-none text-primary-700">{event.time}</p>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-primary-700">+ {day.events.length - 2} mais</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-8 w-full">
          <h3 className="text-lg font-bold mb-2">Eventos do dia {format(selectedDay, "dd/MM/yyyy")}</h3>
          {selectedDayEvents.length === 0 ? (
            <p className="text-gray-500">Nenhum evento para este dia.</p>
          ) : (
            <ul className="space-y-4">
              {selectedDayEvents.map((ev) => (
                <li key={ev.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-primary-100 dark:border-primary-700">
                  <h4 className="font-bold text-base text-primary-700 dark:text-primary-300">{ev.name}</h4>
                  <p className="text-gray-600">{ev.time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Modal Novo Evento */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Novo Evento</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  placeholder="Título do evento"
                  value={newEvent.name}
                  onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                />
                <input
                  type="time"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl"
                  value={newEvent.time}
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                />
                <div className="flex gap-3 mt-4">
                  <Button
                    className="px-6 py-2 bg-primary-500 text-black font-bold rounded-xl hover:bg-primary-600"
                    onClick={handleAddEvent}
                  >
                    Salvar
                  </Button>
                  <Button
                    className="px-6 py-2 bg-gray-200 font-bold rounded-xl hover:bg-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
