/**
 * WorkMatch 2.0 — PageLayout
 * Wrapper para páginas autenticadas: header fixo + menu lateral + conteúdo
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "./MenuLateral";

export default function PageLayout({ title, subtitle, backPath, children, headerRight }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--clr-bg)", display: "flex", flexDirection: "column" }}>
      {/* ── Topbar fixa ── */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "var(--header-h)",
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--clr-border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px 0 80px",
        zIndex: 100,
        gap: 16,
      }}>
        {backPath && (
          <button
            onClick={() => navigate(backPath)}
            aria-label="Voltar"
            style={{
              background: "var(--clr-primary-bg)",
              border: "none",
              borderRadius: 10,
              width: 40,
              height: 40,
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--clr-primary)",
              flexShrink: 0,
            }}
          >←</button>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <h1 style={{
              fontSize: "clamp(18px, 3vw, 24px)",
              fontWeight: 800,
              color: "var(--clr-text)",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{title}</h1>
          )}
          {subtitle && (
            <p style={{ fontSize: 13, color: "var(--clr-muted)", fontWeight: 500, marginTop: 2 }}>
              {subtitle}
            </p>
          )}
        </div>

        {headerRight && (
          <div style={{ flexShrink: 0 }}>
            {headerRight}
          </div>
        )}
      </header>

      <MenuLateral />

      {/* ── Conteúdo principal ── */}
      <main style={{
        flex: 1,
        marginTop: "var(--header-h)",
        padding: "32px 20px 48px",
        maxWidth: 1200,
        width: "100%",
        margin: "var(--header-h) auto 0",
      }}>
        {children}
      </main>
    </div>
  );
}
