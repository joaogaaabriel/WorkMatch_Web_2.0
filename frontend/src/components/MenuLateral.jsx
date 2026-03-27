/**
 * WorkMatch 2.0 — MenuLateral
 * BUG CORRIGIDO: logout limpa AuthContext | menu filtrado por role
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_CLIENTE = [
  { label: "Início",            path: "/home",               emoji: "🏠" },
  { label: "Meus Agendamentos", path: "/meus-agendamentos",  emoji: "📅" },
  { label: "Meu Perfil",        path: "/perfil",             emoji: "👤" },
  { label: "Suporte",           path: "/suporte",            emoji: "💬" },
];

const NAV_ADMIN = [
  { label: "Início",                path: "/home",                    emoji: "🏠" },
  { label: "Gerenciar Profissionais", path: "/gerenciar-profissionais", emoji: "👷" },
];

export default function MenuLateral() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = user?.role === "ADMIN" ? NAV_ADMIN : NAV_CLIENTE;
  const nomeInicial = user?.nome ? user.nome.charAt(0).toUpperCase() : "U";

  function handleLogout() {
    logout();
    navigate("/login");
    setOpen(false);
  }

  function handleNav(path) {
    navigate(path);
    setOpen(false);
  }

  return (
    <>
      {/* ── Botão hambúrguer ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 200,
          width: 52,
          height: 52,
          borderRadius: 14,
          border: "1.5px solid var(--clr-border)",
          background: "var(--clr-surface)",
          boxShadow: "var(--shadow-md)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          transition: "box-shadow .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-blue)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: "block",
            width: 22,
            height: 2.5,
            background: "var(--clr-primary)",
            borderRadius: 99,
          }} />
        ))}
      </button>

      {/* ── Overlay ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(3px)",
            animation: "fadeIn .2s ease",
          }}
        />
      )}

      {/* ── Drawer ── */}
      <aside style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 400,
        width: 300,
        background: "var(--clr-surface)",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        borderRight: "1px solid var(--clr-border)",
      }}>

        {/* Header do drawer */}
        <div style={{
          padding: "28px 24px 20px",
          background: "var(--grad-hero)",
          color: "#fff",
          flexShrink: 0,
        }}>
          {/* Fechar */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 10,
              width: 36,
              height: 36,
              fontSize: 20,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >×</button>

          {/* Avatar + nome */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 12,
          }}>
            {nomeInicial}
          </div>

          <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>
            {user?.nome || "Usuário"}
          </p>
          <p style={{ fontSize: 13, opacity: 0.75, fontWeight: 500 }}>
            {user?.role === "ADMIN" ? "Administrador" : "Cliente"}
          </p>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "16px 16px 8px", overflowY: "auto" }}>
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--clr-subtle)",
            padding: "8px 12px 6px",
          }}>
            Navegação
          </p>

          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: active ? "var(--clr-primary-bg)" : "transparent",
                  color: active ? "var(--clr-primary)" : "var(--clr-text)",
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 4,
                  transition: "background .15s",
                  borderLeft: active ? "3px solid var(--clr-primary)" : "3px solid transparent",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{
          padding: "16px",
          borderTop: "1px solid var(--clr-border)",
          flexShrink: 0,
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 12,
              border: "1.5px solid #fee2e2",
              background: "#fff5f5",
              color: "var(--clr-danger)",
              fontFamily: "var(--font-body)",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff5f5"}
          >
            <span style={{ fontSize: 20 }}>🚪</span>
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
