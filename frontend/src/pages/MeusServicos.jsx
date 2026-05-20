/**
 * WorkMatch 2.0 — MeusServicos
 * Tela unificada de serviços para CLIENTE e PROFISSIONAL.
 * O role do usuário define as tabs, dados e ações exibidos.
 */
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody, Badge, EmptyState } from "../components/ui";

// ─────────────────────────────────────────────
// Configuração por role
// ─────────────────────────────────────────────

const TABS_CLIENTE = [
    { key: "publicado",  label: "Publicados",   emoji: "📋" },
    { key: "negociando", label: "Negociando",   emoji: "💬" },
    { key: "andamento",  label: "Em andamento", emoji: "⚙️" },
    { key: "concluido",  label: "Concluídos",   emoji: "✅" },
];

const TABS_PROFISSIONAL = [
    { key: "negociando", label: "Negociando",   emoji: "💬" },
    { key: "andamento",  label: "Em andamento", emoji: "⚙️" },
    { key: "concluido",  label: "Concluídos",   emoji: "✅" },
];

const BADGE_MAP = {
    publicado:  { variant: "blue",    label: "Publicado"    },
    negociando: { variant: "warning", label: "Negociando"   },
    andamento:  { variant: "info",    label: "Em andamento" },
    concluido:  { variant: "success", label: "Concluído"    },
};

// ─────────────────────────────────────────────
// Mock de dados — substituir por chamada à API
// ─────────────────────────────────────────────

const MOCK_CLIENTE = [
    { id: 1, titulo: "Instalação elétrica",          especialidade: "Eletricista", cidade: "Goiânia", estado: "GO", status: "publicado",  data: "2026-05-18T10:00:00", candidatos: 3, contraparte: null },
    { id: 2, titulo: "Conserto de encanamento",      especialidade: "Encanador",   cidade: "Goiânia", estado: "GO", status: "negociando", data: "2026-05-17T08:00:00", candidatos: 1, contraparte: "João Silva" },
    { id: 3, titulo: "Pintura da sala",              especialidade: "Pintor",      cidade: "Goiânia", estado: "GO", status: "andamento",  data: "2026-05-15T09:00:00", candidatos: 1, contraparte: "Carlos Matos" },
    { id: 4, titulo: "Instalação de ar-condicionado",especialidade: "Eletricista", cidade: "Goiânia", estado: "GO", status: "concluido",  data: "2026-05-10T10:00:00", candidatos: 2, contraparte: "Rafael Souza" },
];

const MOCK_PROFISSIONAL = [
    { id: 1, titulo: "Conserto de encanamento",      especialidade: "Encanador",   cidade: "Goiânia", estado: "GO", status: "negociando", data: "2026-05-18T08:00:00", candidatos: null, contraparte: "Maria Souza" },
    { id: 2, titulo: "Pintura da sala",              especialidade: "Pintor",      cidade: "Goiânia", estado: "GO", status: "andamento",  data: "2026-05-15T09:00:00", candidatos: null, contraparte: "Pedro Lima" },
    { id: 3, titulo: "Instalação elétrica",          especialidade: "Eletricista", cidade: "Goiânia", estado: "GO", status: "concluido",  data: "2026-05-10T10:00:00", candidatos: null, contraparte: "Ana Ferreira", avaliacao: 5 },
    { id: 4, titulo: "Reparo no telhado",            especialidade: "Pedreiro",    cidade: "Goiânia", estado: "GO", status: "concluido",  data: "2026-05-05T10:00:00", candidatos: null, contraparte: "Lucas Pinto",  avaliacao: 4 },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function fmtData(iso) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

function Estrelas({ nota }) {
    return (
        <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
          <span key={n} style={{ color: n <= nota ? "var(--clr-yellow)" : "var(--clr-border-mid)", fontSize: 13 }}>★</span>
      ))}
    </span>
    );
}

// ─────────────────────────────────────────────
// Ações por status e role
// ─────────────────────────────────────────────

function Acoes({ servico, role, navigate }) {
    const { status } = servico;

    if (role === "CLIENTE") {
        if (status === "publicado")  return <Btn variant="secondary" size="sm">Ver candidatos</Btn>;
        if (status === "negociando") return <Btn variant="secondary" size="sm">Ver conversa</Btn>;
        if (status === "andamento")  return <Btn variant="secondary" size="sm">Acompanhar</Btn>;
        if (status === "concluido")  return <Btn variant="secondary" size="sm">⭐ Avaliar profissional</Btn>;
    }

    if (role === "PROFISSIONAL") {
        if (status === "negociando") return <Btn variant="secondary" size="sm">Ver conversa</Btn>;
        if (status === "andamento")  return <Btn variant="primary"   size="sm">Marcar como concluído</Btn>;
    }

    return null;
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function MeusServicos() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const isProfissional = user?.role === "PROFISSIONAL";
    const tabs    = isProfissional ? TABS_PROFISSIONAL : TABS_CLIENTE;
    const dados   = isProfissional ? MOCK_PROFISSIONAL : MOCK_CLIENTE;

    const statusParam = searchParams.get("status");
    const tabInicial  = tabs.find(t => t.key === statusParam)?.key || tabs[0].key;
    const [aba, setAba] = useState(tabInicial);

    const filtrados = dados.filter(s => s.status === aba);
    const tabAtual  = tabs.find(t => t.key === aba);

    return (
        <PageLayout
            title="Meus serviços"
            subtitle={isProfissional ? "Seus atendimentos" : "Acompanhe seus serviços"}
            backPath="/home"
        >

            {/* ── Botão novo serviço (só cliente) ── */}
            {!isProfissional && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--sp-4)" }}>
                    <Btn variant="primary" size="sm" onClick={() => navigate("/novo-servico")}>
                        🤖 Novo serviço com IA
                    </Btn>
                </div>
            )}

            {/* ── Tabs ── */}
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
                {tabs.map(tab => {
                    const ativo = aba === tab.key;
                    const count = dados.filter(s => s.status === tab.key).length;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setAba(tab.key)}
                            style={{
                                display: "flex", alignItems: "center", gap: "var(--sp-2)",
                                padding: "var(--sp-2) var(--sp-4)",
                                borderRadius: "var(--r-full)",
                                border: "1.5px solid",
                                borderColor: ativo ? "var(--clr-purple)" : "var(--clr-border)",
                                background:  ativo ? "var(--clr-purple)" : "var(--clr-surface)",
                                color:       ativo ? "#fff" : "var(--clr-text-mid)",
                                fontWeight: 600, fontSize: 13, cursor: "pointer",
                                transition: "all var(--t-fast)",
                            }}
                        >
                            {tab.emoji} {tab.label}
                            {count > 0 && (
                                <span style={{
                                    background: ativo ? "rgba(255,255,255,0.25)" : "var(--clr-purple-pale)",
                                    color:      ativo ? "#fff" : "var(--clr-purple)",
                                    borderRadius: "var(--r-full)",
                                    padding: "1px 7px", fontSize: 11, fontWeight: 700,
                                }}>
                  {count}
                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Lista ── */}
            {filtrados.length === 0 ? (
                <EmptyState
                    emoji={tabAtual?.emoji || "📋"}
                    title="Nenhum serviço aqui"
                    description="Você não tem serviços com este status no momento."
                    action={
                        !isProfissional
                            ? <Btn variant="secondary" onClick={() => navigate("/novo-servico")}>Publicar serviço</Btn>
                            : <Btn variant="secondary" onClick={() => navigate("/home")}>Ver publicações</Btn>
                    }
                />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                    {filtrados.map((s, i) => (
                        <div key={s.id} className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}>
                            <Card>
                                <CardBody>
                                    {/* Cabeçalho */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-1)" }}>
                                                <h3 style={{ fontWeight: 700, color: "var(--clr-navy)", fontSize: 15 }}>{s.titulo}</h3>
                                                <Badge variant={BADGE_MAP[s.status].variant}>{BADGE_MAP[s.status].label}</Badge>
                                            </div>
                                            <p style={{ fontSize: 13, color: "var(--clr-text-light)" }}>
                                                🔧 {s.especialidade}
                                                &nbsp;·&nbsp;
                                                📍 {s.cidade}/{s.estado}
                                                &nbsp;·&nbsp;
                                                📅 {fmtData(s.data)}
                                            </p>
                                        </div>
                                        {s.avaliacao && <Estrelas nota={s.avaliacao} />}
                                    </div>

                                    {/* Info contextual */}
                                    <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap", fontSize: 13, marginBottom: "var(--sp-4)" }}>
                                        {s.contraparte && (
                                            <span style={{ color: "var(--clr-text-mid)" }}>
                        {isProfissional ? "👤 Cliente:" : "👷 Profissional:"} {s.contraparte}
                      </span>
                                        )}
                                        {s.candidatos != null && s.candidatos > 0 && (
                                            <span style={{ color: "var(--clr-text-mid)" }}>
                        👥 {s.candidatos} candidato{s.candidatos !== 1 ? "s" : ""}
                      </span>
                                        )}
                                    </div>

                                    {/* Ações */}
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Acoes servico={s} role={user?.role} navigate={navigate} />
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