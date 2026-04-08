/**
 * WorkMatch 2.0 — CadastroPage
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosService, validacaoService } from "../services/api";
import { Btn, Input, Card, CardBody } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const INITIAL = { nome: "", email: "", cpf: "", telefone: "", dataNascimento: "", endereco: "", senha: "", role: "CLIENTE" };

function fmtCpf(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
    d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
  );
}
function fmtTel(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 7) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
}

export default function CadastroPage() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === "cpf") value = fmtCpf(value);
    if (name === "telefone") value = fmtTel(value);
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  }

  function validateStep1() {
    const errs = {};
    if (!form.nome.trim()) errs.nome = "Nome obrigatório";
    if (!form.cpf || form.cpf.length < 14) errs.cpf = "CPF inválido";
    if (!form.telefone || form.telefone.length < 14) errs.telefone = "Telefone inválido";
    if (!form.dataNascimento) errs.dataNascimento = "Obrigatório";
    return errs;
  }

  async function handleNext() {
  const errs = validateStep1();
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setLoading(true);

  try {
    const cpfLimpo = form.cpf.replace(/\D/g, "");

    const { valido } = await validacaoService.validarCpf(cpfLimpo);
    if (!valido) {
      setErrors({ cpf: "CPF inválido ou não reconhecido." });
      return;
    }

    const { existe } = await validacaoService.cpfExiste(cpfLimpo);
    if (existe) {
      setErrors({ cpf: "CPF inválido ou não reconhecido." });
      return;
    }

    setStep(2);

  } catch {
    showToast("Erro ao validar CPF.", "error");
  } finally {
    setLoading(false);
  }
}

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.email || !form.email.includes("@")) errs.email = "E-mail inválido";
    if (!form.senha || form.senha.length < 6) errs.senha = "Mínimo 6 caracteres";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data); 
      return;
    }

    console.log("Usuário criado:", data.id);
    showToast("Conta criada com sucesso! 🎉", "success");
    setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      showToast(err.response?.data?.message || "Erro ao criar conta.", "error");
    } finally { setLoading(false); }
  }

  const f = (name, label, extra = {}) => ({ label, name, value: form[name], onChange: handleChange, error: errors[name], ...extra });

  return (
    <div className="wm-auth" style={{ flexDirection: "column", alignItems: "center", padding: "var(--sp-8) var(--sp-4)" }}>
      {/* Topo */}
      <div style={{ width: "100%", maxWidth: 540, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-8)" }}>
        <span className="wm-auth__logo" style={{ margin: 0, fontSize: "1.3rem" }} onClick={() => navigate("/")}>
          Work<span>Match</span>
        </span>
        <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "var(--clr-text-mid)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" }}>
          Já tenho conta →
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 540 }}>
        {/* Steps */}
        <div className="wm-steps">
          <div className={`wm-step${step >= 1 ? " wm-step--active" : ""}`} />
          <div className={`wm-step${step >= 2 ? " wm-step--active" : ""}`} />
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--clr-navy)", marginBottom: "var(--sp-1)", fontWeight: 400 }}>
          {step === 1 ? "Seus dados pessoais" : "Dados de acesso"}
        </h1>
        <p style={{ color: "var(--clr-text-light)", fontSize: 14, marginBottom: "var(--sp-6)" }}>
          Passo {step} de 2 — {step === 1 ? "Informe seus dados pessoais" : "Crie seu acesso"}
        </p>

        <div className="wm-auth__card">
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
              <div className="wm-form-grid-2">
                <Input {...f("nome", "Nome completo", { placeholder: "João Silva", icon: "👤", required: true })} />
                <Input {...f("cpf", "CPF", { placeholder: "000.000.000-00", icon: "🪪", required: true, maxLength: 14 })} />
                <Input {...f("telefone", "Telefone", { placeholder: "(62) 99999-9999", icon: "📱", required: true })} />
                <Input {...f("dataNascimento", "Data de nascimento", { icon: "🎂", required: true, type: "date" })} />
              </div>
              <Input {...f("endereco", "Endereço", { placeholder: "Rua das Flores, 123 — Goiânia, GO", icon: "📍" })} />
              <div className="wm-form-actions">
                <Btn loading={loading} onClick={handleNext}>Continuar →</Btn>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
              <Input {...f("email", "E-mail", { placeholder: "seuemail@exemplo.com", icon: "✉️", required: true, type: "email" })} />
              <div className="wm-form-group">
                <label className="wm-label">Senha <span className="wm-label__required">*</span></label>
                <div className="wm-input-wrapper">
                  <span className="wm-input-icon">🔒</span>
                  <input
                    name="senha" type={showPass ? "text" : "password"}
                    value={form.senha} onChange={handleChange}
                    placeholder="Mínimo 6 caracteres" required
                    className={`wm-input wm-input--with-icon${errors.senha ? " wm-input--error" : ""}`}
                    style={{ paddingRight: "var(--sp-10)" }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.senha && <span className="wm-field-error">{errors.senha}</span>}
              </div>
              <div className="wm-form-actions">
                <Btn variant="secondary" onClick={() => setStep(1)} type="button">← Voltar</Btn>
                <Btn type="submit" loading={loading}>Criar conta</Btn>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "var(--sp-4)", fontSize: 12, color: "var(--clr-text-light)" }}>
          Ao criar uma conta você concorda com os termos de uso do WorkMatch.
        </p>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}
