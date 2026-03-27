/**
 * WorkMatch 2.0 — Toast
 */
import React, { useEffect } from "react";

const ICONS = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

export default function Toast({ open, message, type = "success", onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="wm-toast-container">
      <div className={`wm-toast wm-toast--${type}`}>
        <span className="wm-toast__icon">{ICONS[type]}</span>
        <span className="wm-toast__msg">{message}</span>
        <button className="wm-toast__close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
