export const BANK_COLORS = ['#1d6fd1', '#8a3ffc', '#1fa37a', '#e5a50a', '#e0458b', '#334155'];

/** Gradiente de tarjeta a partir del color del banco */
export const cardGradient = (color: string) =>
  `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 70%, #000) 100%)`;
