'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Wallet, CreditCard, Banknote, PiggyBank, Clock, RefreshCw } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';
import LoansView from './LoansView';
import MovementsView from './MovementsView';
import BanksView from './BanksView';
import { useCustomBanks } from './banks';
import { money } from './format';

type FinanceScreen = 'main' | 'loans' | 'movements' | 'banks';

export default function FinancesView() {
  const { accountBalances, savingsGoal, addSavingsContribution, openCaptureSheet, triggerHaptic } = useApp();
  const { customTotal } = useCustomBanks();

  const [screen, setScreen] = useState<FinanceScreen>('main');
  const [showContribute, setShowContribute] = useState(false);
  const [contribution, setContribution] = useState('');

  const go = (s: FinanceScreen) => {
    triggerHaptic(20);
    setScreen(s);
  };

  const total = accountBalances.Total + customTotal;
  const savingsPct = Math.min(100, Math.round((savingsGoal.currentAmount / Math.max(1, savingsGoal.targetAmount)) * 100));

  const submitContribution = () => {
    const v = parseFloat(contribution);
    if (isNaN(v) || v <= 0) return;
    addSavingsContribution(v);
    setContribution('');
    setShowContribute(false);
  };

  const accounts = [
    { label: 'NU', value: accountBalances.Nu, icon: CreditCard },
    { label: 'BBVA', value: accountBalances.BBVA, icon: CreditCard },
    { label: 'Efectivo', value: accountBalances.Efectivo, icon: Banknote },
  ];

  const others = [
    { id: 'loans' as const, label: 'Préstamos', icon: Clock },
    { id: 'movements' as const, label: 'Movimientos', icon: RefreshCw },
    { id: 'banks' as const, label: 'Bancos', icon: CreditCard },
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

      {/* TARJETA HERO: saldo total + 3 mini-tarjetas translúcidas */}
      <section className="mk-hero p-4 pt-5 space-y-4" aria-label="Saldo total">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/25 blur-2xl"
        />
        <div className="relative z-10 flex items-baseline justify-between">
          <p className="text-[32px] leading-none font-extrabold tracking-tight">
            {money(total)} <span className="text-[13px] font-bold align-middle opacity-90">MXN</span>
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-2">
          {accounts.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-[14px] px-2.5 py-2.5 bg-white/24 dark:bg-black/22 backdrop-blur-md border border-white/45 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.28),inset_0_1.5px_0.5px_rgba(255,255,255,0.65)] text-[color:var(--on-accent)] transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide opacity-90">
                <Icon className="w-2.5 h-2.5" /> {label}
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
        <span className="mk-label">Ahorros</span>
        <motion.div
          id="card-savings"
          layout
          transition={{ duration: 0.3 }}
          role="button"
          tabIndex={0}
          onClick={() => setShowContribute((v) => !v)}
          className="mk-card mk-card-press p-3.5 space-y-2.5 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="mk-tile w-8 h-8 rounded-[12px]">
              <PiggyBank className="w-4 h-4 text-[color:var(--accent-warm)]" />
            </span>
            <span className="text-[12px] font-bold text-[color:var(--accent-warm)] truncate flex-1">{savingsGoal.name}</span>
            <span className="text-[9px] font-semibold text-[var(--mk-muted)] whitespace-nowrap">
              {money(savingsGoal.currentAmount).replace('.00', '')} MXN / {money(savingsGoal.targetAmount).replace('.00', '')} MXN
            </span>
          </div>
          <div className="mk-track h-[14px]">
            <div
              className="h-full rounded-full bg-[var(--accent-warm)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)] flex items-center justify-center transition-all duration-700 min-w-[34px]"
              style={{ width: `${savingsPct}%` }}
            >
              <span className="text-[8px] font-bold text-[color:var(--on-accent)]">{savingsPct}%</span>
            </div>
          </div>

          <AnimatePresence>
            {showContribute && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 pt-1 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  id="input-savings-contribution"
                  className="mk-field"
                  type="number"
                  inputMode="decimal"
                  placeholder="Aportar ($ MXN)"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitContribution()}
                />
                <button
                  id="btn-savings-contribute"
                  type="button"
                  onClick={submitContribution}
                  className="mk-rect px-4 py-2 text-[11px] font-bold lg-btn lg-btn-accent shrink-0"
                >
                  Aportar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* OTROS (Disparadores que abren mini-menú flotante en el centro) */}
      <section className="space-y-2">
        <span className="mk-label">Otros</span>
        <div className="mk-card p-4 grid grid-cols-3 gap-3">
          {others.map(({ id, label, icon: Icon }) => (
            <motion.div
              key={id}
              id={`btn-finances-${id}`}
              transition={{ duration: 0.3 }}
              role="button"
              tabIndex={0}
              onClick={() => go(id)}
              className="rounded-[20px] lg-btn lg-btn-frosted py-3.5 px-2 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <span className="mk-tile w-13 h-13 rounded-[18px] group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6 text-[color:var(--accent-warm)]" strokeWidth={1.9} />
              </span>
              <span className="text-[10px] font-extrabold text-[var(--mk-ink)]">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Isla flotante centrada para el mini-menú de Finanzas (Préstamos / Movimientos / Bancos) */}
      <LiquidGlassSheet
        isOpen={screen !== 'main'}
        onClose={() => go('main')}
        maxWidth="max-w-md"
        isCenter={true}
      >
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar max-h-[78dvh]">
          {screen === 'loans' && <LoansView onBack={() => go('main')} />}
          {screen === 'movements' && <MovementsView onBack={() => go('main')} />}
          {screen === 'banks' && <BanksView onBack={() => go('main')} />}
        </div>
      </LiquidGlassSheet>
    </div>
  );
}
