/**
 * WorkMatch 2.0 — InicioPage (Landing pública)
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Btn } from "../components/ui";

const SERVICOS = [
  { emoji: "🔌", label: "Eletricista" },
  { emoji: "🔧", label: "Encanador" },
  { emoji: "🌿", label: "Jardineiro" },
  { emoji: "🧹", label: "Faxineiro" },
  { emoji: "🎨", label: "Pintor" },
  { emoji: "🏗️", label: "Pedreiro" },
  { emoji: "🪚", label: "Marceneiro" },
  { emoji: "🧰", label: "Reparos gerais" },
];

const PASSOS = [
  { n: "1", emoji: "🔍", title: "Encontre o profissional", desc: "Busque por especialidade ou cidade e veja os perfis disponíveis." },
  { n: "2", emoji: "📅", title: "Escolha data e horário", desc: "Selecione o dia e o horário que melhor se encaixa na sua agenda." },
  { n: "3", emoji: "✅", title: "Confirme o agendamento", desc: "Com um clique, seu agendamento fica confirmado. Simples assim." },
];

const DIFERENCIAIS = [
  { emoji: "🛡️", title: "Profissionais verificados", desc: "Todos os profissionais passam por validação de CPF e dados." },
  { emoji: "⏰", title: "Agenda em tempo real", desc: "Veja horários disponíveis atualizado na hora." },
  { emoji: "📱", title: "Fácil de usar", desc: "Interface pensada para ser simples e intuitiva para todos." },
  { emoji: "💬", title: "Suporte dedicado", desc: "Nossa equipe está pronta para ajudar quando você precisar." },
];

export default function InicioPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", fontFamily: "var(--font-body)", background: "var(--clr-bg)" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--clr-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 68,
      }}>
        <span style={{
          fontWeight: 900,
          fontSize: 26,
          background: "var(--grad-brand)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
        }}>
          WorkMatch
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <Btn variant="ghost" size="sm" onClick={() => navigate("/login")}>Entrar</Btn>
          <Btn variant="primary" size="sm" onClick={() => navigate("/cadastro")}>Criar conta</Btn>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh",
        background: "var(--grad-hero)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Blob decorativo */}
        <div style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          top: -100,
          right: -100,
        }} />
        <div style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(245,158,11,0.12)",
          bottom: -60,
          left: -60,
        }} />

        <div className="animate-fadeUp" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.2)",
            border: "1px solid rgba(245,158,11,0.4)",
            borderRadius: 99,
            padding: "6px 20px",
            fontSize: 14,
            fontWeight: 700,
            color: "#fcd34d",
            marginBottom: 24,
            letterSpacing: "0.04em",
          }}>
            ✨ Plataforma de serviços autônomos
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 7vw, 72px)",
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 760,
          }}>
            O profissional certo,<br />
            <em style={{ color: "#fcd34d" }}>no momento certo.</em>
          </h1>

          <p style={{
            fontSize: "clamp(17px, 2.5vw, 22px)",
            color: "rgba(255,255,255,0.82)",
            maxWidth: 560,
            lineHeight: 1.65,
            margin: "0 auto 40px",
            fontWeight: 500,
          }}>
            Agende eletricistas, encanadores, jardineiros e muito mais —
            com facilidade e segurança, diretamente pelo celular ou computador.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" variant="accent" onClick={() => navigate("/cadastro")}>
              🚀 Começar agora — é grátis
            </Btn>
            <Btn size="lg" variant="ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }} onClick={() => navigate("/login")}>
              Já tenho conta
            </Btn>
          </div>
        </div>
      </section>

      {/* ── Serviços ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, marginBottom: 8, color: "var(--clr-text)" }}>
          Serviços disponíveis
        </h2>
        <p style={{ textAlign: "center", fontSize: 17, color: "var(--clr-muted)", marginBottom: 48 }}>
          Profissionais prontos para te atender
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 16,
        }}>
          {SERVICOS.map((s) => (
            <div
              key={s.label}
              onClick={() => navigate("/cadastro")}
              style={{
                background: "var(--clr-surface)",
                border: "1.5px solid var(--clr-border)",
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--clr-primary-lt)";
                e.currentTarget.style.boxShadow = "var(--shadow-blue)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--clr-border)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{s.emoji}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--clr-text)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section style={{ padding: "72px 24px", background: "var(--clr-primary-bg)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, marginBottom: 8 }}>
            Como funciona
          </h2>
          <p style={{ textAlign: "center", fontSize: 17, color: "var(--clr-muted)", marginBottom: 56 }}>
            Em 3 passos simples você agenda o serviço que precisa
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
            {PASSOS.map((p) => (
              <div key={p.n} style={{
                background: "var(--clr-surface)",
                borderRadius: 20,
                padding: "32px 28px",
                border: "1px solid var(--clr-border)",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  top: -14,
                  left: 24,
                  background: "var(--clr-primary)",
                  color: "#fff",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 900,
                }}>{p.n}</div>
                <div style={{ fontSize: 36, marginBottom: 16, marginTop: 8 }}>{p.emoji}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: "var(--clr-muted)", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, marginBottom: 56 }}>
          Por que escolher o WorkMatch?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {DIFERENCIAIS.map((d) => (
            <div key={d.title} style={{
              background: "var(--clr-surface)",
              borderRadius: 18,
              padding: "28px 24px",
              border: "1px solid var(--clr-border)",
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{d.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{d.title}</h3>
              <p style={{ fontSize: 15, color: "var(--clr-muted)", lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section style={{
        background: "var(--grad-hero)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 5vw, 52px)",
          color: "#fff",
          marginBottom: 16,
        }}>
          Pronto para começar?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 40 }}>
          Crie sua conta gratuitamente e agende seu primeiro serviço hoje.
        </p>
        <Btn size="lg" variant="accent" onClick={() => navigate("/cadastro")}>
          Criar conta grátis →
        </Btn>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "#0f172a",
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        padding: "24px",
        fontSize: 14,
      }}>
        © {new Date().getFullYear()} WorkMatch — Conectando você ao profissional certo.
      </footer>
    </div>
  );
}
