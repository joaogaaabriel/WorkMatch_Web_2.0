/**
 * WorkMatch 2.0 — LoginPage
 */
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/api";
import { Btn, Input } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.senha) { showToast("Preencha todos os campos.", "warning"); return; }
    setLoading(true);
    try {
      const data = await authService.login({
        email: form.email.includes("@") ? form.email : null,
        login: !form.email.includes("@") ? form.email : null,
        senha: form.senha,
      });
      login({ token: data.token, nome: data.nome, role: data.role });
      showToast(`Bem-vindo, ${data.nome}! 👋`, "success");
      setTimeout(() => navigate("/home"), 600);
    } catch (err) {
      const msg = err.response?.status === 401 ? "E-mail ou senha incorretos." : "Erro ao conectar. Tente novamente.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wm-auth">
      {/* Painel esquerdo */}
      <div className="wm-auth__panel-left">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", maxWidth: 400 }}>
          <div style={{ fontSize: 56, marginBottom: "var(--sp-6)" }}>🔧</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 38, marginBottom: "var(--sp-4)", lineHeight: 1.15 }}>
            Bem-vindo de volta ao <em style={{ color: "var(--clr-yellow)" }}>WorkMatch</em>
          </h2>
          <p style={{ fontSize: 16, opacity: 0.78, lineHeight: 1.7 }}>
            Conectamos você aos melhores profissionais autônomos da sua região.
          </p>
          <div style={{ display: "flex", gap: "var(--sp-8)", justifyContent: "center", marginTop: "var(--sp-10)" }}>
            {[["500+", "Profissionais"], ["2.4k", "Agendamentos"], ["4.8★", "Avaliação"]].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--clr-yellow)" }}>{n}</p>
                <p style={{ fontSize: 12, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel direito */}
      <div className="wm-auth__panel-right">
        <span className="wm-auth__logo" onClick={() => navigate("/")}>
          Work<span>Match</span>
        </span>

        <div className="wm-auth__card">
          <h1 className="wm-auth__heading">Entrar na conta</h1>
          <p className="wm-auth__sub">Use seu e-mail ou login para acessar</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <Input
              label="E-mail ou login" name="email" value={form.email}
              onChange={handleChange} placeholder="seuemail@exemplo.com"
              icon="👤" required
            />

            <div className="wm-form-group">
              <label className="wm-label">Senha <span className="wm-label__required">*</span></label>
              <div className="wm-input-wrapper">
                <span className="wm-input-icon">🔒</span>
                <input
                  name="senha" type={showPass ? "text" : "password"}
                  value={form.senha} onChange={handleChange}
                  placeholder="Sua senha" required
                  className="wm-input wm-input--with-icon"
                  style={{ paddingRight: "var(--sp-10)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}
                >{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>

            <Btn type="submit" fullWidth size="lg" loading={loading} style={{ marginTop: "var(--sp-2)" }}>
              Entrar na conta
            </Btn>
          </form>

          <p style={{ textAlign: "center", marginTop: "var(--sp-5)", fontSize: 14, color: "var(--clr-text-light)" }}>
            Não tem conta?{" "}
            <button onClick={() => navigate("/cadastro")} style={{ background: "none", border: "none", color: "var(--clr-purple)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              Criar conta grátis →
            </button>
          </p>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}
