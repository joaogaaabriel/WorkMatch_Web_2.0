/**
 * WorkMatch 2.0 — CadastroPage
 * BUG CORRIGIDO: usa template literals corretos nas URLs via service layer
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosService, validacaoService } from "../services/api";
import { Btn, Input, Card } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const INITIAL = {
  nome: "", email: "", cpf: "", telefone: "",
  dataNascimento: "", endereco: "", senha: "", role: "CLIENTE",
};

function fmt_cpf(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
    d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
  );
}

function fmt_tel(v) {
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
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: dados pessoais | 2: acesso

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === "cpf") value = fmt_cpf(value);
    if (name === "telefone") value = fmt_tel(value);
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validateStep1() {
    const errs = {};
    if (!form.nome.trim()) errs.nome = "Nome obrigatório";
    if (!form.cpf || form.cpf.length < 14) errs.cpf = "CPF inválido";
    if (!form.telefone || form.telefone.length < 14) errs.telefone = "Telefone inválido";
    if (!form.dataNascimento) errs.dataNascimento = "Data de nascimento obrigatória";
    return errs;
  }

  function validateStep2() {
    const errs = {};
    if (!form.email || !form.email.includes("@")) errs.email = "E-mail inválido";
    if (!form.senha || form.senha.length < 6) errs.senha = "Senha deve ter ao menos 6 caracteres";
    return errs;
  }

  async function handleNextStep() {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const cpfLimpo = form.cpf.replace(/\D/g, "");
      const cpfValido = await validacaoService.validarCpf(cpfLimpo);
      if (!cpfValido.valido) {
        setErrors({ cpf: "CPF inválido ou não reconhecido." });
        setLoading(false);
        return;
      }
      const cpfExiste = await validacaoService.cpfExiste(cpfLimpo);
      if (cpfExiste) {
        setErrors({ cpf: "Este CPF já está cadastrado." });
        setLoading(false);
        return;
      }
      setStep(2);
    } catch {
      showToast("Erro ao validar CPF. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const emailExiste = await validacaoService.emailExiste(form.email);
      if (emailExiste) {
        setErrors({ email: "Este e-mail já está cadastrado." });
        setLoading(false);
        return;
      }

      await usuariosService.cadastrar({
        ...form,
        cpf: form.cpf.replace(/\D/g, ""),
        telefone: form.telefone.replace(/\D/g, ""),
      });

      showToast("Conta criada com sucesso! Faça login para continuar. 🎉", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao criar conta. Tente novamente.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  const inputProps = (name, label, extra = {}) => ({
    label,
    name,
    value: form[name],
    onChange: handleChange,
    error: errors[name],
    ...extra,
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--clr-bg)",
      fontFamily: "var(--font-body)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 16px 64px",
    }}>
      {/* Header */}
      <div style={{ width:"100%", maxWidth:560, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
        <span
          onClick={() => navigate("/")}
          style={{
            cursor:"pointer", fontWeight:900, fontSize:24,
            background:"var(--grad-brand)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
          }}
        >WorkMatch</span>
        <button
          onClick={() => navigate("/login")}
          style={{
            background:"none", border:"none", color:"var(--clr-muted)",
            fontSize:15, cursor:"pointer", fontFamily:"var(--font-body)", fontWeight:600,
          }}
        >Já tenho conta →</button>
      </div>

      <div style={{ width:"100%", maxWidth:560 }}>
        {/* Progress */}
        <div style={{ display:"flex", gap:8, marginBottom:32 }}>
          {[1,2].map(n => (
            <div key={n} style={{
              flex:1, height:5, borderRadius:99,
              background: n <= step ? "var(--clr-primary)" : "var(--clr-border)",
              transition: "background .3s",
            }} />
          ))}
        </div>

        <h1 style={{ fontSize:30, fontWeight:900, color:"var(--clr-text)", marginBottom:4 }}>
          {step === 1 ? "Seus dados pessoais" : "Dados de acesso"}
        </h1>
        <p style={{ color:"var(--clr-muted)", fontSize:16, marginBottom:32 }}>
          {step === 1 ? "Passo 1 de 2 — Informe seus dados pessoais" : "Passo 2 de 2 — Crie seu acesso"}
        </p>

        <Card style={{ padding:32 }}>
          {step === 1 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Input {...inputProps("nome", "Nome completo", { placeholder:"João Silva", icon:"👤", required:true })} />
              <Input {...inputProps("cpf", "CPF", { placeholder:"000.000.000-00", icon:"🪪", required:true, maxLength:14 })} />
              <Input {...inputProps("telefone", "Telefone / WhatsApp", { placeholder:"(62) 99999-9999", icon:"📱", required:true, type:"tel" })} />
              <Input {...inputProps("dataNascimento", "Data de nascimento", { icon:"🎂", required:true, type:"date" })} />
              <Input {...inputProps("endereco", "Endereço", { placeholder:"Rua das Flores, 123 — Goiânia, GO", icon:"📍" })} />

              <Btn size="lg" fullWidth loading={loading} onClick={handleNextStep}>
                Continuar →
              </Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Input {...inputProps("email", "E-mail", { placeholder:"seuemail@exemplo.com", icon:"✉️", required:true, type:"email" })} />

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
                    placeholder="Mínimo 6 caracteres"
                    required
                    style={{
                      width:"100%", padding:"14px 48px 14px 44px", fontSize:16,
                      fontFamily:"var(--font-body)", fontWeight:500, color:"var(--clr-text)",
                      background:"var(--clr-surface)",
                      border:`2px solid ${errors.senha ? "var(--clr-danger)" : "var(--clr-border)"}`,
                      borderRadius:12, outline:"none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18 }}
                  >{showPassword ? "🙈" : "👁️"}</button>
                </div>
                {errors.senha && <p style={{ fontSize:13, color:"var(--clr-danger)", fontWeight:600 }}>{errors.senha}</p>}
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <Btn variant="ghost" fullWidth onClick={() => setStep(1)} type="button">
                  ← Voltar
                </Btn>
                <Btn type="submit" fullWidth size="lg" loading={loading}>
                  Criar conta
                </Btn>
              </div>
            </form>
          )}
        </Card>

        <p style={{ textAlign:"center", marginTop:20, fontSize:13, color:"var(--clr-subtle)" }}>
          Ao criar uma conta você concorda com os termos de uso do WorkMatch.
        </p>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}
