/**
 * WorkMatch 2.0 — HomeProfissional
 * Feed de publicações de clientes para o profissional se candidatar
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody, Badge, Spinner, EmptyState } from "../components/ui";

// Dados mock — substituir por chamada à API
const MOCK_PUBLICACOES = [
    {
        id: 1,
        titulo: "Instalação elétrica residencial",
        descricao: "Preciso instalar tomadas e interruptores em 3 cômodos. Casa de 80m².",
        especialidade: "Eletricista",
        cidade: "Goiânia",
        estado: "GO",
        urgencia: "Alta",
        publicadoEm: "2026-05-18T10:00:00",
        candidatos: 2,
    },
    {
        id: 2,
        titulo: "Conserto de encanamento",
        descricao: "Vazamento embaixo da pia da cozinha e no banheiro. Preciso de atendimento rápido.",
        especialidade: "Encanador",
        cidade: "Aparecida de Goiânia",
        estado: "GO",
        urgencia: "Urgente",
        publicadoEm: "2026-05-18T08:30:00",
        candidatos: 0,
    },
    {
        id: 3,
        titulo: "Pintura de apartamento",
        descricao: "Apartamento de 65m², 2 quartos, sala e cozinha. Tinta fornecida pelo cliente.",
        especialidade: "Pintor",
        cidade: "Goiânia",
        estado: "GO",
        urgencia: "Normal",
        publicadoEm: "2026-05-17T15:00:00",
        candidatos: 5,
    },
];

const URGENCIA_BADGE = {
    Urgente: "danger",
    Alta:    "warning",
    Normal:  "neutral",
};

function fmtData(iso) {
    const d = new Date(iso);
    const agora = new Date();
    const diff = Math.floor((agora - d) / 60000);
    if (diff < 60)  return `${diff}min atrás`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`;
    return d.toLocaleDateString("pt-BR");
}

export default function HomeProfissional() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const primeiroNome = user?.nome?.split(" ")[0] || "Profissional";
    const [candidatando, setCandidatando] = useState(null);

    function handleCandidatar(id) {
        setCandidatando(id);
        // TODO: chamar API POST /api/candidaturas
        setTimeout(() => {
            setCandidatando(null);
            alert("Candidatura enviada! Em breve o cliente entrará em contato.");
        }, 1000);
    }

    return (
        <PageLayout title="Publicações" subtitle="Serviços disponíveis na sua região">

            {/* ── Boas-vindas ── */}
            <div
                className="wm-animate-fadeUp"
                style={{
                    background: "linear-gradient(135deg, var(--clr-navy-deep) 0%, var(--clr-blue) 100%)",
                    borderRadius: "var(--r-xl)",
                    padding: "var(--sp-6) var(--sp-8)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "var(--sp-4)",
                    marginBottom: "var(--sp-6)",
                }}
            >
                <div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--sp-1)" }}>
                        Olá, {primeiroNome} 👷
                    </p>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2.5vw,26px)", lineHeight: 1.2 }}>
                        {MOCK_PUBLICACOES.length} serviços disponíveis
                    </h2>
                </div>
                <div style={{ display: "flex", gap: "var(--sp-3)" }}>
                    <Btn variant="secondary" size="sm" onClick={() => navigate("/meus-servicos-prof")}>
                        📋 Meus serviços
                    </Btn>
                    <Btn variant="accent" size="sm" onClick={() => navigate("/perfil-profissional")}>
                        👤 Meu perfil
                    </Btn>
                </div>
            </div>

            {/* ── Feed de publicações ── */}
            {MOCK_PUBLICACOES.length === 0 ? (
                <EmptyState
                    emoji="🔍"
                    title="Nenhuma publicação disponível"
                    description="Não há serviços na sua área no momento. Volte em breve!"
                />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                    {MOCK_PUBLICACOES.map((pub, i) => (
                        <div
                            key={pub.id}
                            className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}
                        >
                            <Card>
                                <CardBody>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-2)" }}>
                                                <h3 style={{ fontWeight: 700, color: "var(--clr-navy)", fontSize: 16 }}>{pub.titulo}</h3>
                                                <Badge variant={URGENCIA_BADGE[pub.urgencia]}>{pub.urgencia}</Badge>
                                            </div>
                                            <p style={{ fontSize: 14, color: "var(--clr-text-mid)", lineHeight: 1.6 }}>{pub.descricao}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap", marginBottom: "var(--sp-4)" }}>
                    <span style={{ fontSize: 13, color: "var(--clr-text-light)", display: "flex", alignItems: "center", gap: 4 }}>
                      🔧 {pub.especialidade}
                    </span>
                                        <span style={{ fontSize: 13, color: "var(--clr-text-light)", display: "flex", alignItems: "center", gap: 4 }}>
                      📍 {pub.cidade} — {pub.estado}
                    </span>
                                        <span style={{ fontSize: 13, color: "var(--clr-text-light)", display: "flex", alignItems: "center", gap: 4 }}>
                      🕐 {fmtData(pub.publicadoEm)}
                    </span>
                                        <span style={{ fontSize: 13, color: "var(--clr-text-light)", display: "flex", alignItems: "center", gap: 4 }}>
                      👥 {pub.candidatos} candidato{pub.candidatos !== 1 ? "s" : ""}
                    </span>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Btn
                                            variant="primary"
                                            size="sm"
                                            loading={candidatando === pub.id}
                                            onClick={() => handleCandidatar(pub.id)}
                                        >
                                            ✋ Candidatar-se
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