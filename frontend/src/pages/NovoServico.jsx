import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody } from "../components/ui";

import { enviarMensagemIA } from "../services/aiService";

const MENSAGENS_INICIAIS = [
    {
        id: 1,
        autor: "ia",
        texto: "Olá! 👋 Sou a assistente do WorkMatch. Vou te ajudar a publicar seu serviço em poucos passos. Me conta: qual tipo de serviço você precisa?",
    },
];

export default function NovoServico() {
    const navigate = useNavigate();
    const [mensagens, setMensagens] = useState(MENSAGENS_INICIAIS);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensagens]);

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleEnviar();
        }
    }

    async function handleEnviar() {
        if (!input.trim() || loading) return;

        const texto = input.trim();

        const novaMensagem = {
            id: Date.now(),
            autor: "usuario",
            texto,
        };

        setMensagens(prev => [...prev, novaMensagem]);

        setInput("");
        setLoading(true);

        try {

            const respostaIA = await enviarMensagemIA(texto);

            setMensagens(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    autor: "ia",
                    texto: respostaIA,
                }
            ]);

        } catch (error) {

            console.error(error);

            setMensagens(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    autor: "ia",
                    texto: "Erro ao processar mensagem.",
                }
            ]);

        } finally {
            setLoading(false);
        }
    }

    return (
        <PageLayout title="Novo serviço" subtitle="Converse com a IA para publicar" backPath="/home">

            {/* ── Aviso informativo ── */}
            <div style={{
                background: "var(--clr-purple-pale)", border: "1px solid rgba(109,40,217,0.2)",
                borderRadius: "var(--r-lg)", padding: "var(--sp-4) var(--sp-5)",
                display: "flex", gap: "var(--sp-3)", alignItems: "flex-start",
                marginBottom: "var(--sp-5)", fontSize: 14, color: "var(--clr-purple)",
            }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
                <p style={{ lineHeight: 1.6 }}>
                    Nossa IA vai extrair as informações do seu serviço por meio desta conversa e publicar automaticamente para que profissionais possam se candidatar.
                </p>
            </div>

            {/* ── Chat ── */}
            <Card style={{ marginBottom: "var(--sp-4)" }}>
                <CardBody style={{ padding: 0 }}>
                    <div style={{
                        height: 420, overflowY: "auto",
                        padding: "var(--sp-5)",
                        display: "flex", flexDirection: "column", gap: "var(--sp-4)",
                    }}>
                        {mensagens.map(msg => (
                            <div
                                key={msg.id}
                                style={{
                                    display: "flex",
                                    justifyContent: msg.autor === "usuario" ? "flex-end" : "flex-start",
                                }}
                            >
                                {msg.autor === "ia" && (
                                    <div style={{
                                        width: 32, height: 32, borderRadius: "var(--r-full)",
                                        background: "linear-gradient(135deg, var(--clr-purple), var(--clr-blue))",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 16, flexShrink: 0, marginRight: "var(--sp-2)", alignSelf: "flex-end",
                                    }}>🤖</div>
                                )}
                                <div style={{
                                    maxWidth: "70%",
                                    padding: "var(--sp-3) var(--sp-4)",
                                    borderRadius: msg.autor === "usuario"
                                        ? "var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg)"
                                        : "var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm)",
                                    background: msg.autor === "usuario" ? "var(--clr-purple)" : "var(--clr-bg)",
                                    color: msg.autor === "usuario" ? "#fff" : "var(--clr-text)",
                                    fontSize: 14, lineHeight: 1.6,
                                    boxShadow: "var(--shadow-xs)",
                                }}>
                                    {msg.texto}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "var(--r-full)",
                                    background: "linear-gradient(135deg, var(--clr-purple), var(--clr-blue))",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                                }}>🤖</div>
                                <div style={{
                                    background: "var(--clr-bg)", borderRadius: "var(--r-lg)", padding: "var(--sp-3) var(--sp-4)",
                                    display: "flex", gap: "var(--sp-1)", alignItems: "center",
                                }}>
                                    {[0, 1, 2].map(i => (
                                        <span key={i} style={{
                                            width: 7, height: 7, borderRadius: "var(--r-full)",
                                            background: "var(--clr-purple)", display: "inline-block",
                                            animation: `wmSpin 1s ease-in-out ${i * 0.2}s infinite`,
                                            opacity: 0.6,
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </CardBody>
            </Card>

            {/* ── Input ── */}
            <div style={{ display: "flex", gap: "var(--sp-3)" }}>
        <textarea
            className="wm-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem... (Enter para enviar)"
            rows={2}
            style={{ flex: 1, resize: "none", lineHeight: 1.5 }}
            disabled={loading}
        />
                <Btn
                    variant="primary"
                    onClick={handleEnviar}
                    disabled={!input.trim() || loading}
                    style={{ alignSelf: "flex-end", height: 48 }}
                >
                    Enviar →
                </Btn>
            </div>

        </PageLayout>
    );
}