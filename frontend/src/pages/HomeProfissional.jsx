/**
 * WorkMatch — pages/HomeProfissional.jsx
 * CEL Design System v3.0
 *
 * Lógica 100% preservada:
 *  - carregarPublicacoes / handleCandidatar
 *  - URGENCIA_BADGE / fmtData
 *  - estados: publicacoes, loading, erro, candidatando
 *  - fetch nativo / API_URL
 *
 * Alterações visuais:
 *  - "Olá, {nome} 👷" → sem emoji
 *  - "📋 Meus serviços" / "👤 Meu perfil" → SVG + texto
 *  - emoji="🔍" EmptyState → icon SVG
 *  - Inline 📍 / 🕐 / 📌 / ✋ nos cards → SVG
 */

import React, { useEffect, useState } from "react";
import { useNavigate }  from "react-router-dom";
import { useAuth }      from "../context/AuthContext";
import PageLayout       from "../components/PageLayout";
import { Btn, Card, CardBody, Badge, Spinner, EmptyState } from "../components/ui";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================================================
   CONSTANTES — preservadas
========================================================= */

const URGENCIA_BADGE = {
  URGENTE: "danger",
  ALTA:    "warning",
  NORMAL:  "neutral",
};

/* =========================================================
   HELPER — preservado
========================================================= */

function fmtData(data) {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* =========================================================
   ÍCONES SVG — inline, Lucide-style
========================================================= */

const IcoClipboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>
  </svg>
);

const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
);

const IcoSearch = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const IcoMapPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IcoClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoTag = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
  </svg>
);

const IcoSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const IcoWrench = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

/* =========================================================
   COMPONENTE
========================================================= */

export default function HomeProfissional() {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const primeiroNome = user?.nome?.split(" ")[0] || "Profissional";

  const [publicacoes,  setPublicacoes]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [erro,         setErro]         = useState("");
  const [candidatando, setCandidatando] = useState(null);

  useEffect(() => { carregarPublicacoes(); }, []);

  /* ── Lógica preservada integralmente ── */

  async function carregarPublicacoes() {
    try {
      setLoading(true); setErro("");
      const response = await fetch(`${API_URL}/api/servicos/publicados`);
      if (!response.ok) throw new Error("Erro ao buscar publicações");
      const data = await response.json();
      setPublicacoes(data);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCandidatar(servicoId) {
    setCandidatando(servicoId);
    try {
      const response = await fetch(`${API_URL}/api/candidaturas`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ servicoId, profissionalId: user.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao candidatar");
      alert("Candidatura enviada!");
      navigate(`/chat/${servicoId}`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setCandidatando(null);
    }
  }

  /* ── Estilo compartilhado de metadado (localização, data, etc.) ── */
  const metaStyle = {
    fontSize: 13, color: "var(--clr-text-light)",
    display: "flex", alignItems: "center", gap: 5,
  };

  return (
    <PageLayout title="Publicações" subtitle="Serviços disponíveis na sua região">

      {/* ── Banner boas-vindas ── */}
      <div
        className="wm-animate-fadeUp"
        style={{
          background:    "linear-gradient(135deg, var(--clr-navy-deep) 0%, var(--clr-blue) 100%)",
          borderRadius:  "var(--r-xl)",
          padding:       "var(--sp-6) var(--sp-8)",
          color:         "#fff",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"space-between",
          flexWrap:      "wrap",
          gap:           "var(--sp-4)",
          marginBottom:  "var(--sp-6)",
        }}
      >
        <div>
          {/* Saudação — emoji 👷 removido, padrão CEL */}
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--sp-1)",
          }}>
            Olá, {primeiroNome}
          </p>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize:   "clamp(18px, 2.5vw, 26px)",
            lineHeight: 1.2,
          }}>
            {publicacoes.length > 0
              ? `${publicacoes.length} ${publicacoes.length === 1 ? "serviço disponível" : "serviços disponíveis"}`
              : "Serviços disponíveis"}
          </h2>
        </div>

        {/* Botões de ação — SVG sem emojis 📋 👤 */}
        <div style={{ display: "flex", gap: "var(--sp-3)" }}>
          <Btn variant="secondary" size="sm" onClick={() => navigate("/meus-servicos")}>
            <IcoClipboard />
            Meus serviços
          </Btn>
          <Btn variant="accent" size="sm" onClick={() => navigate("/perfil-profissional")}>
            <IcoUser />
            Meu perfil
          </Btn>
        </div>
      </div>

      {/* ── Loading — Spinner centralizado ── */}
      {loading && <Spinner size="md" center />}

      {/* ── Erro ── */}
      {!loading && erro && (
        <Card>
          <CardBody>
            <p style={{ color: "var(--clr-danger)", fontWeight: 600 }}>{erro}</p>
          </CardBody>
        </Card>
      )}

      {/* ── Estado vazio — icon SVG em vez de emoji 🔍 ── */}
      {!loading && !erro && publicacoes.length === 0 && (
        <EmptyState
          icon={<IcoSearch />}
          title="Nenhuma publicação disponível"
          description="Não há serviços publicados no momento. Volte em breve."
        />
      )}

      {/* ── Feed de publicações ── */}
      {!loading && !erro && publicacoes.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          {publicacoes.map((pub, i) => (
            <div
              key={pub.id}
              className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}
            >
              <Card>
                <CardBody>

                  {/* ── Cabeçalho do card ── */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap",
                    gap: "var(--sp-3)", marginBottom: "var(--sp-4)",
                  }}>
                    <div style={{ flex: 1 }}>

                      {/* Título + badge de urgência */}
                      <div style={{
                        display: "flex", alignItems: "center",
                        gap: "var(--sp-2)", flexWrap: "wrap",
                        marginBottom: "var(--sp-2)",
                      }}>
                        <h3 style={{ fontWeight: 700, color: "var(--clr-navy)", fontSize: 16 }}>
                          {pub.titulo}
                        </h3>
                        <Badge variant={URGENCIA_BADGE[pub.urgencia] || "neutral"}>
                          {pub.urgencia || "NORMAL"}
                        </Badge>
                      </div>

                      {/* Especialidade */}
                      <p style={{ fontSize: 14, color: "var(--clr-text-mid)", marginBottom: "var(--sp-1)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <IcoWrench /> {pub.especialidade}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ── Metadados — SVG substituindo emojis 📍 🕐 📌 ── */}
                  <div style={{
                    display: "flex", gap: "var(--sp-5)", flexWrap: "wrap",
                    marginBottom: "var(--sp-4)",
                  }}>
                    {/* Localização — SVG MapPin */}
                    <span style={metaStyle}>
                      <IcoMapPin />
                      {pub.cidade} — {pub.estado}
                    </span>

                    {/* Data — SVG Clock */}
                    <span style={metaStyle}>
                      <IcoClock />
                      {fmtData(pub.criadoEm || pub.dataCriacao)}
                    </span>

                    {/* Status — SVG Tag */}
                    <span style={metaStyle}>
                      <IcoTag />
                      {pub.status}
                    </span>
                  </div>

                  {/* Descrição (se existir) */}
                  {pub.descricao && (
                    <p style={{
                      fontSize: 14, color: "var(--clr-text-mid)",
                      lineHeight: 1.6, marginBottom: "var(--sp-4)",
                      borderLeft: "3px solid var(--clr-border)",
                      paddingLeft: "var(--sp-3)",
                    }}>
                      {pub.descricao}
                    </p>
                  )}

                  {/* ── Botão candidatar — SVG Send, sem emoji ✋ ── */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Btn
                      variant="primary"
                      size="sm"
                      disabled={candidatando === pub.id}
                      onClick={() => handleCandidatar(pub.id)}
                    >
                      {candidatando === pub.id
                        ? "Enviando..."
                        : <><IcoSend /> Candidatar-se</>
                      }
                    </Btn>
                  </div>

                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      )}

    </PageLayout>
  );
}
