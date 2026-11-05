'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Droplets,
  Heart,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Mic,
  Plus,
  Check,
  CreditCard,
  Banknote,
  Delete,
  Toilet,
  Pizza,
  Salad,
  Coffee,
  ArrowRightLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountType, TransactionType, DebtType } from '@/types';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';
import LiquidSegmentedControl from '@/components/ui/liquid-glass/LiquidSegmentedControl';

export default function QuickCaptureSheet() {
  const {
    isCaptureSheetOpen,
    closeCaptureSheet,
    captureSheetInitialTab,
    captureSheetScoped,
    todayHabit,
    incrementPoop,
    addWater,
    addCalories,
    incrementLove,
    addTransaction,
    addDebt,
    payDebt,
    userDebts,
    triggerHaptic,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'habits' | 'finances' | 'nutrition'>(captureSheetInitialTab);

  // Sincronizar tab inicial cuando se abre el modal
  useEffect(() => {
    if (isCaptureSheetOpen) {
      setActiveTab(captureSheetInitialTab);
    }
  }, [isCaptureSheetOpen, captureSheetInitialTab]);

  // Tab Finanzas
  const [financeSubTab, setFinanceSubTab] = useState<'transaction' | 'loans'>('transaction');
  const [txType, setTxType] = useState<TransactionType>('EXPENSE');
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<AccountType>('Nu');
  const [concept, setConcept] = useState('');

  // Préstamos sub-state
  const [loanMode, setLoanMode] = useState<'create' | 'pay'>('create');
  const [loanContact, setLoanContact] = useState('');
  const [loanAmountStr, setLoanAmountStr] = useState('');
  const [loanType, setLoanType] = useState<DebtType>('THEY_OWE');
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [payAmountStr, setPayAmountStr] = useState('');

  // Tab Nutrición
  const [nutritionPrompt, setNutritionPrompt] = useState('');
  const [nutritionResult, setNutritionResult] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handler de teclado numérico de finanzas
  const handleKeypadPress = (val: string) => {
    triggerHaptic(20);
    if (val === 'backspace') {
      setAmountStr((prev) => prev.slice(0, -1));
    } else if (val === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => (prev === '' ? '0.' : prev + '.'));
      }
    } else {
      if (amountStr.length < 9) {
        setAmountStr((prev) => prev + val);
      }
    }
  };

  const handleSaveTransaction = () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;
    triggerHaptic(30);
    addTransaction({
      type: txType,
      amount,
      account: selectedAccount,
      concept: concept.trim() || undefined,
    });
    setAmountStr('');
    setConcept('');
    closeCaptureSheet();
  };

  const handleCreateLoan = () => {
    const amount = parseFloat(loanAmountStr);
    if (!loanContact.trim() || isNaN(amount) || amount <= 0) return;
    triggerHaptic(30);
    addDebt({
      contactName: loanContact.trim(),
      totalAmount: amount,
      type: loanType,
    });
    setLoanContact('');
    setLoanAmountStr('');
    closeCaptureSheet();
  };

  const handlePayLoan = () => {
    const amount = parseFloat(payAmountStr);
    if (!selectedDebtId || isNaN(amount) || amount <= 0) return;
    triggerHaptic(30);
    payDebt(selectedDebtId, amount);
    setPayAmountStr('');
    closeCaptureSheet();
  };

  // Estimador de Nutrición IA
  const handleAnalyzeNutrition = (customPrompt?: string) => {
    const text = customPrompt || nutritionPrompt;
    if (!text.trim()) return;
    setIsAnalyzing(true);
    triggerHaptic(35);

    setTimeout(() => {
      const query = text.toLowerCase();
      let cals = 380;
      let p = 22;
      let c = 38;
      let f = 14;

      if (query.includes('pizza')) {
        cals = 580;
        p = 24;
        c = 68;
        f = 22;
      } else if (query.includes('ensalada') || query.includes('salad')) {
        cals = 280;
        p = 18;
        c = 15;
        f = 14;
      } else if (query.includes('taco') || query.includes('tacos')) {
        cals = 520;
        p = 32;
        c = 44;
        f = 22;
      } else if (query.includes('huevo') || query.includes('egg') || query.includes('omelet')) {
        cals = 320;
        p = 22;
        c = 6;
        f = 18;
      } else if (query.includes('proteina') || query.includes('shake') || query.includes('licuado')) {
        cals = 240;
        p = 30;
        c = 18;
        f = 4;
      } else if (query.includes('café') || query.includes('cafe')) {
        cals = 180;
        p = 6;
        c = 24;
        f = 5;
      }

      setNutritionResult({
        calories: cals,
        protein: p,
        carbs: c,
        fat: f,
      });
      setIsAnalyzing(false);
    }, 550);
  };

  return (
    <LiquidGlassSheet
      isOpen={isCaptureSheetOpen}
      onClose={closeCaptureSheet}
      maxWidth="max-w-[370px]"
      isCenter={true}
      fullHeight={false}
    >
      {/* Cabecera compacta de isla flotante */}
      <div className="flex items-center justify-between px-4 pb-2 pt-3 border-b border-black/5 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_var(--accent-warm)] transition-colors duration-300"
            style={{ backgroundColor: 'var(--accent-warm)' }}
          />
          <h2 className="text-sm font-extrabold text-[var(--mk-ink)] dark:text-white tracking-tight">
            {captureSheetScoped
              ? activeTab === 'finances'
                ? 'Finanzas'
                : activeTab === 'nutrition'
                ? 'Nutrición'
                : 'Hábitos'
              : 'Captura Rápida'}
          </h2>
        </div>

        <button
          onClick={closeCaptureSheet}
          aria-label="Cerrar"
          className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-90 flex items-center justify-center text-neutral-500 hover:text-[var(--mk-ink)] dark:hover:text-white transition-all"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Barra de selección Glisse SegmentedControl (Hábitos | Finanzas | Nutrición) */}
      {!captureSheetScoped && (
      <div className="px-4 my-2 shrink-0">
        <LiquidSegmentedControl<'habits' | 'finances' | 'nutrition'>
          size="sm"
          value={activeTab}
          onChange={(next) => {
            triggerHaptic(15);
            setActiveTab(next);
          }}
          options={[
            { id: 'habits', label: 'Hábitos' },
            { id: 'finances', label: 'Finanzas' },
            { id: 'nutrition', label: 'Nutrición' },
          ]}
        />
      </div>
      )}

      {/* Área de contenido de la isla flotante (compacta y auto-ajustada al centro) */}
      <div className="px-4 pb-4 pt-0.5 overflow-y-auto no-scrollbar">
        {/* ========================================================= */}
        {/* PESTAÑA 1: HÁBITOS                                        */}
        {/* ========================================================= */}
        {activeTab === 'habits' && (
          <div className="space-y-2.5">
            {/* Digestión & Baño compacta */}
            <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  id="btn-poop"
                  type="button"
                  onClick={() => {
                    triggerHaptic(30);
                    incrementPoop();
                  }}
                  className="w-12 h-12 rounded-full bg-gradient-to-b from-black/[0.06] to-black/[0.12] dark:from-white/10 dark:to-white/5 border-2 border-[color:var(--accent-warm)]/40 flex items-center justify-center shadow-md active:scale-90 hover:scale-105 transition-all shrink-0"
                  title="Toca para registrar"
                >
                  <Toilet className="w-6 h-6 text-[color:var(--accent-warm)]" strokeWidth={1.9} />
                </button>
                <div>
                  <span className="text-xs font-bold text-[var(--mk-ink)] dark:text-white block">
                    Digestión & Baño
                  </span>
                  <span className="text-[11px] font-extrabold text-[color:var(--accent-warm)]">
                    Hoy: {todayHabit.poopCount} {todayHabit.poopCount === 1 ? 'vez' : 'veces'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(30);
                  incrementPoop();
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] text-[11px] font-extrabold shadow-sm active:scale-95 transition-all"
              >
                +1
              </button>
            </div>

            {/* Hidratación */}
            <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-[var(--mk-ink)] dark:text-white">
                    Hidratación
                  </span>
                </div>
                <span className="text-xs font-extrabold text-sky-500">
                  {todayHabit.waterMl} ml{' '}
                  <span className="text-[10px] text-neutral-400 font-normal">
                    ({(todayHabit.waterMl / 1000).toFixed(1)} L)
                  </span>
                </span>
              </div>

              {/* Barra de progreso de agua */}
              <div className="mk-track h-1.5 bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (todayHabit.waterMl / 2500) * 100)}%` }}
                />
              </div>

              {/* Fila horizontal de chips */}
              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                {[
                  { label: '+250ml', ml: 250 },
                  { label: '+500ml', ml: 500 },
                  { label: '+1L', ml: 1000 },
                  { label: '+1.5L', ml: 1500 },
                ].map((chip) => (
                  <button
                    key={chip.ml}
                    type="button"
                    onClick={() => {
                      triggerHaptic(20);
                      addWater(chip.ml);
                    }}
                    className="py-2 px-1 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 text-sky-600 dark:text-sky-300 text-[11px] font-extrabold hover:scale-105 active:scale-95 transition-all text-center shadow-sm"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Love & Conexión */}
            <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-rose-500/30 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center border border-rose-500/30 shrink-0">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--mk-ink)] dark:text-white leading-tight">
                    Love & Conexión
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Registros hoy: <span className="font-bold text-rose-500">{todayHabit.loveCount}</span>
                  </p>
                </div>
              </div>

              <button
                id="btn-love"
                type="button"
                onClick={() => {
                  triggerHaptic(40);
                  incrementLove();
                  confetti({
                    particleCount: 35,
                    spread: 60,
                    origin: { y: 0.8 },
                    colors: ['#e0458b', '#d62725', '#f67f00', '#2f8fdc'],
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-95 text-white font-extrabold text-[11px] shadow-md active:scale-95 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Registrar
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 2: FINANZAS (ISLA FLOTANTE COMPACTA)              */}
        {/* ========================================================= */}
        {activeTab === 'finances' && (
          <div className="space-y-2">
            {/* Sub-pestañas Glisse: Movimiento vs Préstamos */}
            <LiquidSegmentedControl<'transaction' | 'loans'>
              size="sm"
              value={financeSubTab}
              onChange={(next) => {
                triggerHaptic(15);
                setFinanceSubTab(next);
              }}
              options={[
                { id: 'transaction', label: 'Movimiento' },
                { id: 'loans', label: 'Préstamos' },
              ]}
            />

            {financeSubTab === 'transaction' ? (
              <>
                {/* Selector Gasto / Ingreso con Glisse SegmentedControl */}
                <LiquidSegmentedControl<TransactionType>
                  size="sm"
                  value={txType}
                  onChange={(next) => {
                    triggerHaptic(15);
                    setTxType(next);
                  }}
                  options={[
                    {
                      id: 'EXPENSE',
                      label: 'Gasto',
                      icon: <TrendingDown className="w-3 h-3" />,
                    },
                    {
                      id: 'INCOME',
                      label: 'Ingreso',
                      icon: <TrendingUp className="w-3 h-3" />,
                    },
                  ]}
                />

                {/* Display de Monto Compacto */}
                <div className="py-1.5 px-3 rounded-xl bg-black/[0.03] dark:bg-black/50 border border-black/8 dark:border-white/10 text-center shadow-inner shrink-0">
                  <div className="text-2xl font-black tracking-tight text-[var(--mk-ink)] dark:text-white leading-none">
                    ${amountStr || '0'}
                    <span className="text-[10px] text-neutral-400 font-bold ml-1 align-baseline">MXN</span>
                  </div>
                </div>

                {/* Selector de Cuenta Glisse: [Nu] [BBVA] [Efectivo] */}
                <LiquidSegmentedControl<AccountType>
                  size="sm"
                  value={selectedAccount}
                  onChange={(acc) => {
                    triggerHaptic(15);
                    setSelectedAccount(acc);
                  }}
                  options={[
                    { id: 'Nu', label: 'Nu', icon: <CreditCard className="w-3 h-3" /> },
                    { id: 'BBVA', label: 'BBVA', icon: <CreditCard className="w-3 h-3" /> },
                    { id: 'Efectivo', label: 'Efectivo', icon: <Banknote className="w-3 h-3" /> },
                  ]}
                />

                {/* Campo de Concepto compacto */}
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Concepto (ej. Despensa, Farmacia, Café)"
                  className="w-full h-8 px-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-xs text-[var(--mk-ink)] dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[var(--accent-warm)] shrink-0"
                />

                {/* Teclado numérico compacto */}
                <div className="grid grid-cols-3 gap-1 shrink-0">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypadPress(key)}
                      className="h-8 rounded-xl bg-black/[0.03] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.14] active:scale-90 text-sm font-bold text-[var(--mk-ink)] dark:text-white flex items-center justify-center transition-all border border-black/5 dark:border-white/10 shadow-xs"
                    >
                      {key === 'backspace' ? <Delete className="w-3.5 h-3.5 text-neutral-500" /> : key}
                    </button>
                  ))}
                </div>

                {/* Botón Guardar */}
                <button
                  type="button"
                  onClick={handleSaveTransaction}
                  disabled={!amountStr || parseFloat(amountStr) <= 0}
                  className="w-full h-9 rounded-xl bg-[var(--accent-warm)] hover:opacity-95 text-[color:var(--on-accent)] font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Registrar{' '}
                  {txType === 'EXPENSE' ? 'Gasto' : 'Ingreso'}
                  {amountStr && parseFloat(amountStr) > 0 ? ` ($${amountStr} MXN)` : ''}
                </button>
              </>
            ) : (
              /* Subpestaña Préstamos */
              <div className="flex-1 flex flex-col justify-between py-1 space-y-2.5">
                <LiquidSegmentedControl<'create' | 'pay'>
                  size="sm"
                  value={loanMode}
                  onChange={(next) => {
                    triggerHaptic(15);
                    setLoanMode(next);
                  }}
                  options={[
                    { id: 'create', label: 'Nuevo Préstamo' },
                    { id: 'pay', label: 'Liquidar Préstamo' },
                  ]}
                />

                {loanMode === 'create' ? (
                  <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-neutral-400 mb-1 block uppercase tracking-wider">
                          Nombre del contacto
                        </label>
                        <input
                          type="text"
                          value={loanContact}
                          onChange={(e) => setLoanContact(e.target.value)}
                          placeholder="ej. Carlos Martínez"
                          className="w-full h-9 px-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-xs text-[var(--mk-ink)] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-neutral-400 mb-1 block uppercase tracking-wider">
                          Monto total ($ MXN)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={loanAmountStr}
                          onChange={(e) => setLoanAmountStr(e.target.value)}
                          placeholder="1500"
                          className="w-full h-9 px-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-xs text-[var(--mk-ink)] dark:text-white"
                        />
                      </div>
                      <div className="pt-1">
                        <LiquidSegmentedControl<DebtType>
                          size="sm"
                          value={loanType}
                          onChange={(next) => {
                            triggerHaptic(15);
                            setLoanType(next);
                          }}
                          options={[
                            { id: 'THEY_OWE', label: 'Me deben a mí' },
                            { id: 'I_OWE', label: 'Yo debo' },
                          ]}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateLoan}
                      className="w-full h-11 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] font-extrabold text-xs shadow-md active:scale-[0.99] transition-all"
                    >
                      Crear Préstamo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <label className="text-[10px] font-extrabold text-neutral-400 mb-1 block uppercase tracking-wider">
                        Selecciona deuda activa
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {userDebts.filter((d) => d.status === 'ACTIVE').length === 0 ? (
                          <p className="text-xs text-neutral-400 text-center py-4">
                            No tienes deudas activas registradas.
                          </p>
                        ) : (
                          userDebts
                            .filter((d) => d.status === 'ACTIVE')
                            .map((debt) => (
                              <div
                                key={debt.id}
                                onClick={() => setSelectedDebtId(debt.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                                  selectedDebtId === debt.id
                                    ? 'bg-[var(--accent-warm)]/15 border-[var(--accent-warm)]'
                                    : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/8 dark:border-white/10'
                                }`}
                              >
                                <div className="flex justify-between text-xs">
                                  <span className="font-extrabold text-[var(--mk-ink)] dark:text-white">
                                    {debt.contactName}
                                  </span>
                                  <span
                                    className={`font-bold ${
                                      debt.type === 'THEY_OWE' ? 'text-emerald-500' : 'text-rose-500'
                                    }`}
                                  >
                                    {debt.type === 'THEY_OWE' ? 'Te debe' : 'Debes'}
                                  </span>
                                </div>
                                <div className="flex justify-between text-[11px] text-neutral-400 mt-0.5">
                                  <span>Pagado: ${debt.paidAmount}</span>
                                  <span>Pendiente: ${debt.totalAmount - debt.paidAmount}</span>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {selectedDebtId && (
                      <div className="space-y-2 pt-1 border-t border-black/8 dark:border-white/10">
                        <label className="text-[10px] font-extrabold text-neutral-400 block uppercase tracking-wider">
                          Monto a abonar ($ MXN)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={payAmountStr}
                          onChange={(e) => setPayAmountStr(e.target.value)}
                          placeholder="ej. 500"
                          className="w-full h-9 px-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-xs text-[var(--mk-ink)] dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handlePayLoan}
                          className="w-full h-11 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] font-extrabold text-xs shadow-md active:scale-[0.99] transition-all"
                        >
                          Registrar Abono
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 3: NUTRICIÓN                                      */}
        {/* ========================================================= */}
        {activeTab === 'nutrition' && (
          <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
            {/* Banner IA */}
            <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-[color:var(--accent-warm)]" />
                <h4 className="text-xs font-extrabold text-[var(--mk-ink)] dark:text-white">
                  Estimación Nutricional Inteligente
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                Escribe en lenguaje natural lo que comiste y el sistema calculará calorías y macronutrientes al instante.
              </p>
            </div>

            {/* Input de lenguaje natural + Micrófono */}
            <div className="relative">
              <textarea
                rows={3}
                value={nutritionPrompt}
                onChange={(e) => setNutritionPrompt(e.target.value)}
                placeholder="ej. 'Comí 2 rebanadas de pizza con queso y un vaso de agua mineral'"
                className="w-full p-3 pr-12 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-xs text-[var(--mk-ink)] dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[var(--accent-warm)] resize-none"
              />
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(25);
                  setNutritionPrompt('Comí 2 rebanadas de pizza con queso y una ensalada fresca');
                }}
                title="Simular dictado por voz"
                className="absolute right-2.5 bottom-2.5 p-2 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] active:scale-90 transition-all shadow-sm"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sugerencias de 1 toque */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { label: 'Pizza con queso', icon: Pizza, text: '2 rebanadas de pizza con queso' },
                { label: 'Ensalada pollo', icon: Salad, text: 'Ensalada con pechuga de pollo y aguacate' },
                { label: 'Café y tostada', icon: Coffee, text: 'Café con leche y 1 pan tostado con mermelada' },
              ].map((sug) => (
                <button
                  key={sug.label}
                  type="button"
                  onClick={() => {
                    setNutritionPrompt(sug.text);
                    handleAnalyzeNutrition(sug.text);
                  }}
                  className="px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/6 dark:border-white/10 text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0 active:scale-95 transition-all inline-flex items-center gap-1"
                >
                  <sug.icon className="w-3 h-3 text-[color:var(--accent-warm)]" />
                  {sug.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAnalyzeNutrition()}
              disabled={!nutritionPrompt.trim() || isAnalyzing}
              className="w-full h-11 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] font-extrabold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculando nutrientes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Calcular y Registrar
                </>
              )}
            </button>

            {/* Desglose de resultados */}
            {nutritionResult && (
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/8 dark:border-white/10 space-y-2.5 animate-sheet-up">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-300">
                    Estimación Total
                  </span>
                  <span className="text-xl font-black text-[color:var(--accent-warm)]">
                    {nutritionResult.calories} kcal
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-black/40 border border-black/6 dark:border-white/10">
                    <span className="text-[9px] text-neutral-400 block font-extrabold uppercase">Proteína</span>
                    <span className="text-xs font-black text-[var(--mk-ink)] dark:text-white">
                      {nutritionResult.protein}g
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-black/40 border border-black/6 dark:border-white/10">
                    <span className="text-[9px] text-neutral-400 block font-extrabold uppercase">Carbos</span>
                    <span className="text-xs font-black text-[var(--mk-ink)] dark:text-white">
                      {nutritionResult.carbs}g
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-black/40 border border-black/6 dark:border-white/10">
                    <span className="text-[9px] text-neutral-400 block font-extrabold uppercase">Grasas</span>
                    <span className="text-xs font-black text-[var(--mk-ink)] dark:text-white">
                      {nutritionResult.fat}g
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(40);
                    addCalories(nutritionResult.calories);
                    closeCaptureSheet();
                  }}
                  className="w-full h-10 rounded-xl bg-[var(--accent-warm)] text-[color:var(--on-accent)] text-xs font-extrabold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Confirmar en Métrica Diaria
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </LiquidGlassSheet>
  );
}
