'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Apple,
  GlassWater,
  Dumbbell,
  Lock,
  User as UserIcon,
  Calendar,
  Plus,
} from 'lucide-react';
import Image from 'next/image';
import { LiquidPill } from '@/components/ui/liquid-glass';

interface CyclicMetricRingProps {
  current: number;
  target: number;
  /** Paleta de colores por vuelta: [vuelta 1 (claro), vuelta 2 (medio), vuelta 3 (oscuro), ...] */
  lapColors: string[];
  bgTintClass: string;
  textColorClass: string;
  children: React.ReactNode;
}

/**
 * CyclicMetricRing
 * Anillo circular cíclico de línea ancha sin punto blanco:
 * - Empieza con un tono más claro en la primera vuelta (`lapColors[0]`).
 * - Con cada vuelta adicional (> 100%, > 200%, ...), la vuelta anterior queda fija de fondo
 *   y la nueva vuelta se dibuja encima con el siguiente tono más oscuro de `lapColors`
 *   (o en rojo para Calorías al pasar de la primera vuelta).
 */
function CyclicMetricRing({
  current,
  target,
  lapColors,
  bgTintClass,
  textColorClass,
  children,
}: CyclicMetricRingProps) {
  const safeTarget = target > 0 ? target : 1;
  const ratio = Math.max(0, current / safeTarget);

  // Número de vueltas completas previas y fracción de la vuelta actual (0..1]
  const completedLaps = ratio <= 1 ? 0 : Math.ceil(ratio) - 1;
  const activeFraction = ratio === 0 ? 0 : ratio - completedLaps;

  const getColorForLap = (lapIdx: number) =>
    lapColors[Math.min(Math.max(0, lapIdx), lapColors.length - 1)];

  const activeColor = getColorForLap(completedLaps);
  const previousLapColor = completedLaps > 0 ? getColorForLap(completedLaps - 1) : lapColors[0];

  const size = 60;
  const center = size / 2;
  const strokeWidth = 6.5;
  const radius = (size - strokeWidth) / 2 - 1; // 25.75
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - activeFraction);

  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0">
      {/* Círculo interior suave con el icono */}
      <div
        className={`w-10 h-10 rounded-full ${bgTintClass} ${textColorClass} flex items-center justify-center transition-transform group-hover:scale-105`}
      >
        {children}
      </div>

      {/* SVG del anillo circular cíclico ancho */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Pista base (en la primera vuelta) o el color completo de la vuelta anterior (en vueltas >= 2) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={previousLapColor}
          strokeWidth={strokeWidth}
          strokeOpacity={completedLaps > 0 ? 1 : 0.18}
        />

        {/* Arco activo de la vuelta en curso */}
        {activeFraction > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              transition:
                'stroke-dashoffset 0.45s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.3s ease',
            }}
          />
        )}
      </svg>
    </div>
  );
}

export default function DashboardView() {
  const {
    activeUser,
    authUser,
    nextImmediateEvent,
    allDayReminders,
    weeklyWorkoutsCount,
    workoutGoalPerWeek,
    todayHabit,
    setCurrentTab,
    triggerHaptic,
  } = useApp();

  const [greeting, setGreeting] = React.useState('BUENAS TARDES');

  React.useEffect(() => {
    try {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('BUENOS DÍAS');
      else if (hour < 19) setGreeting('BUENAS TARDES');
      else setGreeting('BUENAS NOCHES');
    } catch {
      // ignore
    }
  }, []);

  // Métricas de Salud calculadas (cíclicas, sin tope en 100%)
  // 1. Calorías (se vuelve rojo después de completar la primera vuelta)
  const caloriesConsumed = todayHabit.calories ?? 0;
  const caloriesTarget = 2200;
  const caloriesExceeded = caloriesConsumed > caloriesTarget;

  // 2. Agua (en litros)
  const waterLitersNum = todayHabit.waterMl > 0 ? todayHabit.waterMl / 1000 : 0;
  const waterLiters = waterLitersNum.toFixed(1);
  const waterTargetLiters = 2.5;

  // 3. Ejercicio semanal
  const workoutGoal = workoutGoalPerWeek || 3;
  const workoutCurrent = weeklyWorkoutsCount || 0;

  return (
    <div className="space-y-3.5 pb-20">
      {/* ========================================================= */}
      {/* HEADER: Saludo Contextual + Avatar Domo 3D                 */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold tracking-wider text-[color:var(--accent-warm)] uppercase block leading-none">
              {greeting}
            </span>
            {authUser?.isPaired && (
              <LiquidPill variant="frosted" size="xs" dotColor="#10b981">
                {`Sincro • ${authUser.partnerName}`}
              </LiquidPill>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--mk-ink)] tracking-tight mt-1 leading-none">
            {activeUser.displayName || 'Bienvenido'}
          </h1>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            triggerHaptic(20);
            setCurrentTab('settings');
          }}
          className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[color:var(--accent-warm)] p-0.5 lg-btn lg-btn-dome active:scale-95 transition-transform shrink-0 cursor-pointer"
          title="Ver perfil y ajustes"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-[var(--mk-tile)] flex items-center justify-center">
            {activeUser.avatarUrl ? (
              <Image
                src={activeUser.avatarUrl}
                alt={activeUser.displayName || 'Usuario'}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-[color:var(--accent-warm)]" />
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN 1: SALUD (Formato de 3 tarjetas con anillo cíclico) */}
      {/* ========================================================= */}
      <section className="space-y-1.5">
        <span className="mk-label">Salud</span>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Tarjeta 1: Calorías (Verde claro en 1ra vuelta -> Rojo al superar la 1ra vuelta) */}
          <div
            className="rounded-[20px] lg-shape-rounded lg-btn lg-btn-frosted p-3 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden"
          >
            <CyclicMetricRing
              current={caloriesConsumed}
              target={caloriesTarget}
              lapColors={['#34d399', '#ef4444', '#b91c1c', '#7f1d1d']}
              bgTintClass={caloriesExceeded ? 'bg-red-500/12' : 'bg-emerald-500/12'}
              textColorClass={
                caloriesExceeded
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            >
              <Apple className="w-5 h-5" strokeWidth={2.1} />
            </CyclicMetricRing>

            <span className="text-[11px] font-extrabold text-[var(--mk-ink)] leading-none mt-0.5">
              Calorías
            </span>
            <span
              className={`text-[9px] font-bold leading-none ${
                caloriesExceeded
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {caloriesConsumed.toLocaleString()}/{caloriesTarget.toLocaleString()} Cal
            </span>
          </div>

          {/* Tarjeta 2: Agua (Azul claro -> medio -> oscuro -> marino en cada vuelta) */}
          <div
            className="rounded-[20px] lg-shape-rounded lg-btn lg-btn-frosted p-3 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden"
          >
            <CyclicMetricRing
              current={waterLitersNum}
              target={waterTargetLiters}
              lapColors={['#7dd3fc', '#0ea5e9', '#0284c7', '#0369a1', '#1e3a8a']}
              bgTintClass="bg-sky-500/12"
              textColorClass="text-sky-500"
            >
              <GlassWater className="w-5 h-5" strokeWidth={2.1} />
            </CyclicMetricRing>

            <span className="text-[11px] font-extrabold text-[var(--mk-ink)] leading-none mt-0.5">
              Agua
            </span>
            <span className="text-[9px] font-bold text-sky-500 leading-none">
              {waterLiters}/{waterTargetLiters} L
            </span>
          </div>

          {/* Tarjeta 3: Ejercicio (Ámbar claro -> medio -> naranja intenso -> bronce oscuro en cada vuelta) */}
          <div
            className="rounded-[20px] lg-shape-rounded lg-btn lg-btn-frosted p-3 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden"
          >
            <CyclicMetricRing
              current={workoutCurrent}
              target={workoutGoal}
              lapColors={['#fcd34d', '#f59e0b', '#d97706', '#b45309', '#78350f']}
              bgTintClass="bg-amber-500/12"
              textColorClass="text-amber-500"
            >
              <Dumbbell className="w-5 h-5" strokeWidth={2.1} />
            </CyclicMetricRing>

            <span className="text-[11px] font-extrabold text-[var(--mk-ink)] leading-none mt-0.5">
              Ejercicio
            </span>
            <span className="text-[9px] font-bold text-amber-500 leading-none">
              {workoutCurrent}/{workoutGoal} sem
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN 2: AGENDA (Compacta: Solo el próximo evento)     */}
      {/* ========================================================= */}
      <section className="space-y-1.5">
        <span className="mk-label">Agenda</span>

        {nextImmediateEvent ? (
          <div
            className="mk-card mk-card-press p-3.5 relative overflow-hidden flex items-center justify-between"
          >
            {/* Reflejo diagonal especular */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/20 dark:bg-white/5 blur-xl"
            />

            {/* Contenido izquierdo */}
            <div className="min-w-0 pr-3 relative z-10">
              <h3 className="text-sm font-extrabold text-[var(--mk-ink)] truncate flex items-center gap-1.5">
                {nextImmediateEvent.isRedacted && <Lock className="w-3.5 h-3.5 text-[var(--mk-muted)]" />}
                {nextImmediateEvent.title}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-[var(--mk-muted)] font-medium">
                  <Clock className="w-3 h-3 text-[color:var(--accent-warm)]" />
                  {nextImmediateEvent.startTime}{' '}
                  {nextImmediateEvent.endTime ? `- ${nextImmediateEvent.endTime}` : ''}
                </span>

                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/30 dark:border-white/10"
                  style={{
                    backgroundColor: `${nextImmediateEvent.color || '#d62725'}22`,
                    color: nextImmediateEvent.color || 'var(--accent-warm)',
                  }}
                >
                  {nextImmediateEvent.category}
                </span>
              </div>
            </div>

            {/* Barra lateral derecha de color según mockup */}
            <div
              className="w-1.5 self-stretch rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: nextImmediateEvent.color || 'var(--accent-warm)' }}
            />
          </div>
        ) : (
          <div
            className="mk-card p-4 text-center transition-colors flex flex-col items-center justify-center gap-1.5 group"
          >
            <div className="w-9 h-9 rounded-full bg-[var(--mk-tile)] flex items-center justify-center text-[color:var(--accent-warm)] group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" strokeWidth={2.3} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--mk-ink)]">
                Sin eventos programados para hoy
              </p>
              <p className="text-[10px] text-[var(--mk-muted)] mt-0.5">
                Usa el botón + para registrar uno
              </p>
            </div>
          </div>
        )}

        {/* Carrusel de chips compactos para tareas de "Todo el día" (Píldoras Liquid Glass) */}
        {allDayReminders.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {allDayReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill shrink-0 active:scale-95 transition-all"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: reminder.color || 'var(--accent-warm)' }}
                />
                <span className="text-[11px] font-semibold text-[var(--mk-ink)] truncate max-w-[140px]">
                  {reminder.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
