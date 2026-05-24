import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody } from "../components/ui";
import { enviarMensagemIA, extrairDadosColetados } from "../services/aiService";
import api from "../services/api";

const MENSAGEM_INICIAL = {
    id: 1,
    autor: "ia",
    texto: "Olá! 👋 Sou a assistente do WorkMatch. Vou te ajudar a publicar seu serviço em poucos passos. Me conta: qual tipo de serviço você precisa?",
};

export default function NovoServico() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mensagens, setMensagens] = useState([MENSAGEM_INICIAL]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [dadosColetados, setDadosColetados] = useState(null);
    const [publicando, setPublicando] = useState(false);
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
        setInput("");

        const novaMensagemUsuario = { id: Date.now(), autor: "usuario", texto };
        const novasMensagens = [...mensagens, novaMensagemUsuario];
        setMensagens(novasMensagens);
        setLoading(true);

        try {
            const historico = novasMensagens.map(m => ({
                role: m.autor === "usuario" ? "user" : "assistant",
                content: m.texto,
            }));

            const respostaIA = await enviarMensagemIA(historico);
            const dados = extrairDadosColetados(respostaIA);

            if (dados) {
                setDadosColetados(dados);
                setMensagens(prev => [...prev, {
                    id: Date.now() + 1,
                    autor: "ia",
                    texto: "Perfeito! Coletei todas as informações. Veja o resumo abaixo e confirme para publicar.",
                }]);
            } else {
                setMensagens(prev => [...prev, {
                    id: Date.now() + 1,
                    autor: "ia",
                    texto: respostaIA,
                }]);
            }
        } catch (error) {
            setMensagens(prev => [...prev, {
                id: Date.now() + 1,
                autor: "ia",
                texto: "Erro ao processar mensagem. Tente novamente.",
            }]);
        } finally {
            setLoading(false);
        }
    }

    async function handlePublicar() {
        if (!dadosColetados) return;

        setPublicando(true);

        try {
            await api.post("/api/servicos", {
                ...dadosColetados,
                clienteId: user.id,
            });

            setMensagens(prev => [...prev, {
                id: Date.now(),
                autor: "ia",
                texto: "✅ Serviço publicado com sucesso! Profissionais já podem se candidatar.",
            }]);

            setTimeout(() => navigate("/meus-servicos"), 2000);

        } catch (error) {
            setMensagens(prev => [...prev, {
                id: Date.now(),
                autor: "ia",
                texto: "Erro ao publicar o serviço. Tente novamente.",
            }]);
        } finally {
            setPublicando(false);
        }
    }

    return (
        <PageLayout title="Novo serviço" subtitle="Converse com a IA para publicar" backPath="/home">

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

            <Card style={{ marginBottom: "var(--sp-4)" }}>
                <CardBody style={{ padding: 0 }}>
                    <div style={{
                        height: 420, overflowY: "auto",
                        padding: "var(--sp-5)",
                        display: "flex", flexDirection: "column", gap: "var(--sp-4)",
                    }}>
                        {mensagens.map(msg => (
                            <div key={msg.id} style={{
                                display: "flex",
                                justifyContent: msg.autor === "usuario" ? "flex-end" : "flex-start",
                            }}>
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
                                    background: "var(--clr-bg)", borderRadius: "var(--r-lg)",
                                    padding: "var(--sp-3) var(--sp-4)",
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

            {dadosColetados && (
                <Card style={{ marginBottom: "var(--sp-4)", border: "1.5px solid var(--clr-purple)" }}>
                    <CardBody>
                        <p style={{ fontWeight: 700, marginBottom: "var(--sp-3)", color: "var(--clr-purple)" }}>
                            📋 Resumo do serviço
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)", fontSize: 14 }}>
                            <p><strong>Título:</strong> {dadosColetados.titulo}</p>
                            <p><strong>Especialidade:</strong> {dadosColetados.especialidade}</p>
                            <p><strong>Descrição:</strong> {dadosColetados.descricao}</p>
                            <p><strong>Local:</strong> {dadosColetados.cidade} / {dadosColetados.estado}</p>
                        </div>
                        <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-4)" }}>
                            <Btn variant="secondary" onClick={() => setDadosColetados(null)} disabled={publicando}>
                                Corrigir
                            </Btn>
                            <Btn variant="primary" onClick={handlePublicar} loading={publicando}>
                                ✅ Confirmar e publicar
                            </Btn>
                        </div>
                    </CardBody>
                </Card>
            )}

            {!dadosColetados && (
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
            )}

        </PageLayout>
    );
}