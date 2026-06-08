/**
 * WorkMatch — pages/MeusServicos.jsx
 * CEL Design System v3.0
 *
 * Lógica 100% preservada:
 *  - buscarServicos / contarPorStatus / filtrados
 *  - Acoes component / BADGE_MAP / fmtData
 *  - tabs por role (CLIENTE / PROFISSIONAL)
 *  - searchParams para tab inicial
 *
 * Alterações visuais:
 *  - emoji removido de TABS (apenas label permanece)
 *  - "🤖 Novo serviço com IA" → SVG Bot + texto
 *  - Tab counter badge: var(--clr-purple) → var(--clr-blue) explícito
 *  - EmptyState emoji prop → icon SVG
 *  - Inline 🔧 / 📍 / 📅 / 👷 nos cards → SVG
 *  - "⭐ Avaliar profissional" → SVG Star + texto
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth }   from "../context/AuthContext";
import PageLayout    from "../components/PageLayout";
import { Btn, Card, CardBody, Badge, EmptyState, Spinner } from "../components/ui";
import api           from "../services/api";

/* =========================================================
   ÍCONES SVG — inline, Lucide-style
========================================================= */

const IcoBot = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2M20 14h2M9 17v1M15 17v1M9 13h.01M15 13h.01"/>
  </svg>
);

const IcoWrench = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const IcoMapPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IcoCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const IcoHardHat = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3"/>
  </svg>
);

const IcoUser = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
);

const IcoStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IcoClipboard = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>
  </svg>
);

/* =========================================================
   CONSTANTES — emoji removido (não era exibido de forma CEL)
========================================================= */

const TABS_CLIENTE = [
  { key: "PUBLICADO",  label: "Publicados"   },
  { key: "NEGOCIANDO", label: "Negociando"   },
  { key: "CONTRATADO", label: "Contratados"  },
  { key: "ANDAMENTO",  label: "Em andamento" },
  { key: "FINALIZADO", label: "Finalizados"  },
];

const TABS_PROFISSIONAL = [
  { key: "NEGOCIANDO", label: "Negociando"   },
  { key: "CONTRATADO", label: "Contratados"  },
  { key: "ANDAMENTO",  label: "Em andamento" },
  { key: "FINALIZADO", label: "Finalizados"  },
];

const BADGE_MAP = {
  PUBLICADO:  { variant: "blue",    label: "Publicado"    },
  NEGOCIANDO: { variant: "warning", label: "Negociando"   },
  CONTRATADO: { variant: "info",    label: "Contratado"   },
  ANDAMENTO:  { variant: "info",    label: "Em andamento" },
  FINALIZADO: { variant: "success", label: "Finalizado"   },
};

/* =========================================================
   HELPER — preservado
========================================================= */

function fmtData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

/* =========================================================
   ACOES — lógica preservada, emoji ⭐ → SVG Star
========================================================= */

function Acoes({ servico, role }) {
  const { status } = servico;

  if (role === "CLIENTE") {
    if (status === "PUBLICADO")  return <Btn variant="secondary" size="sm">Ver candidatos</Btn>;
    if (status === "NEGOCIANDO") return <Btn variant="secondary" size="sm">Ver conversa</Btn>;
    if (status === "ANDAMENTO")  return <Btn variant="secondary" size="sm">Acompanhar</Btn>;
    if (status === "FINALIZADO") return (
      /* SVG Star substituindo ⭐ */
      <Btn variant="secondary" size="sm">
        <IcoStar /> Avaliar profissional
      </Btn>
    );
  }

  if (role === "PROFISSIONAL") {
    if (status === "NEGOCIANDO") return <Btn variant="secondary" size="sm">Ver conversa</Btn>;
    if (status === "ANDAMENTO")  return <Btn variant="primary"   size="sm">Marcar como concluído</Btn>;
  }

  return null;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function MeusServicos() {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const { user }       = useAuth();

  const isProfissional = user?.role === "PROFISSIONAL";
  const tabs           = isProfissional ? TABS_PROFISSIONAL : TABS_CLIENTE;

  /* Tab inicial via query string — lógica preservada */
  const statusParam = searchParams.get("status")?.toUpperCase();
  const tabInicial  = tabs.find((t) => t.key === statusParam)?.key || tabs[0].key;

  const [aba,      setAba]      = useState(tabInicial);
  const [servicos, setServicos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [erro,     setErro]     = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    buscarServicos();
  }, [user]);

  /* ── Lógica preservada integralmente ── */

  async function buscarServicos() {
    setLoading(true); setErro(null);
    try {
      const endpoint = isProfissional
        ? `/api/servicos/profissional/${user.id}`
        : `/api/servicos/cliente/${user.id}`;
      const { data } = await api.get(endpoint);
      setServicos(data);
    } catch {
      setErro("Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  }

  const filtrados = servicos.filter((s) => s.status === aba);

  function contarPorStatus(status) {
    return servicos.filter((s) => s.status === status).length;
  }

  /* ── Estilo de metadado de card ── */
  const metaStyle = {
    display: "inline-flex", alignItems: "center",
    gap: 4, color: "var(--clr-text-light)", fontSize: 13,
  };

  return (
    <PageLayout
      title="Meus serviços"
      subtitle={isProfissional ? "Seus atendimentos" : "Acompanhe seus serviços"}
      backPath="/home"
    >

      {/* ── Botão novo serviço (CLIENTE) — SVG Bot, sem emoji 🤖 ── */}
      {!isProfissional && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--sp-4)" }}>
          <Btn variant="primary" size="sm" onClick={() => navigate("/novo-servico")}>
            <IcoBot /> Novo serviço com IA
          </Btn>
        </div>
      )}

      {/* ── Abas de status — sem emoji, apenas label + contador ── */}
      <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
        {tabs.map((tab) => {
          const ativo = aba === tab.key;
          const count = contarPorStatus(tab.key);
          return (
            <button
              key={tab.key}
              onClick={() => setAba(tab.key)}
              style={{
                display:     "flex",
                alignItems:  "center",
                gap:         "var(--sp-2)",
                padding:     "var(--sp-2) var(--sp-4)",
                borderRadius:"var(--r-full)",
                border:      "1.5px solid",
                /* var(--clr-blue) explícito — sem depender do alias purple */
                borderColor: ativo ? "var(--clr-blue)"    : "var(--clr-border)",
                background:  ativo ? "var(--clr-blue)"    : "var(--clr-surface)",
                color:       ativo ? "#fff"                : "var(--clr-text-mid)",
                fontWeight:  600,
                fontSize:    13,
                cursor:      "pointer",
                fontFamily:  "var(--font-body)",
                transition:  "all var(--t-fast)",
              }}
            >
              {tab.label}

              {/* Contador — badge pill */}
              {count > 0 && (
                <span style={{
                  background:   ativo ? "rgba(255,255,255,0.25)" : "var(--clr-blue-pale)",
                  color:        ativo ? "#fff"                   : "var(--clr-blue)",
                  borderRadius: "var(--r-full)",
                  padding:      "1px 7px",
                  fontSize:     11,
                  fontWeight:   700,
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Loading ── */}
      {loading && <Spinner size="md" center />}

      {/* ── Erro com retry ── */}
      {!loading && erro && (
        <div style={{ textAlign: "center", padding: "var(--sp-6)", color: "var(--clr-danger)" }}>
          {erro}
          <br />
          <Btn variant="secondary" size="sm" onClick={buscarServicos}
            style={{ marginTop: "var(--sp-3)" }}>
            Tentar novamente
          </Btn>
        </div>
      )}

      {/* ── Estado vazio — icon SVG, sem emoji da tab ── */}
      {!loading && !erro && filtrados.length === 0 && (
        <EmptyState
          icon={<IcoClipboard />}
          title="Nenhum serviço aqui"
          description="Você não tem serviços com este status no momento."
          action={
            !isProfissional
              ? <Btn variant="secondary" onClick={() => navigate("/novo-servico")}>Publicar serviço</Btn>
              : <Btn variant="secondary" onClick={() => navigate("/home")}>Ver publicações</Btn>
          }
        />
      )}

      {/* ── Lista de serviços ── */}
      {!loading && !erro && filtrados.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          {filtrados.map((s, i) => (
            <div key={s.id} className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}>
              <Card>
                <CardBody>

                  {/* ── Cabeçalho: título + badge status ── */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", flexWrap: "wrap",
                    gap: "var(--sp-3)", marginBottom: "var(--sp-3)",
                  }}>
                    <div>
                      <div style={{
                        display: "flex", alignItems: "center",
                        gap: "var(--sp-2)", flexWrap: "wrap",
                        marginBottom: "var(--sp-1)",
                      }}>
                        <h3 style={{ fontWeight: 700, color: "var(--clr-navy)", fontSize: 15 }}>
                          {s.titulo}
                        </h3>
                        <Badge variant={BADGE_MAP[s.status]?.variant}>
                          {BADGE_MAP[s.status]?.label}
                        </Badge>
                      </div>

                      {/* Metadados — SVG substituindo 🔧 📍 📅 */}
                      <p style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={metaStyle}><IcoWrench />{s.especialidade}</span>
                        <span style={{ color: "var(--clr-border-mid)" }}>·</span>
                        <span style={metaStyle}><IcoMapPin />{s.cidade}/{s.estado}</span>
                        <span style={{ color: "var(--clr-border-mid)" }}>·</span>
                        <span style={metaStyle}><IcoCalendar />{fmtData(s.dataCriacao)}</span>
                      </p>
                    </div>
                  </div>

                  {/* ── Partes envolvidas — SVG substituindo 👷 / 👤 ── */}
                  <div style={{
                    display: "flex", gap: "var(--sp-4)", flexWrap: "wrap",
                    fontSize: 13, marginBottom: "var(--sp-4)",
                  }}>
                    {!isProfissional && s.profissionalNome && (
                      <span style={{ ...metaStyle, color: "var(--clr-text-mid)", fontSize: 13 }}>
                        <IcoHardHat /> Profissional: {s.profissionalNome}
                      </span>
                    )}
                    {isProfissional && s.clienteNome && (
                      <span style={{ ...metaStyle, color: "var(--clr-text-mid)", fontSize: 13 }}>
                        <IcoUser /> Cliente: {s.clienteNome}
                      </span>
                    )}
                  </div>

                  {/* ── Ações — componente Acoes (⭐ substituído por SVG Star) ── */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Acoes servico={s} role={user?.role} />
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
