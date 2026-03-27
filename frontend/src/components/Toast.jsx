/**
 * WorkMatch 2.0 — Toast Component
 */
import React, { useEffect } from "react";

const icons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const colors = {
  success: { bg: "#059669", border: "#047857" },
  error:   { bg: "#dc2626", border: "#b91c1c" },
  warning: { bg: "#d97706", border: "#b45309" },
  info:    { bg: "#1e40af", border: "#1e3a8a" },
};

export default function Toast({ open, message, type = "success", onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: "#fff",
      borderRadius: 14,
      padding: "14px 24px",
      fontSize: 17,
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
      minWidth: 260,
      maxWidth: "90vw",
      animation: "fadeUp 0.35s ease both",
    }}>
      <span style={{ fontSize: 20, fontWeight: 800 }}>{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "rgba(255,255,255,0.25)",
          border: "none",
          borderRadius: 8,
          color: "#fff",
          cursor: "pointer",
          padding: "2px 10px",
          fontSize: 18,
          lineHeight: 1,
        }}
      >×</button>
    </div>
  );
}
