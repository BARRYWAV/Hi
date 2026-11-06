export const money = (n: number) =>
  `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** 21/11/26 */
export const shortDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
};

/** 21/Diciembre/26 */
export const longDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${MONTHS[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`;
};

/** 13 Dic */
export const dayMonth = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
};

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Fecha límite de un préstamo: dueDate o createdAt + 30 días. */
export const dueDateOf = (debt: { createdAt: string; dueDate?: string }) =>
  debt.dueDate || new Date(new Date(debt.createdAt).getTime() + 30 * DAY_MS).toISOString();

/** % de tiempo transcurrido entre inicio y límite (0-100). */
export const elapsedPct = (startIso: string, endIso: string) => {
  const s = new Date(startIso).getTime();
  const e = new Date(endIso).getTime();
  if (e <= s) return 100;
  return Math.max(0, Math.min(100, ((Date.now() - s) / (e - s)) * 100));
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export interface LoanTiming {
  /** % de días transcurridos entre el día del préstamo y el día límite (0-100) */
  pct: number;
  /** Días que faltan (negativo si ya venció) */
  daysLeft: number;
  status: 'ok' | 'warning' | 'due' | 'overdue';
  label: string;
}

/**
 * Tiempo de un préstamo contado por días naturales:
 * - Préstamo martes, límite viernes → el miércoles va ~33% (verde-amarillo).
 * - El viernes llega al 100% (rojo en la punta).
 * - El sábado ya está vencido → toda la barra en rojo.
 */
export const loanTiming = (startIso: string, dueIso: string, now = new Date()): LoanTiming => {
  const s = startOfDay(new Date(startIso));
  const e = startOfDay(new Date(dueIso));
  const t = startOfDay(now);
  const totalDays = Math.max(1, Math.round((e - s) / DAY_MS));
  const elapsed = Math.round((t - s) / DAY_MS);
  const daysLeft = Math.round((e - t) / DAY_MS);
  const pct = Math.max(0, Math.min(100, (elapsed / totalDays) * 100));

  if (daysLeft < 0) {
    const d = Math.abs(daysLeft);
    return { pct: 100, daysLeft, status: 'overdue', label: `Vencido hace ${d} ${d === 1 ? 'día' : 'días'}` };
  }
  if (daysLeft === 0) return { pct: 100, daysLeft, status: 'due', label: 'Vence hoy' };
  return {
    pct,
    daysLeft,
    status: pct >= 66 ? 'warning' : 'ok',
    label: `Faltan ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}`,
  };
};

/** yyyy-mm-dd de hoy + n días (para inputs type=date) */
export const isoDateInDays = (n: number) => {
  const d = new Date(Date.now() + n * DAY_MS);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
