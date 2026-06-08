/**
 * WorkMatch — components/MenuLateral.jsx
 * CEL Design System v3.0
 *
 * Lógica 100% preservada:
 *  - useAuth() / logout() / navigate / location
 *  - NAV_CLIENTE / NAV_PROFISSIONAL / active state
 *  - open state / handleNav / handleLogout
 *
 * Alterações visuais:
 *  - Emojis de navegação → SVG profissional inline (CEL)
 *  - Emoji de role no header → texto puro + ícone SVG
 *  - Botão fechar × → SVG X (padrão CEL modal/drawer)
 *  - Botão logout 🚪 → SVG LogOut
 *  - wm-drawer__link-emoji → wm-drawer__link-icon
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   ÍCONES SVG — inline, sem dependência externa
   Estilo Lucide: stroke, round caps, 24×24 viewBox
========================================================= */

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconClipboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const IconMessage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconHardHat = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" />
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
  </svg>
);

const IconUserRole = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const IconLogOut = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    aria-hidden="true">
    <path d="M2 2l10 10M12 2L2 12" />
  </svg>
);

/* =========================================================
   ITENS DE NAVEGAÇÃO
   Substituição de `emoji` por `icon` (componente SVG)
   Paths e labels inalterados.
========================================================= */

const NAV_CLIENTE = [
  { label: "Início",        path: "/home",          icon: IconHome      },
  { label: "Meus serviços", path: "/meus-servicos", icon: IconClipboard },
  { label: "Meu perfil",    path: "/perfil",        icon: IconUser      },
  { label: "Suporte",       path: "/suporte",       icon: IconMessage   },
];

const NAV_PROFISSIONAL = [
  { label: "Publicações",   path: "/home",               icon: IconHome      },
  { label: "Meus serviços", path: "/meus-servicos-prof", icon: IconClipboard },
  { label: "Meu perfil",    path: "/perfil-profissional", icon: IconUser     },
  { label: "Suporte",       path: "/suporte",             icon: IconMessage  },
];

/* =========================================================
   COMPONENTE
========================================================= */

export default function MenuLateral() {
  const [open, setOpen]   = useState(false);
  const navigate          = useNavigate();
  const location          = useLocation();
  const { user, logout }  = useAuth();

  const isProfissional = user?.role === "PROFISSIONAL";
  const navItems       = isProfissional ? NAV_PROFISSIONAL : NAV_CLIENTE;
  const nomeInicial    = user?.nome ? user.nome.charAt(0).toUpperCase() : "U";

  /* ── Lógica preservada integralmente ── */

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
      {/* ── Botão hamburguer — integrado ao header navy (CSS) ── */}
      <button
        className="wm-menu-btn"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu de navegação"
        aria-expanded={open}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {/* ── Overlay ── */}
      {open && (
        <div
          className="wm-drawer-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer ── */}
      <aside
        className={`wm-drawer${open ? "" : " wm-drawer--closed"}`}
        aria-label="Menu de navegação"
        aria-hidden={!open}
      >

        {/* Cabeçalho do drawer — navy com radial gradient (CSS) */}
        <div className="wm-drawer__header">

          {/* Botão fechar — SVG X (padrão CEL) */}
          <button
            className="wm-drawer__close"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <IconClose />
          </button>

          {/* Avatar com inicial do nome */}
          <div className="wm-drawer__avatar" aria-hidden="true">
            {nomeInicial}
          </div>

          {/* Nome do usuário */}
          <p className="wm-drawer__name">
            {user?.nome || "Usuário"}
          </p>

          {/* Role — texto puro + ícone SVG (sem emoji) */}
          <p className="wm-drawer__role">
            <span
              style={{
                display:    "inline-flex",
                alignItems: "center",
                gap:        4,
              }}
            >
              {isProfissional ? <IconHardHat /> : <IconUserRole />}
              {isProfissional ? "Profissional" : "Cliente"}
            </span>
          </p>

        </div>

        {/* ── Navegação ── */}
        <nav className="wm-drawer__nav" aria-label="Navegação principal">
          <p className="wm-drawer__section-label">Navegação</p>

          {navItems.map((item) => {
            const active  = location.pathname === item.path;
            const NavIcon = item.icon;

            return (
              <button
                key={item.path}
                className={[
                  "wm-drawer__link",
                  active ? "wm-drawer__link--active" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => handleNav(item.path)}
                aria-current={active ? "page" : undefined}
              >
                {/* Ícone SVG — substitui emoji */}
                <span className="wm-drawer__link-icon">
                  <NavIcon />
                </span>

                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Rodapé — botão sair ── */}
        <div className="wm-drawer__footer">
          <button
            className="wm-drawer__logout"
            onClick={handleLogout}
          >
            {/* Ícone SVG — substitui 🚪 */}
            <IconLogOut />
            Sair da conta
          </button>
        </div>

      </aside>
    </>
  );
}
