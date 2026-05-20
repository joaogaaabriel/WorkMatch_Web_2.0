/**
 * WorkMatch 2.0 — PageLayout
 * Layout padrão das páginas internas com topbar + menu lateral
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "./MenuLateral";

export default function PageLayout({ title, subtitle, backPath, children, headerRight }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* Topbar */}
      <header className="wm-topbar">
        {backPath && (
          <button className="wm-topbar__back" onClick={() => navigate(backPath)} aria-label="Voltar">
            ←
          </button>
        )}
        <div className="wm-topbar__title-group">
          {title && <h1 className="wm-topbar__title">{title}</h1>}
          {subtitle && <p className="wm-topbar__subtitle">{subtitle}</p>}
        </div>
        {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
      </header>

      <MenuLateral />

      {/* Conteúdo */}
      <main className="wm-main">
        <div className="wm-container">
          {children}
        </div>
      </main>
    </div>
  );
}
