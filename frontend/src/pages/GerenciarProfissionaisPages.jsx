/**
 * WorkMatch 2.0 — GerenciarProfissionaisPages (ADMIN)
 * BUG CORRIGIDO: template literals corretos; MenuLateral fixo
 */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { profissionaisService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Input, Textarea, Spinner, EmptyState } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const FORM_EMPTY = {
  id: "", nome: "", email: "", cpf: "", telefone: "",
  dataNascimento: "", especialidade: "", descricao: "",
  experienciaAnos: 0, cidade: "", estado: "", endereco: "",
};

function ProfForm({ form, onChange, onSubmit, onCancel, loading, isEdit }) {
  const field = (name, label, extra = {}) => (
    <Input
      label={label}
      name={name}
      value={form[name] ?? ""}
      onChange={onChange}
      {...extra}
    />
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:18 }}>
        {field("nome",         "Nome completo",  { required:true, placeholder:"João da Silva" })}
        {field("especialidade","Especialidade",  { required:true, placeholder:"Eletricista" })}
        {field("email",        "E-mail",         { type:"email", placeholder:"email@exemplo.com" })}
        {field("cpf",          "CPF",            { placeholder:"000.000.000-00" })}
        {field("telefone",     "Telefone",       { type:"tel", placeholder:"(62) 99999-9999" })}
        {field("dataNascimento","Nascimento",    { type:"date" })}
        {field("experienciaAnos","Experiência (anos)", { type:"number", placeholder:"0" })}
        {field("cidade",       "Cidade",         { placeholder:"Goiânia" })}
        {field("estado",       "Estado (UF)",    { placeholder:"GO", maxLength:2 })}
        {field("endereco",     "Endereço",       { placeholder:"Rua das Flores, 123" })}
      </div>

      <Textarea
        label="Descrição / Apresentação"
        name="descricao"
        value={form.descricao ?? ""}
        onChange={onChange}
        placeholder="Descreva a experiência e o trabalho do profissional..."
        rows={3}
      />

      <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onCancel} disabled={loading}>Cancelar</Btn>
        <Btn onClick={onSubmit} loading={loading} size="lg">
          {isEdit ? "💾 Salvar alterações" : "➕ Adicionar profissional"}
        </Btn>
      </div>
    </div>
  );
}

export default function GerenciarProfissionaisPages() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletando, setDeletando] = useState(null);

  const [mode, setMode] = useState("list"); // list | form
  const [form, setForm] = useState(FORM_EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busca, setBusca] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const data = await profissionaisService.listar();
      setProfissionais(Array.isArray(data) ? data : []);
    } catch {
      showToast("Erro ao carregar profissionais.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "experienciaAnos" ? Number(value) : value }));
  }

  function openAdd() {
    setForm(FORM_EMPTY);
    setMode("form");
  }

  function openEdit(prof) {
    setForm({ ...prof });
    setMode("form");
  }

  function cancelForm() {
    setMode("list");
    setForm(FORM_EMPTY);
  }

  async function handleSave() {
    if (!form.nome?.trim() || !form.especialidade?.trim()) {
      showToast("Nome e especialidade são obrigatórios.", "warning");
      return;
    }
    setSaving(true);
    try {
      if (form.id) {
        await profissionaisService.atualizar(form.id, form);
        showToast("Profissional atualizado com sucesso! ✓", "success");
      } else {
        await profissionaisService.criar(form);
        showToast("Profissional adicionado com sucesso! ✓", "success");
      }
      setMode("list");
      carregar();
    } catch {
      showToast("Erro ao salvar profissional.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletando(id);
    try {
      await profissionaisService.deletar(id);
      showToast("Profissional removido.", "success");
      setConfirmDelete(null);
      carregar();
    } catch {
      showToast("Erro ao remover profissional.", "error");
    } finally {
      setDeletando(null);
    }
  }

  const filtrados = useMemo(() => {
    if (!busca) return profissionais;
    const q = busca.toLowerCase();
    return profissionais.filter(p =>
      p.nome?.toLowerCase().includes(q) ||
      p.especialidade?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    );
  }, [profissionais, busca]);

  return (
    <PageLayout
      title="Gerenciar Profissionais"
      subtitle={`${profissionais.length} profissional${profissionais.length !== 1 ? "is" : ""} cadastrado${profissionais.length !== 1 ? "s" : ""}`}
      backPath="/home"
      headerRight={
        mode === "list" && (
          <Btn onClick={openAdd}>
            + Novo profissional
          </Btn>
        )
      }
    >

      {/* ── Formulário ── */}
      {mode === "form" && (
        <Card style={{ padding:28, marginBottom:32 }}>
          <h2 style={{ fontSize:20, fontWeight:900, color:"var(--clr-text)", marginBottom:24 }}>
            {form.id ? "✏️ Editar profissional" : "➕ Novo profissional"}
          </h2>
          <ProfForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSave}
            onCancel={cancelForm}
            loading={saving}
            isEdit={!!form.id}
          />
        </Card>
      )}

      {/* ── Lista ── */}
      {mode === "list" && (
        <>
          {/* Busca */}
          <div style={{ position:"relative", maxWidth:480, marginBottom:24 }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>🔍</span>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome, especialidade ou e-mail..."
              style={{
                width:"100%", padding:"13px 16px 13px 44px",
                fontSize:15, fontFamily:"var(--font-body)", fontWeight:500,
                color:"var(--clr-text)", background:"var(--clr-surface)",
                border:"2px solid var(--clr-border)", borderRadius:12, outline:"none",
                boxShadow:"var(--shadow-sm)",
              }}
            />
          </div>

          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
              <Spinner size={48} />
            </div>
          ) : filtrados.length === 0 ? (
            <EmptyState
              emoji="👷"
              title={busca ? "Nenhum resultado" : "Nenhum profissional cadastrado"}
              description={busca ? "Tente buscar por outro termo." : "Clique em '+ Novo profissional' para adicionar o primeiro."}
              action={busca ? <Btn variant="ghost" onClick={() => setBusca("")}>Limpar busca</Btn> : null}
            />
          ) : (
            <>
              {/* Tabela responsiva */}
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 8px" }}>
                  <thead>
                    <tr>
                      {["Nome", "Especialidade", "E-mail", "Cidade", "Ações"].map(h => (
                        <th key={h} style={{
                          padding:"10px 16px", textAlign:"left", fontSize:13,
                          fontWeight:700, color:"var(--clr-muted)",
                          letterSpacing:"0.05em", textTransform:"uppercase",
                          background:"var(--clr-bg)",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map(p => (
                      <tr key={p.id} style={{
                        background:"var(--clr-surface)",
                        borderRadius:12,
                        boxShadow:"var(--shadow-sm)",
                      }}>
                        <td style={{ padding:"16px 16px", borderRadius:"12px 0 0 12px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                            <div style={{
                              width:38, height:38, borderRadius:"50%",
                              background:"var(--grad-brand)",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:15, fontWeight:900, color:"#fff", flexShrink:0,
                            }}>
                              {(p.nome?.[0] || "?").toUpperCase()}
                            </div>
                            <span style={{ fontWeight:700, fontSize:15, color:"var(--clr-text)" }}>{p.nome}</span>
                          </div>
                        </td>
                        <td style={{ padding:"16px 16px" }}>
                          <span style={{
                            fontSize:13, fontWeight:700, padding:"4px 12px", borderRadius:99,
                            background:"var(--clr-primary-bg)", color:"var(--clr-primary)",
                          }}>{p.especialidade || "—"}</span>
                        </td>
                        <td style={{ padding:"16px 16px", color:"var(--clr-muted)", fontSize:14, fontWeight:500 }}>
                          {p.email || "—"}
                        </td>
                        <td style={{ padding:"16px 16px", color:"var(--clr-muted)", fontSize:14, fontWeight:500 }}>
                          {[p.cidade, p.estado].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td style={{ padding:"16px 16px", borderRadius:"0 12px 12px 0" }}>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                            <Btn size="sm" variant="secondary" onClick={() => openEdit(p)}>
                              ✏️ Editar
                            </Btn>
                            <Btn
                              size="sm"
                              variant="ghost"
                              style={{ color:"var(--clr-primary-lt)", borderColor:"#bfdbfe" }}
                              onClick={() => navigate(`/profissional/${p.id}/agenda`)}
                            >
                              📅 Agenda
                            </Btn>
                            <Btn
                              size="sm"
                              variant="ghost"
                              style={{ color:"var(--clr-danger)", borderColor:"#fecaca" }}
                              onClick={() => setConfirmDelete(p.id)}
                            >
                              🗑️ Remover
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ textAlign:"right", color:"var(--clr-subtle)", fontSize:13, marginTop:12 }}>
                {filtrados.length} de {profissionais.length} profissionais
              </p>
            </>
          )}
        </>
      )}

      {/* ── Modal confirmação de exclusão ── */}
      {confirmDelete && (
        <div style={{
          position:"fixed", inset:0, zIndex:500,
          background:"rgba(15,23,42,0.6)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:16,
        }}>
          <Card style={{ padding:36, maxWidth:420, width:"100%" }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
              <h2 style={{ fontSize:22, fontWeight:900, marginBottom:8 }}>Remover profissional?</h2>
              <p style={{ color:"var(--clr-muted)", fontSize:16, lineHeight:1.6 }}>
                Todos os agendamentos e agendas deste profissional também serão removidos. Essa ação não pode ser desfeita.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Btn variant="danger" fullWidth size="lg" loading={deletando === confirmDelete} onClick={() => handleDelete(confirmDelete)}>
                Sim, remover
              </Btn>
              <Btn variant="ghost" fullWidth onClick={() => setConfirmDelete(null)} disabled={!!deletando}>
                Cancelar
              </Btn>
            </div>
          </Card>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
