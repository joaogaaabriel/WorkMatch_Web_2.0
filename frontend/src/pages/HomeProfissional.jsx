/**
 * WorkMatch 2.0 — HomeProfissional
 * Feed de serviços publicados no banco
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import PageLayout from "../components/PageLayout";

import {
    Btn,
    Card,
    CardBody,
    Badge,
    Spinner,
    EmptyState
} from "../components/ui";
const API_URL = import.meta.env.VITE_API_URL;

const URGENCIA_BADGE = {
    URGENTE: "danger",
    ALTA: "warning",
    NORMAL: "neutral",
};

function fmtData(data) {

    if (!data) return "";

    const d = new Date(data);

    return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function HomeProfissional() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const primeiroNome =
        user?.nome?.split(" ")[0] || "Profissional";

    const [publicacoes, setPublicacoes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [erro, setErro] = useState("");

    const [candidatando, setCandidatando] = useState(null);

    useEffect(() => {
        carregarPublicacoes();
    }, []);

    async function carregarPublicacoes() {

        try {

            setLoading(true);

            setErro("");

            const response = await fetch(
                `${API_URL}/api/servicos/publicados`
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar publicações");
            }

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

        try {
            const response = await fetch(
                `${API_URL}/api/candidaturas`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        servicoId,
                        profissionalId: user.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Erro ao candidatar"
                );
            }

            alert("Candidatura enviada!");

            navigate(`/chat/${servicoId}`);

        } catch (error) {

            console.error(error);

            alert(error.message);
        }
    }

    return (
        <PageLayout
            title="Publicações"
            subtitle="Serviços disponíveis na sua região"
        >

            {/* ── Boas-vindas ── */}
            <div
                className="wm-animate-fadeUp"
                style={{
                    background:
                        "linear-gradient(135deg, var(--clr-navy-deep) 0%, var(--clr-blue) 100%)",
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

                    <p
                        style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: "var(--sp-1)",
                        }}
                    >
                        Olá, {primeiroNome} 👷
                    </p>

                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(18px,2.5vw,26px)",
                            lineHeight: 1.2,
                        }}
                    >
                        {publicacoes.length} serviços disponíveis
                    </h2>

                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "var(--sp-3)",
                    }}
                >

                    <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            navigate("/meus-servicos-prof")
                        }
                    >
                        📋 Meus serviços
                    </Btn>

                    <Btn
                        variant="accent"
                        size="sm"
                        onClick={() =>
                            navigate("/perfil-profissional")
                        }
                    >
                        👤 Meu perfil
                    </Btn>

                </div>

            </div>

            {/* ── Loading ── */}
            {loading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "40px",
                    }}
                >
                    <Spinner />
                </div>
            )}

            {/* ── Erro ── */}
            {!loading && erro && (
                <Card>
                    <CardBody>
                        <p
                            style={{
                                color: "red",
                                fontWeight: 600,
                            }}
                        >
                            {erro}
                        </p>
                    </CardBody>
                </Card>
            )}

            {/* ── Sem serviços ── */}
            {!loading &&
                !erro &&
                publicacoes.length === 0 && (
                    <EmptyState
                        emoji="🔍"
                        title="Nenhuma publicação disponível"
                        description="Não há serviços publicados no momento."
                    />
                )}

            {/* ── Lista de serviços ── */}
            {!loading &&
                !erro &&
                publicacoes.length > 0 && (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--sp-4)",
                        }}
                    >

                        {publicacoes.map((pub, i) => (

                            <div
                                key={pub.id}
                                className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}
                            >

                                <Card>

                                    <CardBody>

                                        {/* Header */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                flexWrap: "wrap",
                                                gap: "var(--sp-3)",
                                                marginBottom: "var(--sp-4)",
                                            }}
                                        >

                                            <div style={{ flex: 1 }}>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "var(--sp-2)",
                                                        flexWrap: "wrap",
                                                        marginBottom: "var(--sp-2)",
                                                    }}
                                                >

                                                    <h3
                                                        style={{
                                                            fontWeight: 700,
                                                            color: "var(--clr-navy)",
                                                            fontSize: 16,
                                                        }}
                                                    >
                                                        {pub.titulo}
                                                    </h3>

                                                    <Badge
                                                        variant={
                                                            URGENCIA_BADGE[
                                                                pub.urgencia
                                                                ] || "neutral"
                                                        }
                                                    >
                                                        {pub.urgencia || "NORMAL"}
                                                    </Badge>

                                                </div>

                                                <p
                                                    style={{
                                                        fontSize: 14,
                                                        color:
                                                            "var(--clr-text-mid)",
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {pub.descricao}
                                                </p>

                                            </div>

                                        </div>

                                        {/* Informações */}
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "var(--sp-3)",
                                                flexWrap: "wrap",
                                                marginBottom: "var(--sp-4)",
                                            }}
                                        >

                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color:
                                                        "var(--clr-text-light)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                🔧 {pub.especialidade}
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color:
                                                        "var(--clr-text-light)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                📍 {pub.cidade} - {pub.estado}
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color:
                                                        "var(--clr-text-light)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                🕐 {fmtData(pub.criadoEm)}
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color:
                                                        "var(--clr-text-light)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                📌 {pub.status}
                                            </span>

                                        </div>

                                        {/* Botão */}
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                            }}
                                        >

                                            <Btn
                                                variant="primary"
                                                size="sm"
                                                loading={
                                                    candidatando === pub.id
                                                }
                                                onClick={() =>
                                                    handleCandidatar(pub.id)
                                                }
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