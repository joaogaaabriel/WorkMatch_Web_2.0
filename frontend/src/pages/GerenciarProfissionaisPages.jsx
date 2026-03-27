/**
 * WorkMatch 2.0 — GerenciarProfissionaisPages (ADMIN)
 */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { profissionaisService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardHeader, CardBody, CardTitle, Input, Textarea, Badge, Spinner, EmptyState, Avatar } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const EMPTY_FORM = { nome:"", cpf:"", email:"", telefone:"", especialidade:"", descricao:"", experienciaAnos:"", cidade:"", estado:"", endereco:"" };
const ESPECIALIDADES = ["Eletricista","Encanador","Jardineiro","Faxineiro","Pintor","Pedreiro","Marceneiro","Reparos gerais"];

function fmtCpf(v) { v=v.replace(/\D/g,"").slice(0,11); return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/,(_,a,b,c,d)=>d?`${a}.${b}.${c}-${d}`:c?`${a}.${b}.${c}`:b?`${a}.${b}`:a); }
function fmtTel(v) { v=v.replace(/\D/g,"").slice(0,11); if(v.length<=2)return`(${v}`; if(v.length<=7)return`(${v.slice(0,2)}) ${v.slice(2)}`; return`(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`; }

export default function GerenciarProfissionaisPages() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(null); // null | "criar" | "editar" | "excluir"
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [excluirId, setExcluirId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setLoading(true);
    try { setLista(await profissionaisService.listar()); }
    catch { showToast("Erro ao carregar profissionais.", "error"); }
    finally { setLoading(false); }
  }

  useEffect(() => { carregar(); }, []);

  const filtrados = useMemo(() =>
    lista.filter(p => !busca || p.nome?.toLowerCase().includes(busca.toLowerCase()) || p.especialidade?.toLowerCase().includes(busca.toLowerCase())),
    [lista, busca]
  );

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === "cpf") value = fmtCpf(value);
    if (name === "telefone") value = fmtTel(value);
    setForm(p => ({ ...p, [name]: value }));
  }

  function abrirCriar() { setForm(EMPTY_FORM); setEditId(null); setModal("criar"); }
  function abrirEditar(p) { setForm({ ...p, cpf: fmtCpf(p.cpf||""), telefone: fmtTel(p.telefone||""), experienciaAnos: String(p.experienciaAnos||"") }); setEditId(p.id); setModal("editar"); }
  function abrirExcluir(id) { setExcluirId(id); setModal("excluir"); }
  function fecharModal() { setModal(null); setEditId(null); setExcluirId(null); }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      const payload = { ...form, cpf: form.cpf.replace(/\D/g,""), telefone: form.telefone.replace(/\D/g,""), experienciaAnos: Number(form.experienciaAnos)||0 };
      if (editId) await profissionaisService.atualizar(editId, payload);
      else await profissionaisService.cadastrar(payload);
      showToast(editId ? "Profissional atualizado!" : "Profissional cadastrado!", "success");
      fecharModal(); carregar();
    } catch { showToast("Erro ao salvar profissional.", "error"); }
    finally { setSalvando(false); }
  }

  async function excluir() {
    setSalvando(true);
    try { await profissionaisService.excluir(excluirId); showToast("Profissional excluído.", "success"); fecharModal(); carregar(); }
    catch { showToast("Erro ao excluir.", "error"); }
    finally { setSalvando(false); }
  }

  const f = (name, label, extra={}) => ({ label, name, value: form[name], onChange: handleChange, ...extra });

  return (
    <PageLayout title="Gerenciar Profissionais" subtitle={`${lista.length} cadastrados`} backPath="/home">

      {/* Toolbar */}
      <div style={{ display:"flex", gap:"var(--sp-4)", flexWrap:"wrap" }}>
        <div className="wm-search-wrapper" style={{ flex:1, minWidth:220 }}>
          <span className="wm-search-icon">🔍</span>
          <input className="wm-input wm-search-input" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome ou especialidade..." />
        </div>
        <Btn onClick={abrirCriar}>+ Novo profissional</Btn>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Profissionais cadastrados</CardTitle>
          <Badge variant="purple">{filtrados.length}</Badge>
        </CardHeader>

        {loading ? (
          <CardBody><div style={{ display:"flex",justifyContent:"center",padding:"var(--sp-12) 0" }}><Spinner size="lg"/></div></CardBody>
        ) : filtrados.length === 0 ? (
          <CardBody>
            <EmptyState emoji="👷" title="Nenhum profissional" description={busca ? "Tente outro termo de busca." : "Cadastre o primeiro profissional."} action={!busca && <Btn onClick={abrirCriar}>+ Cadastrar</Btn>} />
          </CardBody>
        ) : (
          <div className="wm-table-wrapper">
            <table className="wm-table">
              <thead>
                <tr>
                  <th>Profissional</th>
                  <th>Especialidade</th>
                  <th>Localização</th>
                  <th>Experiência</th>
                  <th>Contato</th>
                  <th style={{ textAlign:"right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, i) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:"var(--sp-3)" }}>
                        <Avatar name={p.nome} size="sm" colorIndex={i} />
                        <div>
                          <p style={{ fontWeight:600, color:"var(--clr-navy)" }}>{p.nome}</p>
                          <p style={{ fontSize:12, color:"var(--clr-text-light)" }}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><Badge variant="purple">{p.especialidade}</Badge></td>
                    <td style={{ color:"var(--clr-text-mid)", fontSize:14 }}>
                      {[p.cidade, p.estado].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td style={{ color:"var(--clr-text-mid)", fontSize:14 }}>
                      {p.experienciaAnos ? `${p.experienciaAnos} anos` : "—"}
                    </td>
                    <td style={{ color:"var(--clr-text-mid)", fontSize:14 }}>{p.telefone || "—"}</td>
                    <td>
                      <div style={{ display:"flex", gap:"var(--sp-2)", justifyContent:"flex-end" }}>
                        <Btn variant="secondary" size="sm" onClick={() => navigate(`/profissional/${p.id}/agenda`)}>📅</Btn>
                        <Btn variant="secondary" size="sm" onClick={() => abrirEditar(p)}>✏️</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => abrirExcluir(p.id)} style={{ color:"var(--clr-danger)" }}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal criar/editar */}
      {(modal === "criar" || modal === "editar") && (
        <div className="wm-modal-overlay">
          <div className="wm-modal wm-modal--lg" style={{ maxHeight:"90vh", overflowY:"auto" }}>
            <div className="wm-modal__header">
              <h2 className="wm-modal__title">{modal==="criar" ? "➕ Novo profissional" : "✏️ Editar profissional"}</h2>
              <Btn variant="ghost" size="sm" onClick={fecharModal} disabled={salvando}>×</Btn>
            </div>
            <form onSubmit={salvar}>
              <div className="wm-modal__body" style={{ display:"flex", flexDirection:"column", gap:"var(--sp-4)" }}>
                <div className="wm-form-grid-2">
                  <Input {...f("nome","Nome completo",{placeholder:"João Silva",required:true})} />
                  <Input {...f("cpf","CPF",{placeholder:"000.000.000-00",maxLength:14})} />
                  <Input {...f("email","E-mail",{placeholder:"joao@email.com",type:"email"})} />
                  <Input {...f("telefone","Telefone",{placeholder:"(62) 99999-9999"})} />
                </div>

                <div className="wm-form-group">
                  <label className="wm-label">Especialidade</label>
                  <select name="especialidade" value={form.especialidade} onChange={handleChange} className="wm-input">
                    <option value="">Selecione...</option>
                    {ESPECIALIDADES.map(e=><option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                <div className="wm-form-grid-2">
                  <Input {...f("cidade","Cidade",{placeholder:"Goiânia"})} />
                  <Input {...f("estado","Estado",{placeholder:"GO",maxLength:2})} />
                  <Input {...f("experienciaAnos","Anos de experiência",{type:"number",min:0,max:50,placeholder:"5"})} />
                  <Input {...f("endereco","Endereço",{placeholder:"Rua das Flores, 123"})} />
                </div>

                <div className="wm-form-group">
                  <label className="wm-label">Descrição / Bio</label>
                  <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Conte um pouco sobre o profissional..." className="wm-input" rows={3} />
                </div>
              </div>
              <div className="wm-modal__footer">
                <Btn variant="secondary" onClick={fecharModal} disabled={salvando} type="button">Cancelar</Btn>
                <Btn type="submit" loading={salvando}>{modal==="criar" ? "Cadastrar" : "Salvar"}</Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal excluir */}
      {modal === "excluir" && (
        <div className="wm-modal-overlay">
          <div className="wm-modal wm-modal--sm">
            <div className="wm-modal__header">
              <h2 className="wm-modal__title">Excluir profissional?</h2>
              <Btn variant="ghost" size="sm" onClick={fecharModal}>×</Btn>
            </div>
            <div className="wm-modal__body">
              <p style={{ color:"var(--clr-text-mid)", lineHeight:1.6 }}>
                Isso removerá o profissional e <strong>todos os agendamentos e agenda</strong> vinculados. Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="wm-modal__footer">
              <Btn variant="secondary" onClick={fecharModal} disabled={salvando}>Cancelar</Btn>
              <Btn variant="danger" loading={salvando} onClick={excluir}>Excluir</Btn>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
