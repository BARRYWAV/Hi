"use client";

import type { GlassVariant } from "./presets";

export interface SocialGlassButtonsProps {
  /** Variante opcional (mantenida por compatibilidad de tipos) */
  variant?: GlassVariant;
  /** Si está activo, oculta los botones con animación fluida hacia la izquierda */
  hidden?: boolean;
  /** Si debe mostrar la etiqueta de texto ("WhatsApp", "Facebook", "Instagram") junto al ícono. Por defecto true. */
  showLabels?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Número de WhatsApp (por defecto 8112169211 / +52 8112169211) */
  whatsAppNumber?: string;
  /** URL directa de WhatsApp opcional */
  whatsAppUrl?: string;
  /** Callback opcional al hacer clic en WhatsApp */
  onWhatsAppClick?: () => void;
  /** Callback opcional al hacer clic en Facebook */
  onFacebookClick?: () => void;
  /** Callback opcional al hacer clic en Instagram */
  onInstagramClick?: () => void;
}

/** Icono oficial de WhatsApp con geometría y color original (#25D366) */
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Globo de conversación verde WhatsApp con colita inferior izquierda */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3C8.82 3 3 8.82 3 16c0 2.4.65 4.65 1.79 6.58L3.25 28.5l6.09-1.52A12.93 12.93 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3z"
        fill="#25D366"
      />
      {/* Auricular telefónico blanco original */}
      <path
        d="M22.8 19.3c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-1.64-.82-2.71-1.47-3.79-3.32-.29-.49-.03-.75.14-.92.15-.15.33-.38.5-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.09-.16-.74-1.78-1.02-2.44-.27-.64-.54-.56-.74-.57-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.16 1.13-1.16 2.75s1.18 3.19 1.35 3.41c.16.22 2.33 3.55 5.63 4.98 2.24.97 3.13 1.03 4.24.86.69-.1 1.95-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39z"
        fill="white"
      />
    </svg>
  );
}

/** Icono oficial de Facebook con insignia azul (#1877F2) y la 'f' blanca */
function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Círculo azul oficial de Facebook */}
      <circle cx="16" cy="16" r="14" fill="#1877F2" />
      {/* Letra 'f' blanca con compensación óptica oficial */}
      <path
        d="M21.5 17.5l.6-3.9h-3.7v-2.5c0-1.08.53-2.13 2.22-2.13h1.72V5.62s-1.56-.27-3.05-.27c-3.11 0-5.14 1.89-5.14 5.3V13.6H10.6v3.9h3.45v9.45c.7.11 1.4.17 2.15.17.74 0 1.45-.06 2.15-.17V17.5h3.15z"
        fill="white"
      />
    </svg>
  );
}

/** Icono oficial de Instagram con degradado de marca y cámara en blanco */
function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ig-grad-radial" cx="30%" cy="107%" r="130%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      {/* Fondo redondeado con el degradado oficial de Instagram */}
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#ig-grad-radial)" />
      {/* Marco de la cámara */}
      <rect x="7" y="7" width="18" height="18" rx="5" stroke="white" strokeWidth="2.2" fill="none" />
      {/* Lente central */}
      <circle cx="16" cy="16" r="4.2" stroke="white" strokeWidth="2.2" fill="none" />
      {/* Punto de flash */}
      <circle cx="21.3" cy="10.7" r="1.3" fill="white" />
    </svg>
  );
}

/**
 * SocialGlassButtons
 * Enlaces flotantes de WhatsApp, Facebook e Instagram (sin contenedores/tarjetas de fondo,
 * mostrando únicamente los íconos y textos suspendidos con animaciones micro-interactivas).
 */
export default function SocialGlassButtons({
  hidden = false,
  showLabels = true,
  className = "",
  whatsAppNumber = "8112169211",
  whatsAppUrl,
  onWhatsAppClick,
  onFacebookClick,
  onInstagramClick,
}: SocialGlassButtonsProps) {
  const cleanNumber = whatsAppNumber.replace(/\D/g, "");
  const fullNumber = cleanNumber.length === 10 ? `52${cleanNumber}` : cleanNumber;
  const computedWhatsAppHref = whatsAppUrl || `https://wa.me/${fullNumber}`;

  return (
    <nav
      aria-label="Redes sociales"
      className={`absolute top-5 sm:top-6 md:top-7 left-5 sm:left-7 md:left-9 z-20 flex items-center gap-4 sm:gap-6 md:gap-7 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] ${
        hidden ? "opacity-0 -translate-x-10 pointer-events-none" : "opacity-100 translate-x-0"
      } ${className}`}
    >
      {/* Botón WhatsApp flotante */}
      <a
        href={computedWhatsAppHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsAppClick}
        id="social-btn-whatsapp"
        aria-label="Contactar por WhatsApp"
        title="WhatsApp (81 1216 9211)"
        className="group inline-flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 select-none focus:outline-none"
      >
        <WhatsAppIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(37,211,102,0.35)]" />
        {showLabels ? (
          <span className="text-xs sm:text-[13px] font-medium tracking-wide text-white/80 group-hover:text-white transition-colors duration-300">
            WhatsApp
          </span>
        ) : null}
      </a>

      {/* Botón Facebook flotante */}
      <button
        type="button"
        onClick={onFacebookClick}
        id="social-btn-facebook"
        aria-label="Visitar en Facebook"
        title="Facebook"
        className="group inline-flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 select-none focus:outline-none"
      >
        <FacebookIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(24,119,242,0.35)]" />
        {showLabels ? (
          <span className="text-xs sm:text-[13px] font-medium tracking-wide text-white/80 group-hover:text-white transition-colors duration-300">
            Facebook
          </span>
        ) : null}
      </button>

      {/* Botón Instagram flotante */}
      <button
        type="button"
        onClick={onInstagramClick}
        id="social-btn-instagram"
        aria-label="Visitar en Instagram"
        title="Instagram"
        className="group inline-flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 select-none focus:outline-none"
      >
        <InstagramIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(225,48,108,0.35)]" />
        {showLabels ? (
          <span className="text-xs sm:text-[13px] font-medium tracking-wide text-white/80 group-hover:text-white transition-colors duration-300">
            Instagram
          </span>
        ) : null}
      </button>
    </nav>
  );
}
