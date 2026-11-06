'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  Clock,
  RefreshCw,
  Plus,
  ChevronRight,
  Target,
  Check,
  Trash2,
} from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';
import LoansView from './LoansView';
import MovementsView from './MovementsView';
import BanksView from './BanksView';
import FormSheet, { Field, SubmitButton, fieldClass } from './FormSheet';
import { longDate, money } from './format';

type FinanceScreen = 'main' | 'loans' | 'movements' | 'banks';

export default function FinancesView() {
  const {
    accountBalances,
    banks,
    userDebts,
    userTransactions,
    savingsGoals,
    addSavingsGoal,
    removeSavingsGoal,
    addSavingsContribution,
    openCaptureSheet,
    triggerHaptic,
  } = useApp();

  const [screen, setScreen] = useState<FinanceScreen>('main');

  // Crear ahorro
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // Aportar a un ahorro
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contribution, setContribution] = useState('');
  const contributeGoal = savingsGoals.find((g) => g.id === contributeId) ?? null;

  const go = (s: FinanceScreen) => {
    triggerHaptic(20);
    setScreen(s);
  };

  const closeCreate = () => {
    setIsCreatingGoal(false);
    setGoalName('');
    setGoalTarget('');
    setGoalDate('');
  };

  const submitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    if (!goalName.trim() || isNaN(target) || target <= 0) return;
    addSavingsGoal({
      name: goalName.trim(),
      targetAmount: target,
      targetDate: goalDate ? new Date(`${goalDate}T12:00:00`).toISOString() : '',
    });
    closeCreate();
  };

  const closeContribute = () => {
    setContributeId(null);
    setContribution('');
  };

  const submitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(contribution);
    if (!contributeId || isNaN(v) || v <= 0) return;
    addSavingsContribution(contributeId, v);
    closeContribute();
  };

  // Cuentas: Efectivo siempre + los bancos agregados
  const accounts = [
    { id: 'Efectivo', label: 'Efectivo', value: accountBalances.Efectivo, icon: Banknote, color: '' },
    ...banks.map((b) => ({
      id: b.id,
      label: b.name,
      value: accountBalances.byAccount[b.id] ?? b.initialBalance,
      icon: CreditCard,
      color: b.color,
    })),
  ];

  const activeLoans = userDebts.filter((d) => d.status === 'ACTIVE').length;

  const others = [
    {
      id: 'loans' as const,
      label: 'Préstamos',
      sub: activeLoans === 0 ? 'Sin préstamos' : `${activeLoans} activo${activeLoans === 1 ? '' : 's'}`,
      icon: Clock,
      tint: 'from-amber-400/25 to-orange-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'movements' as const,
      label: 'Movimientos',
      sub: userTransactions.length === 0 ? 'Sin registros' : `${userTransactions.length} registro${userTransactions.length === 1 ? '' : 's'}`,
      icon: RefreshCw,
      tint: 'from-sky-400/25 to-blue-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      id: 'banks' as const,
      label: 'Bancos',
      sub: banks.length === 0 ? 'Agrega uno' : `${banks.length} cuenta${banks.length === 1 ? '' : 's'}`,
      icon: CreditCard,
      tint: 'from-violet-400/25 to-purple-500/10 text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      <ScreenHeader
        title="Finanzas"
        icon={Wallet}
        onAdd={() => openCaptureSheet('finances')}
        addLabel="Registrar movimiento"
        addId="btn-finances-add"
      />

      {/* TARJETA HERO: saldo total + cuentas */}
      <section className="mk-hero p-4 pt-5 space-y-4" aria-label="Saldo total">
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/25 blur-2xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Saldo total</span>
          <p className="text-[32px] leading-none font-extrabold tracking-tight mt-1">
            {money(accountBalances.Total)} <span className="text-[13px] font-bold align-middle opacity-90">MXN</span>
          </p>
        </div>
        <div
          className={`relative z-10 ${
            accounts.length <= 3 ? `grid gap-2 ${accounts.length === 1 ? 'grid-cols-1' : accounts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}` : 'flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1'
          }`}
        >
          {accounts.map(({ id, label, value, icon: Icon, color }) => (
            <div
              key={id}
              className={`rounded-[14px] px-2.5 py-2.5 bg-white/24 dark:bg-black/22 backdrop-blur-md border border-white/45 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.28),inset_0_1.5px_0.5px_rgba(255,255,255,0.65)] text-[color:var(--on-accent)] ${
                accounts.length > 3 ? 'min-w-[108px] shrink-0' : ''
              }`}
            >
              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide opacity-90 truncate">
                {color ? <span className="w-2 h-2 rounded-full shrink-0 border border-white/60" style={{ backgroundColor: color }} /> : <Icon className="w-2.5 h-2.5" />}
                {label}
              </span>
              <span className="block text-[13px] font-extrabold mt-1 leading-none truncate">
                {money(value)} <span className="text-[7px] font-bold opacity-80">MXN</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* AHORROS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="mk-label">Ahorros</span>
          {savingsGoals.length > 0 && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(20);
                setIsCreatingGoal(true);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[color:var(--accent-warm)] active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Nuevo
            </button>
          )}
        </div>

        {savingsGoals.length === 0 ? (
          <button
            id="btn-create-savings"
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setIsCreatingGoal(true);
            }}
            className="w-full mk-card mk-card-press p-4 flex items-center gap-3 text-left group"
          >
            <span className="w-11 h-11 rounded-[14px] bg-[color-mix(in_srgb,var(--accent-warm)_14%,transparent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5 text-[color:var(--accent-warm)]" strokeWidth={2.1} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-extrabold text-[var(--mk-ink)]">Crear un ahorro</span>
              <span className="block text-[10.5px] text-[var(--mk-muted)] mt-0.5">Define una meta y ve cómo crece</span>
            </span>
            <span className="w-8 h-8 rounded-full bg-[var(--accent-warm)] text-[color:var(--on-accent)] flex items-center justify-center shadow-md shrink-0">
              <Plus className="w-4 h-4" strokeWidth={3} />
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            {savingsGoals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / Math.max(1, g.targetAmount)) * 100));
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    setContributeId(g.id);
                  }}
                  className="w-full mk-card mk-card-press p-3.5 space-y-2.5 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="mk-tile w-9 h-9 rounded-[12px] shrink-0">
                      <PiggyBank className="w-4 h-4 text-[color:var(--accent-warm)]" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12.5px] font-extrabold text-[var(--mk-ink)] truncate">{g.name}</span>
                      <span className="block text-[9.5px] font-semibold text-[var(--mk-muted)] truncate">
                        {money(g.currentAmount)} de {money(g.targetAmount)}
                        {g.targetDate ? ` · ${longDate(g.targetDate)}` : ''}
                      </span>
                    </span>
                    <span className="text-[15px] font-black text-[color:var(--accent-warm)] shrink-0">{pct}%</span>
                  </div>
                  <div className="relative h-[10px] rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-warm)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)] transition-all duration-700"
                      style={{ width: `${Math.max(pct, g.currentAmount > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* OTROS */}
      <section className="space-y-2">
        <span className="mk-label">Otros</span>
        <div className="grid grid-cols-3 gap-2.5">
          {others.map(({ id, label, sub, icon: Icon, tint }) => (
            <button
              key={id}
              id={`btn-finances-${id}`}
              type="button"
              onClick={() => go(id)}
              className="mk-card mk-card-press p-3 flex flex-col items-start gap-2.5 text-left group relative overflow-hidden"
            >
              <span className={`w-10 h-10 rounded-[14px] bg-gradient-to-br ${tint} flex items-center justify-center border border-white/40 dark:border-white/10 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" strokeWidth={2.1} />
              </span>
              <span className="w-full">
                <span className="flex items-center justify-between">
                  <span className="text-[11.5px] font-extrabold text-[var(--mk-ink)] truncate">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--mk-muted)] shrink-0" />
                </span>
                <span className="block text-[9.5px] font-semibold text-[var(--mk-muted)] mt-0.5 truncate">{sub}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Isla flotante: Préstamos / Movimientos / Bancos */}
      <LiquidGlassSheet isOpen={screen !== 'main'} onClose={() => go('main')} maxWidth="max-w-md" isCenter={true}>
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar max-h-[78dvh]">
          {screen === 'loans' && <LoansView onBack={() => go('main')} />}
          {screen === 'movements' && <MovementsView onBack={() => go('main')} />}
          {screen === 'banks' && <BanksView onBack={() => go('main')} />}
        </div>
      </LiquidGlassSheet>

      {/* Menú: crear ahorro */}
      <FormSheet isOpen={isCreatingGoal} onClose={closeCreate} title="Crear ahorro" icon={PiggyBank}>
        <form onSubmit={submitGoal} className="space-y-3">
          <Field label="¿Para qué ahorras?">
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="ej. Viaje, Fondo de emergencia"
              className={fieldClass}
              autoFocus
              required
            />
          </Field>
          <Field label="Meta ($ MXN)">
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder="10,000"
              className={fieldClass}
              required
            />
          </Field>
          <Field label="Fecha objetivo (opcional)">
            <input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} className={fieldClass} />
          </Field>
          <SubmitButton type="submit" disabled={!goalName.trim() || !(parseFloat(goalTarget) > 0)}>
            <Target className="w-3.5 h-3.5" strokeWidth={2.6} /> Crear ahorro
          </SubmitButton>
        </form>
      </FormSheet>

      {/* Menú: aportar a un ahorro */}
      <FormSheet isOpen={!!contributeGoal} onClose={closeContribute} title={contributeGoal?.name ?? 'Ahorro'} icon={PiggyBank}>
        {contributeGoal && (
          <form onSubmit={submitContribution} className="space-y-3">
            <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-center">
              <p className="text-2xl font-black text-[var(--mk-ink)] tracking-tight">{money(contributeGoal.currentAmount)}</p>
              <p className="text-[10px] font-semibold text-[var(--mk-muted)] mt-0.5">
                de {money(contributeGoal.targetAmount)} · faltan{' '}
                {money(Math.max(0, contributeGoal.targetAmount - contributeGoal.currentAmount))}
              </p>
            </div>
            <Field label="Aportar ($ MXN)">
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                placeholder="500"
                className={fieldClass}
                autoFocus
              />
            </Field>
            <SubmitButton type="submit" disabled={!(parseFloat(contribution) > 0)}>
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Aportar
            </SubmitButton>
            <button
              type="button"
              onClick={() => {
                removeSavingsGoal(contributeGoal.id);
                closeContribute();
              }}
              className="w-full h-9 rounded-xl text-[11px] font-bold text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar ahorro
            </button>
          </form>
        )}
      </FormSheet>
    </div>
  );
}
