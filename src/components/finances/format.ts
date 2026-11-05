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
