'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditCard, Trash2, Wifi, Landmark, Check } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import LiquidSegmentedControl from '@/components/ui/liquid-glass/LiquidSegmentedControl';
import FormSheet, { Field, SubmitButton, fieldClass } from './FormSheet';
import { BANK_COLORS, cardGradient } from './banks';
import { money } from './format';

export default function BanksView({ onBack }: { onBack: () => void }) {
  const { banks, addBank, removeBank, accountBalances, triggerHaptic } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [bankKind, setBankKind] = useState<'TD' | 'TC'>('TD');
  const [selectedColor, setSelectedColor] = useState(BANK_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const openAdd = () => {
    triggerHaptic(20);
    setIsAdding(true);
  };

  const closeAdd = () => {
    setIsAdding(false);
    setBankName('');
    setBankBalance('');
    setBankKind('TD');
    setSelectedColor(BANK_COLORS[0]);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = bankBalance.trim() === '' ? 0 : parseFloat(bankBalance);
    if (!bankName.trim() || isNaN(val)) return;
    addBank({
      name: bankName.trim(),
      initialBalance: val,
      kind: bankKind,
      color: selectedColor,
    });
    closeAdd();
  };

  return (
    <div className="space-y-4 pb-2">
      <ScreenHeader title="Bancos" icon={CreditCard} onBack={onBack} onAdd={openAdd} addLabel="Agregar banco" />

      {/* Lista de tarjetas */}
      {banks.length === 0 ? (
        <div className="mk-card p-6 text-center space-y-2">
          <div className="w-11 h-11 rounded-full bg-[var(--mk-tile)] flex items-center justify-center mx-auto text-[color:var(--accent-warm)]">
            <Landmark className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <p className="text-xs font-bold text-[var(--mk-ink)]">Aún no tienes bancos</p>
          <p className="text-[11px] text-[var(--mk-muted)]">
            Toca el botón + para agregar tu primera tarjeta. Mientras tanto, tus movimientos se registran en Efectivo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {banks.map((bank) => {
            const balance = accountBalances.byAccount[bank.id] ?? bank.initialBalance;
            const isConfirming = confirmDelete === bank.id;
            return (
              <div
                key={bank.id}
                className="relative aspect-[1.75/1] w-full rounded-[22px] p-4 overflow-hidden text-white flex flex-col justify-between shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)]"
                style={{ background: cardGradient(bank.color) }}
              >
                {/* Brillos de la tarjeta */}
                <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 w-52 h-52 rounded-full bg-black/15 blur-2xl" />
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" />

                {/* Fila superior: nombre + tipo */}
                <div className="relative flex items-start justify-between">
                  <span className="text-[17px] font-black tracking-wide uppercase drop-shadow-sm">{bank.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[9px] font-extrabold tracking-wider">
                      {bank.kind === 'TC' ? 'CRÉDITO' : 'DÉBITO'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isConfirming) {
                          removeBank(bank.id);
                          setConfirmDelete(null);
                        } else {
                          triggerHaptic(15);
                          setConfirmDelete(bank.id);
                        }
                      }}
                      onBlur={() => setConfirmDelete(null)}
                      aria-label={isConfirming ? 'Confirmar eliminación' : 'Eliminar banco'}
                      title={isConfirming ? 'Toca de nuevo para eliminar' : 'Eliminar banco'}
                      className={`h-6 rounded-full flex items-center justify-center gap-1 transition-all active:scale-90 ${
                        isConfirming ? 'px-2 bg-white text-red-600' : 'w-6 bg-white/15 hover:bg-white/25'
                      }`}
                    >
                      {isConfirming ? (
                        <>
                          <Check className="w-3 h-3" strokeWidth={3} />
                          <span className="text-[9px] font-extrabold">Eliminar</span>
                        </>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Chip + contactless */}
                <div className="relative flex items-center gap-2">
                  <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-500 shadow-inner border border-amber-600/30" />
                  <Wifi className="w-4 h-4 rotate-90 opacity-80" />
                </div>

                {/* Saldo */}
                <div className="relative flex items-end justify-between">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest opacity-75">Saldo disponible</span>
                    <span className="block text-[22px] font-black tracking-tight leading-tight">
                      {money(balance)} <span className="text-[10px] font-bold opacity-80">MXN</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Menú flotante para agregar banco */}
      <FormSheet isOpen={isAdding} onClose={closeAdd} title="Nuevo banco" icon={Landmark}>
        <form onSubmit={handleAddSubmit} className="space-y-3">
          {/* Vista previa de la tarjeta */}
          <div
            className="relative h-24 rounded-[18px] p-3 overflow-hidden text-white flex flex-col justify-between shadow-md"
            style={{ background: cardGradient(selectedColor) }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex justify-between items-start">
              <span className="text-sm font-black uppercase tracking-wide truncate">{bankName || 'Mi banco'}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[8px] font-extrabold">
                {bankKind === 'TC' ? 'CRÉDITO' : 'DÉBITO'}
              </span>
            </div>
            <span className="relative text-lg font-black">{money(parseFloat(bankBalance) || 0)}</span>
          </div>

          <Field label="Nombre del banco">
            <input
              type="text"
              placeholder="ej. NU, BBVA, Santander"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={fieldClass}
              autoFocus
              required
            />
          </Field>

          <Field label="Saldo actual ($ MXN)">
            <input
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="0.00"
              value={bankBalance}
              onChange={(e) => setBankBalance(e.target.value)}
              className={fieldClass}
            />
          </Field>

          <LiquidSegmentedControl<'TD' | 'TC'>
            size="sm"
            value={bankKind}
            onChange={(next) => {
              triggerHaptic(15);
              setBankKind(next);
            }}
            options={[
              { id: 'TD', label: 'Débito' },
              { id: 'TC', label: 'Crédito' },
            ]}
          />

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Color</span>
            <div className="flex gap-2">
              {BANK_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setSelectedColor(c)}
                  className="w-6 h-6 rounded-full transition-transform flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: selectedColor === c ? '0 0 0 2px var(--mk-card, #fff), 0 0 0 4px ' + c : 'none',
                  }}
                >
                  {selectedColor === c && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <SubmitButton type="submit" disabled={!bankName.trim()}>
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Guardar banco
          </SubmitButton>
        </form>
      </FormSheet>
    </div>
  );
}
