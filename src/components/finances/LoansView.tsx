'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Clock, Check, PartyPopper, ArrowDownLeft, ArrowUpRight, CalendarClock, AlertTriangle } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { Debt } from '@/types';
import { dueDateOf, loanTiming, longDate, money, shortDate, type LoanTiming } from './format';

/**
 * Barra de tiempo dinámica (por días):
 * - El relleno avanza desde el día del préstamo hasta hoy.
 * - El degradado verde → amarillo → rojo está fijo a toda la pista, así el color
 *   que se ve depende de qué tan cerca está la fecha límite (a mitad: verde-amarillo).
 * - El día límite el relleno llega a la punta roja.
 * - Ya vencido: toda la barra en rojo con pulso.
 */
function TimeBar({ timing }: { timing: LoanTiming }) {
  const { pct, status } = timing;
  const overdue = status === 'overdue';
  const fill = Math.max(pct, 4);

  return (
    <div className="relative h-[10px] flex-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
      {/* Marcas de tercios */}
      <span aria-hidden className="absolute top-0 bottom-0 left-1/3 w-px bg-black/10 dark:bg-white/10" />
      <span aria-hidden className="absolute top-0 bottom-0 left-2/3 w-px bg-black/10 dark:bg-white/10" />

      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out ${overdue ? 'animate-pulse' : ''}`}
        style={{
          width: `${overdue ? 100 : fill}%`,
          background: overdue
            ? 'linear-gradient(90deg, #ef4444, #b91c1c)'
            : 'linear-gradient(90deg, #22c55e 0%, #a3d634 30%, #facc15 55%, #f97316 78%, #ef4444 100%)',
          backgroundSize: overdue ? '100% 100%' : `${(100 / fill) * 100}% 100%`,
          backgroundRepeat: 'no-repeat',
          boxShadow: overdue ? '0 0 10px rgba(239,68,68,0.55)' : 'inset 0 1px 1px rgba(255,255,255,0.45)',
        }}
      />

      {/* Indicador de "hoy" */}
      {!overdue && (
        <span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow-md transition-[left] duration-700"
          style={{
            left: `${fill}%`,
            borderColor: status === 'due' ? '#ef4444' : status === 'warning' ? '#f97316' : '#22c55e',
          }}
        />
      )}
    </div>
  );
}

const statusTone: Record<LoanTiming['status'], string> = {
  ok: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  warning: 'text-amber-600 dark:text-amber-400 bg-amber-500/12',
  due: 'text-red-600 dark:text-red-400 bg-red-500/12',
  overdue: 'text-white bg-red-500',
};

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
    <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
      <input
        className="mk-field"
        type="number"
        inputMode="decimal"
        placeholder={`Abono (máx ${money(pending)})`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        autoFocus
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

function LoanCard({
  debt,
  open,
  onToggle,
  onSettle,
}: {
  debt: Debt;
  open: boolean;
  onToggle: () => void;
  onSettle: () => void;
}) {
  const due = dueDateOf(debt);
  const timing = loanTiming(debt.createdAt, due);
  const pending = debt.totalAmount - debt.paidAmount;
  const paidPct = Math.min(100, (debt.paidAmount / Math.max(1, debt.totalAmount)) * 100);
  const theyOwe = debt.type === 'THEY_OWE';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      className={`mk-card mk-card-press p-3.5 space-y-3 cursor-pointer relative overflow-hidden ${
        timing.status === 'overdue' ? 'ring-1 ring-red-500/50' : ''
      }`}
    >
      {/* Encabezado: avatar + nombre + monto */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            theyOwe ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'
          }`}
        >
          {theyOwe ? <ArrowDownLeft className="w-5 h-5" strokeWidth={2.4} /> : <ArrowUpRight className="w-5 h-5" strokeWidth={2.4} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold text-[var(--mk-ink)] truncate leading-tight">{debt.contactName}</p>
          <p className="text-[10px] text-[var(--mk-muted)] truncate mt-0.5">
            {debt.notes || (theyOwe ? 'Te debe' : 'Le debes')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-[15px] font-black tracking-tight leading-none ${theyOwe ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--mk-ink)]'}`}>
            {money(pending)}
          </p>
          {debt.paidAmount > 0 && (
            <p className="text-[9px] text-[var(--mk-muted)] mt-1">de {money(debt.totalAmount)}</p>
          )}
        </div>
      </div>

      {/* Barra de tiempo */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-[var(--mk-muted)] tabular-nums">{shortDate(debt.createdAt)}</span>
          <TimeBar timing={timing} />
          <span className="text-[9px] font-bold text-[var(--mk-muted)] tabular-nums">{shortDate(due)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold ${statusTone[timing.status]}`}>
            {timing.status === 'overdue' || timing.status === 'due' ? (
              <AlertTriangle className="w-3 h-3" strokeWidth={2.6} />
            ) : (
              <CalendarClock className="w-3 h-3" strokeWidth={2.4} />
            )}
            {timing.label}
          </span>
          <span className="text-[9.5px] font-semibold text-[var(--mk-muted)]">Límite: {longDate(due)}</span>
        </div>
      </div>

      {/* Progreso de pago (si hay abonos) */}
      {debt.paidAmount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-[var(--mk-muted)] w-10">Pagado</span>
          <div className="relative h-[6px] flex-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${paidPct}%`, background: 'linear-gradient(90deg, #6ec6ff, #2f8fdc)' }}
            />
          </div>
          <span className="text-[9px] font-bold text-sky-500 w-8 text-right">{Math.round(paidPct)}%</span>
        </div>
      )}

      {/* Acciones al abrir */}
      {open && (
        <div className="space-y-2 pt-1 border-t border-black/5 dark:border-white/10" onClick={(e) => e.stopPropagation()}>
          <PayRow debt={debt} onDone={onToggle} />
          <button
            type="button"
            onClick={onSettle}
            className="w-full h-9 rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={3} /> {theyOwe ? 'Marcar como cobrado' : 'Marcar como pagado'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoansView({ onBack }: { onBack: () => void }) {
  const { userDebts, payDebt, openCaptureSheet, triggerHaptic } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);

  const active = userDebts.filter((d) => d.status === 'ACTIVE');
  const investments = active.filter((d) => d.type === 'THEY_OWE');
  const debts = active.filter((d) => d.type === 'I_OWE');
  const totalOwedToMe = investments.reduce((a, d) => a + d.totalAmount - d.paidAmount, 0);
  const totalIOwe = debts.reduce((a, d) => a + d.totalAmount - d.paidAmount, 0);

  const toggle = (id: string) => {
    triggerHaptic(15);
    setOpenId((cur) => (cur === id ? null : id));
  };

  const settle = (d: Debt) => {
    triggerHaptic([40, 30, 60]);
    payDebt(d.id, d.totalAmount - d.paidAmount);
    setOpenId(null);
  };

  const empty = (text: React.ReactNode) => (
    <div className="mk-card p-4 text-center text-[11px] text-[var(--mk-muted)]">{text}</div>
  );

  return (
    <div className="space-y-4 pb-2">
      <ScreenHeader
        title="Préstamos"
        icon={Clock}
        onBack={onBack}
        onAdd={() => openCaptureSheet('finances', true, 'loans')}
        addLabel="Nuevo préstamo"
      />

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="mk-card p-3">
          <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ArrowDownLeft className="w-3 h-3" strokeWidth={2.6} /> Me deben
          </span>
          <p className="text-[17px] font-black text-[var(--mk-ink)] mt-1 tracking-tight">{money(totalOwedToMe)}</p>
        </div>
        <div className="mk-card p-3">
          <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-red-500">
            <ArrowUpRight className="w-3 h-3" strokeWidth={2.6} /> Debo
          </span>
          <p className="text-[17px] font-black text-[var(--mk-ink)] mt-1 tracking-tight">{money(totalIOwe)}</p>
        </div>
      </div>

      {/* INVERSIÓN: dinero que me deben */}
      <section className="space-y-2">
        <span className="mk-label">Inversión</span>
        {investments.length === 0
          ? empty('Nadie te debe dinero por ahora.')
          : investments.map((d) => (
              <LoanCard key={d.id} debt={d} open={openId === d.id} onToggle={() => toggle(d.id)} onSettle={() => settle(d)} />
            ))}
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
          : debts.map((d) => (
              <LoanCard key={d.id} debt={d} open={openId === d.id} onToggle={() => toggle(d.id)} onSettle={() => settle(d)} />
            ))}
      </section>
    </div>
  );
}
