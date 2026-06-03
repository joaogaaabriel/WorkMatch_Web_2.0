import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody } from "../components/ui";
import api from "../services/api";

function parseData(iso) {
    if (!iso) return new Date();
    return new Date(iso.includes("Z") ? iso : `${iso}Z`);
}

function fmtHora(iso) {
    return parseData(iso).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtData(iso) {
    return parseData(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
    });
}

export default function ChatServico() {
    const { servicoId } = useParams();
    const { user } = useAuth();

    const [servico, setServico] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const bottomRef = useRef(null);
    const pollingRef = useRef(null);

    useEffect(() => {
        carregarDados();

        pollingRef.current = setInterval(() => {
            carregarMensagens();
        }, 4000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [servicoId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [mensagens]);

    async function carregarDados() {
        try {
            setLoading(true);

            const [servicoResponse, mensagensResponse] = await Promise.all([
                api.get(`/api/servicos/${servicoId}`),
                api.get(`/api/mensagens/servico/${servicoId}`),
            ]);

            setServico(servicoResponse.data);
            setMensagens(mensagensResponse.data || []);
        } catch (error) {
            console.error("Erro ao carregar chat:", error);
        } finally {
            setLoading(false);
        }
    }

    async function carregarMensagens() {
        try {
            const { data } = await api.get(
                `/api/mensagens/servico/${servicoId}`
            );

            setMensagens(data || []);
        } catch (error) {
            console.error("Erro ao atualizar mensagens:", error);
        }
    }

    async function handleEnviar() {
        if (!input.trim()) return;
        if (enviando) return;

        try {
            setEnviando(true);

            const texto = input.trim();

            await api.post("/api/mensagens", {
                servicoId,
                remetenteId: user?.id,
                conteudo: texto,
            });

            setInput("");

            await carregarMensagens();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setEnviando(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleEnviar();
        }
    }

    const isMinha = (mensagem) => {
        if (!user?.id) return false;

        return String(mensagem.remetenteId) === String(user.id);
    };

    function agruparPorData(lista) {
        const itens = [];
        let dataAtual = null;

        lista.forEach((mensagem) => {
            const data = fmtData(mensagem.enviadoEm);

            if (data !== dataAtual) {
                itens.push({
                    tipo: "data",
                    label: data,
                });

                dataAtual = data;
            }

            itens.push({
                tipo: "msg",
                msg: mensagem,
            });
        });

        return itens;
    }

    const itens = agruparPorData(mensagens);

    const outraParte =
        user?.role === "PROFISSIONAL"
            ? servico?.clienteNome
            : servico?.profissionalNome;

    if (loading) {
        return (
            <PageLayout title="Conversa" backPath="/meus-servicos">
                <div
                    style={{
                        textAlign: "center",
                        padding: "40px",
                    }}
                >
                    Carregando...
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title={
                outraParte
                    ? `Conversa com ${outraParte}`
                    : "Conversa"
            }
            subtitle={servico?.titulo || ""}
            backPath="/meus-servicos"
        >
            <Card
                style={{
                    marginBottom: "16px",
                }}
            >
                <CardBody>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                            fontSize: "13px",
                        }}
                    >
                        <span>
                            <strong>Serviço:</strong>{" "}
                            {servico?.titulo}
                        </span>

                        <span>
                            <strong>Especialidade:</strong>{" "}
                            {servico?.especialidade}
                        </span>

                        <span>
                            <strong>Local:</strong>{" "}
                            {servico?.cidade}/{servico?.estado}
                        </span>

                        <span>
                            <strong>Status:</strong>{" "}
                            {servico?.status}
                        </span>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardBody style={{ padding: 0 }}>
                    <div
                        style={{
                            height: "500px",
                            overflowY: "auto",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {mensagens.length === 0 && (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#999",
                                    paddingTop: "80px",
                                }}
                            >
                                Nenhuma mensagem ainda.
                            </div>
                        )}

                        {itens.map((item, index) => {
                            if (item.tipo === "data") {
                                return (
                                    <div
                                        key={`data-${index}`}
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                color: "#888",
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            }

                            const msg = item.msg;
                            const minha = isMinha(msg);

                            return (
                                <div
                                    key={msg.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: minha
                                            ? "flex-end"
                                            : "flex-start",
                                    }}
                                >
                                    {!minha && (
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                marginBottom: "3px",
                                            }}
                                        >
                                            {msg.remetenteNome}
                                        </span>
                                    )}

                                    <div
                                        style={{
                                            background: minha
                                                ? "#6D28D9"
                                                : "#F3F4F6",
                                            color: minha
                                                ? "#FFF"
                                                : "#111",
                                            padding: "10px 14px",
                                            borderRadius: "12px",
                                            maxWidth: "70%",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {msg.conteudo}
                                    </div>

                                    <span
                                        style={{
                                            fontSize: "10px",
                                            color: "#888",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {fmtHora(msg.enviadoEm)}
                                    </span>
                                </div>
                            );
                        })}

                        <div ref={bottomRef} />
                    </div>
                </CardBody>
            </Card>

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "16px",
                }}
            >
                <textarea
                    value={input}
                    onChange={(e) =>
                        setInput(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={enviando}
                    placeholder="Digite sua mensagem..."
                    style={{
                        flex: 1,
                        resize: "none",
                    }}
                />

                <Btn
                    variant="primary"
                    onClick={handleEnviar}
                    disabled={!input.trim() || enviando}
                >
                    Enviar
                </Btn>
            </div>
        </PageLayout>
    );
}