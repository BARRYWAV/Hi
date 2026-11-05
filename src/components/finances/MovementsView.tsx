'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { FileClock, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import LiquidSegmentedControl from '@/components/ui/liquid-glass/LiquidSegmentedControl';
import { dayMonth, money } from './format';

export default function MovementsView({ onBack }: { onBack: () => void }) {
  const { userTransactions, openCaptureSheet, triggerHaptic } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const filtered = userTransactions.filter((tx) => {
    if (filter === 'ALL') return true;
    return tx.type === filter;
  });

  return (
    <motion.div
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-2"
    >
      <ScreenHeader
        title="Movimientos"
        icon={FileClock}
        onBack={onBack}
        onAdd={() => openCaptureSheet('finances')}
        addLabel="Nuevo movimiento"
      />

      {/* Barra de selección Glisse: Todos | Ingresos | Gastos */}
      <LiquidSegmentedControl<'ALL' | 'INCOME' | 'EXPENSE'>
        size="sm"
        value={filter}
        onChange={(next) => {
          triggerHaptic(15);
          setFilter(next);
        }}
        options={[
          { id: 'ALL', label: 'Todos' },
          { id: 'INCOME', label: 'Ingresos' },
          { id: 'EXPENSE', label: 'Gastos' },
        ]}
      />

      {/* Lista vertical de tarjetas limpias (concepto, fecha, monto, flechas de color) */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="mk-card p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[var(--mk-tile)] flex items-center justify-center mx-auto text-[color:var(--accent-warm)]">
              <FileClock className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <p className="text-xs font-bold text-[var(--mk-ink)]">
              No hay movimientos registrados
            </p>
            <p className="text-[11px] text-[var(--mk-muted)]">
              Toca el botón + para registrar tu primer gasto o ingreso.
            </p>
            <button
              type="button"
              onClick={() => openCaptureSheet('finances')}
              className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--accent-warm)] text-[color:var(--on-accent)] font-bold text-[11px] shadow-sm active:scale-95 transition-transform"
            >
              + Nuevo movimiento
            </button>
          </div>
        ) : (
          filtered.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            const isTransfer = (tx.concept || '').toLowerCase().includes('transfer') || (tx.category || '').toLowerCase().includes('transfer');

            return (
              <div
                key={tx.id}
                className="mk-card p-3.5 flex items-center justify-between gap-3 transition-transform active:scale-[0.99]"
              >
                {/* Lado izquierdo: Ícono circular de flecha + Concepto & Banco */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isTransfer
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                        : isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-950/40 text-[color:var(--accent-warm)]'
                    }`}
                  >
                    {isTransfer ? (
                      <ArrowLeftRight className="w-5 h-5" strokeWidth={2.2} />
                    ) : isIncome ? (
                      <ArrowUpRight className="w-5 h-5" strokeWidth={2.4} />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" strokeWidth={2.4} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--mk-ink)] truncate leading-tight">
                      {tx.concept || (isIncome ? 'Ingreso' : 'Gasto')}
                    </p>
                    <p className="text-[10px] text-[var(--mk-muted)] mt-0.5 truncate">
                      {tx.account || 'Banco'} {tx.category ? `• ${tx.category}` : ''}
                    </p>
                  </div>
                </div>

                {/* Lado derecho: Monto con signo y Fecha */}
                <div className="text-right shrink-0">
                  <p
                    className={`text-xs font-extrabold tracking-tight ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[color:var(--accent-warm)]'
                    }`}
                  >
                    {isIncome ? '+ ' : '- '}
                    {money(tx.amount)}
                  </p>
                  <p className="text-[10px] text-[var(--mk-muted)] mt-0.5">
                    {dayMonth(tx.date)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
