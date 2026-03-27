/**
 * WorkMatch 2.0 — ConfiguracaoPerfilPage
 */
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { usuariosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Card, Btn, Input, Divider } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function ConfiguracaoPerfilPage() {
  const { user, login } = useContext(AuthContext);
  const { toast, showToast, hideToast } = useToast();

  const [nome, setNome] = useState(user?.nome || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  async function salvarNome(e) {
    e.preventDefault();
    if (!nome.trim()) { showToast("Nome não pode ser vazio.", "warning"); return; }
    setSaving(true);
    try {
      if (user?.id) {
        await usuariosService.atualizar(user.id, { nome });
      }
      login({ ...user, nome });
      showToast("Nome atualizado com sucesso! ✓", "success");
    } catch {
      showToast("Erro ao atualizar nome.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function salvarSenha(e) {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmar) { showToast("Preencha todos os campos.", "warning"); return; }
    if (novaSenha.length < 6) { showToast("Nova senha deve ter ao menos 6 caracteres.", "warning"); return; }
    if (novaSenha !== confirmar) { showToast("Senhas não conferem.", "error"); return; }
    setSavingPass(true);
    try {
      if (user?.id) {
        await usuariosService.atualizar(user.id, { senhaAtual, senha: novaSenha });
      }
      showToast("Senha alterada com sucesso! ✓", "success");
      setSenhaAtual(""); setNovaSenha(""); setConfirmar("");
    } catch (err) {
      const msg = err.response?.status === 401 ? "Senha atual incorreta." : "Erro ao alterar senha.";
      showToast(msg, "error");
    } finally {
      setSavingPass(false);
    }
  }

  const nomeInicial = user?.nome ? user.nome.charAt(0).toUpperCase() : "U";

  return (
    <PageLayout title="Meu Perfil" subtitle="Gerencie suas informações pessoais" backPath="/home">

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24, maxWidth:800 }}>

        {/* ── Dados pessoais ── */}
        <Card style={{ padding:28 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
            <div style={{
              width:80, height:80, borderRadius:"50%",
              background:"var(--grad-brand)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:32, fontWeight:900, color:"#fff",
              marginBottom:14,
              boxShadow:"var(--shadow-blue)",
            }}>
              {nomeInicial}
            </div>
            <p style={{ fontWeight:800, fontSize:18, color:"var(--clr-text)" }}>{user?.nome || "Usuário"}</p>
            <span style={{
              fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:99, marginTop:6,
              background: user?.role === "ADMIN" ? "#fef3c7" : "var(--clr-primary-bg)",
              color: user?.role === "ADMIN" ? "#d97706" : "var(--clr-primary)",
            }}>
              {user?.role === "ADMIN" ? "👑 Administrador" : "👤 Cliente"}
            </span>
          </div>

          <Divider style={{ marginBottom:20 }} />

          <form onSubmit={salvarNome} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:"var(--clr-text)", marginBottom:4 }}>
              ✏️ Alterar nome
            </h3>
            <Input
              label="Seu nome"
              name="nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome completo"
              icon="👤"
              required
            />
            <Btn type="submit" fullWidth loading={saving}>
              Salvar nome
            </Btn>
          </form>
        </Card>

        {/* ── Segurança ── */}
        <Card style={{ padding:28 }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:"var(--clr-text)", marginBottom:20 }}>
            🔒 Alterar senha
          </h3>

          <form onSubmit={salvarSenha} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Input
              label="Senha atual"
              name="senhaAtual"
              type="password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              icon="🔑"
              placeholder="Digite sua senha atual"
              required
            />
            <Input
              label="Nova senha"
              name="novaSenha"
              type="password"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              icon="🔒"
              placeholder="Mínimo 6 caracteres"
              required
            />
            <Input
              label="Confirmar nova senha"
              name="confirmar"
              type="password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              icon="✅"
              placeholder="Repita a nova senha"
              required
            />
            <Btn type="submit" fullWidth loading={savingPass}>
              Alterar senha
            </Btn>
          </form>
        </Card>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
