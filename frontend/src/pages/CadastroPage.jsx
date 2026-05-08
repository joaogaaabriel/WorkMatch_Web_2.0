import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Btn, Input } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { apiBackend, validacaoService } from "../services/api";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const INITIAL_USUARIO = {
  nome: "", cpf: "", email: "", telefone: "", dataNascimento: "",
  cep: "", endereco: "", numero: "", complemento: "", cidade: "", estado: "",
  login: "", senha: "",
  role: "CLIENTE",
};

const INITIAL_PROFISSIONAL = {
  nome: "", cpf: "", email: "", telefone: "", dataNascimento: "",
  cep: "", endereco: "", numero: "", complemento: "", cidade: "", estado: "",
  especialidade: "", descricao: "", experienciaAnos: "",
  login: "", senha: "",
};

function fmtCpf(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
      d ? `${a}.${b}.${c}-${d}` : c ? `${a}.${b}.${c}` : b ? `${a}.${b}` : a
  );
}

function fmtTel(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

function fmtCep(v) {
  v = v.replace(/\D/g, "").slice(0, 8);
  return v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
}

function validateStep1(form) {
  const errs = {};
  if (!form.nome.trim()) errs.nome = "Nome obrigatório";
  if (!form.cpf || form.cpf.length < 14) errs.cpf = "CPF inválido";
  if (!form.telefone || form.telefone.length < 14) errs.telefone = "Telefone inválido";
  if (!form.dataNascimento) errs.dataNascimento = "Obrigatório";
  return errs;
}

function validateStep2(form, isProfissional) {
  const errs = {};
  if (!form.email || !form.email.includes("@")) errs.email = "E-mail inválido";
  if (!form.cep || form.cep.replace(/\D/g, "").length < 8) errs.cep = "CEP inválido";
  if (!form.endereco?.trim()) errs.endereco = "Endereço obrigatório";
  if (!form.cidade?.trim()) errs.cidade = "Cidade obrigatória";
  if (!form.estado) errs.estado = "Estado obrigatório";
  if (isProfissional && !form.especialidade?.trim()) errs.especialidade = "Especialidade obrigatória";
  return errs;
}

function validateStep3(form) {
  const errs = {};
  if (!form.login?.trim() || form.login.length < 4) errs.login = "Login mínimo de 4 caracteres";
  if (!form.senha || form.senha.length < 6) errs.senha = "Mínimo 6 caracteres";
  return errs;
}

export default function CadastroPage() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(0);

  const isProfissional = perfil === "PROFISSIONAL";

  function escolherPerfil(tipo) {
    setPerfil(tipo);
    setForm(tipo === "PROFISSIONAL" ? { ...INITIAL_PROFISSIONAL } : { ...INITIAL_USUARIO });
    setErrors({});
    setStep(1);
  }

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === "cpf") value = fmtCpf(value);
    if (name === "telefone") value = fmtTel(value);
    if (name === "cep") {
      value = fmtCep(value);
      if (value.replace(/\D/g, "").length === 8) buscarCep(value);
    }
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  }

  async function buscarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, "");
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        setErrors(p => ({ ...p, cep: "CEP não encontrado" }));
        return;
      }
      setForm(p => ({
        ...p,
        endereco: data.logradouro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
      setErrors(p => ({ ...p, cep: "", endereco: "", cidade: "", estado: "" }));
    } catch {
      setErrors(p => ({ ...p, cep: "Erro ao buscar CEP" }));
    } finally {
      setLoadingCep(false);
    }
  }

  function field(name, label, extra = {}) {
    return { label, name, value: form[name] ?? "", onChange: handleChange, error: errors[name], ...extra };
  }

  async function handleStep1Next() {
    const errs = validateStep1(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const cpfLimpo = form.cpf.replace(/\D/g, "");
      const { valido } = await validacaoService.validarCpf(cpfLimpo);
      if (!valido) { setErrors({ cpf: "CPF inválido." }); return; }
      const { existe } = await validacaoService.cpfExiste(cpfLimpo);
      if (existe) { setErrors({ cpf: "CPF já cadastrado." }); return; }
      setStep(2);
    } catch {
      showToast("Erro ao validar CPF.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleStep2Next() {
    const errs = validateStep2(form, isProfissional);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(3);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateStep3(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const cpfLimpo = form.cpf.replace(/\D/g, "");
      const telLimpo = form.telefone.replace(/\D/g, "");
      const enderecoCompleto = [form.endereco, form.numero, form.complemento]
          .filter(Boolean).join(", ");

      const payload = {
        nome: form.nome,
        cpf: cpfLimpo,
        dataNascimento: form.dataNascimento,
        telefone: telLimpo,
        endereco: enderecoCompleto,
        cidade: form.cidade,
        estado: form.estado,
        email: form.email,
        login: form.login,
        senha: form.senha,
        role: isProfissional ? "PROFISSIONAL" : "CLIENTE",
        ...(isProfissional && {
          especialidade: form.especialidade,
          descricao: form.descricao,
          experienciaAnos: form.experienciaAnos ? Number(form.experienciaAnos) : null,
        }),
      };

      const endpoint = isProfissional ? "/api/profissionais" : "/api/usuarios";
      await apiBackend.post(endpoint, payload);
      showToast("Conta criada com sucesso! 🎉", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const backendMsg =
          error.response?.data?.message ||
          error.response?.data?.erro ||
          JSON.stringify(error.response?.data);
      showToast(backendMsg || "Erro ao criar conta.", "error");
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Dados pessoais", "Endereço e perfil", "Acesso"];

  if (step === 0) {
    return (
        <div className="wm-auth" style={styles.page}>
          <Header navigate={navigate} showBack={false} />
          <div style={styles.container}>
            <h1 style={styles.title}>Bem-vindo ao WorkMatch</h1>
            <p style={styles.subtitle}>Como você quer usar a plataforma?</p>
            <div style={styles.perfilGrid}>
              <button style={styles.perfilCard} onClick={() => escolherPerfil("CLIENTE")}>
                <span style={styles.perfilIcon}>🧑‍💼</span>
                <strong style={styles.perfilLabel}>Cliente</strong>
                <span style={styles.perfilDesc}>Quero contratar profissionais</span>
              </button>
              <button style={styles.perfilCard} onClick={() => escolherPerfil("PROFISSIONAL")}>
                <span style={styles.perfilIcon}>🔧</span>
                <strong style={styles.perfilLabel}>Profissional</strong>
                <span style={styles.perfilDesc}>Quero oferecer meus serviços</span>
              </button>
            </div>
            <p style={styles.termos}>
              Já tem conta?{" "}
              <button onClick={() => navigate("/login")} style={styles.link}>Entrar →</button>
            </p>
          </div>
          <Toast {...toast} onClose={hideToast} />
        </div>
    );
  }

  return (
      <div className="wm-auth" style={styles.page}>
        <Header
            navigate={navigate}
            showBack
            onBack={() => step === 1 ? setStep(0) : setStep(s => s - 1)}
        />

        <div style={styles.container}>
          <div style={styles.stepsRow}>
            {stepLabels.map((label, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      ...styles.stepDot,
                      background: step >= i + 1 ? "var(--clr-navy)" : "var(--clr-border)",
                      color: step >= i + 1 ? "#fff" : "var(--clr-text-light)",
                    }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 11, color: step === i + 1 ? "var(--clr-navy)" : "var(--clr-text-light)" }}>
                  {label}
                </span>
                  </div>
                  {i < 2 && (
                      <div style={{ ...styles.stepLine, background: step > i + 1 ? "var(--clr-navy)" : "var(--clr-border)" }} />
                  )}
                </React.Fragment>
            ))}
          </div>

          <div style={{ marginBottom: "var(--sp-2)" }}>
          <span style={styles.perfilBadge}>
            {isProfissional ? "🔧 Profissional" : "🧑‍💼 Cliente"}
          </span>
          </div>

          <h1 style={styles.title}>{stepLabels[step - 1]}</h1>
          <p style={styles.subtitle}>Passo {step} de 3</p>

          <div className="wm-auth__card">
            {step === 1 && (
                <div style={styles.formCol}>
                  <div className="wm-form-grid-2">
                    <Input {...field("nome", "Nome completo", { placeholder: "João Silva", icon: "👤", required: true })} />
                    <Input {...field("cpf", "CPF", { placeholder: "000.000.000-00", icon: "🪪", required: true, maxLength: 14 })} />
                    <Input {...field("telefone", "Telefone", { placeholder: "(62) 99999-9999", icon: "📱", required: true })} />
                    <Input {...field("dataNascimento", "Data de nascimento", { icon: "🎂", required: true, type: "date" })} />
                  </div>
                  <div className="wm-form-actions">
                    <Btn loading={loading} onClick={handleStep1Next}>Continuar →</Btn>
                  </div>
                </div>
            )}

            {step === 2 && (
                <div style={styles.formCol}>
                  <Input {...field("email", "E-mail", { placeholder: "seuemail@exemplo.com", icon: "✉️", required: true, type: "email" })} />

                  <div style={{ position: "relative" }}>
                    <Input {...field("cep", "CEP", { placeholder: "00000-000", icon: "📮", required: true, maxLength: 9 })} />
                    {loadingCep && (
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-4px)", fontSize: 13, color: "var(--clr-text-light)" }}>
                    Buscando...
                  </span>
                    )}
                  </div>

                  <Input {...field("endereco", "Rua / Logradouro", { placeholder: "Preenchido automaticamente pelo CEP", icon: "🏠", required: true })} />

                  <div className="wm-form-grid-2">
                    <Input {...field("numero", "Número", { placeholder: "Ex: 123", icon: "🔢" })} />
                    <Input {...field("complemento", "Complemento", { placeholder: "Apto, Bloco...", icon: "🏢" })} />
                  </div>

                  <div className="wm-form-grid-2">
                    <Input {...field("cidade", "Cidade", { placeholder: "Preenchida pelo CEP", icon: "🏙️", required: true })} />

                    <div className="wm-form-group">
                      <label className="wm-label">
                        Estado <span className="wm-label__required">*</span>
                      </label>
                      <div className="wm-input-wrapper">
                        <span className="wm-input-icon">🗺️</span>
                        <select
                            name="estado"
                            value={form.estado ?? ""}
                            onChange={handleChange}
                            className={`wm-input wm-input--with-icon${errors.estado ? " wm-input--error" : ""}`}
                        >
                          <option value="">Selecione</option>
                          {ESTADOS.map(uf => (
                              <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                      {errors.estado && <span className="wm-field-error">{errors.estado}</span>}
                    </div>
                  </div>

                  {isProfissional && (
                      <>
                        <Input {...field("especialidade", "Especialidade", { placeholder: "Ex: Eletricista, Designer...", icon: "💼", required: true })} />
                        <div className="wm-form-grid-2">
                          <Input {...field("experienciaAnos", "Anos de experiência", { placeholder: "Ex: 5", icon: "📅", type: "number", min: 0 })} />
                        </div>
                        <div className="wm-form-group">
                          <label className="wm-label">Descrição profissional</label>
                          <textarea
                              name="descricao"
                              value={form.descricao ?? ""}
                              onChange={handleChange}
                              placeholder="Fale sobre você e seus serviços..."
                              rows={3}
                              className="wm-input"
                              style={{ resize: "vertical", paddingTop: 10 }}
                          />
                        </div>
                      </>
                  )}

                  <div className="wm-form-actions">
                    <Btn variant="secondary" onClick={() => setStep(1)} type="button">← Voltar</Btn>
                    <Btn onClick={handleStep2Next}>Continuar →</Btn>
                  </div>
                </div>
            )}

            {step === 3 && (
                <form onSubmit={handleSubmit} style={styles.formCol}>
                  <Input {...field("login", "Login", { placeholder: "Mínimo 4 caracteres", icon: "🧑", required: true })} />

                  <div className="wm-form-group">
                    <label className="wm-label">Senha <span className="wm-label__required">*</span></label>
                    <div className="wm-input-wrapper">
                      <span className="wm-input-icon">🔒</span>
                      <input
                          name="senha"
                          type={showPass ? "text" : "password"}
                          value={form.senha}
                          onChange={handleChange}
                          placeholder="Mínimo 6 caracteres"
                          required
                          className={`wm-input wm-input--with-icon${errors.senha ? " wm-input--error" : ""}`}
                          style={{ paddingRight: "var(--sp-10)" }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                    {errors.senha && <span className="wm-field-error">{errors.senha}</span>}
                  </div>

                  <div className="wm-form-actions">
                    <Btn variant="secondary" onClick={() => setStep(2)} type="button">← Voltar</Btn>
                    <Btn type="submit" loading={loading}>Criar conta</Btn>
                  </div>
                </form>
            )}
          </div>

          <p style={styles.termos}>
            Ao criar uma conta você concorda com os termos de uso do WorkMatch.
          </p>
        </div>

        <Toast {...toast} onClose={hideToast} />
      </div>
  );
}

function Header({ navigate, showBack, onBack }) {
  return (
      <div style={{ width: "100%", maxWidth: 560, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-8)" }}>
      <span
          className="wm-auth__logo"
          style={{ margin: 0, fontSize: "1.3rem", cursor: "pointer" }}
          onClick={() => navigate("/")}
      >
        Work<span>Match</span>
      </span>
        {showBack ? (
            <button onClick={onBack} style={styles.backBtn}>← Voltar</button>
        ) : (
            <button onClick={() => navigate("/login")} style={styles.backBtn}>Já tenho conta →</button>
        )}
      </div>
  );
}

const styles = {
  page: {
    flexDirection: "column",
    alignItems: "center",
    padding: "var(--sp-8) var(--sp-4)",
  },
  container: {
    width: "100%",
    maxWidth: 560,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "1.8rem",
    color: "var(--clr-navy)",
    marginBottom: "var(--sp-1)",
    fontWeight: 400,
  },
  subtitle: {
    color: "var(--clr-text-light)",
    fontSize: 14,
    marginBottom: "var(--sp-6)",
  },
  formCol: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--sp-4)",
  },
  stepsRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "var(--sp-6)",
    gap: 0,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    transition: "background .2s",
  },
  stepLine: {
    flex: 1,
    height: 2,
    margin: "0 6px",
    marginBottom: 20,
    transition: "background .2s",
  },
  perfilGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--sp-4)",
    marginBottom: "var(--sp-6)",
  },
  perfilCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "var(--sp-6) var(--sp-4)",
    border: "2px solid var(--clr-border)",
    borderRadius: "var(--radius-lg)",
    background: "var(--clr-surface)",
    cursor: "pointer",
    transition: "border-color .2s, box-shadow .2s",
    fontFamily: "var(--font-body)",
  },
  perfilIcon: { fontSize: 36 },
  perfilLabel: {
    fontSize: 16,
    color: "var(--clr-navy)",
    fontWeight: 600,
  },
  perfilDesc: {
    fontSize: 12,
    color: "var(--clr-text-light)",
    textAlign: "center",
  },
  perfilBadge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 99,
    background: "var(--clr-navy)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 500,
    marginBottom: "var(--sp-2)",
  },
  termos: {
    textAlign: "center",
    marginTop: "var(--sp-4)",
    fontSize: 12,
    color: "var(--clr-text-light)",
  },
  link: {
    background: "none",
    border: "none",
    color: "var(--clr-navy)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: 12,
    textDecoration: "underline",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "var(--clr-text-mid)",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
  },
};