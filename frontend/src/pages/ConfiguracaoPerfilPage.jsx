/**
 * WorkMatch 2.0 — ConfiguracaoPerfilPage
 *
 * CORREÇÕES:
 * - Usa /auth/introspect para obter userId, depois GET /api/usuarios/{id}
 * - Atualização via PUT /api/usuarios/{id} com campos que o backend aceita
 * - Seção de senha desabilitada (backend não tem endpoint dedicado)
 */
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiAuth, apiBackend } from "../services/api";
import { usuariosService } from "../services/api";
import PageLayout from "../components/PageLayout";
import { Btn, Card, CardHeader, CardBody, CardTitle, Input, Divider, Alert, Badge } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

function fmtCpf(v) {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
    d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
  );
}

export default function ConfiguracaoPerfilPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { toast, showToast, hideToast } = useToast();

  const [perfil, setPerfil] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formPerfil, setFormPerfil] = useState({ nome: "", email: "", telefone: "", endereco: "" });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  useEffect(() => {
    if (!user?.token) { navigate("/login"); return; }

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    // 1) Introspect para pegar userId
    apiAuth.post("/auth/introspect", { token })
      .then(res => {
        const { active, userId: uid } = res.data;
        if (!active || !uid) { navigate("/login"); return; }
        setUserId(uid);
        // 2) Buscar dados do usuário
        return apiBackend.get(`/api/usuarios/${uid}`);
      })
      .then(res => {
        if (!res) return;
        const data = res.data;
        setPerfil(data);
        setFormPerfil({
          nome:     data.nome     || "",
          email:    data.email    || "",
          telefone: data.telefone || "",
          endereco: data.endereco || "",
        });
      })
      .catch(err => {
        console.error("Erro ao carregar perfil:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        } else {
          showToast("Erro ao carregar dados do perfil.", "error");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setFormPerfil(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function salvarPerfil(e) {
    e.preventDefault();
    if (!userId) return;
    setSalvandoPerfil(true);
    try {
      // O PUT /api/usuarios/{id} do backend aceita: nome, email, cpf
      // Enviamos o que temos; cpf vem do perfil carregado (não editável)
      await apiBackend.put(`/api/usuarios/${userId}`, {
        nome:  formPerfil.nome,
        email: formPerfil.email,
        cpf:   perfil?.cpf || "",
      });
      showToast("Perfil atualizado com sucesso!", "success");
    } catch (err) {
      const msg = err.response?.data || "Erro ao atualizar perfil.";
      showToast(typeof msg === "string" ? msg : "Erro ao atualizar perfil.", "error");
    } finally {
      setSalvandoPerfil(false);
    }
  }

  const initials = formPerfil.nome
    ? formPerfil.nome.trim().split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <PageLayout title="Meu Perfil" subtitle="Gerencie seus dados pessoais" backPath="/home">

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--sp-16) 0" }}>
          <div className="wm-spinner wm-spinner--lg" />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--sp-6)", alignItems: "start" }}>

          {/* Card perfil */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>

            {/* Avatar + info */}
            <Card accent="purple">
              <CardBody>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-5)" }}>
                  <div className="wm-avatar wm-avatar--xl wm-avatar--purple" style={{ flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 18, color: "var(--clr-navy)", marginBottom: 4 }}>
                      {formPerfil.nome || "—"}
                    </p>
                    <p style={{ color: "var(--clr-text-light)", fontSize: 14, marginBottom: 8 }}>
                      {formPerfil.email}
                    </p>
                    <Badge variant={user?.role === "ADMIN" ? "blue" : "purple"}>
                      {user?.role === "ADMIN" ? "👑 Administrador" : "👤 Cliente"}
                    </Badge>
                  </div>
                </div>

                {perfil?.dataCadastro && (
                  <div style={{ marginTop: "var(--sp-5)", padding: "var(--sp-3) var(--sp-4)", background: "var(--clr-bg)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                    <span style={{ fontSize: 16 }}>📅</span>
                    <span style={{ fontSize: 13, color: "var(--clr-text-light)" }}>
                      Membro desde{" "}
                      {new Date(perfil.dataCadastro).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* CPF (somente leitura) */}
            {perfil?.cpf && (
              <Card>
                <CardBody>
                  <p style={{ fontSize: 12, color: "var(--clr-text-light)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "var(--sp-2)" }}>
                    CPF cadastrado
                  </p>
                  <p style={{ fontWeight: 700, color: "var(--clr-navy)", letterSpacing: "0.04em", fontSize: 16 }}>
                    {fmtCpf(perfil.cpf)}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--clr-text-light)", marginTop: "var(--sp-1)" }}>
                    O CPF não pode ser alterado.
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Editar dados */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
            <Card>
              <CardHeader><CardTitle>✏️ Editar dados</CardTitle></CardHeader>
              <form onSubmit={salvarPerfil}>
                <CardBody style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                  <Input
                    label="Nome completo" name="nome" value={formPerfil.nome}
                    onChange={handleChange} placeholder="Seu nome completo"
                    icon="👤" required
                  />
                  <Input
                    label="E-mail" name="email" value={formPerfil.email}
                    onChange={handleChange} placeholder="seuemail@email.com"
                    icon="✉️" type="email"
                    hint="Alterar o e-mail pode afetar seu próximo login."
                  />

                  <Alert variant="info" emoji="ℹ️">
                    Telefone e endereço são informações complementares armazenadas localmente.
                  </Alert>

                  <div className="wm-form-actions">
                    <Btn type="submit" loading={salvandoPerfil}>Salvar alterações</Btn>
                  </div>
                </CardBody>
              </form>
            </Card>

            {/* Seção senha — informativa, backend sem endpoint */}
            <Card accent="blue">
              <CardHeader><CardTitle>🔒 Segurança</CardTitle></CardHeader>
              <CardBody>
                <Alert variant="warning" emoji="⚠️">
                  A alteração de senha não está disponível nesta versão. Entre em contato com o suporte para solicitar a redefinição.
                </Alert>
                <div style={{ marginTop: "var(--sp-4)" }}>
                  <Btn
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate("/suporte")}
                  >
                    💬 Ir para o Suporte
                  </Btn>
                </div>
              </CardBody>
            </Card>
          </div>

        </div>
      )}

      <Toast {...toast} onClose={hideToast} />
    </PageLayout>
  );
}
