/**
 * WorkMatch 2.0 — MenuLateral
 * Drawer lateral com classes CSS do novo design system
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_CLIENTE = [
  { label: "Início",            path: "/home",              emoji: "🏠" },
  { label: "Meus Agendamentos", path: "/meus-agendamentos", emoji: "📅" },
  { label: "Meu Perfil",        path: "/perfil",            emoji: "👤" },
  { label: "Suporte",           path: "/suporte",           emoji: "💬" },
];

const NAV_ADMIN = [
  { label: "Início",                  path: "/home",                    emoji: "🏠" },
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
      {/* Botão hamburguer */}
      <button className="wm-menu-btn" onClick={() => setOpen(true)} aria-label="Abrir menu">
        <span /><span /><span />
      </button>

      {/* Overlay */}
      {open && <div className="wm-drawer-overlay" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <aside className={`wm-drawer${open ? "" : " wm-drawer--closed"}`}>
        {/* Header */}
        <div className="wm-drawer__header">
          <button className="wm-drawer__close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
          <div className="wm-drawer__avatar">{nomeInicial}</div>
          <p className="wm-drawer__name">{user?.nome || "Usuário"}</p>
          <p className="wm-drawer__role">{user?.role === "ADMIN" ? "Administrador" : "Cliente"}</p>
        </div>

        {/* Nav */}
        <nav className="wm-drawer__nav">
          <p className="wm-drawer__section-label">Navegação</p>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`wm-drawer__link${active ? " wm-drawer__link--active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="wm-drawer__link-emoji">{item.emoji}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="wm-drawer__footer">
          <button className="wm-drawer__logout" onClick={handleLogout}>
            <span style={{ fontSize: 18 }}>🚪</span>
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
