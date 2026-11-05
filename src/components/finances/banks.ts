'use client';

import { useCallback, useEffect, useState } from 'react';

export interface CustomBank {
  id: string;
  name: string;
  balance: number;
  kind: 'TD' | 'TC';
  color: string;
}

const KEY = 'sincro_banks';

export const BANK_COLORS = ['#3b9ae1', '#8a3ffc', '#1fa37a', '#e5a50a', '#e0458b', '#64748b'];

/** Cuentas extra creadas en Finanzas → Bancos (persisten en localStorage). */
export function useCustomBanks() {
  const [banks, setBanks] = useState<CustomBank[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBanks(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: CustomBank[]) => {
    setBanks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const addBank = (b: Omit<CustomBank, 'id'>) => persist([...banks, { ...b, id: `bank-${Date.now()}` }]);
  const removeBank = (id: string) => persist(banks.filter((b) => b.id !== id));

  return { banks, addBank, removeBank, customTotal: banks.reduce((acc, b) => acc + b.balance, 0) };
}
