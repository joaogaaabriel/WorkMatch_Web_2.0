/**
 * WorkMatch — components/PageLayout.jsx
 * CEL Design System v3.0
 *
 * Layout padrão de todas as páginas internas.
 * Props inalteradas: title, subtitle, backPath, children, headerRight
 *
 * Alterações visuais:
 *  - Botão "voltar": texto ← → SVG ChevronLeft (CEL)
 *  - Logo-mark WorkMatch no lado direito do topbar (quando não há headerRight)
 *  - Animação de entrada wmPageIn no <main>
 *  - Wrapper div sem inline styles redundantes (CSS cuida do background)
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import MenuLateral from "./MenuLateral";

/* ── Ícone voltar — CEL (SVG, sem texto) ── */
function IconChevronLeft() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/*
 * Logo-mark WorkMatch — adaptado do padrão CEL
 * Fundo navy translúcido + topo amarelo + ícone ferramenta #1E5FAF
 * Exibido no topbar quando não há headerRight, para consistência de marca.
 */
function LogoMark() {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            "var(--sp-2)",
        flexShrink:     0,
        opacity:        0.85,
        userSelect:     "none",
      }}
      aria-hidden="true"
    >
      <svg
        width="28" height="28" viewBox="0 0 28 28"
        fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fundo com opacidade — padrão CEL logo-mark */}
        <rect width="28" height="28" rx="6" fill="#F2C94C" fillOpacity="0.15" />

        {/* Chave inglesa — ícone representativo do WorkMatch */}
        <path
          d="M18.5 7a4.5 4.5 0 0 0-4.33 5.73L7.5 19.4a1.5 1.5 0 1 0 2.1 2.1l6.67-6.67A4.5 4.5 0 1 0 18.5 7Z"
          fill="#F2C94C" fillOpacity="0.9"
        />
        <path
          d="M18.5 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
          fill="#1E5FAF"
        />
        <path
          d="M8.5 20.5a1 1 0 1 1-1.5-1.5"
          stroke="#1E5FAF" strokeWidth="1.5" strokeLinecap="round"
        />
      </svg>

      <span
        style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "0.95rem",
          color:         "#fff",
          letterSpacing: "-0.01em",
          lineHeight:    1,
        }}
      >
        WorkMatch
      </span>
    </div>
  );
}

/* ── Componente principal ── */

export default function PageLayout({
  title,
  subtitle,
  backPath,
  children,
  headerRight,
}) {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Topbar — navy fixo, CEL ── */}
      <header className="wm-topbar">

        {/* Botão voltar — SVG ChevronLeft */}
        {backPath && (
          <button
            className="wm-topbar__back"
            onClick={() => navigate(backPath)}
            aria-label="Voltar"
          >
            <IconChevronLeft />
          </button>
        )}

        {/* Grupo título + subtítulo */}
        <div className="wm-topbar__title-group">
          {title    && <h1 className="wm-topbar__title">{title}</h1>}
          {subtitle && <p  className="wm-topbar__subtitle">{subtitle}</p>}
        </div>

        {/*
         * Lado direito do topbar:
         *  - Se `headerRight` foi passado, exibe os botões/ações da página
         *  - Caso contrário, exibe o logo-mark WorkMatch para consistência de marca CEL
         */}
        {headerRight
          ? <div style={{ flexShrink: 0 }}>{headerRight}</div>
          : <LogoMark />
        }

      </header>

      {/* Menu lateral deslizante */}
      <MenuLateral />

      {/* Conteúdo da página — animação de entrada CEL (wmPageIn) */}
      <main className="wm-main wm-animate-page">
        <div className="wm-container">
          {children}
        </div>
      </main>
    </div>
  );
}
