/**
 * WorkMatch 2.0 — SuporteClientePage
 */
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Input, Textarea } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const FAQ = [
  {
    q: "Como faço para agendar um serviço?",
    a: "Na página inicial, encontre o profissional que deseja, clique no card dele, escolha uma data no calendário, selecione o horário disponível e confirme o agendamento.",
  },
  {
    q: "Posso cancelar um agendamento?",
    a: "Sim! Acesse 'Meus Agendamentos', encontre o agendamento que deseja cancelar e clique em 'Cancelar agendamento'. O cancelamento é imediato.",
  },
  {
    q: "Os profissionais são verificados?",
    a: "Sim. Todos os profissionais passam por validação de CPF e dados antes de aparecerem na plataforma.",
  },
  {
    q: "Como altero minha senha?",
    a: "Acesse 'Meu Perfil' pelo menu lateral, vá à seção 'Alterar senha', informe sua senha atual e a nova senha.",
  },
  {
    q: "Não encontrei um profissional na minha cidade. O que faço?",
    a: "Use a barra de busca na tela inicial para pesquisar por especialidade. Se ainda assim não encontrar, entre em contato com nosso suporte.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border:"1.5px solid var(--clr-border)",
      borderRadius:14,
      overflow:"hidden",
      transition:"border-color .15s",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width:"100%", textAlign:"left",
          padding:"18px 20px",
          background:open ? "var(--clr-primary-bg)" : "var(--clr-surface)",
          border:"none", cursor:"pointer",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          gap:12,
          fontFamily:"var(--font-body)",
          transition:"background .15s",
        }}
      >
        <span style={{ fontSize:16, fontWeight:700, color:"var(--clr-text)", lineHeight:1.4 }}>{q}</span>
        <span style={{
          fontSize:20, color:"var(--clr-primary)", flexShrink:0,
          transform: open ? "rotate(180deg)" : "none",
          transition:"transform .2s",
        }}>▾</span>
      </button>
      {open && (
        <div style={{
          padding:"16px 20px",
          borderTop:"1px solid var(--clr-border)",
          background:"var(--clr-bg)",
        }}>
          <p style={{ color:"var(--clr-muted)", fontSize:15, lineHeight:1.7, fontWeight:500 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function SuporteClientePage() {
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm] = useState({ assunto:"", mensagem:"" });
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.assunto.trim() || !form.mensagem.trim()) {
      showToast("Preencha assunto e mensagem.", "warning");
      return;
    }
    setSending(true);
    // Simulação de envio (endpoint não existe no backend)
    setTimeout(() => {
      showToast("Mensagem enviada! Nossa equipe entrará em contato em breve. 📬", "success");
      setForm({ assunto:"", mensagem:"" });
      setSending(false);
    }, 1200);
  }

  return (
    <PageLayout title="Central de Suporte" subtitle="Como podemos te ajudar?" backPath="/home">

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:28 }}>

        {/* ── FAQ ── */}
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, marginBottom:16, color:"var(--clr-text)" }}>
            ❓ Perguntas frequentes
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {FAQ.map((item, i) => (
              <FaqItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* ── Formulário de contato ── */}
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, marginBottom:16, color:"var(--clr-text)" }}>
            ✉️ Fale conosco
          </h2>

          <Card style={{ padding:28 }}>
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <Input
                label="Assunto"
                name="assunto"
                value={form.assunto}
                onChange={handleChange}
                placeholder="Descreva brevemente o seu problema"
                icon="📝"
                required
              />
              <Textarea
                label="Mensagem"
                name="mensagem"
                value={form.mensagem}
                onChange={handleChange}
                placeholder="Descreva em detalhes como podemos te ajudar..."
                rows={6}
                required
              />
              <Btn type="submit" fullWidth size="lg" loading={sending}>
                📬 Enviar mensagem
              </Btn>
            </form>
          </Card>

          {/* Canais alternativos */}
          <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { emoji:"📧", label:"E-mail", value:"suporte@workmatch.com.br" },
              { emoji:"📱", label:"WhatsApp", value:"(62) 99999-0000" },
              { emoji:"🕐", label:"Horário de atendimento", value:"Seg–Sex, 8h às 18h" },
            ].map(({ emoji, label, value }) => (
              <div key={label} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"14px 18px",
                background:"var(--clr-surface)",
                border:"1px solid var(--clr-border)",
                borderRadius:12,
              }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{emoji}</span>
                <div>
                  <p style={{ fontSize:13, color:"var(--clr-muted)", fontWeight:600, marginBottom:2 }}>{label}</p>
                  <p style={{ fontSize:15, color:"var(--clr-text)", fontWeight:700 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
