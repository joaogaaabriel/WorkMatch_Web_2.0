/**
 * WorkMatch 2.0 — UI Primitives
 * Componentes reutilizáveis: Button, Card, Input, Badge, Spinner, EmptyState
 * Público 40-70 anos: botões grandes, texto legível, espaçamento confortável
 */
import React from "react";

/* ── Button ───────────────────────────────────────────────── */
export function Btn({
  children, onClick, type = "button", variant = "primary",
  size = "md", fullWidth, disabled, loading, icon, style, ...rest
}) {
  const sizes = {
    sm: { padding: "10px 18px", fontSize: 14, borderRadius: 10 },
    md: { padding: "14px 28px", fontSize: 16, borderRadius: 13 },
    lg: { padding: "18px 36px", fontSize: 18, borderRadius: 15 },
  };

  const variants = {
    primary: {
      background: "var(--grad-brand)",
      color: "#fff",
      border: "none",
      boxShadow: "var(--shadow-blue)",
    },
    secondary: {
      background: "var(--clr-surface)",
      color: "var(--clr-primary)",
      border: "2px solid var(--clr-primary)",
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: "var(--clr-muted)",
      border: "1.5px solid var(--clr-border)",
      boxShadow: "none",
    },
    danger: {
      background: "#dc2626",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
    },
    accent: {
      background: "var(--clr-accent)",
      color: "#1e293b",
      border: "none",
      boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "transform .15s, box-shadow .15s, opacity .15s",
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      {...rest}
    >
      {loading ? <Spinner size={16} color={variant === "secondary" ? "var(--clr-primary)" : "#fff"} /> : icon}
      {children}
    </button>
  );
}

/* ── Card ─────────────────────────────────────────────────── */
export function Card({ children, style, hoverable, accent, ...rest }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: "var(--clr-surface)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--clr-border)",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hovered && hoverable ? "translateY(-3px)" : "none",
        transition: "box-shadow .2s, transform .2s",
        overflow: "hidden",
        position: "relative",
        ...(accent ? {
          borderTop: `3px solid ${accent}`,
        } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Input ────────────────────────────────────────────────── */
export function Input({
  label, name, value, onChange, type = "text",
  placeholder, required, error, hint, icon, readOnly,
  style, inputStyle, ...rest
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label htmlFor={name} style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--clr-text)",
        }}>
          {label}{required && <span style={{ color: "var(--clr-danger)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 18,
            pointerEvents: "none",
          }}>{icon}</span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: icon ? "14px 16px 14px 44px" : "14px 16px",
            fontSize: 16,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            color: "var(--clr-text)",
            background: readOnly ? "var(--clr-bg)" : "var(--clr-surface)",
            border: `2px solid ${error ? "var(--clr-danger)" : focused ? "var(--clr-primary-lt)" : "var(--clr-border)"}`,
            borderRadius: 12,
            outline: "none",
            transition: "border-color .15s",
            ...inputStyle,
          }}
          {...rest}
        />
      </div>
      {error && <p style={{ fontSize: 13, color: "var(--clr-danger)", fontWeight: 600 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 13, color: "var(--clr-muted)" }}>{hint}</p>}
    </div>
  );
}

/* ── Textarea ─────────────────────────────────────────────── */
export function Textarea({ label, name, value, onChange, placeholder, required, rows = 4, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label htmlFor={name} style={{ fontSize: 15, fontWeight: 700, color: "var(--clr-text)" }}>
          {label}{required && <span style={{ color: "var(--clr-danger)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: 16,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          color: "var(--clr-text)",
          background: "var(--clr-surface)",
          border: `2px solid ${focused ? "var(--clr-primary-lt)" : "var(--clr-border)"}`,
          borderRadius: 12,
          outline: "none",
          resize: "vertical",
          transition: "border-color .15s",
        }}
      />
    </div>
  );
}

/* ── Badge ────────────────────────────────────────────────── */
export function Badge({ children, color = "#1e40af", bg }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: 99,
      fontSize: 13,
      fontWeight: 700,
      background: bg || `${color}18`,
      color,
    }}>
      {children}
    </span>
  );
}

/* ── Spinner ──────────────────────────────────────────────── */
export function Spinner({ size = 36, color = "var(--clr-primary)" }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `${Math.max(2, size / 12)}px solid ${color}22`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin .7s linear infinite",
      flexShrink: 0,
    }} />
  );
}

/* ── EmptyState ───────────────────────────────────────────── */
export function EmptyState({ emoji = "📭", title, description, action }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "56px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}>
      <span style={{ fontSize: 56 }}>{emoji}</span>
      <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--clr-text)" }}>{title}</h3>
      {description && <p style={{ fontSize: 16, color: "var(--clr-muted)", maxWidth: 360, lineHeight: 1.6 }}>{description}</p>}
      {action}
    </div>
  );
}

/* ── Avatar ───────────────────────────────────────────────── */
export function Avatar({ name, size = 48, gradient }) {
  const initials = name
    ? name.trim().split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: gradient || "var(--grad-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.38,
      fontWeight: 800,
      color: "#fff",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── Divider ──────────────────────────────────────────────── */
export function Divider({ style }) {
  return <hr style={{ border: "none", borderTop: "1px solid var(--clr-border)", margin: "0", ...style }} />;
}

/* ── InfoRow ──────────────────────────────────────────────── */
export function InfoRow({ emoji, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0" }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
      <div>
        <p style={{ fontSize: 13, color: "var(--clr-muted)", fontWeight: 600, marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 16, color: "var(--clr-text)", fontWeight: 600 }}>{value || "—"}</p>
      </div>
    </div>
  );
}

/* ── Spin keyframe (global) ───────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("wm-spin-kf")) {
  const s = document.createElement("style");
  s.id = "wm-spin-kf";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}
