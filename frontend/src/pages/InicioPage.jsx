/**
 * WorkMatch 2.0 — InicioPage (Landing)
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Btn } from "../components/ui";

const SERVICOS = [
  { emoji: "🔌", label: "Eletricista" }, { emoji: "🔧", label: "Encanador" },
  { emoji: "🌿", label: "Jardineiro" }, { emoji: "🧹", label: "Faxineiro" },
  { emoji: "🎨", label: "Pintor" },     { emoji: "🏗️", label: "Pedreiro" },
  { emoji: "🪚", label: "Marceneiro" }, { emoji: "🧰", label: "Reparos gerais" },
];

const PASSOS = [
  { n: "1", emoji: "🔍", title: "Encontre", desc: "Busque por especialidade ou cidade." },
  { n: "2", emoji: "📅", title: "Escolha", desc: "Selecione data e horário disponíveis." },
  { n: "3", emoji: "✅", title: "Confirme", desc: "Agendamento confirmado com um clique." },
];

const DIFERENCIAIS = [
  { emoji: "🛡️", title: "Profissionais verificados", desc: "CPF e dados validados antes do cadastro." },
  { emoji: "⏰", title: "Agenda em tempo real", desc: "Horários atualizados na hora." },
  { emoji: "📱", title: "Fácil de usar", desc: "Pensado para ser simples para todos." },
  { emoji: "💬", title: "Suporte dedicado", desc: "Equipe pronta para ajudar." },
];

export default function InicioPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--clr-bg)" }}>

      {/* ── Navbar ── */}
      <nav className="wm-header">
        <div className="wm-header__inner">
          <div className="wm-header__brand">
            <div className="wm-header__logo-mark">🔧</div>
            <div>
              <div className="wm-header__title">WorkMatch</div>
              <div className="wm-header__subtitle">Serviços autônomos</div>
            </div>
          </div>
          <div className="wm-header__nav">
            <button className="wm-nav-link" onClick={() => navigate("/login")}>Entrar</button>
            <button className="wm-nav-link" onClick={() => navigate("/cadastro")}>Criar conta</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="wm-hero" style={{ paddingTop: 120 }}>
        <div className="wm-animate-fadeUp" style={{ position: "relative", zIndex: 1 }}>
          <div className="wm-hero__eyebrow">✨ Plataforma de serviços autônomos</div>
          <h1 className="wm-hero__title">
            O profissional certo,<br />
            <em>no momento certo.</em>
          </h1>
          <p className="wm-hero__desc">
            Agende eletricistas, encanadores, jardineiros e muito mais —
            com facilidade e segurança.
          </p>
          <div className="wm-hero__actions">
            <Btn variant="accent" size="lg" onClick={() => navigate("/cadastro")}>
              🚀 Começar agora — é grátis
            </Btn>
            <button
              className="wm-nav-link"
              style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "var(--r-full)", padding: "0 var(--sp-6)", height: 48 }}
              onClick={() => navigate("/login")}
            >
              Já tenho conta
            </button>
          </div>
          <div className="wm-hero__stats">
            {[["500+", "Profissionais"], ["2.4k", "Agendamentos"], ["4.8★", "Avaliação"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div className="wm-hero__stat-val">{n}</div>
                <div className="wm-hero__stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Serviços ── */}
      <section style={{ padding: "72px var(--sp-6)", maxWidth: "var(--container)", margin: "0 auto" }}>
        <p className="wm-page-hero__eyebrow" style={{ textAlign: "center", marginBottom: "var(--sp-2)" }}>Categorias</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,4vw,36px)", color: "var(--clr-navy)", textAlign: "center", marginBottom: "var(--sp-12)", fontWeight: 400 }}>
          Serviços disponíveis
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: "var(--sp-4)" }}>
          {SERVICOS.map(s => (
            <div
              key={s.label}
              onClick={() => navigate("/cadastro")}
              style={{
                background: "var(--clr-surface)", border: "1.5px solid var(--clr-border)",
                borderRadius: "var(--r-lg)", padding: "var(--sp-6) var(--sp-4)",
                textAlign: "center", cursor: "pointer",
                transition: "all var(--t-base)",
                boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-purple)"; e.currentTarget.style.boxShadow = "var(--shadow-purple)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 34, marginBottom: "var(--sp-3)" }}>{s.emoji}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--clr-navy)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section style={{ padding: "72px var(--sp-6)", background: "var(--clr-purple-pale)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <p className="wm-page-hero__eyebrow" style={{ textAlign: "center", marginBottom: "var(--sp-2)" }}>Simples assim</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,4vw,36px)", color: "var(--clr-navy)", textAlign: "center", marginBottom: "var(--sp-12)", fontWeight: 400 }}>
            Como funciona
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "var(--sp-6)" }}>
            {PASSOS.map(p => (
              <div key={p.n} style={{
                background: "var(--clr-surface)", borderRadius: "var(--r-lg)",
                padding: "var(--sp-8) var(--sp-6)", position: "relative",
                border: "1px solid var(--clr-border)", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  position: "absolute", top: -14, left: 24,
                  background: "var(--clr-purple)", color: "#fff",
                  width: 30, height: 30, borderRadius: "var(--r-full)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900,
                }}>{p.n}</div>
                <div style={{ fontSize: 34, marginBottom: "var(--sp-4)", marginTop: "var(--sp-2)" }}>{p.emoji}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: "var(--sp-2)", color: "var(--clr-navy)" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "var(--clr-text-mid)", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section style={{ padding: "72px var(--sp-6)", maxWidth: "var(--container)", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,4vw,36px)", color: "var(--clr-navy)", textAlign: "center", marginBottom: "var(--sp-12)", fontWeight: 400 }}>
          Por que WorkMatch?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "var(--sp-5)" }}>
          {DIFERENCIAIS.map(d => (
            <div key={d.title} style={{ background: "var(--clr-surface)", borderRadius: "var(--r-lg)", padding: "var(--sp-6)", border: "1px solid var(--clr-border)", borderTop: "3px solid var(--clr-purple)" }}>
              <div style={{ fontSize: 34, marginBottom: "var(--sp-4)" }}>{d.emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: "var(--sp-2)", color: "var(--clr-navy)" }}>{d.title}</h3>
              <p style={{ fontSize: 14, color: "var(--clr-text-mid)", lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(160deg, var(--clr-navy-deep) 0%, var(--clr-purple-mid) 50%, var(--clr-navy-mid) 100%)", padding: "80px var(--sp-6)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,5vw,48px)", color: "#fff", marginBottom: "var(--sp-4)", fontWeight: 400 }}>
          Pronto para começar?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, marginBottom: "var(--sp-10)" }}>
          Crie sua conta gratuitamente e agende hoje mesmo.
        </p>
        <Btn variant="accent" size="lg" onClick={() => navigate("/cadastro")}>
          Criar conta grátis →
        </Btn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--clr-navy-deep)", color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "var(--sp-6)", fontSize: 13 }}>
        © {new Date().getFullYear()} WorkMatch — Conectando você ao profissional certo.
      </footer>
    </div>
  );
}
