import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Btn, Card, CardBody, Badge, Spinner, EmptyState } from "../components/ui.jsx";
import { useToast } from "../hooks/useToast.js";
import api from "../services/api.js"; // B12 corrigido — substituído fetch nativo

// ─── Ícones ───────────────────────────────────────────────────────────────────

const IconUsers = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconMapPin = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const IconMessage = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const IconCheck = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const IconArrow = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default function CandidatosServico() {
    const { servicoId }   = useParams();
    const { user }        = useAuth();
    const navigate        = useNavigate();
    const { showToast }   = useToast();

    const [candidatos,   setCandidatos]   = useState([]);
    const [carregando,   setCarregando]   = useState(true);
    const [contratando,  setContratando]  = useState(null);

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            // B12 corrigido — api envia Bearer token automaticamente
            const { data } = await api.get(`/api/candidaturas/servico/${servicoId}`);
            setCandidatos(data);
        } catch {
            showToast("Erro ao carregar candidatos.", "danger");
        } finally {
            setCarregando(false);
        }
    }, [servicoId]);

    useEffect(() => { carregar(); }, [carregar]);

    const contratar = async (profissionalId) => {
        setContratando(profissionalId);
        try {
            await api.patch(`/api/servicos/${servicoId}/avancar?profissionalId=${profissionalId}`);
            showToast("Profissional selecionado! Negociação iniciada.", "success");
            navigate(`/chat/${servicoId}`);
        } catch (e) {
            const msg = e?.response?.data?.message || "Erro ao selecionar profissional.";
            showToast(msg, "danger");
        } finally {
            setContratando(null);
        }
    };

    const abrirChat = (profissionalId) => {
        navigate(`/chat/${servicoId}/${profissionalId}`);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--clr-bg, #f5f7fa)" }}>

            {/* Header */}
            <header style={{
                background:  "linear-gradient(135deg, #0A2F5A 0%, #1E5FAF 100%)",
                padding:     "20px 24px",
                boxShadow:   "0 2px 12px rgba(10,47,90,0.18)"
            }}>
                <h1 style={{
                    margin: 0, color: "#fff", fontSize: "1.1rem", fontWeight: 600,
                    fontFamily: "var(--font-display, 'DM Serif Display', serif)"
                }}>
                    Candidatos
                </h1>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
                    Selecione o profissional para iniciar a negociação
                </p>
            </header>

            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 16px" }}>
                {carregando ? (
                    <Spinner center />
                ) : candidatos.length === 0 ? (
                    <EmptyState
                        icon={<IconUsers />}
                        title="Nenhum candidato ainda"
                        description="Aguarde profissionais se candidatarem ao seu serviço."
                    />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {candidatos.map(c => (
                            <Card key={c.id} style={{ borderRadius: "14px", animation: "wmPageIn .25s ease" }}>
                                <CardBody style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                                    {/* Nome + especialidade */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                                        <div>
                                            <span style={{ fontWeight: 600, fontSize: "0.98rem", color: "var(--clr-text, #1e293b)" }}>
                                                {c.nome}
                                            </span>
                                            <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                                                <Badge variant="blue">{c.especialidade}</Badge>
                                                {c.cidade && (
                                                    <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.8rem", color: "var(--clr-muted, #64748b)" }}>
                                                        <IconMapPin /> {c.cidade}{c.estado ? ` — ${c.estado}` : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div style={{
                                        display: "flex", gap: "8px", flexWrap: "wrap",
                                        paddingTop: "8px",
                                        borderTop: "1px solid var(--clr-border, #e2e8f0)"
                                    }}>
                                        <Btn
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => abrirChat(c.profissionalId)}
                                        >
                                            <IconMessage /> &nbsp;Conversar
                                        </Btn>
                                        <Btn
                                            variant="primary"
                                            size="sm"
                                            onClick={() => contratar(c.profissionalId)}
                                            disabled={contratando === c.profissionalId}
                                        >
                                            {contratando === c.profissionalId
                                                ? <Spinner />
                                                : <><IconCheck /> &nbsp;Selecionar profissional</>
                                            }
                                        </Btn>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Voltar */}
                <div style={{ marginTop: "24px" }}>
                    <Btn variant="secondary" size="sm" onClick={() => navigate(-1)}>
                        ← Voltar
                    </Btn>
                </div>
            </div>
        </div>
    );
}
