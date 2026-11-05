'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Lock,
  List,
  CalendarDays,
  Clock,
  X,
  Check,
} from 'lucide-react';
import { EventCategory, CalendarEvent } from '@/types';
import { SegmentedControl, Switch } from 'glisse';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';
import LiquidSegmentedControl from '@/components/ui/liquid-glass/LiquidSegmentedControl';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['a.m.', 'p.m.'] as const;
const YEARS_LIST = Array.from({ length: 12 }, (_, i) => String(2024 + i));
const WHEEL_ITEM_H = 34;

function format12hLabel(time24: string): string {
  const [hStr, mStr] = (time24 || '10:30').split(':');
  const h24 = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const period = h24 < 12 ? 'a.m.' : 'p.m.';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Columna giratoria estilo tambor de iPhone / Google Calendar iOS */
function IOSWheelColumn({
  items,
  selectedIndex,
  onSelect,
  className = '',
}: {
  items: readonly string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInternalScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isInternalScroll.current) return;
    const targetTop = selectedIndex * WHEEL_ITEM_H;
    if (Math.abs(el.scrollTop - targetTop) > 2) {
      el.scrollTop = targetTop;
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    isInternalScroll.current = true;
    const rawIdx = Math.round(el.scrollTop / WHEEL_ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, rawIdx));
    if (clamped !== selectedIndex) {
      onSelect(clamped);
    }
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isInternalScroll.current = false;
    }, 120);
  };

  const scrollToIndex = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * WHEEL_ITEM_H, behavior: 'smooth' });
    onSelect(idx);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: WHEEL_ITEM_H * 5, perspective: '500px' }}
      className={`overflow-y-scroll snap-y snap-mandatory no-scrollbar select-none relative z-10 ${className}`}
    >
      {/* Espaciador superior (2 filas para centrar el índice 0 en la barra fija) */}
      <div style={{ height: WHEEL_ITEM_H * 2 }} aria-hidden="true" />
      {items.map((item, idx) => {
        const diff = idx - selectedIndex;
        const absDiff = Math.abs(diff);
        const isSelected = diff === 0;
        const rotateX = Math.max(-48, Math.min(48, diff * -22));
        const scale = isSelected ? 1.08 : absDiff === 1 ? 0.92 : 0.8;

        return (
          <div
            key={item}
            role="option"
            aria-selected={isSelected}
            onClick={() => scrollToIndex(idx)}
            style={{
              height: WHEEL_ITEM_H,
              transform: `rotateX(${rotateX}deg) scale(${scale})`,
            }}
            className={`snap-center flex items-center justify-center cursor-pointer transition-all duration-150 ${
              isSelected
                ? 'text-[15px] font-extrabold text-[var(--mk-ink)] opacity-100'
                : absDiff === 1
                ? 'text-[13px] font-semibold text-[var(--mk-muted)] opacity-70'
                : 'text-[12px] font-medium text-[var(--mk-muted)] opacity-35'
            }`}
          >
            {item}
          </div>
        );
      })}
      {/* Espaciador inferior (2 filas para centrar el último índice) */}
      <div style={{ height: WHEEL_ITEM_H * 2 }} aria-hidden="true" />
    </div>
  );
}

const CATEGORIES: { label: EventCategory; color: string }[] = [
  { label: 'Personal', color: '#d62725' },
  { label: 'Trabajo', color: '#003049' },
  { label: 'Salud', color: '#1fa37a' },
  { label: 'Social', color: '#e5a50a' },
  { label: 'Hogar', color: '#8e837c' },
];

type EventTypeTag = 'Evento' | 'Tarea' | 'Cumpleaños';

export default function CalendarView() {
  const {
    calendarEvents,
    addCalendarEvent,
    triggerHaptic,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-20');
  const [todayStr, setTodayStr] = useState<string>('2026-10-20');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Month grid navigation state
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9);

  useEffect(() => {
    try {
      const now = new Date();
      const iso = now.toISOString().split('T')[0];
      setSelectedDate(iso);
      setTodayStr(iso);
      setCurrentYear(now.getFullYear());
      setCurrentMonth(now.getMonth());
    } catch {
      // ignore
    }
  }, []);

  // Form State for "Agregar (+)" Modal
  const [title, setTitle] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [eventTypeTag, setEventTypeTag] = useState<EventTypeTag>('Evento');
  
  // Date and Time selectors for the modal
  const [formDay, setFormDay] = useState<number>(20);
  const [formMonthIdx, setFormMonthIdx] = useState<number>(9);
  const [formYear, setFormYear] = useState<number>(2026);
  const [formTime, setFormTime] = useState<string>('10:30');
  const [activeWheel, setActiveWheel] = useState<'date' | 'time' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Días válidos para el mes y año seleccionados en la rueda de fecha
  const daysInFormMonth = useMemo(() => {
    const count = new Date(formYear, formMonthIdx + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => String(i + 1));
  }, [formYear, formMonthIdx]);

  const wheelDayIdx = Math.max(0, Math.min(daysInFormMonth.length - 1, formDay - 1));
  const wheelYearIdx = Math.max(0, YEARS_LIST.indexOf(String(formYear)));

  const updateWheelDate = (newDayIdx: number, newMonthIdx: number, newYearIdx: number) => {
    triggerHaptic(8);
    const nextYear = parseInt(YEARS_LIST[newYearIdx] || '2026', 10);
    const maxDays = new Date(nextYear, newMonthIdx + 1, 0).getDate();
    const clampedDay = Math.min(newDayIdx + 1, maxDays);
    setFormYear(nextYear);
    setFormMonthIdx(newMonthIdx);
    setFormDay(clampedDay);
  };

  // Desglose de formTime ("HH:mm") en índices para la rueda giratoria de iPhone
  const { wheelHourIdx, wheelMinIdx, wheelPeriodIdx } = useMemo(() => {
    const [hStr, mStr] = (formTime || '10:30').split(':');
    const h24 = parseInt(hStr, 10) || 0;
    const m = Math.max(0, Math.min(59, parseInt(mStr, 10) || 0));
    const periodIdx = h24 < 12 ? 0 : 1;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return {
      wheelHourIdx: h12 - 1,
      wheelMinIdx: m,
      wheelPeriodIdx: periodIdx,
    };
  }, [formTime]);

  const updateWheelTime = (newHourIdx: number, newMinIdx: number, newPeriodIdx: number) => {
    triggerHaptic(8);
    const h12 = newHourIdx + 1;
    let h24 = h12 % 12;
    if (newPeriodIdx === 1) h24 += 12;
    const nextTime = `${String(h24).padStart(2, '0')}:${String(newMinIdx).padStart(2, '0')}`;
    setFormTime(nextTime);
  };

  // Generate 7-10 carousel pills around today
  const carouselDays = useMemo(() => {
    const list = [];
    const base = new Date(todayStr + 'T12:00:00');
    // From -1 (yesterday) to +5 (5 days ahead)
    for (let offset = -1; offset <= 5; offset++) {
      const d = new Date(base);
      d.setDate(base.getDate() + offset);
      const iso = d.toISOString().split('T')[0];
      const isToday = iso === todayStr;

      let name = '';
      if (isToday) {
        name = 'hoy';
      } else {
        const dayIdx = d.getDay();
        const shortNames = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
        name = shortNames[dayIdx];
      }

      list.push({
        iso,
        dayName: name,
        dayNum: d.getDate(),
        isToday,
      });
    }
    return list;
  }, [todayStr]);

  // Events filtered by selectedDate
  const dayEvents = useMemo(() => {
    return calendarEvents
      .filter((e) => e.date === selectedDate)
      .sort((a, b) => {
        if (a.isAllDay) return -1;
        if (b.isAllDay) return 1;
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
  }, [calendarEvents, selectedDate]);

  // Open modal prefilled with selected date
  const handleOpenCreateModal = () => {
    triggerHaptic(25);
    const d = new Date(selectedDate + 'T12:00:00');
    setFormDay(d.getDate());
    setFormMonthIdx(d.getMonth());
    setFormYear(d.getFullYear());
    setTitle('');
    setIsAllDay(false);
    setIsPrivate(false);
    setEventTypeTag('Evento');
    setActiveWheel(null);
    setSelectedCategory(null);
    setShowCategoryPicker(false);
    setIsCreateModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!title.trim()) return;
    triggerHaptic(40);

    const m = String(formMonthIdx + 1).padStart(2, '0');
    const day = String(formDay).padStart(2, '0');
    const constructedDate = `${formYear}-${m}-${day}`;

    const finalCategory: EventCategory = selectedCategory || 'Personal';
    const catObj = CATEGORIES.find((c) => c.label === finalCategory);

    addCalendarEvent({
      title: title.trim(),
      date: constructedDate,
      startTime: isAllDay ? undefined : formTime,
      endTime: isAllDay ? undefined : undefined,
      isAllDay,
      category: finalCategory,
      color: catObj ? catObj.color : '#d62725',
      isPrivate,
    });

    setTitle('');
    setIsCreateModalOpen(false);
  };

  // Month grid calculation
  const currentMonthDays = useMemo(() => {
    const year = currentYear;
    const month = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvts = calendarEvents.filter((e) => e.date === dateStr);
      days.push({ day: d, dateStr, events: dayEvts });
    }
    return days;
  }, [calendarEvents, currentYear, currentMonth]);

  return (
    <div className="space-y-4 pb-24">
      {/* ========================================================= */}
      {/* 1. CABECERA: "Calendario" + Switch vista + Botón "+" rojo  */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[color:var(--accent-warm)] shrink-0" strokeWidth={2.3} />
          <h1 className="text-[20px] font-extrabold tracking-tight text-[var(--mk-ink)]">
            Calendario
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch de vista Glisse: Agenda (lista) vs Calendario (cuadrícula) del mismo alto (38px) que el botón '+' */}
          <SegmentedControl
            aria-label="Cambiar vista entre Agenda y Calendario"
            value={viewMode}
            onValueChange={(next: string) => {
              triggerHaptic(15);
              setViewMode(next as 'list' | 'grid');
            }}
            className="glisse-calendar-switcher"
            items={[
              {
                value: 'list',
                label: (
                  <span className="flex items-center justify-center" title="Vista Agenda">
                    <List className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                ),
              },
              {
                value: 'grid',
                label: (
                  <span className="flex items-center justify-center" title="Vista Calendario">
                    <CalendarDays className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                ),
              },
            ]}
          />

          {/* Botón '+' circular del mockup (desaparece al estar dentro del modal) */}
          <motion.div
            role="button"
            tabIndex={0}
            id="btn-calendar-add"
            transition={{ duration: 0.3 }}
            onClick={handleOpenCreateModal}
            aria-label="Agregar evento"
            className={`mk-fab cursor-pointer transition-all duration-200 ${
              isCreateModalOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </motion.div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CARRUSEL HORIZONTAL DE FECHAS (Solo visible en Agenda)  */}
      {/* ========================================================= */}
      {viewMode === 'list' && (
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-2 px-1">
          {carouselDays.map((pill) => {
            const isSelected = selectedDate === pill.iso;
            const isCurrentToday = pill.isToday;

            return (
              <button
                key={pill.iso}
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  setSelectedDate(pill.iso);
                }}
                className="flex flex-col items-center justify-center shrink-0 min-w-[42px] transition-transform active:scale-95"
              >
                {isCurrentToday ? (
                  /* DÍA ACTUAL: Rojo con texto blanco en modo día, Amarillo con número negro en modo oscuro */
                  <div
                    className={`w-11 h-11 rounded-full bg-[#d62725] dark:bg-[#fcbf48] text-white dark:text-black shadow-md flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-[var(--accent-warm)]/40 scale-105' : 'opacity-95'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-tight leading-none">
                      hoy
                    </span>
                    <span className="text-[13px] font-black leading-tight mt-0.5 text-white dark:text-black">
                      {pill.dayNum}
                    </span>
                  </div>
                ) : (
                  /* OTROS DÍAS: Formato limpio texto sobre fondo sutil */
                  <div
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[var(--mk-tile)] text-[var(--mk-ink)] font-extrabold ring-1 ring-[var(--mk-field-border)] scale-105'
                        : 'text-[var(--mk-muted)] hover:text-[var(--mk-ink)]'
                    }`}
                  >
                    <span className="text-[9px] font-semibold tracking-tight uppercase leading-none">
                      {pill.dayName}
                    </span>
                    <span className="text-[12px] font-bold leading-tight mt-0.5">
                      {pill.dayNum}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CONTENIDO: VISTA LISTA O CUADRÍCULA                     */}
      {/* ========================================================= */}
      {viewMode === 'list' ? (
        <div className="space-y-2.5">
          {dayEvents.length === 0 ? (
            /* Empty State elegante */
            <div className="mk-card p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--mk-tile)] flex items-center justify-center mx-auto text-[color:var(--accent-warm)]">
                <CalendarIcon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <p className="text-xs font-bold text-[var(--mk-ink)]">
                No hay eventos programados
              </p>
              <p className="text-[11px] text-[var(--mk-muted)]">
                Tu agenda está libre. Toca el botón + para registrar tu primer evento o tarea.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--accent-warm)] text-[color:var(--on-accent)] font-bold text-[11px] shadow-sm active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Agregar evento
              </button>
            </div>
          ) : (
            dayEvents.map((evt) => (
              <div
                key={evt.id}
                className="mk-card p-3.5 flex items-center justify-between gap-3 border-l-4 transition-transform active:scale-[0.99]"
                style={{ borderLeftColor: evt.color || 'var(--accent-warm)' }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {evt.isRedacted && <Lock className="w-3 h-3 text-[var(--mk-muted)]" />}
                    <h4 className="text-xs font-extrabold text-[var(--mk-ink)] truncate">
                      {evt.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--mk-muted)] mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {evt.isAllDay ? 'Todo el día' : `${evt.startTime || '09:00'}${evt.endTime ? ` - ${evt.endTime}` : ''}`}
                    </span>
                    <span>•</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                      style={{
                        backgroundColor: `${evt.color || '#d62725'}18`,
                        color: evt.color || 'var(--accent-warm)',
                      }}
                    >
                      {evt.category}
                    </span>
                  </div>
                </div>

                {evt.isPrivate && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    Privado
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Vista de cuadrícula mensual */
        <div className="mk-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--mk-ink)] capitalize">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear((y) => y - 1);
                  } else {
                    setCurrentMonth((m) => m - 1);
                  }
                }}
                className="px-2 py-1 text-xs rounded bg-[var(--mk-tile)] text-[var(--mk-muted)]"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear((y) => y + 1);
                  } else {
                    setCurrentMonth((m) => m + 1);
                  }
                }}
                className="px-2 py-1 text-xs rounded bg-[var(--mk-tile)] text-[var(--mk-muted)]"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <span key={d} className="text-[9px] font-bold text-[var(--mk-muted)] uppercase">
                {d}
              </span>
            ))}

            {currentMonthDays.map((item, idx) => {
              if (!item) return <div key={`empty-${idx}`} className="h-10" />;
              const isSelected = selectedDate === item.dateStr;
              return (
                <div
                  key={item.dateStr}
                  onClick={() => {
                    triggerHaptic(15);
                    setSelectedDate(item.dateStr);
                    setViewMode('list');
                  }}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#d62725] dark:bg-[#fcbf48] text-white dark:text-black font-bold'
                      : 'hover:bg-[var(--mk-tile)] text-[var(--mk-ink)]'
                  }`}
                >
                  <span className="text-[11px] font-bold">{item.day}</span>
                  {item.events.length > 0 && (
                    <span className="w-1 h-1 rounded-full bg-current mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL DE AGREGAR (+) ISLA FLOTANTE EN EL CENTRO         */}
      {/* ========================================================= */}
      <LiquidGlassSheet
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="max-w-[350px]"
        isCenter={true}
      >
        <div className="p-4 space-y-3 max-h-[80dvh] overflow-y-auto no-scrollbar">
          {/* Fila superior: Interruptores Glisse "Todo el día" y "Privado" + Botón "+" para guardar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Switch Todo el día (Glisse On/Off) */}
              <div className="inline-flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[var(--mk-ink)] select-none">
                  Todo el día
                </span>
                <Switch
                  checked={isAllDay}
                  aria-label="Todo el día"
                  style={
                    {
                      '--lg-scale': 0.3,
                      '--lg-on': '#30d158',
                    } as React.CSSProperties
                  }
                  onCheckedChange={(next: boolean) => {
                    triggerHaptic(15);
                    setIsAllDay(next);
                    if (next && activeWheel === 'time') setActiveWheel(null);
                  }}
                />
              </div>

              {/* Switch Privado (Glisse On/Off) */}
              <div className="inline-flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[var(--mk-ink)] select-none">
                  Privado
                </span>
                <Switch
                  checked={isPrivate}
                  aria-label="Privado"
                  style={
                    {
                      '--lg-scale': 0.3,
                      '--lg-on': 'var(--accent-warm)',
                    } as React.CSSProperties
                  }
                  onCheckedChange={(next: boolean) => {
                    triggerHaptic(15);
                    setIsPrivate(next);
                  }}
                />
              </div>
            </div>

            {/* Botón "+" de acento para guardar */}
            <button
              type="button"
              id="btn-save-event-modal"
              onClick={handleSaveEvent}
              disabled={!title.trim()}
              className="mk-fab !w-8 !h-8 disabled:opacity-35"
              title="Guardar evento"
              aria-label="Guardar evento"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
            </button>
          </div>

          {/* Input de título: ligero, translúcido y sin autoFocus */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEvent()}
              placeholder="Agregar título..."
              className="mk-title-input"
            />
          </div>

          {/* Barra de selección Glisse: "Evento", "Tarea", "Cumpleaños" */}
          <LiquidSegmentedControl<EventTypeTag>
            size="sm"
            value={eventTypeTag}
            onChange={(tag) => {
              triggerHaptic(15);
              setEventTypeTag(tag);
            }}
            options={[
              { id: 'Evento', label: 'Evento' },
              { id: 'Tarea', label: 'Tarea' },
              { id: 'Cumpleaños', label: 'Cumpleaños' },
            ]}
          />

          {/* Selectores de FECHA (Día, Mes, Año) y HORA: ambos despliegan rueda giratoria estilo iPhone debajo */}
          <div className="flex items-end gap-2 pt-0.5">
            {/* FECHA */}
            <div className="flex-1 min-w-0 space-y-1">
              <span className="mk-caption">Fecha:</span>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  triggerHaptic(15);
                  setActiveWheel((cur) => (cur === 'date' ? null : 'date'));
                }}
                className="flex items-center gap-1 cursor-pointer"
              >
                {/* Día */}
                <span
                  className={`mk-field !rounded-[10px] !w-[38px] shrink-0 text-center font-bold !px-1 !py-1.5 text-xs transition-all ${
                    activeWheel === 'date'
                      ? '!border-[var(--accent-warm)] !text-[color:var(--accent-warm)]'
                      : ''
                  }`}
                >
                  {formDay}
                </span>
                {/* Mes */}
                <span
                  className={`mk-field !rounded-[10px] flex-1 min-w-[78px] text-xs font-bold !py-1.5 !px-2 text-center truncate transition-all ${
                    activeWheel === 'date'
                      ? '!border-[var(--accent-warm)] !text-[color:var(--accent-warm)]'
                      : ''
                  }`}
                >
                  {MONTH_NAMES[formMonthIdx]}
                </span>
                {/* Año */}
                <span
                  className={`mk-field !rounded-[10px] !w-[54px] shrink-0 text-center font-bold !px-1 !py-1.5 text-xs transition-all ${
                    activeWheel === 'date'
                      ? '!border-[var(--accent-warm)] !text-[color:var(--accent-warm)]'
                      : ''
                  }`}
                >
                  {formYear}
                </span>
              </div>
            </div>

            {/* HORA: botón que despliega la rueda giratoria estilo iPhone / Google Calendar debajo */}
            <div className="w-[106px] shrink-0 space-y-1">
              <span className="mk-caption">Hora:</span>
              <button
                type="button"
                disabled={isAllDay}
                onClick={() => {
                  triggerHaptic(15);
                  setActiveWheel((cur) => (cur === 'time' ? null : 'time'));
                }}
                className={`mk-field !rounded-[10px] !w-full text-xs font-bold !py-1.5 !px-2 text-center truncate disabled:opacity-40 cursor-pointer transition-all ${
                  activeWheel === 'time'
                    ? '!border-[var(--accent-warm)] !text-[color:var(--accent-warm)]'
                    : ''
                }`}
              >
                {format12hLabel(formTime)}
              </button>
            </div>
          </div>

          {/* Rueda giratoria estilo iPhone / Google Calendar iOS (Fecha: Día/Mes/Año o Hora: Hora/Min/a.m.-p.m.) */}
          <AnimatePresence mode="wait">
            {activeWheel === 'date' && (
              <motion.div
                key="wheel-date"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="relative rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-[var(--mk-field-border)] px-3 py-1 mt-1"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 20%, black 40%, black 60%, rgba(0,0,0,0.45) 80%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 20%, black 40%, black 60%, rgba(0,0,0,0.45) 80%, transparent 100%)',
                  }}
                >
                  {/* Barra central fija de selección estilo iPhone */}
                  <div
                    aria-hidden="true"
                    style={{ height: WHEEL_ITEM_H }}
                    className="pointer-events-none absolute inset-x-2.5 top-1/2 -translate-y-1/2 rounded-[10px] bg-black/[0.08] dark:bg-white/[0.12] border border-[var(--mk-field-border)] shadow-inner z-0"
                  />

                  {/* 3 Tambores giratorios de Fecha: Día | Mes | Año */}
                  <div className="grid grid-cols-11 items-center relative z-10">
                    <IOSWheelColumn
                      className="col-span-3"
                      items={daysInFormMonth}
                      selectedIndex={wheelDayIdx}
                      onSelect={(dIdx) => updateWheelDate(dIdx, formMonthIdx, wheelYearIdx)}
                    />
                    <IOSWheelColumn
                      className="col-span-5"
                      items={MONTH_NAMES}
                      selectedIndex={formMonthIdx}
                      onSelect={(mIdx) => updateWheelDate(wheelDayIdx, mIdx, wheelYearIdx)}
                    />
                    <IOSWheelColumn
                      className="col-span-3"
                      items={YEARS_LIST}
                      selectedIndex={wheelYearIdx}
                      onSelect={(yIdx) => updateWheelDate(wheelDayIdx, formMonthIdx, yIdx)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeWheel === 'time' && !isAllDay && (
              <motion.div
                key="wheel-time"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="relative rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-[var(--mk-field-border)] px-3 py-1 mt-1"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 20%, black 40%, black 60%, rgba(0,0,0,0.45) 80%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 20%, black 40%, black 60%, rgba(0,0,0,0.45) 80%, transparent 100%)',
                  }}
                >
                  {/* Barra central fija de selección estilo iPhone */}
                  <div
                    aria-hidden="true"
                    style={{ height: WHEEL_ITEM_H }}
                    className="pointer-events-none absolute inset-x-2.5 top-1/2 -translate-y-1/2 rounded-[10px] bg-black/[0.08] dark:bg-white/[0.12] border border-[var(--mk-field-border)] shadow-inner z-0"
                  />

                  {/* 3 Tambores giratorios: Hora | : | Minutos | a.m./p.m. */}
                  <div className="grid grid-cols-11 items-center relative z-10">
                    <IOSWheelColumn
                      className="col-span-3"
                      items={HOURS_12}
                      selectedIndex={wheelHourIdx}
                      onSelect={(hIdx) => updateWheelTime(hIdx, wheelMinIdx, wheelPeriodIdx)}
                    />
                    <div className="col-span-1 flex items-center justify-center text-sm font-black text-[var(--mk-ink)] pb-0.5 select-none pointer-events-none">
                      :
                    </div>
                    <IOSWheelColumn
                      className="col-span-3"
                      items={MINUTES_60}
                      selectedIndex={wheelMinIdx}
                      onSelect={(mIdx) => updateWheelTime(wheelHourIdx, mIdx, wheelPeriodIdx)}
                    />
                    <IOSWheelColumn
                      className="col-span-4"
                      items={PERIODS}
                      selectedIndex={wheelPeriodIdx}
                      onSelect={(pIdx) => updateWheelTime(wheelHourIdx, wheelMinIdx, pIdx)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selector de CATEGORÍA: vacío por defecto; el botón '+' desaparece al abrir las opciones */}
          <div className="space-y-1.5 pt-0.5">
            <span className="mk-caption">Categoría:</span>

            {/* Si no hay categoría elegida y aún no se tocó '+', solo aparece el botón '+' */}
            {!selectedCategory && !showCategoryPicker && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  setShowCategoryPicker(true);
                }}
                className="w-7 h-7 rounded-full bg-black/[0.05] dark:bg-white/[0.08] border border-[var(--mk-field-border)] flex items-center justify-center text-[var(--mk-muted)] hover:text-[var(--mk-ink)] transition-colors"
                title="Agregar categoría"
                aria-label="Agregar categoría"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Si ya hay una categoría seleccionada y el selector está cerrado, mostrar la píldora (tocar para cambiar) */}
            {selectedCategory && !showCategoryPicker && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setShowCategoryPicker(true);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--mk-chip)] border border-[var(--mk-field-border)] active:scale-95 transition-transform"
                  title="Cambiar categoría"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        CATEGORIES.find((c) => c.label === selectedCategory)?.color || '#d62725',
                    }}
                  />
                  <span className="text-xs font-bold text-[var(--mk-ink)]">
                    {selectedCategory}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setSelectedCategory(null);
                  }}
                  className="w-6 h-6 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center text-[var(--mk-muted)] hover:text-[var(--mk-ink)]"
                  title="Quitar categoría"
                  aria-label="Quitar categoría"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Al tocar '+', desaparece el '+' y se muestran las opciones de categoría */}
            {showCategoryPicker && (
              <div className="flex flex-wrap gap-1.5 pt-0.5 animate-fade-in">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      setSelectedCategory(cat.label);
                      setShowCategoryPicker(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                      selectedCategory === cat.label
                        ? 'border-[var(--accent-warm)] bg-[var(--mk-tile)] text-[var(--mk-ink)]'
                        : 'border-[var(--mk-field-border)] bg-black/[0.03] dark:bg-white/[0.05] text-[var(--mk-muted)] hover:text-[var(--mk-ink)]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </LiquidGlassSheet>
    </div>
  );
}
