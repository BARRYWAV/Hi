'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Apple,
  GlassWater,
  Dumbbell,
  Lock,
  User as UserIcon,
  Calendar,
  Wifi,
  Repeat,
} from 'lucide-react';
import Image from 'next/image';
import { LiquidCard } from '@/components/ui/liquid-glass';
import { useCustomBanks } from '@/components/finances/banks';
import { money } from '@/components/finances/format';

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

interface DashboardCardItem {
  id: string;
  name: string;
  subtitle: string;
  balance: number;
  number: string;
  network: string;
  /** Gradiente translúcido Liquid Glass para la tarjeta frontal */
  glassTint: string;
  /** Borde luminoso perimetral */
  glassBorder: string;
  /** Sombra coloreada de contacto */
  glowShadow: string;
  /** Color de la tarjeta cuando se asoma por detrás en la pila */
  backPeekBg: string;
}

export default function DashboardView() {
  const {
    activeUser,
    authUser,
    accountBalances,
    nextImmediateEvent,
    allDayReminders,
    weeklyWorkoutsCount,
    workoutGoalPerWeek,
    todayHabit,
    setCurrentTab,
    openCaptureSheet,
    triggerHaptic,
  } = useApp();

  const { banks: customBanks } = useCustomBanks();
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [greeting, setGreeting] = useState('BUENAS TARDES');

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

  // Tarjetas con estética Liquid Glass (cristal esmerilado teñido + refracción especular)
  const walletCards = useMemo<DashboardCardItem[]>(() => {
    const base: DashboardCardItem[] = [
      {
        id: 'card-bbva',
        name: 'BBVA',
        subtitle: ' Cuenta Débito',
        balance: accountBalances.BBVA,
        number: '0000  1234  9999  2344',
        network: 'Visa',
        glassTint:
          'linear-gradient(135deg, rgba(147, 197, 253, 0.58) 0%, rgba(59, 154, 225, 0.72) 50%, rgba(29, 111, 184, 0.84) 100%)',
        glassBorder: 'rgba(191, 219, 254, 0.72)',
        glowShadow: '0 18px 36px -10px rgba(29, 111, 184, 0.42)',
        backPeekBg:
          'linear-gradient(135deg, rgba(59, 154, 225, 0.85) 0%, rgba(29, 78, 216, 0.92) 100%)',
      },
      {
        id: 'card-nu',
        name: 'Nu',
        subtitle: 'Cuenta & Cajita',
        balance: accountBalances.Nu,
        number: '5204  8812  4091  7731',
        network: 'Mastercard',
        glassTint:
          'linear-gradient(135deg, rgba(216, 180, 254, 0.56) 0%, rgba(138, 63, 252, 0.72) 50%, rgba(88, 28, 135, 0.84) 100%)',
        glassBorder: 'rgba(233, 213, 255, 0.70)',
        glowShadow: '0 18px 36px -10px rgba(138, 63, 252, 0.42)',
        backPeekBg:
          'linear-gradient(135deg, rgba(239, 68, 68, 0.85) 0%, rgba(214, 39, 37, 0.92) 100%)',
      },
      {
        id: 'card-efectivo',
        name: 'Efectivo',
        subtitle: 'Liquidez inmediata',
        balance: accountBalances.Efectivo,
        number: '••••  ••••  ••••  CASH',
        network: 'Disponible',
        glassTint:
          'linear-gradient(135deg, rgba(110, 231, 183, 0.56) 0%, rgba(16, 185, 129, 0.72) 50%, rgba(4, 120, 87, 0.84) 100%)',
        glassBorder: 'rgba(167, 243, 208, 0.72)',
        glowShadow: '0 18px 36px -10px rgba(16, 185, 129, 0.38)',
        backPeekBg:
          'linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(4, 120, 87, 0.92) 100%)',
      },
    ];

    const extras: DashboardCardItem[] = customBanks.map((b, i) => ({
      id: b.id,
      name: b.name,
      subtitle: b.kind === 'TC' ? 'Tarjeta Crédito' : 'Tarjeta Débito',
      balance: b.balance,
      number: `4152  310${i}  8842  ${1090 + i}`,
      network: b.kind === 'TC' ? 'Visa' : 'Visa Débito',
      glassTint: `linear-gradient(135deg, color-mix(in srgb, ${b.color} 52%, rgba(255,255,255,0.65)) 0%, color-mix(in srgb, ${b.color} 76%, transparent) 55%, color-mix(in srgb, ${b.color} 86%, #000000 14%) 100%)`,
      glassBorder: `color-mix(in srgb, ${b.color} 50%, #ffffff 50%)`,
      glowShadow: `0 18px 36px -10px color-mix(in srgb, ${b.color} 45%, transparent)`,
      backPeekBg: `linear-gradient(135deg, ${b.color} 0%, color-mix(in srgb, ${b.color} 80%, #000000 20%) 100%)`,
    }));

    return [...base, ...extras];
  }, [accountBalances, customBanks]);

  const safeIdx = activeCardIdx % walletCards.length;
  const currentCard = walletCards[safeIdx];
  const nextCard = walletCards[(safeIdx + 1) % walletCards.length];

  const handleNextCard = () => {
    triggerHaptic(25);
    setActiveCardIdx((prev) => (prev + 1) % walletCards.length);
  };

  // Métricas de Salud calculadas (cíclicas, sin tope en 100%)
  const caloriesConsumed = todayHabit.calories ?? 0;
  const caloriesTarget = 2200;
  const caloriesExceeded = caloriesConsumed > caloriesTarget;

  const waterLitersNum = todayHabit.waterMl > 0 ? todayHabit.waterMl / 1000 : 0;
  const waterLiters = waterLitersNum.toFixed(1);
  const waterTargetLiters = 2.5;

  const workoutGoal = workoutGoalPerWeek || 3;
  const workoutCurrent = weeklyWorkoutsCount || 0;

  return (
    <div className="space-y-5 pb-20">
      {/* ========================================================= */}
      {/* FILA 1: Saludo Contextual + Cápsula Liquid Glass Derecha  */}
      {/* ========================================================= */}
      <div className="flex items-stretch justify-between gap-3 pt-1">
        {/* Columna izquierda: BUENAS TARDES / Nombre */}
        <div className="flex flex-col justify-center shrink-0">
          <span className="text-[11px] font-extrabold tracking-wider text-[color:var(--accent-warm)] uppercase block leading-none">
            {greeting}
          </span>
          <h1 className="text-[26px] font-black text-[var(--mk-ink)] tracking-tight mt-1 leading-none">
            {activeUser.displayName || 'Alejandro'}
          </h1>
        </div>

        {/* Cápsula Liquid Glass derecha: muestra próximo evento o estado + avatar */}
        <LiquidCard
          variant="frosted"
          cornerRadius={18}
          interactive
          onClick={() => {
            triggerHaptic(20);
            setCurrentTab(nextImmediateEvent ? 'calendar' : 'settings');
          }}
          className="flex-1 min-w-0 max-w-[215px] min-h-[54px] px-3 py-2 flex items-center justify-between gap-2"
          title={nextImmediateEvent ? 'Ver en Calendario' : 'Ver perfil y ajustes'}
        >
          {nextImmediateEvent ? (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-[color:var(--accent-warm)]">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{nextImmediateEvent.startTime || 'Hoy'}</span>
              </div>
              <p className="text-[11px] font-extrabold text-[var(--mk-ink)] truncate mt-0.5 flex items-center gap-1">
                {nextImmediateEvent.isRedacted && (
                  <Lock className="w-2.5 h-2.5 text-[var(--mk-muted)] shrink-0" />
                )}
                <span className="truncate">{nextImmediateEvent.title}</span>
              </p>
            </div>
          ) : (
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--mk-muted)] block leading-none">
                {authUser?.isPaired ? `Sincro • ${authUser.partnerName}` : 'Agenda de hoy'}
              </span>
              <p className="text-[11px] font-bold text-[var(--mk-ink)] truncate mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[color:var(--accent-warm)] shrink-0" />
                <span>Sin eventos</span>
              </p>
            </div>
          )}

          {/* Avatar circular con bisel Domo */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic(20);
              setCurrentTab('settings');
            }}
            className="w-8 h-8 rounded-full overflow-hidden border border-[color:var(--accent-warm)]/60 bg-[var(--mk-tile)] flex items-center justify-center shrink-0 shadow-sm"
            title="Ajustes y Perfil"
          >
            {activeUser.avatarUrl ? (
              <Image
                src={activeUser.avatarUrl}
                alt={activeUser.displayName || 'Usuario'}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-[color:var(--accent-warm)]" />
            )}
          </div>
        </LiquidCard>
      </div>

      {/* ========================================================= */}
      {/* FILA 2: Tarjetas Bancarias Liquid Glass + Switcher Lateral */}
      {/* ========================================================= */}
      <section aria-label="Tarjetas bancarias" className="pt-0.5">
        <div className="flex items-start gap-2.5">
          {/* Pila de Tarjetas Liquid Glass (Izquierda) */}
          <div className="relative flex-1 min-w-0 pb-3.5 pr-3">
            {/* Tarjeta trasera (segunda tarjeta) asomándose abajo y a la derecha */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 bottom-3.5 right-3 translate-x-3 translate-y-3.5 rounded-[22px] backdrop-blur-xl transition-all duration-300 z-0"
              style={{
                background:
                  safeIdx === 0
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.88) 0%, rgba(214, 39, 37, 0.95) 100%)'
                    : nextCard.backPeekBg,
                border: '1px solid rgba(255, 255, 255, 0.42)',
                boxShadow:
                  '0 12px 24px -8px rgba(0, 0, 0, 0.28), inset 0 1px 0.5px rgba(255, 255, 255, 0.5)',
              }}
            />

            {/* Tarjeta frontal activa con refracción Liquid Glass */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, x: 20, scale: 0.96, rotateY: -6 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.96, rotateY: 6 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                role="button"
                tabIndex={0}
                onClick={() => {
                  triggerHaptic(20);
                  setCurrentTab('finances');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    triggerHaptic(20);
                    setCurrentTab('finances');
                  }
                }}
                className="relative z-10 rounded-[22px] p-4 h-[154px] flex flex-col justify-between cursor-pointer select-none overflow-hidden backdrop-blur-2xl saturate-[190%] active:scale-[0.985] transition-transform"
                style={{
                  background: `linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.04) 42%, transparent 100%), ${currentCard.glassTint}`,
                  border: `1px solid ${currentCard.glassBorder}`,
                  boxShadow: `${currentCard.glowShadow}, inset 0 2px 1px 0 rgba(255, 255, 255, 0.78), inset 0 0 0 1px rgba(255, 255, 255, 0.24), inset 0 -10px 22px -12px rgba(0, 20, 40, 0.28)`,
                }}
                title="Toca para abrir Finanzas"
              >
                {/* Destello diagonal de refracción de cristal */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -left-12 w-48 h-48 rounded-full bg-white/35 blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.24)_36%,transparent_50%)]"
                />

                {/* Fila superior: Nombre del banco en cápsula de cristal + Saldo */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.8)] text-[14px] font-black tracking-tight text-[#041827] leading-none">
                      {currentCard.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[20px] font-black tracking-tight text-[#041827] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] leading-none">
                      {money(currentCard.balance).replace('.00', '')}
                    </span>
                  </div>
                </div>

                {/* Fila central: Chip EMV de cristal/metal + Contactless */}
                <div className="relative z-10 flex items-center justify-between my-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-7 rounded-[7px] bg-gradient-to-br from-white/85 via-slate-200/80 to-slate-400/75 backdrop-blur-md border border-white/70 shadow-[0_2px_6px_rgba(0,0,0,0.15),inset_0_1px_1px_#ffffff] relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-600/30" />
                      <div className="absolute inset-y-0 left-1/3 w-[1px] bg-slate-600/30" />
                      <div className="absolute inset-y-0 right-1/3 w-[1px] bg-slate-600/30" />
                      <div className="w-3.5 h-3.5 rounded-[3px] border border-slate-600/30 bg-amber-200/30" />
                    </div>
                    <Wifi className="w-4 h-4 rotate-90 text-[#041827]/70" strokeWidth={2.3} />
                  </div>

                  {/* Subtítulo discreto de la cuenta */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#041827]/65 px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-sm">
                    {currentCard.subtitle}
                  </span>
                </div>

                {/* Fila inferior: Numeración + Marca de red (Visa / Mastercard) */}
                <div className="relative z-10 flex items-end justify-between gap-2 pt-0.5">
                  <p className="text-[13.5px] sm:text-[15px] font-bold tracking-[0.06em] text-[#041827]/90 font-mono leading-none truncate">
                    {currentCard.number}
                  </p>
                  <span className="text-[15px] font-black italic tracking-tight text-[#041827] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)] leading-none shrink-0">
                    {currentCard.network}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Píldora Vertical Interactiva para intercambiar tarjetas (Formato Cápsula Stadium + Domo Circular) */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={handleNextCard}
            aria-label="Intercambiar tarjeta bancaria"
            title={`Cambiar a ${nextCard.name}`}
            style={{ height: 170 }}
            className="relative z-20 w-[50px] h-[170px] min-h-[170px] shrink-0 rounded-full liquid-glass-pill lg-btn lg-btn-frosted p-2 flex flex-col items-center justify-between cursor-pointer group select-none"
          >
            {/* Indicadores verticales de las tarjetas en la pila */}
            <div className="flex flex-col items-center gap-1.5 pt-2">
              {walletCards.map((c, idx) => {
                const isActive = idx === safeIdx;
                return (
                  <span
                    key={c.id}
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-2 h-5 bg-[color:var(--accent-warm)] shadow-[0_0_8px_var(--accent-warm)]'
                        : 'w-1.5 h-1.5 bg-[var(--mk-muted)]/40 group-hover:bg-[var(--mk-muted)]/70'
                    }`}
                  />
                );
              })}
            </div>

            {/* Botón redondito con cristal puro Liquid Glass (sin tinte amarillo) */}
            <motion.div
              key={safeIdx}
              initial={{ rotate: -90, scale: 0.85 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className="relative w-9 h-9 rounded-full lg-btn lg-btn-clear lg-btn-dome flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden"
            >
              {/* Reflejo especular superior de gota de cristal */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0.5 inset-x-1.5 h-2.5 rounded-full bg-gradient-to-b from-white/80 to-transparent blur-[0.5px]"
              />
              <Repeat
                className="relative z-10 w-4 h-4 text-[var(--mk-ink)] opacity-80 group-hover:opacity-100 transition-opacity"
                strokeWidth={2.4}
              />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FILA 3: SALUD (Contenedor Liquid Glass con las 3 métricas) */}
      {/* ========================================================= */}
      <LiquidCard variant="frosted" cornerRadius={22} className="mt-7 p-3.5 space-y-2.5">
        <span className="mk-label">Salud</span>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Tarjeta 1: Calorías */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openCaptureSheet('nutrition', false)}
            className="rounded-[20px] lg-shape-rounded lg-btn lg-btn-frosted p-3 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden cursor-pointer"
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

          {/* Tarjeta 2: Agua */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openCaptureSheet('habits', false)}
            className="rounded-[20px] lg-shape-rounded lg-btn lg-btn-frosted p-3 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden cursor-pointer"
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

          {/* Tarjeta 3: Ejercicio */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCurrentTab('workout')}
            className="rounded-[20px] lg-shape-rounded lg-btn lg-btn-frosted p-3 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden cursor-pointer"
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
      </LiquidCard>

      {/* Carrusel de chips compactos si existen recordatorios de "Todo el día" */}
      {allDayReminders.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {allDayReminders.map((reminder) => (
            <div
              key={reminder.id}
              onClick={() => setCurrentTab('calendar')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill shrink-0 active:scale-95 transition-all cursor-pointer"
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
    </div>
  );
}
