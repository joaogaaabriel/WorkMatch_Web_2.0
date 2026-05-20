/**
 * WorkMatch 2.0 — SuporteClientePage
 */
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { Card, CardHeader, CardBody, CardTitle, Btn, Alert } from "../components/ui";

const FAQS = [
  { q: "Como faço para agendar um serviço?", a: "Acesse a tela 'Início', escolha o profissional desejado, selecione a data e o horário disponíveis, e confirme o agendamento." },
  { q: "Como cancelo um agendamento?", a: "Vá em 'Meus Agendamentos', localize o agendamento futuro e clique em 'Cancelar'. Agendamentos passados não podem ser cancelados." },
  { q: "Posso alterar a data de um agendamento?", a: "No momento, não é possível alterar diretamente. Cancele o agendamento atual e realize um novo com a data desejada." },
  { q: "Como atualizo meus dados pessoais?", a: "Acesse 'Meu Perfil' no menu lateral e edite as informações desejadas." },
  { q: "Esqueci minha senha. O que faço?", a: "Na tela de login, clique em 'Esqueci minha senha' para receber instruções por e-mail. Se não encontrar, verifique sua pasta de spam." },
  { q: "Os profissionais são verificados?", a: "Sim. Todos os profissionais cadastrados têm CPF validado pela equipe WorkMatch antes de aparecerem na plataforma." },
];

const CANAIS = [
  { emoji: "📧", title: "E-mail", desc: "Resposta em até 24h", info: "suporte@workmatch.com.br", btn: "Enviar e-mail" },
  { emoji: "💬", title: "WhatsApp", desc: "Segunda a sexta, 8h–18h", info: "(62) 99999-9999", btn: "Abrir WhatsApp" },
  { emoji: "📱", title: "Telefone", desc: "Segunda a sexta, 8h–18h", info: "(62) 3333-4444", btn: "Ligar agora" },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid var(--clr-border)", borderRadius: "var(--r-md)",
      overflow: "hidden", transition: "box-shadow var(--t-base)",
      boxShadow: open ? "var(--shadow-sm)" : "none",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "var(--sp-5) var(--sp-5)",
          background: open ? "var(--clr-purple-pale)" : "var(--clr-surface)",
          border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
          fontSize: 15, fontWeight: 600, color: open ? "var(--clr-purple)" : "var(--clr-navy)",
          textAlign: "left", gap: "var(--sp-4)", transition: "background var(--t-fast)",
        }}
      >
        <span>{q}</span>
        <span style={{ fontSize: 20, flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform var(--t-base)", color: "var(--clr-purple)" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "var(--sp-2) var(--sp-5) var(--sp-5)", color: "var(--clr-text-mid)", lineHeight: 1.7, fontSize: 14, background: "var(--clr-surface)" }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function SuporteClientePage() {
  const [formEnviado, setFormEnviado] = useState(false);
  const [form, setForm] = useState({ assunto: "", mensagem: "" });

  function handleEnviar(e) {
    e.preventDefault();
    setFormEnviado(true);
    setForm({ assunto: "", mensagem: "" });
    setTimeout(() => setFormEnviado(false), 5000);
  }

  return (
    <PageLayout title="Suporte" subtitle="Estamos aqui para ajudar" backPath="/home">

      {/* Canais */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--sp-5)" }}>
        {CANAIS.map(c => (
          <div key={c.title} style={{
            background: "var(--clr-surface)", borderRadius: "var(--r-lg)",
            border: "1px solid var(--clr-border)", borderTop: "3px solid var(--clr-purple)",
            padding: "var(--sp-6)", textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: 36, marginBottom: "var(--sp-4)" }}>{c.emoji}</div>
            <p style={{ fontWeight: 700, color: "var(--clr-navy)", marginBottom: "var(--sp-1)" }}>{c.title}</p>
            <p style={{ fontSize: 13, color: "var(--clr-text-light)", marginBottom: "var(--sp-3)" }}>{c.desc}</p>
            <p style={{ fontWeight: 600, color: "var(--clr-purple)", fontSize: 14, marginBottom: "var(--sp-5)" }}>{c.info}</p>
            <Btn variant="secondary" size="sm" fullWidth>{c.btn}</Btn>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "var(--sp-6)", alignItems: "start" }}>

        {/* FAQ */}
        <Card>
          <CardHeader><CardTitle>❓ Perguntas frequentes</CardTitle></CardHeader>
          <CardBody style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {FAQS.map((item, i) => <FaqItem key={i} {...item} />)}
          </CardBody>
        </Card>

        {/* Formulário de contato */}
        <Card accent="purple">
          <CardHeader><CardTitle>💌 Enviar mensagem</CardTitle></CardHeader>
          <CardBody>
            {formEnviado ? (
              <div style={{ textAlign: "center", padding: "var(--sp-8) 0" }}>
                <div style={{ fontSize: 52, marginBottom: "var(--sp-4)" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-navy)", marginBottom: "var(--sp-3)", fontWeight: 400 }}>
                  Mensagem enviada!
                </h3>
                <p style={{ color: "var(--clr-text-light)", fontSize: 14, lineHeight: 1.6 }}>
                  Nossa equipe responderá em até 24 horas no seu e-mail cadastrado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnviar} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <Alert variant="purple" emoji="ℹ️">
                  Nossa equipe responde em até 24 horas nos dias úteis.
                </Alert>

                <div className="wm-form-group">
                  <label className="wm-label">Assunto <span className="wm-label__required">*</span></label>
                  <select className="wm-input" value={form.assunto} onChange={e => setForm(p => ({ ...p, assunto: e.target.value }))} required>
                    <option value="">Selecione um assunto...</option>
                    <option>Problema com agendamento</option>
                    <option>Dúvida sobre o sistema</option>
                    <option>Reclamação sobre profissional</option>
                    <option>Sugestão de melhoria</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div className="wm-form-group">
                  <label className="wm-label">Mensagem <span className="wm-label__required">*</span></label>
                  <textarea
                    className="wm-input" rows={5} required
                    value={form.mensagem} onChange={e => setForm(p => ({ ...p, mensagem: e.target.value }))}
                    placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
                  />
                </div>

                <div className="wm-form-actions">
                  <Btn type="submit" fullWidth disabled={!form.assunto || !form.mensagem}>
                    📤 Enviar mensagem
                  </Btn>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Horário de atendimento */}
      <Card>
        <CardBody>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-5)", flexWrap: "wrap" }}>
            <div style={{ fontSize: 36 }}>🕐</div>
            <div>
              <p style={{ fontWeight: 700, color: "var(--clr-navy)", marginBottom: "var(--sp-1)" }}>Horário de atendimento</p>
              <p style={{ color: "var(--clr-text-mid)", fontSize: 14 }}>Segunda a sexta — 8h às 18h</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <p style={{ fontSize: 12, color: "var(--clr-text-light)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Tempo médio de resposta</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--clr-purple)" }}>2–4 horas</p>
            </div>
          </div>
        </CardBody>
      </Card>

    </PageLayout>
  );
}
