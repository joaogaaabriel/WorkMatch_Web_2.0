/**
 * WorkMatch 2.0 — ui.jsx
 * Componentes reutilizáveis usando o novo CSS (padrão Controle de Férias)
 */
import React from "react";

/* ── Btn ──────────────────────────────────────────────── */
export function Btn({ children, onClick, type = "button", variant = "primary", size = "", fullWidth, disabled, loading, style, className = "", ...rest }) {
  const cls = ["wm-btn", `wm-btn--${variant}`, size && `wm-btn--${size}`, fullWidth && "wm-btn--full", className].filter(Boolean).join(" ");
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls} style={style} {...rest}>
      {loading && <span className="wm-btn__spinner" />}
      {children}
    </button>
  );
}

/* ── Card ─────────────────────────────────────────────── */
export function Card({ children, style, accent, clickable, className = "", ...rest }) {
  const cls = ["wm-card", accent && `wm-card--${accent}`, clickable && "wm-card--clickable", className].filter(Boolean).join(" ");
  return <div className={cls} style={style} {...rest}>{children}</div>;
}
export function CardHeader({ children, style }) { return <div className="wm-card__header" style={style}>{children}</div>; }
export function CardBody({ children, style }) { return <div className="wm-card__body" style={style}>{children}</div>; }
export function CardTitle({ children }) { return <h2 className="wm-card__title">{children}</h2>; }

/* ── Input ────────────────────────────────────────────── */
export function Input({ label, name, value, onChange, type = "text", placeholder, required, error, hint, icon, readOnly, style, ...rest }) {
  return (
    <div className="wm-form-group" style={style}>
      {label && (
        <label htmlFor={name} className="wm-label">
          {label}{required && <span className="wm-label__required">*</span>}
        </label>
      )}
      <div className="wm-input-wrapper">
        {icon && <span className="wm-input-icon">{icon}</span>}
        <input
          id={name} name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required} readOnly={readOnly}
          className={`wm-input${icon ? " wm-input--with-icon" : ""}${error ? " wm-input--error" : ""}`}
          {...rest}
        />
      </div>
      {error && <span className="wm-field-error">{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: "var(--clr-text-light)" }}>{hint}</span>}
    </div>
  );
}

/* ── Textarea ─────────────────────────────────────────── */
export function Textarea({ label, name, value, onChange, placeholder, required, rows = 4, style }) {
  return (
    <div className="wm-form-group" style={style}>
      {label && <label htmlFor={name} className="wm-label">{label}{required && <span className="wm-label__required">*</span>}</label>}
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows} className="wm-input" />
    </div>
  );
}

/* ── Badge ────────────────────────────────────────────── */
export function Badge({ children, variant = "purple" }) {
  return <span className={`wm-badge wm-badge--${variant}`}>{children}</span>;
}

/* ── Spinner ──────────────────────────────────────────── */
export function Spinner({ size = "md" }) {
  return <div className={`wm-spinner wm-spinner--${size}`} />;
}

/* ── EmptyState ───────────────────────────────────────── */
export function EmptyState({ emoji = "📭", title, description, action }) {
  return (
    <div className="wm-empty">
      <span className="wm-empty__icon">{emoji}</span>
      <h3 className="wm-empty__title">{title}</h3>
      {description && <p className="wm-empty__desc">{description}</p>}
      {action}
    </div>
  );
}

/* ── Avatar ───────────────────────────────────────────── */
const AV_COLORS = ["blue", "purple", "teal", "navy"];
export function Avatar({ name, size = "md", colorIndex = 0 }) {
  const initials = name ? name.trim().split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() : "?";
  const color = AV_COLORS[colorIndex % AV_COLORS.length];
  return <div className={`wm-avatar wm-avatar--${size} wm-avatar--${color}`}>{initials}</div>;
}

/* ── Divider ──────────────────────────────────────────── */
export function Divider({ style }) { return <hr className="wm-divider" style={style} />; }

/* ── InfoRow ──────────────────────────────────────────── */
export function InfoRow({ emoji, label, value }) {
  return (
    <div className="wm-info-row">
      <span className="wm-info-row__emoji">{emoji}</span>
      <div>
        <p className="wm-info-row__label">{label}</p>
        <p className="wm-info-row__value">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ── Alert ────────────────────────────────────────────── */
export function Alert({ children, variant = "info", emoji }) {
  return (
    <div className={`wm-alert wm-alert--${variant}`}>
      {emoji && <span style={{ fontSize: 18, flexShrink: 0 }}>{emoji}</span>}
      <span>{children}</span>
    </div>
  );
}

/* ── Stars ────────────────────────────────────────────── */
export function Stars({ rating }) {
  const r = parseFloat(rating) || 4.5;
  return (
    <span className="wm-stars">
      {[1,2,3,4,5].map(i => <span key={i} className={`wm-star${i > Math.floor(r) ? " wm-star--empty" : ""}`}>★</span>)}
      <span className="wm-stars__val">{rating}</span>
    </span>
  );
}

/* ── SkeletonList ─────────────────────────────────────── */
export function SkeletonList({ rows = 4 }) {
  return (
    <div className="wm-skeleton-list">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="wm-skeleton-item">
          <div className="wm-skeleton wm-skeleton--avatar" style={{ width: 40, height: 40 }} />
          <div className="wm-skeleton-item__lines">
            <div className="wm-skeleton wm-skeleton--line wm-skeleton--w70" />
            <div className="wm-skeleton wm-skeleton--line wm-skeleton--w50" />
          </div>
          <div className="wm-skeleton wm-skeleton--line" style={{ width: 72, height: 24, borderRadius: "var(--r-full)" }} />
        </div>
      ))}
    </div>
  );
}
