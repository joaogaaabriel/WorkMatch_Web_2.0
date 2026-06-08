/**
 * WorkMatch — components/ui.jsx
 * Design System CEL v3.0 — componentes base
 *
 * Exports: Btn, Input, Avatar, Card, CardHeader, CardTitle, CardBody,
 *          Divider, Badge, Stars, Alert, Spinner, EmptyState
 */

import React from "react";

/* =========================================================
   ÍCONES SVG INTERNOS (CEL — sem emojis)
   Usados por EmptyState e Alert como padrão.
   Páginas podem sobrescrever com prop `icon`.
========================================================= */

const IconBox = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8
             a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const IconSearch = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const IconInfo = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const IconCheck = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconWarning = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16
             a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const IconDanger = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
);

const ALERT_ICONS = {
  info:    IconInfo,
  success: IconCheck,
  warning: IconWarning,
  danger:  IconDanger,
  purple:  IconInfo,   /* alias blue */
};

/* =========================================================
   BUTTON
========================================================= */

export function Btn({
  children,
  onClick,
  type      = "button",
  disabled  = false,
  variant   = "primary",
  size      = "md",
  fullWidth = false,
  className = "",
  style     = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={[
        "wm-btn",
        `wm-btn--${variant}`,
        size !== "md" ? `wm-btn--${size}` : "",
        fullWidth ? "wm-btn--full" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}

/* =========================================================
   INPUT
========================================================= */

export function Input({
  label,
  error,
  required  = false,
  className = "",
  ...props
}) {
  return (
    <div className="wm-form-group">
      {label && (
        <label className="wm-label">
          {label}
          {required && <span className="wm-label__required">*</span>}
        </label>
      )}

      <input
        {...props}
        required={required}
        className={[
          "wm-input",
          error ? "wm-input--error" : "",
          className,
        ].filter(Boolean).join(" ")}
      />

      {error && (
        <span className="wm-field-error">{error}</span>
      )}
    </div>
  );
}

/* =========================================================
   AVATAR
   color default → "blue" (CEL — sem purple)
========================================================= */

export function Avatar({
  src,
  alt      = "Avatar",
  size     = "md",
  color    = "blue",
  initials = "U",
  className = "",
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={["wm-avatar", `wm-avatar--${size}`, className].filter(Boolean).join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        "wm-avatar",
        `wm-avatar--${size}`,
        `wm-avatar--${color}`,
        className,
      ].filter(Boolean).join(" ")}
    >
      {initials}
    </div>
  );
}

/* =========================================================
   CARD
========================================================= */

export function Card({
  children,
  className = "",
  variant   = "",
  clickable = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={[
        "wm-card",
        variant   ? `wm-card--${variant}` : "",
        clickable ? "wm-card--clickable"  : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

/* =========================================================
   CARD HEADER
========================================================= */

export function CardHeader({ title, children, className = "" }) {
  return (
    <div className={["wm-card__header", className].filter(Boolean).join(" ")}>
      {title && <div className="wm-card__title">{title}</div>}
      {children}
    </div>
  );
}

/* =========================================================
   CARD TITLE
========================================================= */

export function CardTitle({ children, className = "" }) {
  return (
    <div className={["wm-card__title", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

/* =========================================================
   CARD BODY
========================================================= */

export function CardBody({ children, className = "" }) {
  return (
    <div className={["wm-card__body", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

/* =========================================================
   DIVIDER
========================================================= */

export function Divider({ className = "" }) {
  return (
    <hr className={["wm-divider", className].filter(Boolean).join(" ")} />
  );
}

/* =========================================================
   BADGE
========================================================= */

export function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={[
        "wm-badge",
        `wm-badge--${variant}`,
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}

/* =========================================================
   STARS
========================================================= */

export function Stars({ rating = 5 }) {
  const rate = Number(rating);
  const full = Math.floor(rate);

  return (
    <div className="wm-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= full ? "wm-star" : "wm-star wm-star--empty"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="wm-stars__val">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

/* =========================================================
   ALERT
   Aceita `icon` (JSX — preferido, CEL) ou `emoji` (legado).
   Aceita `variant` incluindo "purple" (remapeado para blue).
========================================================= */

export function Alert({
  children,
  variant   = "info",
  icon,
  emoji,
  className = "",
}) {
  /* Resolve o ícone a exibir: prop icon > prop emoji > ícone padrão do variant */
  const resolvedIcon = icon
    ? icon
    : emoji
    ? <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
    : ALERT_ICONS[variant] ?? ALERT_ICONS.info;

  return (
    <div
      className={[
        "wm-alert",
        `wm-alert--${variant}`,
        className,
      ].filter(Boolean).join(" ")}
    >
      <span
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        {resolvedIcon}
      </span>
      <span>{children}</span>
    </div>
  );
}

/* =========================================================
   SPINNER
   Renderiza centrado quando `center={true}`.
========================================================= */

export function Spinner({ size = "md", center = true, className = "" }) {
  const spinner = (
    <div
      className={[
        "wm-spinner",
        `wm-spinner--${size}`,
        className,
      ].filter(Boolean).join(" ")}
      role="status"
      aria-label="Carregando"
    />
  );

  if (!center) return spinner;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "var(--sp-10)",
      }}
    >
      {spinner}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   Aceita `icon` (JSX SVG — preferido, CEL) ou
   `emoji` (string — legado, compatibilidade com páginas atuais).
   Aceita `action` (JSX) para botão de ação opcional.
========================================================= */

export function EmptyState({
  icon,
  emoji,
  title       = "Nada encontrado",
  description = "",
  action      = null,
}) {
  /* Resolve o ícone: prop icon > prop emoji > ícone padrão CEL */
  const resolvedIcon = icon
    ? icon
    : emoji
    ? (
        <span
          style={{ fontSize: 32, lineHeight: 1 }}
          role="img"
          aria-hidden="true"
        >
          {emoji}
        </span>
      )
    : IconSearch;

  return (
    <div className="wm-empty">
      <div className="wm-empty__icon">
        {resolvedIcon}
      </div>

      <p className="wm-empty__title">{title}</p>

      {description && (
        <p className="wm-empty__desc">{description}</p>
      )}

      {action && (
        <div style={{ marginTop: "var(--sp-2)" }}>
          {action}
        </div>
      )}
    </div>
  );
}
