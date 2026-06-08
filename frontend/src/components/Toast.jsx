/**
 * WorkMatch — components/Toast.jsx
 * CEL Design System v3.0
 *
 * Contrato inalterado: props open, message, type, onClose
 * Compatível com useToast hook existente (hooks/useToast.js)
 *
 * Alteração visual: ícones de texto → SVG profissional (sem emojis)
 */

import React, { useEffect } from "react";

/* ── Ícones SVG por tipo — CEL (sem emojis, sem texto) ── */

const IconSuccess = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconError = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
);

const IconWarning = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const IconInfo = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const IconClose = () => (
  <svg
    width="12" height="12" viewBox="0 0 14 14"
    fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M2 2l10 10M12 2L2 12" />
  </svg>
);

/* Mapa tipo → componente de ícone */
const ICONS = {
  success: IconSuccess,
  error:   IconError,
  warning: IconWarning,
  info:    IconInfo,
};

/* Labels ARIA por tipo */
const ARIA_LABELS = {
  success: "Sucesso",
  error:   "Erro",
  warning: "Atenção",
  info:    "Informação",
};

/* ── Componente ── */

export default function Toast({ open, message, type = "success", onClose }) {

  /* Auto-dismiss: 4 segundos — comportamento inalterado */
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const Icon = ICONS[type] ?? IconInfo;

  return (
    <div className="wm-toast-container" role="region" aria-label="Notificações">
      <div
        className={`wm-toast wm-toast--${type}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-label={ARIA_LABELS[type] ?? "Notificação"}
      >
        {/* Ícone do tipo */}
        <span className="wm-toast__icon">
          <Icon />
        </span>

        {/* Mensagem */}
        <span className="wm-toast__msg">{message}</span>

        {/* Fechar */}
        <button
          className="wm-toast__close"
          onClick={onClose}
          aria-label="Fechar notificação"
        >
          <IconClose />
        </button>
      </div>
    </div>
  );
}
