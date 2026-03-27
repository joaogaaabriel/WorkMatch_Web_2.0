/**
 * WorkMatch 2.0 — ConfiguracaoPerfilPage
 */
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { usuariosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardHeader, CardBody, CardTitle, Input, Avatar, Divider, Alert, Badge } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function fmtTel(v) { v=v.replace(/\D/g,"").slice(0,11); if(v.length<=2)return`(${v}`; if(v.length<=7)return`(${v.slice(0,2)}) ${v.slice(2)}`; return`(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`; }

export default function ConfiguracaoPerfilPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { toast, showToast, hideToast } = useToast();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formPerfil, setFormPerfil] = useState({ nome:"", email:"", telefone:"", endereco:"" });
  const [formSenha, setFormSenha] = useState({ senhaAtual:"", novaSenha:"", confirmar:"" });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!user?.token) { navigate("/login"); return; }
    usuariosService.buscarPerfil()
      .then(data => {
        setPerfil(data);
        setFormPerfil({ nome: data.nome||"", email: data.email||"", telefone: fmtTel(data.telefone||""), endereco: data.endereco||"" });
      })
      .catch(() => showToast("Erro ao carregar perfil.", "error"))
      .finally(() => setLoading(false));
  }, []);

  function handlePerfil(e) {
    let { name, value } = e.target;
    if (name === "telefone") value = fmtTel(value);
    setFormPerfil(p => ({ ...p, [name]: value }));
  }

  function handleSenha(e) { setFormSenha(p => ({ ...p, [e.target.name]: e.target.value })); }

  async function salvarPerfil(e) {
    e.preventDefault();
    setSalvandoPerfil(true);
    try {
      await usuariosService.atualizarPerfil({ ...formPerfil, telefone: formPerfil.telefone.replace(/\D/g,"") });
      showToast("Perfil atualizado com sucesso!", "success");
    } catch { showToast("Erro ao atualizar perfil.", "error"); }
    finally { setSalvandoPerfil(false); }
  }

  async function salvarSenha(e) {
    e.preventDefault();
    if (formSenha.novaSenha !== formSenha.confirmar) { showToast("As senhas não coincidem.", "warning"); return; }
    if (formSenha.novaSenha.length < 6) { showToast("A nova senha deve ter pelo menos 6 caracteres.", "warning"); return; }
    setSalvandoSenha(true);
    try {
      await usuariosService.alterarSenha({ senhaAtual: formSenha.senhaAtual, novaSenha: formSenha.novaSenha });
      showToast("Senha alterada com sucesso!", "success");
      setFormSenha({ senhaAtual:"", novaSenha:"", confirmar:"" });
    } catch (err) {
      const msg = err.response?.status === 400 ? "Senha atual incorreta." : "Erro ao alterar senha.";
      showToast(msg, "error");
    } finally { setSalvandoSenha(false); }
  }

  const initials = formPerfil.nome ? formPerfil.nome.trim().split(" ").filter(Boolean).map(w=>w[0]).slice(0,2).join("").toUpperCase() : "U";

  return (
    <PageLayout title="Meu Perfil" subtitle="Gerencie seus dados pessoais" backPath="/home">

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"var(--sp-16) 0" }}>
          <div className="wm-spinner wm-spinner--lg" />
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"var(--sp-6)", alignItems:"start" }}>

          {/* Dados pessoais */}
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--sp-5)" }}>
            {/* Avatar + info */}
            <Card accent="purple">
              <CardBody>
                <div style={{ display:"flex", alignItems:"center", gap:"var(--sp-5)" }}>
                  <div className="wm-avatar wm-avatar--xl wm-avatar--purple" style={{ flexShrink:0 }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:18, color:"var(--clr-navy)", marginBottom:4 }}>{formPerfil.nome || "—"}</p>
                    <p style={{ color:"var(--clr-text-light)", fontSize:14, marginBottom:8 }}>{formPerfil.email}</p>
                    <Badge variant={user?.role === "ADMIN" ? "blue" : "purple"}>
                      {user?.role === "ADMIN" ? "👑 Administrador" : "👤 Cliente"}
                    </Badge>
                  </div>
                </div>

                {perfil?.dataCadastro && (
                  <div style={{ marginTop:"var(--sp-5)", padding:"var(--sp-3) var(--sp-4)", background:"var(--clr-bg)", borderRadius:"var(--r-md)", display:"flex", alignItems:"center", gap:"var(--sp-2)" }}>
                    <span style={{ fontSize:16 }}>📅</span>
                    <span style={{ fontSize:13, color:"var(--clr-text-light)" }}>
                      Membro desde {new Date(perfil.dataCadastro).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Editar dados */}
            <Card>
              <CardHeader><CardTitle>✏️ Editar dados</CardTitle></CardHeader>
              <form onSubmit={salvarPerfil}>
                <CardBody style={{ display:"flex", flexDirection:"column", gap:"var(--sp-4)" }}>
                  <Input label="Nome completo" name="nome" value={formPerfil.nome} onChange={handlePerfil} placeholder="Seu nome" icon="👤" />
                  <Input label="E-mail" name="email" value={formPerfil.email} onChange={handlePerfil} placeholder="seuemail@email.com" icon="✉️" type="email" readOnly hint="O e-mail não pode ser alterado." />
                  <Input label="Telefone" name="telefone" value={formPerfil.telefone} onChange={handlePerfil} placeholder="(62) 99999-9999" icon="📱" />
                  <Input label="Endereço" name="endereco" value={formPerfil.endereco} onChange={handlePerfil} placeholder="Rua das Flores, 123 — Goiânia, GO" icon="📍" />
                  <div className="wm-form-actions">
                    <Btn type="submit" loading={salvandoPerfil}>Salvar alterações</Btn>
                  </div>
                </CardBody>
              </form>
            </Card>
          </div>

          {/* Segurança */}
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--sp-5)" }}>
            <Card accent="blue">
              <CardHeader><CardTitle>🔒 Segurança</CardTitle></CardHeader>
              <form onSubmit={salvarSenha}>
                <CardBody style={{ display:"flex", flexDirection:"column", gap:"var(--sp-4)" }}>
                  <Alert variant="purple" emoji="ℹ️">
                    Sua senha deve ter no mínimo 6 caracteres. Por segurança, não use senhas simples como "123456".
                  </Alert>

                  <div className="wm-form-group">
                    <label className="wm-label">Senha atual <span className="wm-label__required">*</span></label>
                    <div className="wm-input-wrapper">
                      <span className="wm-input-icon">🔒</span>
                      <input
                        name="senhaAtual" type={showPass ? "text" : "password"}
                        value={formSenha.senhaAtual} onChange={handleSenha}
                        placeholder="Senha atual" className="wm-input wm-input--with-icon"
                        style={{ paddingRight:"var(--sp-10)" }}
                      />
                      <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:18 }}>
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <Divider />

                  <div className="wm-form-group">
                    <label className="wm-label">Nova senha <span className="wm-label__required">*</span></label>
                    <div className="wm-input-wrapper">
                      <span className="wm-input-icon">🔑</span>
                      <input
                        name="novaSenha" type={showPass ? "text" : "password"}
                        value={formSenha.novaSenha} onChange={handleSenha}
                        placeholder="Mínimo 6 caracteres" className="wm-input wm-input--with-icon"
                      />
                    </div>
                    {formSenha.novaSenha && formSenha.novaSenha.length < 6 && (
                      <span className="wm-field-error">Mínimo 6 caracteres</span>
                    )}
                  </div>

                  <div className="wm-form-group">
                    <label className="wm-label">Confirmar nova senha <span className="wm-label__required">*</span></label>
                    <div className="wm-input-wrapper">
                      <span className="wm-input-icon">🔑</span>
                      <input
                        name="confirmar" type={showPass ? "text" : "password"}
                        value={formSenha.confirmar} onChange={handleSenha}
                        placeholder="Repita a nova senha"
                        className={`wm-input wm-input--with-icon${formSenha.confirmar && formSenha.confirmar !== formSenha.novaSenha ? " wm-input--error" : ""}`}
                      />
                    </div>
                    {formSenha.confirmar && formSenha.confirmar !== formSenha.novaSenha && (
                      <span className="wm-field-error">As senhas não coincidem</span>
                    )}
                  </div>

                  <div className="wm-form-actions">
                    <Btn type="button" variant="secondary" onClick={() => setFormSenha({ senhaAtual:"", novaSenha:"", confirmar:"" })}>Limpar</Btn>
                    <Btn
                      type="submit" loading={salvandoSenha}
                      disabled={!formSenha.senhaAtual || !formSenha.novaSenha || formSenha.novaSenha !== formSenha.confirmar || formSenha.novaSenha.length < 6}
                    >
                      Alterar senha
                    </Btn>
                  </div>
                </CardBody>
              </form>
            </Card>

            {/* Info CPF */}
            {perfil?.cpf && (
              <Card>
                <CardBody>
                  <p style={{ fontSize:12, color:"var(--clr-text-light)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"var(--sp-2)" }}>CPF cadastrado</p>
                  <p style={{ fontWeight:700, color:"var(--clr-navy)", letterSpacing:"0.04em" }}>
                    {perfil.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4")}
                  </p>
                  <p style={{ fontSize:12, color:"var(--clr-text-light)", marginTop:"var(--sp-1)" }}>O CPF não pode ser alterado.</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
