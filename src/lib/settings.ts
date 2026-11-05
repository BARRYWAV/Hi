// Preferencias locales de la pantalla "Ajustes" (persisten en localStorage).

export type AccentId = 'red' | 'pink' | 'sky' | 'mint' | 'yellow';

export interface AppSettings {
  accent: AccentId;
  age: string;
}

export const ACCENTS: { id: AccentId; label: string; color: string; soft: string }[] = [
  { id: 'red', label: 'Rojo', color: '#d62725', soft: '#f6c9c8' },
  { id: 'pink', label: 'Rosa', color: '#e0458b', soft: '#fbe0ee' },
  { id: 'sky', label: 'Azul claro', color: '#2f8fdc', soft: '#d6ebfb' },
  { id: 'mint', label: 'Verde agua', color: '#1fa37a', soft: '#d3f1e4' },
  { id: 'yellow', label: 'Amarillo', color: '#e5a50a', soft: '#fdecc6' },
];

const KEY = 'sincro_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  accent: 'red',
  age: '',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(s: AppSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

/** El acento personalizado aplica en modo Día (en Noche se mantiene el ámbar cálido de marca). */
export function applyAccent(accent: AccentId) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-accent', accent);
}
