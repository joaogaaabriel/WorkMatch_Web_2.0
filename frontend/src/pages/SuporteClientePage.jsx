/**
 * WorkMatch — pages/SuporteClientePage.jsx
 * CEL Design System v3.0 — ÚLTIMO ARQUIVO
 *
 * Lógica 100% preservada:
 *  - FAQS / CANAIS dados
 *  - FaqItem open/setOpen
 *  - handleEnviar / formEnviado / form state
 *
 * Alterações visuais:
 *  - CANAIS: emojis 📧 💬 📱 → SVG Mail, MessageSquare, Phone
 *  - Card canais: borderTop purple → blue, info color purple → blue
 *  - FAQ: var(--clr-purple-pale/purple) → blue-pale/blue
 *  - CardTitle: ❓ 💌 → SVG HelpCircle, Mail
 *  - Success: ✅ (fontSize 52) → SVG CheckCircle
 *  - Alert: variant="purple" emoji="ℹ️" → variant="info" (ícone SVG auto via Alert)
 *  - Botão: "📤 Enviar mensagem" → SVG Send + texto
 *  - Horário: 🕐 (fontSize 36) → SVG Clock
 *  - Tempo resposta: color purple → blue
 */

import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { Card, CardHeader, CardBody, CardTitle, Btn, Alert } from "../components/ui";

/* =========================================================
   ÍCONES SVG — inline, Lucide-style
========================================================= */

const IcoMail = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IcoMessageSquare = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IcoPhone = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IcoHelpCircle = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
);

const IcoMailSm = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IcoSend = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const IcoClock = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IcoCheckCircleLg = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* =========================================================
   DADOS — emoji substituído por componente Icon
========================================================= */

const FAQS = [
  { q: "Como faço para agendar um serviço?",      a: "Acesse a tela 'Início', escolha o profissional desejado, selecione a data e o horário disponíveis, e confirme o agendamento." },
  { q: "Como cancelo um agendamento?",            a: "Vá em 'Meus Agendamentos', localize o agendamento futuro e clique em 'Cancelar'. Agendamentos passados não podem ser cancelados." },
  { q: "Posso alterar a data de um agendamento?", a: "No momento, não é possível alterar diretamente. Cancele o agendamento atual e realize um novo com a data desejada." },
  { q: "Como atualizo meus dados pessoais?",      a: "Acesse 'Meu Perfil' no menu lateral e edite as informações desejadas." },
  { q: "Esqueci minha senha. O que faço?",        a: "Na tela de login, clique em 'Esqueci minha senha' para receber instruções por e-mail. Se não encontrar, verifique sua pasta de spam." },
  { q: "Os profissionais são verificados?",       a: "Sim. Todos os profissionais cadastrados têm CPF validado pela equipe WorkMatch antes de aparecerem na plataforma." },
];

const CANAIS = [
  { Icon: IcoMail,          title: "E-mail",    desc: "Resposta em até 24h",        info: "suporte@workmatch.com.br", btn: "Enviar e-mail"    },
  { Icon: IcoMessageSquare, title: "WhatsApp",  desc: "Segunda a sexta, 8h–18h",    info: "(62) 99999-9999",         btn: "Abrir WhatsApp"  },
  { Icon: IcoPhone,         title: "Telefone",  desc: "Segunda a sexta, 8h–18h",    info: "(62) 3333-4444",          btn: "Ligar agora"     },
];

/* =========================================================
   FAQ ITEM — lógica preservada, purple → blue
========================================================= */

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border:     "1px solid var(--clr-border)",
      borderRadius: "var(--r-md)",
      overflow:   "hidden",
      transition: "box-shadow var(--t-base)",
      boxShadow:  open ? "var(--shadow-sm)" : "none",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width:          "100%",
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          padding:        "var(--sp-5)",
          /* blue-pale substitui purple-pale */
          background:     open ? "var(--clr-blue-pale)" : "var(--clr-surface)",
          border:         "none",
          cursor:         "pointer",
          fontFamily:     "var(--font-body)",
          fontSize:       15,
          fontWeight:     600,
          /* blue substitui purple */
          color:          open ? "var(--clr-blue)" : "var(--clr-navy)",
          textAlign:      "left",
          gap:            "var(--sp-4)",
          transition:     "background var(--t-fast), color var(--t-fast)",
        }}
      >
        <span>{q}</span>
        <span style={{
          fontSize:   18,
          flexShrink: 0,
          fontWeight: 300,
          transform:  open ? "rotate(45deg)" : "none",
          transition: "transform var(--t-base)",
          /* blue substitui purple */
          color:      open ? "var(--clr-blue)" : "var(--clr-text-light)",
        }}>
          +
        </span>
      </button>

      {open && (
        <div style={{
          padding:    "var(--sp-2) var(--sp-5) var(--sp-5)",
          color:      "var(--clr-text-mid)",
          lineHeight: 1.7,
          fontSize:   14,
          background: "var(--clr-surface)",
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function SuporteClientePage() {
  const [formEnviado, setFormEnviado] = useState(false);
  const [form, setForm]               = useState({ assunto: "", mensagem: "" });

  /* ── Lógica preservada ── */
  function handleEnviar(e) {
    e.preventDefault();
    setFormEnviado(true);
    setForm({ assunto: "", mensagem: "" });
    setTimeout(() => setFormEnviado(false), 5000);
  }

  return (
    <PageLayout title="Suporte" subtitle="Estamos aqui para ajudar" backPath="/home">

      {/* ── Canais de atendimento — SVG icons, sem emojis 📧 💬 📱 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--sp-5)" }}>
        {CANAIS.map(({ Icon, title, desc, info, btn }) => (
          <div key={title} style={{
            background:   "var(--clr-surface)",
            borderRadius: "var(--r-lg)",
            border:       "1px solid var(--clr-border)",
            /* blue substitui purple no borderTop */
            borderTop:    "3px solid var(--clr-blue)",
            padding:      "var(--sp-6)",
            textAlign:    "center",
            boxShadow:    "var(--shadow-sm)",
          }}>
            {/* Ícone SVG no lugar do emoji */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--sp-4)", color: "var(--clr-blue)" }}>
              <Icon size={32} />
            </div>
            <p style={{ fontWeight: 700, color: "var(--clr-navy)", marginBottom: "var(--sp-1)" }}>{title}</p>
            <p style={{ fontSize: 13, color: "var(--clr-text-light)", marginBottom: "var(--sp-3)" }}>{desc}</p>
            {/* blue substitui purple na info */}
            <p style={{ fontWeight: 600, color: "var(--clr-blue)", fontSize: 14, marginBottom: "var(--sp-5)" }}>{info}</p>
            <Btn variant="secondary" size="sm" fullWidth>{btn}</Btn>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--sp-6)", alignItems: "start" }}>

        {/* ── FAQ — SVG HelpCircle, sem ❓ ── */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sp-2)" }}>
                <IcoHelpCircle /> Perguntas frequentes
              </span>
            </CardTitle>
          </CardHeader>
          <CardBody style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {FAQS.map((item, i) => <FaqItem key={i} {...item} />)}
          </CardBody>
        </Card>

        {/* ── Formulário de contato — SVG Mail, sem 💌 ── */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sp-2)" }}>
                <IcoMailSm /> Enviar mensagem
              </span>
            </CardTitle>
          </CardHeader>
          <CardBody>

            {formEnviado ? (
              /* Estado de sucesso — SVG CheckCircle, sem ✅ */
              <div style={{ textAlign: "center", padding: "var(--sp-8) 0" }}>
                <div style={{
                  display: "flex", justifyContent: "center",
                  marginBottom: "var(--sp-4)", color: "var(--clr-success)",
                }}>
                  <IcoCheckCircleLg size={52} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-navy)", marginBottom: "var(--sp-3)", fontWeight: 400 }}>
                  Mensagem enviada!
                </h3>
                <p style={{ color: "var(--clr-text-light)", fontSize: 14, lineHeight: 1.6 }}>
                  Nossa equipe responderá em até 24 horas no seu e-mail cadastrado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnviar} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>

                {/* Alert — variant="info" com ícone SVG automático (sem emoji ℹ️) */}
                <Alert variant="info">
                  Nossa equipe responde em até 24 horas nos dias úteis.
                </Alert>

                <div className="wm-form-group">
                  <label className="wm-label">
                    Assunto <span className="wm-label__required">*</span>
                  </label>
                  <select
                    className="wm-input wm-input--select"
                    value={form.assunto}
                    onChange={(e) => setForm((p) => ({ ...p, assunto: e.target.value }))}
                    required
                  >
                    <option value="">Selecione um assunto...</option>
                    <option>Problema com agendamento</option>
                    <option>Dúvida sobre o sistema</option>
                    <option>Reclamação sobre profissional</option>
                    <option>Sugestão de melhoria</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div className="wm-form-group">
                  <label className="wm-label">
                    Mensagem <span className="wm-label__required">*</span>
                  </label>
                  <textarea
                    className="wm-input"
                    rows={5}
                    required
                    value={form.mensagem}
                    onChange={(e) => setForm((p) => ({ ...p, mensagem: e.target.value }))}
                    placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
                  />
                </div>

                {/* Botão — SVG Send, sem 📤 */}
                <div className="wm-form-actions">
                  <Btn type="submit" fullWidth disabled={!form.assunto || !form.mensagem}>
                    <IcoSend /> Enviar mensagem
                  </Btn>
                </div>

              </form>
            )}
          </CardBody>
        </Card>

      </div>

      {/* ── Horário de atendimento — SVG Clock, sem 🕐 ── */}
      <Card>
        <CardBody>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-5)", flexWrap: "wrap" }}>

            {/* SVG Clock no lugar do emoji 🕐 */}
            <div style={{ color: "var(--clr-blue-lt)", flexShrink: 0 }}>
              <IcoClock size={40} />
            </div>

            <div>
              <p style={{ fontWeight: 700, color: "var(--clr-navy)", marginBottom: "var(--sp-1)" }}>
                Horário de atendimento
              </p>
              <p style={{ color: "var(--clr-text-mid)", fontSize: 14 }}>
                Segunda a sexta — 8h às 18h
              </p>
            </div>

            <div style={{ marginLeft: "auto" }}>
              <p style={{ fontSize: 12, color: "var(--clr-text-light)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Tempo médio de resposta
              </p>
              {/* blue substitui purple */}
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-blue)" }}>
                2–4 horas
              </p>
            </div>

          </div>
        </CardBody>
      </Card>

    </PageLayout>
  );
}
