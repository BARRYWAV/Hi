'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { CreditCard, Plus, Trash2, X } from 'lucide-react';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useCustomBanks, BANK_COLORS } from './banks';
import { money } from './format';

export default function BanksView({ onBack }: { onBack: () => void }) {
  const { accountBalances, triggerHaptic } = useApp();
  const { banks, addBank, removeBank } = useCustomBanks();

  const [isAdding, setIsAdding] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [bankKind, setBankKind] = useState<'TD' | 'TC'>('TD');
  const [selectedColor, setSelectedColor] = useState(BANK_COLORS[0]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(bankBalance);
    if (!bankName.trim() || isNaN(val)) return;
    triggerHaptic(30);
    addBank({
      name: bankName.trim(),
      balance: val,
      kind: bankKind,
      color: selectedColor,
    });
    setBankName('');
    setBankBalance('');
    setIsAdding(false);
  };

  // Cuentas base del sistema (BBVA, NU) adaptadas al estilo del mockup
  const baseAccounts = [
    {
      id: 'base-bbva',
      name: 'BBVA',
      balance: accountBalances.BBVA,
      kind: 'TD' as const,
      color: '#3b9ae1', // Azul característico BBVA
    },
    {
      id: 'base-nu',
      name: 'NU',
      balance: accountBalances.Nu,
      kind: 'TD' as const,
      color: '#8a3ffc', // Morado característico NU
    },
  ];

  return (
    <motion.div
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-2"
    >
      <ScreenHeader
        title="Bancos"
        icon={CreditCard}
        onBack={onBack}
        onAdd={() => setIsAdding(true)}
        addLabel="Agregar cuenta bancaria"
      />

      {/* Tarjetas apiladas de cuentas según el mockup exacto */}
      <div className="space-y-3">
        {baseAccounts.map((account) => (
          <div
            key={account.id}
            className="mk-card p-4 relative overflow-hidden transition-all duration-200"
            style={{
              boxShadow: `0 8px 20px -8px ${account.color}35`,
            }}
          >
            <div className="flex items-center justify-between">
              {/* Nombre de Banco (Píldora / Tag redondeado como en el mockup) */}
              <span className="px-3.5 py-1.5 rounded-full bg-[var(--mk-chip)] text-xs font-bold text-[var(--mk-ink)] tracking-wider">
                {account.name}
              </span>

              {/* Saldo centrado grande */}
              <span className="text-sm font-extrabold text-[var(--mk-ink)] tracking-tight">
                {money(account.balance)}
              </span>

              {/* Tipo de tarjeta (TD: Tarjeta Débito / TC: Crédito) */}
              <span className="px-3 py-1 rounded-full bg-[var(--mk-chip)] text-[10px] font-bold text-[var(--mk-muted)]">
                {account.kind}
              </span>
            </div>

            {/* Borde sutil inferior con el color distintivo */}
            <div
              className="absolute bottom-0 inset-x-0 h-1"
              style={{ backgroundColor: account.color }}
            />
          </div>
        ))}

        {/* Cuentas adicionales agregadas por el usuario */}
        {banks.map((account) => (
          <div
            key={account.id}
            className="mk-card p-4 relative overflow-hidden group transition-all duration-200"
            style={{
              boxShadow: `0 8px 20px -8px ${account.color}35`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-[var(--mk-chip)] text-xs font-bold text-[var(--mk-ink)] tracking-wider">
                {account.name}
              </span>

              <span className="text-sm font-extrabold text-[var(--mk-ink)] tracking-tight">
                {money(account.balance)}
              </span>

              <div className="flex items-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-[var(--mk-chip)] text-[10px] font-bold text-[var(--mk-muted)]">
                  {account.kind}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    removeBank(account.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:scale-110 transition-all"
                  title="Eliminar cuenta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              className="absolute bottom-0 inset-x-0 h-1"
              style={{ backgroundColor: account.color }}
            />
          </div>
        ))}

        {/* Tarjeta con botón '+' para agregar nueva cuenta */}
        <AnimatePresence>
          {!isAdding && (
            <motion.div
              id="btn-add-bank-card"
              role="button"
              tabIndex={0}
              layoutId="shared-add-bank"
              transition={{ duration: 0.3 }}
              onClick={() => {
                triggerHaptic(20);
                setIsAdding(true);
              }}
              className="w-full mk-card p-4 border-dashed border-2 border-[var(--mk-field-border)] flex items-center justify-center text-[var(--mk-muted)] hover:text-[color:var(--accent-warm)] hover:border-[color:var(--accent-warm)]/40 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Formulario desplegable para agregar nueva cuenta */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            layoutId="shared-add-bank"
            transition={{ duration: 0.3 }}
            className="mk-card p-4 space-y-3 border-2 border-[color:var(--accent-warm)]/30"
          >
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--mk-ink)]">Nueva Cuenta Bancaria</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-1 text-[var(--mk-muted)] hover:text-[var(--mk-ink)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre del banco (ej. Santander, Banorte)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mk-field"
                  required
                />

                <input
                  type="number"
                  step="any"
                  placeholder="Saldo inicial ($ MXN)"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  className="mk-field"
                  required
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBankKind('TD')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      bankKind === 'TD'
                        ? 'bg-[var(--accent-warm)] text-[color:var(--on-accent)] border-transparent'
                        : 'bg-[var(--mk-card)] text-[var(--mk-muted)] border-[var(--mk-field-border)]'
                    }`}
                  >
                    Débito (TD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankKind('TC')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      bankKind === 'TC'
                        ? 'bg-[var(--accent-warm)] text-[color:var(--on-accent)] border-transparent'
                        : 'bg-[var(--mk-card)] text-[var(--mk-muted)] border-[var(--mk-field-border)]'
                    }`}
                  >
                    Crédito (TC)
                  </button>
                </div>

                {/* Selector de color de acento */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-[var(--mk-muted)] font-semibold">Color:</span>
                  <div className="flex gap-1.5">
                    {BANK_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className="w-5 h-5 rounded-full transition-transform"
                        style={{
                          backgroundColor: c,
                          transform: selectedColor === c ? 'scale(1.2)' : 'scale(1)',
                          outline: selectedColor === c ? '2px solid var(--mk-ink)' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[var(--mk-muted)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[var(--accent-warm)] text-[color:var(--on-accent)] rounded-lg shadow-sm"
                >
                  Guardar Cuenta
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
