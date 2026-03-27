/**
 * WorkMatch 2.0 — LoginPage
 * BUG CORRIGIDO: URL usa authService (porta 8082 / VITE_API_URL1)
 */
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/api";
import { Btn, Input, Card } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { toast, showToast, hideToast } = useToast();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.senha) {
      showToast("Preencha todos os campos.", "warning");
      return;
    }

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
      const msg = err.response?.status === 401
        ? "E-mail ou senha incorretos."
        : "Não foi possível conectar. Tente novamente.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "var(--font-body)",
    }}>

      {/* ── Painel esquerdo (decorativo, oculto em mobile) ── */}
      <div style={{
        flex: 1,
        background: "var(--grad-hero)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        position: "relative",
        overflow: "hidden",
      }}
        className="hide-mobile"
      >
        <style>{`@media(max-width:768px){.hide-mobile{display:none!important}}`}</style>

        {/* Blob */}
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(255,255,255,0.06)", top:-100, right:-100 }} />
        <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"rgba(245,158,11,0.15)", bottom:40, left:-60 }} />

        <div style={{ position:"relative", zIndex:1, textAlign:"center", color:"#fff" }}>
          <div style={{
            fontSize: 64,
            fontWeight: 900,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 24,
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}>
            🔧
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 40,
            marginBottom: 16,
            lineHeight: 1.15,
          }}>
            Bem-vindo de volta ao <em style={{ color: "#fcd34d" }}>WorkMatch</em>
          </h2>
          <p style={{ fontSize: 17, opacity: 0.8, lineHeight: 1.7, maxWidth: 380 }}>
            Conectamos você aos melhores profissionais autônomos da sua região.
            Agende com facilidade e segurança.
          </p>

          <div style={{ display:"flex", gap:32, justifyContent:"center", marginTop:40 }}>
            {[
              { n: "500+", l: "Profissionais" },
              { n: "2.4k", l: "Agendamentos" },
              { n: "4.8★", l: "Avaliação" },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign:"center" }}>
                <p style={{ fontSize:28, fontWeight:900, color:"#fcd34d" }}>{n}</p>
                <p style={{ fontSize:13, opacity:0.75 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Painel direito (formulário) ── */}
      <div style={{
        width: "min(100%, 480px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        background: "var(--clr-bg)",
      }}>
        {/* Logo mobile */}
        <div style={{ textAlign:"center", marginBottom: 40 }}>
          <span
            onClick={() => navigate("/")}
            style={{
              cursor:"pointer",
              fontWeight:900,
              fontSize:30,
              background:"var(--grad-brand)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
            }}
          >
            WorkMatch
          </span>
          <h1 style={{ fontSize:28, fontWeight:800, color:"var(--clr-text)", marginTop:24, marginBottom:6 }}>
            Entrar na sua conta
          </h1>
          <p style={{ color:"var(--clr-muted)", fontSize:16 }}>
            Use seu e-mail ou login para acessar
          </p>
        </div>

        <Card style={{ width:"100%", padding:32 }}>
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <Input
              label="E-mail ou login"
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              icon="👤"
              required
              autoComplete="username"
            />

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:15, fontWeight:700, color:"var(--clr-text)" }}>
                Senha <span style={{ color:"var(--clr-danger)" }}>*</span>
              </label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18, pointerEvents:"none" }}>🔒</span>
                <input
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                  style={{
                    width:"100%",
                    padding:"14px 48px 14px 44px",
                    fontSize:16,
                    fontFamily:"var(--font-body)",
                    fontWeight:500,
                    color:"var(--clr-text)",
                    background:"var(--clr-surface)",
                    border:"2px solid var(--clr-border)",
                    borderRadius:12,
                    outline:"none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", fontSize:18, padding:4,
                  }}
                >{showPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>

            <Btn type="submit" fullWidth size="lg" loading={loading}>
              Entrar na conta
            </Btn>
          </form>
        </Card>

        <div style={{ textAlign:"center", marginTop:24 }}>
          <p style={{ color:"var(--clr-muted)", fontSize:15 }}>
            Não tem conta?{" "}
            <button
              onClick={() => navigate("/cadastro")}
              style={{
                background:"none", border:"none",
                color:"var(--clr-primary-lt)", fontWeight:700,
                fontSize:15, cursor:"pointer",
                fontFamily:"var(--font-body)",
              }}
            >
              Criar conta grátis →
            </button>
          </p>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}
