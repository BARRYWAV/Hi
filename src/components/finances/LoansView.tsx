'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Clock, Check, DollarSign, PartyPopper } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { Debt } from '@/types';
import { dueDateOf, elapsedPct, longDate, money, shortDate } from './format';

/** Barra de tiempo: degradado verde → amarillo → rojo recortado al % transcurrido. */
function TimeBar({ pct, height = 'h-[7px]' }: { pct: number; height?: string }) {
  return (
    <div className={`mk-track ${height} flex-1`}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'linear-gradient(90deg, #2dbd6e 0%, #f5c242 50%, #e5484d 100%)' }}
      />
      <div
        className="absolute inset-y-0 right-0 bg-[var(--mk-track)] transition-all duration-700"
        style={{ width: `${100 - pct}%` }}
      />
    </div>
  );
}

function PayRow({ debt, onDone }: { debt: Debt; onDone: () => void }) {
  const { payDebt } = useApp();
  const [amount, setAmount] = useState('');
  const pending = debt.totalAmount - debt.paidAmount;
  const submit = () => {
    const v = parseFloat(amount);
    if (isNaN(v) || v <= 0) return;
    payDebt(debt.id, Math.min(v, pending));
    onDone();
  };
  return (
    <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
      <input
        className="mk-field"
        type="number"
        inputMode="decimal"
        placeholder={`Abono (máx ${money(pending)})`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <button
        type="button"
        onClick={submit}
        className="mk-rect px-4 py-2 text-[11px] font-bold bg-[var(--accent-warm)] text-[color:var(--on-accent)] shrink-0"
      >
        Abonar
      </button>
    </div>
  );
}

export default function LoansView({ onBack }: { onBack: () => void }) {
  const { userDebts, payDebt, openCaptureSheet, triggerHaptic } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);

  const active = userDebts.filter((d) => d.status === 'ACTIVE');
  const investments = active.filter((d) => d.type === 'THEY_OWE');
  const debts = active.filter((d) => d.type === 'I_OWE');

  const toggle = (id: string) => {
    triggerHaptic(15);
    setOpenId((cur) => (cur === id ? null : id));
  };

  const empty = (text: React.ReactNode) => (
    <div className="mk-card p-4 text-center text-[11px] text-[var(--mk-muted)]">{text}</div>
  );

  return (
    <motion.div
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-2"
    >
      <ScreenHeader title="Préstamos" icon={Clock} onBack={onBack} onAdd={() => openCaptureSheet('finances')} addLabel="Nuevo préstamo" />

      {/* INVERSIÓN: dinero que me deben */}
      <section className="space-y-2">
        <span className="mk-label">Inversión</span>
        {investments.length === 0
          ? empty('Nadie te debe dinero por ahora.')
          : investments.map((d) => {
              const due = dueDateOf(d);
              const pending = d.totalAmount - d.paidAmount;
              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(d.id)}
                  className="mk-card mk-card-press p-3 space-y-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold text-[var(--mk-muted)]">{shortDate(d.createdAt)}</span>
                    <TimeBar pct={elapsedPct(d.createdAt, due)} />
                    <span className="text-[9px] font-semibold text-[var(--mk-muted)]">{shortDate(due)}</span>
                    <button
                      type="button"
                      aria-label="Marcar como cobrado"
                      title="Marcar como cobrado"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic([40, 30, 60]);
                        payDebt(d.id, pending);
                      }}
                      className="w-5 h-5 ml-1 flex items-center justify-center bg-[var(--mk-tile)] text-[var(--mk-muted)] hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-[var(--mk-chip)] text-[11px] font-medium text-[var(--mk-ink)] truncate">
                      {d.notes ? `${d.notes} · ${d.contactName}` : `Préstamo a ${d.contactName}`}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[var(--mk-chip)] text-[12px] font-bold text-[var(--mk-ink)] whitespace-nowrap">
                      {money(pending)} <span className="text-[8px] text-[var(--mk-muted)]">MXN</span>
                    </span>
                  </div>
                  {openId === d.id && <PayRow debt={d} onDone={() => setOpenId(null)} />}
                </div>
              );
            })}
      </section>

      {/* DEUDA: dinero que yo debo */}
      <section className="space-y-2">
        <span className="mk-label">Deuda</span>
        {debts.length === 0
          ? empty(
              <span className="inline-flex items-center gap-1.5">
                No tienes deudas pendientes. <PartyPopper className="w-4 h-4" />
              </span>
            )
          : debts.map((d) => {
              const due = dueDateOf(d);
              const pending = d.totalAmount - d.paidAmount;
              const paidPct = Math.min(100, (d.paidAmount / Math.max(1, d.totalAmount)) * 100);
              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(d.id)}
                  className="mk-card mk-card-press p-3 space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[var(--mk-chip)] text-[11px] font-medium text-[var(--mk-ink)] truncate">
                      {d.contactName}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[color-mix(in_srgb,var(--accent-warm)_12%,transparent)] text-[11px] font-bold text-[color:var(--accent-warm)] whitespace-nowrap">
                      Debes {money(pending)}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-1.5 w-1/2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-[var(--mk-muted)] shrink-0" />
                        <TimeBar pct={elapsedPct(d.createdAt, due)} height="h-[6px]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-[var(--mk-muted)] shrink-0" />
                        <div className="mk-track h-[6px] flex-1">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${paidPct}%`, background: 'linear-gradient(90deg, #6ec6ff, #2f8fdc)' }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-[var(--mk-muted)] whitespace-nowrap">
                      Límite: {longDate(due)}
                    </span>
                  </div>
                  {openId === d.id && <PayRow debt={d} onDone={() => setOpenId(null)} />}
                </div>
              );
            })}
      </section>
    </motion.div>
  );
}
