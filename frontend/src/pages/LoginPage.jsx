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

  const [form, setForm] = useState({
    login: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {

    e.preventDefault();

    if (!form.login || !form.senha) {
      showToast("Preencha todos os campos.", "warning");
      return;
    }

    setLoading(true);

    try {

      const data = await authService.login({
        login: form.login,
        senha: form.senha,
      });

      localStorage.setItem("user", JSON.stringify(data));

      login(data);

      showToast(`Bem-vindo, ${data.nome}! 👋`, "success");

      setTimeout(() => {
        navigate("/home");
      }, 800);

    } catch (err) {

      const mensagem =
          err.response?.status === 401
              ? "Login ou senha inválidos."
              : "Erro ao conectar ao servidor.";

      showToast(mensagem, "error");

    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="wm-auth">

        <div className="wm-auth__panel-left">
          <div
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                color: "#fff",
                maxWidth: 400,
              }}
          >
            <div
                style={{
                  fontSize: 56,
                  marginBottom: "var(--sp-6)",
                }}
            >
              🔧
            </div>

            <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 38,
                  marginBottom: "var(--sp-4)",
                  lineHeight: 1.15,
                }}
            >
              Bem-vindo ao{" "}
              <em style={{ color: "var(--clr-yellow)" }}>
                WorkMatch
              </em>
            </h2>

            <p
                style={{
                  fontSize: 16,
                  opacity: 0.78,
                  lineHeight: 1.7,
                }}
            >
              Encontre profissionais da sua região.
            </p>
          </div>
        </div>

        <div className="wm-auth__panel-right">

          <span
              className="wm-auth__logo"
              onClick={() => navigate("/")}
          >
            Work<span>Match</span>
          </span>

          <div className="wm-auth__card">

            <h1 className="wm-auth__heading">
              Entrar
            </h1>

            <p className="wm-auth__sub">
              Faça login com sua conta
            </p>

            <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--sp-4)",
                }}
            >

              <Input
                  label="Login"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="Digite seu login"
                  icon="👤"
                  required
              />

              <div className="wm-form-group">

                <label className="wm-label">
                  Senha
                </label>

                <div className="wm-input-wrapper">

                  <span className="wm-input-icon">
                    🔒
                  </span>

                  <input
                      name="senha"
                      type={showPass ? "text" : "password"}
                      value={form.senha}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      required
                      className="wm-input wm-input--with-icon"
                      style={{
                        paddingRight: "var(--sp-10)",
                      }}
                  />

                  <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>

                </div>
              </div>

              <Btn
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  style={{
                    marginTop: "var(--sp-2)",
                  }}
              >
                Entrar
              </Btn>

            </form>

            <p
                style={{
                  textAlign: "center",
                  marginTop: "var(--sp-5)",
                  fontSize: 14,
                  color: "var(--clr-text-light)",
                }}
            >
              Não possui conta?{" "}

              <button
                  onClick={() => navigate("/cadastro")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--clr-purple)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
              >
                Criar conta →
              </button>

            </p>

          </div>
        </div>

        <Toast
            {...toast}
            onClose={hideToast}
        />
      </div>
  );
}