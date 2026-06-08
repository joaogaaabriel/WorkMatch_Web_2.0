/**
 * WorkMatch — pages/PerfilProfissional.jsx
 * CEL Design System v3.0
 *
 * Lógica 100% preservada:
 *  - MOCK_PERFIL / MOCK_COMENTARIOS
 *  - Estrelas() / fmtData()
 *  - editando / descricao / especialidade states
 *
 * Alterações visuais:
 *  - Avatar: gradient purple → navy+blue, shadow-purple → shadow-blue
 *  - Badge especialidade: variant="purple" + 🔧 → variant="blue" + SVG Wrench
 *  - 📍 localização → SVG MapPin
 *  - Nota média: var(--clr-purple) → var(--clr-blue) explícito
 *  - Nota card: var(--clr-purple-pale) → var(--clr-blue-pale)
 *  - Stat emojis: ✅ ⏱️ ⭐ 💬 → SVG por stat
 *  - CardTitle emojis: 📊 📝 💬 → SVG
 *  - "✏️ Editar" → SVG Pencil
 *  - Comment avatar: purple → blue explícito
 */

import React, { useState }        from "react";
import { useAuth }                 from "../context/AuthContext";
import PageLayout                  from "../components/PageLayout";
import { Card, CardBody, CardHeader, CardTitle, Btn, Badge, Divider } from "../components/ui";

/* =========================================================
   ÍCONES SVG — inline, Lucide-style
========================================================= */

const IcoWrench = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const IcoMapPin = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IcoBarChart = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <line x1="18" x2="18" y1="20" y2="10"/>
    <line x1="12" x2="12" y1="20" y2="4"/>
    <line x1="6"  x2="6"  y1="20" y2="14"/>
  </svg>
);

const IcoFileText = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9"  y2="9"/>
  </svg>
);

const IcoMessageSquare = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IcoPencil = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

/* Ícones de stats */
const IcoCheckCircle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IcoClock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoStar = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IcoUsers = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* =========================================================
   MOCKS — preservados integralmente
========================================================= */

const MOCK_PERFIL = {
  nome:               "Carlos Matos",
  especialidade:      "Pintor",
  descricao:          "Profissional com mais de 8 anos de experiência em pintura residencial e comercial. Trabalho com tintas premium e entrego no prazo combinado.",
  cidade:             "Goiânia",
  estado:             "GO",
  experienciaAnos:    8,
  servicosRealizados: 47,
  notaMedia:          4.8,
  totalAvaliacoes:    31,
  foto:               null,
};

const MOCK_COMENTARIOS = [
  { id: 1, cliente: "Maria Souza",   nota: 5, data: "2026-05-10", comentario: "Trabalho impecável, pontual e muito cuidadoso. Recomendo!" },
  { id: 2, cliente: "Pedro Lima",    nota: 5, data: "2026-04-28", comentario: "Excelente profissional, sala ficou linda. Voltarei a contratar." },
  { id: 3, cliente: "Ana Ferreira",  nota: 4, data: "2026-04-15", comentario: "Bom serviço, pequeno atraso no início mas o resultado foi ótimo." },
  { id: 4, cliente: "Lucas Pinto",   nota: 5, data: "2026-03-30", comentario: "Super atencioso e caprichoso. Nota 10!" },
];

/* Stats — Icon substituindo emoji */
const STATS = (perfil, especialidade) => [
  { Icon: IcoCheckCircle, valor: perfil.servicosRealizados,        label: "Serviços realizados" },
  { Icon: IcoClock,       valor: `${perfil.experienciaAnos} anos`, label: "Experiência"          },
  { Icon: IcoStar,        valor: perfil.notaMedia.toFixed(1),      label: "Nota média"           },
  { Icon: IcoUsers,       valor: perfil.totalAvaliacoes,           label: "Avaliações"           },
];

/* =========================================================
   HELPERS — preservados integralmente
========================================================= */

function Estrelas({ nota, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{
          color:    n <= Math.round(nota) ? "var(--clr-yellow)" : "var(--clr-border-mid)",
          fontSize: size,
        }}>
          ★
        </span>
      ))}
    </span>
  );
}

function fmtData(d) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function PerfilProfissional() {
  const { user } = useAuth();

  const [editando,      setEditando]      = useState(false);
  const [descricao,     setDescricao]     = useState(MOCK_PERFIL.descricao);
  const [especialidade, setEspecialidade] = useState(MOCK_PERFIL.especialidade);

  const initials = MOCK_PERFIL.nome
    .trim().split(" ").filter(Boolean)
    .map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <PageLayout title="Meu perfil" subtitle="Gerencie sua presença no WorkMatch" backPath="/home">

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--sp-6)", alignItems: "start" }}>

        {/* ── Coluna esquerda: avatar + stats ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>

          {/* Card avatar + info principal */}
          <Card>
            <CardBody>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--sp-4)" }}>

                {/* Avatar — gradient navy+blue, sem purple */}
                <div style={{
                  width:        96,
                  height:       96,
                  borderRadius: "var(--r-full)",
                  background:   "linear-gradient(135deg, var(--clr-navy) 0%, var(--clr-blue) 100%)",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                  color:        "#fff",
                  fontSize:     32,
                  fontWeight:   700,
                  boxShadow:    "var(--shadow-blue)",
                  flexShrink:   0,
                }}>
                  {initials}
                </div>

                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-navy)", marginBottom: "var(--sp-1)" }}>
                    {MOCK_PERFIL.nome}
                  </h2>

                  {/* Badge especialidade — variant blue, SVG Wrench, sem emoji 🔧 */}
                  <Badge variant="blue">
                    <IcoWrench /> {especialidade}
                  </Badge>

                  {/* Localização — SVG MapPin, sem emoji 📍 */}
                  <p style={{ fontSize: 13, color: "var(--clr-text-light)", marginTop: "var(--sp-2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <IcoMapPin /> {MOCK_PERFIL.cidade} — {MOCK_PERFIL.estado}
                  </p>
                </div>

                {/* Nota média — var(--clr-blue) explícito, sem purple */}
                <div style={{
                  background:   "var(--clr-blue-pale)",
                  borderRadius: "var(--r-lg)",
                  padding:      "var(--sp-4) var(--sp-6)",
                  width:        "100%",
                }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", color: "var(--clr-blue)", lineHeight: 1 }}>
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

          {/* Card de estatísticas — SVG icons, sem emojis ✅ ⏱️ ⭐ 💬 */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sp-2)" }}>
                  <IcoBarChart /> Estatísticas
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-4)" }}>
                {STATS(MOCK_PERFIL, especialidade).map(({ Icon, valor, label }) => (
                  <div key={label} style={{
                    background:   "var(--clr-bg)",
                    borderRadius: "var(--r-md)",
                    padding:      "var(--sp-4)",
                    textAlign:    "center",
                  }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--sp-1)", color: "var(--clr-blue)" }}>
                      <Icon size={20} />
                    </div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-navy)", lineHeight: 1 }}>
                      {valor}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--clr-text-light)", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

        </div>

        {/* ── Coluna direita: descrição + avaliações ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>

          {/* Card Sobre mim — SVG FileText + Pencil, sem 📝 ✏️ */}
          <Card>
            <CardHeader>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <CardTitle>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sp-2)" }}>
                    <IcoFileText /> Sobre mim
                  </span>
                </CardTitle>
                <Btn variant="ghost" size="sm" onClick={() => setEditando(!editando)}>
                  {editando
                    ? "Cancelar"
                    : <><IcoPencil /> Editar</>
                  }
                </Btn>
              </div>
            </CardHeader>
            <CardBody>
              {editando ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                  <div className="wm-form-group">
                    <label className="wm-label">Especialidade</label>
                    <input className="wm-input" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} />
                  </div>
                  <div className="wm-form-group">
                    <label className="wm-label">Descrição</label>
                    <textarea className="wm-input" rows={5} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                  </div>
                  <Btn variant="primary" size="sm" onClick={() => setEditando(false)}>
                    Salvar alterações
                  </Btn>
                </div>
              ) : (
                <p style={{ fontSize: 14, color: "var(--clr-text-mid)", lineHeight: 1.7 }}>{descricao}</p>
              )}
            </CardBody>
          </Card>

          {/* Card avaliações — SVG MessageSquare, sem 💬 */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sp-2)" }}>
                  <IcoMessageSquare /> Avaliações de clientes
                </span>
              </CardTitle>
            </CardHeader>
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

                            {/* Avatar de comentário — blue-pale/blue, sem purple */}
                            <div style={{
                              width: 32, height: 32, borderRadius: "var(--r-full)",
                              background: "var(--clr-blue-pale)", color: "var(--clr-blue)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 700,
                            }}>
                              {c.cliente.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--clr-navy)" }}>
                              {c.cliente}
                            </span>
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
