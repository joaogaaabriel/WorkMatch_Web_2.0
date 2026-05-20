/**
 * WorkMatch 2.0 — HomeClient
 * Tela principal do cliente: boas-vindas, botão IA, como funciona, resumo de serviços
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody, Badge } from "../components/ui";

const COMO_FUNCIONA = [
  {
    n: "1",
    emoji: "🤖",
    title: "Converse com a IA",
    desc: "Nossa inteligência artificial coleta os detalhes do seu serviço por meio de uma conversa simples e natural.",
  },
  {
    n: "2",
    emoji: "📋",
    title: "Publicação automática",
    desc: "A IA organiza as informações e publica o seu serviço para que profissionais qualificados possam se candidatar.",
  },
  {
    n: "3",
    emoji: "🤝",
    title: "Negocie e contrate",
    desc: "Avalie os candidatos, negocie os detalhes e contrate o profissional ideal para o seu serviço.",
  },
  {
    n: "4",
    emoji: "✅",
    title: "Serviço concluído",
    desc: "Após a conclusão, avalie o profissional e ajude outros clientes a encontrar os melhores.",
  },
];

const STATUS_CARDS = [
  { label: "Publicados",   emoji: "📋", color: "var(--clr-blue)",    path: "/meus-servicos?status=publicado"   },
  { label: "Negociando",   emoji: "💬", color: "var(--clr-warning)", path: "/meus-servicos?status=negociando"  },
  { label: "Em andamento", emoji: "⚙️", color: "var(--clr-teal)",    path: "/meus-servicos?status=andamento"   },
  { label: "Concluídos",   emoji: "✅", color: "var(--clr-success)", path: "/meus-servicos?status=concluido"   },
];

export default function HomeCliente() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const primeiroNome = user?.nome?.split(" ")[0] || "Cliente";

  return (
    <PageLayout title="Início" subtitle="Bem-vindo ao WorkMatch">

      {/* ── Boas-vindas ── */}
      <div
        className="wm-animate-fadeUp"
        style={{
          background: "linear-gradient(135deg, var(--clr-navy-deep) 0%, var(--clr-purple-mid) 100%)",
          borderRadius: "var(--r-xl)",
          padding: "var(--sp-8) var(--sp-8)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--sp-6)",
          marginBottom: "var(--sp-6)",
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--sp-2)" }}>
            Olá, {primeiroNome} 👋
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3vw,32px)", marginBottom: "var(--sp-3)", lineHeight: 1.2 }}>
            Precisa de um profissional?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, maxWidth: 420, lineHeight: 1.6 }}>
            Converse com nossa IA e publique seu serviço em minutos. Profissionais da sua região vão se candidatar.
          </p>
        </div>
        <Btn
          variant="accent"
          size="lg"
          onClick={() => navigate("/novo-servico")}
          style={{ flexShrink: 0 }}
        >
          🤖 Iniciar com IA
        </Btn>
      </div>

      {/* ── Resumo de serviços ── */}
      <div style={{ marginBottom: "var(--sp-6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-4)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--clr-navy)" }}>
            Meus serviços
          </h3>
          <button
            onClick={() => navigate("/meus-servicos")}
            style={{ background: "none", border: "none", color: "var(--clr-purple)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            Ver todos →
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--sp-4)" }}>
          {STATUS_CARDS.map((s, i) => (
            <div
              key={s.label}
              className={`wm-animate-fadeUp wm-delay-${i + 1}`}
              onClick={() => navigate(s.path)}
              style={{
                background: "var(--clr-surface)",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--clr-border)",
                borderTop: `3px solid ${s.color}`,
                padding: "var(--sp-5)",
                cursor: "pointer",
                transition: "box-shadow var(--t-base), transform var(--t-base)",
                boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: "var(--sp-3)" }}>{s.emoji}</div>
              <p style={{ fontWeight: 700, color: "var(--clr-navy)", fontSize: 13 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Como funciona ── */}
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--clr-navy)", marginBottom: "var(--sp-4)" }}>
          Como funciona
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--sp-4)" }}>
          {COMO_FUNCIONA.map((p, i) => (
            <Card key={p.n} className={`wm-animate-fadeUp wm-delay-${i + 1}`}>
              <CardBody>
                <div style={{ position: "relative", display: "inline-flex", marginBottom: "var(--sp-4)" }}>
                  <span style={{ fontSize: 32 }}>{p.emoji}</span>
                  <span style={{
                    position: "absolute", top: -6, right: -10,
                    background: "var(--clr-purple)", color: "#fff",
                    width: 20, height: 20, borderRadius: "var(--r-full)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 900,
                  }}>{p.n}</span>
                </div>
                <p style={{ fontWeight: 700, color: "var(--clr-navy)", marginBottom: "var(--sp-2)", fontSize: 15 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: "var(--clr-text-mid)", lineHeight: 1.6 }}>{p.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

    </PageLayout>
  );
}