import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardBody, Badge, EmptyState } from "../components/ui";
import api from "../services/api";

const TABS_CLIENTE = [
    { key: "PUBLICADO",  label: "Publicados",   emoji: "📋" },
    { key: "NEGOCIANDO", label: "Negociando",   emoji: "💬" },
    { key: "CONTRATADO", label: "Contratados",  emoji: "🤝" },
    { key: "ANDAMENTO",  label: "Em andamento", emoji: "⚙️" },
    { key: "FINALIZADO", label: "Finalizados",  emoji: "✅" },
];

const TABS_PROFISSIONAL = [
    { key: "NEGOCIANDO", label: "Negociando",   emoji: "💬" },
    { key: "CONTRATADO", label: "Contratados",  emoji: "🤝" },
    { key: "ANDAMENTO",  label: "Em andamento", emoji: "⚙️" },
    { key: "FINALIZADO", label: "Finalizados",  emoji: "✅" },
];

const BADGE_MAP = {
    PUBLICADO:  { variant: "blue",    label: "Publicado"    },
    NEGOCIANDO: { variant: "warning", label: "Negociando"   },
    CONTRATADO: { variant: "info",    label: "Contratado"   },
    ANDAMENTO:  { variant: "info",    label: "Em andamento" },
    FINALIZADO: { variant: "success", label: "Finalizado"   },
};

function fmtData(iso) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

function Acoes({ servico, role, navigate }) {
    const { status } = servico;

    if (role === "CLIENTE") {
        if (status === "PUBLICADO")
            return (
                <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                        navigate(`/candidatos/${servico.id}`)
                    }
                >
                    Ver candidatos
                </Btn>
            );
        if (status === "NEGOCIANDO") return <Btn variant="secondary" size="sm">Ver conversa</Btn>;
        if (status === "ANDAMENTO")  return <Btn variant="secondary" size="sm">Acompanhar</Btn>;
        if (status === "FINALIZADO") return <Btn variant="secondary" size="sm">⭐ Avaliar profissional</Btn>;
    }

    if (role === "PROFISSIONAL") {
        if (status === "NEGOCIANDO") return <Btn variant="secondary" size="sm">Ver conversa</Btn>;
        if (status === "ANDAMENTO")  return <Btn variant="primary" size="sm">Marcar como concluído</Btn>;
    }

    return null;
}

export default function MeusServicos() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const isProfissional = user?.role === "PROFISSIONAL";
    const tabs = isProfissional ? TABS_PROFISSIONAL : TABS_CLIENTE;

    const statusParam = searchParams.get("status")?.toUpperCase();
    const tabInicial = tabs.find(t => t.key === statusParam)?.key || tabs[0].key;
    const [aba, setAba] = useState(tabInicial);

    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (!user?.id) return;
        buscarServicos();
    }, [user]);

    async function buscarServicos() {
        setLoading(true);
        setErro(null);
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

    const filtrados = servicos.filter(s => s.status === aba);
    const tabAtual = tabs.find(t => t.key === aba);

    function contarPorStatus(status) {
        return servicos.filter(s => s.status === status).length;
    }

    return (
        <PageLayout
            title="Meus serviços"
            subtitle={isProfissional ? "Seus atendimentos" : "Acompanhe seus serviços"}
            backPath="/home"
        >
            {!isProfissional && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--sp-4)" }}>
                    <Btn variant="primary" size="sm" onClick={() => navigate("/novo-servico")}>
                        🤖 Novo serviço com IA
                    </Btn>
                </div>
            )}

            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-6)" }}>
                {tabs.map(tab => {
                    const ativo = aba === tab.key;
                    const count = contarPorStatus(tab.key);
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
                                background: ativo ? "var(--clr-purple)" : "var(--clr-surface)",
                                color: ativo ? "#fff" : "var(--clr-text-mid)",
                                fontWeight: 600, fontSize: 13, cursor: "pointer",
                                transition: "all var(--t-fast)",
                            }}
                        >
                            {tab.emoji} {tab.label}
                            {count > 0 && (
                                <span style={{
                                    background: ativo ? "rgba(255,255,255,0.25)" : "var(--clr-purple-pale)",
                                    color: ativo ? "#fff" : "var(--clr-purple)",
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

            {loading && (
                <div style={{ textAlign: "center", padding: "var(--sp-10)", color: "var(--clr-text-light)" }}>
                    Carregando...
                </div>
            )}

            {erro && (
                <div style={{ textAlign: "center", padding: "var(--sp-6)", color: "var(--clr-red)" }}>
                    {erro}
                    <br />
                    <Btn variant="secondary" size="sm" onClick={buscarServicos} style={{ marginTop: "var(--sp-3)" }}>
                        Tentar novamente
                    </Btn>
                </div>
            )}

            {!loading && !erro && filtrados.length === 0 && (
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
            )}

            {!loading && !erro && filtrados.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                    {filtrados.map((s, i) => (
                        <div key={s.id} className={`wm-animate-fadeUp wm-delay-${Math.min(i + 1, 5)}`}>
                            <Card>
                                <CardBody>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap", marginBottom: "var(--sp-1)" }}>
                                                <h3 style={{ fontWeight: 700, color: "var(--clr-navy)", fontSize: 15 }}>{s.titulo}</h3>
                                                <Badge variant={BADGE_MAP[s.status]?.variant}>
                                                    {BADGE_MAP[s.status]?.label}
                                                </Badge>
                                            </div>
                                            <p style={{ fontSize: 13, color: "var(--clr-text-light)" }}>
                                                🔧 {s.especialidade}
                                                &nbsp;·&nbsp;
                                                📍 {s.cidade}/{s.estado}
                                                &nbsp;·&nbsp;
                                                📅 {fmtData(s.dataCriacao)}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "var(--sp-4)", flexWrap: "wrap", fontSize: 13, marginBottom: "var(--sp-4)" }}>
                                        {!isProfissional && s.profissionalNome && (
                                            <span style={{ color: "var(--clr-text-mid)" }}>
                                                👷 Profissional: {s.profissionalNome}
                                            </span>
                                        )}
                                        {isProfissional && s.clienteNome && (
                                            <span style={{ color: "var(--clr-text-mid)" }}>
                                                👤 Cliente: {s.clienteNome}
                                            </span>
                                        )}
                                        {s.descricao && (
                                            <span style={{ color: "var(--clr-text-light)" }}>
                                                {s.descricao}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Acoes
                                            servico={s}
                                            role={user?.role}
                                            navigate={navigate}
                                        />
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