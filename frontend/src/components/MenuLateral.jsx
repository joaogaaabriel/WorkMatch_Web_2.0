/**
 * WorkMatch 2.0 — MenuLateral
 * Menu lateral com navegação separada por role: CLIENTE e PROFISSIONAL
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_CLIENTE = [
    { label: "Início",       path: "/home",          emoji: "🏠" },
    { label: "Meus serviços",path: "/meus-servicos", emoji: "📋" },
    { label: "Meu perfil",   path: "/perfil",        emoji: "👤" },
    { label: "Suporte",      path: "/suporte",       emoji: "💬" },
];

const NAV_PROFISSIONAL = [
    { label: "Publicações",  path: "/home",                   emoji: "🏠" },
    { label: "Meus serviços",path: "/meus-servicos-prof",     emoji: "📋" },
    { label: "Meu perfil",   path: "/perfil-profissional",    emoji: "👤" },
    { label: "Suporte",      path: "/suporte",                emoji: "💬" },
];

export default function MenuLateral() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const isProfissional = user?.role === "PROFISSIONAL";
    const navItems = isProfissional ? NAV_PROFISSIONAL : NAV_CLIENTE;
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
            <button className="wm-menu-btn" onClick={() => setOpen(true)} aria-label="Abrir menu">
                <span /><span /><span />
            </button>

            {open && <div className="wm-drawer-overlay" onClick={() => setOpen(false)} />}

            <aside className={`wm-drawer${open ? "" : " wm-drawer--closed"}`}>
                <div className="wm-drawer__header">
                    <button className="wm-drawer__close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
                    <div className="wm-drawer__avatar">{nomeInicial}</div>
                    <p className="wm-drawer__name">{user?.nome || "Usuário"}</p>
                    <p className="wm-drawer__role">
                        {isProfissional ? "👷 Profissional" : "👤 Cliente"}
                    </p>
                </div>

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