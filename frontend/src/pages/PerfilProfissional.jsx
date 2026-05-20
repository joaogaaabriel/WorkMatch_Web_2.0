/**
 * WorkMatch 2.0 — PerfilProfissional
 * Perfil do profissional: foto, descrição, nota, comentários e estatísticas
 */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { Card, CardBody, CardHeader, CardTitle, Btn, Badge, Divider } from "../components/ui";

// Mock — substituir por chamada à API
const MOCK_PERFIL = {
    nome: "Carlos Matos",
    especialidade: "Pintor",
    descricao: "Profissional com mais de 8 anos de experiência em pintura residencial e comercial. Trabalho com tintas premium e entrego no prazo combinado.",
    cidade: "Goiânia",
    estado: "GO",
    experienciaAnos: 8,
    servicosRealizados: 47,
    notaMedia: 4.8,
    totalAvaliacoes: 31,
    foto: null,
};

const MOCK_COMENTARIOS = [
    { id: 1, cliente: "Maria Souza",   nota: 5, data: "2026-05-10", comentario: "Trabalho impecável, pontual e muito cuidadoso. Recomendo!" },
    { id: 2, cliente: "Pedro Lima",    nota: 5, data: "2026-04-28", comentario: "Excelente profissional, sala ficou linda. Voltarei a contratar." },
    { id: 3, cliente: "Ana Ferreira",  nota: 4, data: "2026-04-15", comentario: "Bom serviço, pequeno atraso no início mas o resultado foi ótimo." },
    { id: 4, cliente: "Lucas Pinto",   nota: 5, data: "2026-03-30", comentario: "Super atencioso e caprichoso. Nota 10!" },
];

function Estrelas({ nota, size = 16 }) {
    return (
        <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
          <span key={n} style={{ color: n <= Math.round(nota) ? "var(--clr-yellow)" : "var(--clr-border-mid)", fontSize: size }}>★</span>
      ))}
    </span>
    );
}

function fmtData(d) {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PerfilProfissional() {
    const { user } = useAuth();
    const [editando, setEditando] = useState(false);
    const [descricao, setDescricao] = useState(MOCK_PERFIL.descricao);
    const [especialidade, setEspecialidade] = useState(MOCK_PERFIL.especialidade);

    const initials = MOCK_PERFIL.nome
        .trim().split(" ").filter(Boolean)
        .map(w => w[0]).slice(0, 2).join("").toUpperCase();

    return (
        <PageLayout title="Meu perfil" subtitle="Gerencie sua presença no WorkMatch" backPath="/home">

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--sp-6)", alignItems: "start" }}>

                {/* ── Coluna esquerda: avatar + stats ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>

                    {/* Avatar + info principal */}
                    <Card>
                        <CardBody>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--sp-4)" }}>

                                {/* Avatar */}
                                <div style={{
                                    width: 96, height: 96, borderRadius: "var(--r-full)",
                                    background: "linear-gradient(135deg, var(--clr-purple) 0%, var(--clr-blue) 100%)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: 32, fontWeight: 700,
                                    boxShadow: "var(--shadow-purple)", flexShrink: 0,
                                }}>
                                    {initials}
                                </div>

                                <div>
                                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-navy)", marginBottom: "var(--sp-1)" }}>
                                        {MOCK_PERFIL.nome}
                                    </h2>
                                    <Badge variant="purple">🔧 {especialidade}</Badge>
                                    <p style={{ fontSize: 13, color: "var(--clr-text-light)", marginTop: "var(--sp-2)" }}>
                                        📍 {MOCK_PERFIL.cidade} — {MOCK_PERFIL.estado}
                                    </p>
                                </div>

                                {/* Nota */}
                                <div style={{
                                    background: "var(--clr-purple-pale)", borderRadius: "var(--r-lg)",
                                    padding: "var(--sp-4) var(--sp-6)", width: "100%",
                                }}>
                                    <p style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", color: "var(--clr-purple)", lineHeight: 1 }}>
                                        {MOCK_PERFIL.notaMedia.toFixed(1)}
                                    </p>
                                    <Estrelas nota={MOCK_PERFIL.notaMedia} size={18} />
                                    <p style={{ fontSize: 12, color: "var(--clr-text-light)", marginTop: "var(--sp-1)" }}>
                                        {MOCK_PERFIL.totalAvaliacoes} avaliações
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Estatísticas */}
                    <Card>
                        <CardHeader><CardTitle>📊 Estatísticas</CardTitle></CardHeader>
                        <CardBody>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-4)" }}>
                                {[
                                    { emoji: "✅", valor: MOCK_PERFIL.servicosRealizados, label: "Serviços realizados" },
                                    { emoji: "⏱️", valor: `${MOCK_PERFIL.experienciaAnos} anos`, label: "Experiência" },
                                    { emoji: "⭐", valor: MOCK_PERFIL.notaMedia.toFixed(1), label: "Nota média" },
                                    { emoji: "💬", valor: MOCK_PERFIL.totalAvaliacoes, label: "Avaliações" },
                                ].map(stat => (
                                    <div key={stat.label} style={{
                                        background: "var(--clr-bg)", borderRadius: "var(--r-md)",
                                        padding: "var(--sp-4)", textAlign: "center",
                                    }}>
                                        <div style={{ fontSize: 22, marginBottom: "var(--sp-1)" }}>{stat.emoji}</div>
                                        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-navy)", lineHeight: 1 }}>{stat.valor}</p>
                                        <p style={{ fontSize: 11, color: "var(--clr-text-light)", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                </div>

                {/* ── Coluna direita: descrição + comentários ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>

                    {/* Descrição editável */}
                    <Card>
                        <CardHeader>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <CardTitle>📝 Sobre mim</CardTitle>
                                <Btn variant="ghost" size="sm" onClick={() => setEditando(!editando)}>
                                    {editando ? "Cancelar" : "✏️ Editar"}
                                </Btn>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {editando ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                    <div className="wm-form-group">
                                        <label className="wm-label">Especialidade</label>
                                        <input
                                            className="wm-input"
                                            value={especialidade}
                                            onChange={e => setEspecialidade(e.target.value)}
                                        />
                                    </div>
                                    <div className="wm-form-group">
                                        <label className="wm-label">Descrição</label>
                                        <textarea
                                            className="wm-input"
                                            rows={5}
                                            value={descricao}
                                            onChange={e => setDescricao(e.target.value)}
                                        />
                                    </div>
                                    <Btn variant="primary" size="sm" onClick={() => setEditando(false)}>
                                        Salvar alterações
                                    </Btn>
                                </div>
                            ) : (
                                <p style={{ fontSize: 14, color: "var(--clr-text-mid)", lineHeight: 1.7 }}>
                                    {descricao}
                                </p>
                            )}
                        </CardBody>
                    </Card>

                    {/* Comentários de clientes */}
                    <Card>
                        <CardHeader><CardTitle>💬 Avaliações de clientes</CardTitle></CardHeader>
                        <CardBody>
                            {MOCK_COMENTARIOS.length === 0 ? (
                                <p style={{ fontSize: 14, color: "var(--clr-text-light)", textAlign: "center", padding: "var(--sp-6) 0" }}>
                                    Nenhuma avaliação ainda. Complete seus primeiros serviços!
                                </p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                                    {MOCK_COMENTARIOS.map((c, i) => (
                                        <div key={c.id}>
                                            {i > 0 && <Divider />}
                                            <div style={{ paddingTop: i > 0 ? "var(--sp-4)" : 0 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: "var(--r-full)",
                                                            background: "var(--clr-purple-pale)", color: "var(--clr-purple)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: 13, fontWeight: 700,
                                                        }}>
                                                            {c.cliente.charAt(0)}
                                                        </div>
                                                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--clr-navy)" }}>{c.cliente}</span>
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                                                        <Estrelas nota={c.nota} size={13} />
                                                        <span style={{ fontSize: 11, color: "var(--clr-text-light)" }}>{fmtData(c.data)}</span>
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: 13, color: "var(--clr-text-mid)", lineHeight: 1.6 }}>
                                                    "{c.comentario}"
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>

                </div>
            </div>

        </PageLayout>
    );
}