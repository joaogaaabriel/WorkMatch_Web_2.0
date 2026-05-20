import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Btn, Input } from "../components/ui";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

import api, { validacaoService } from "../services/api";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const INITIAL_USUARIO = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  dataNascimento: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
  login: "",
  senha: "",
  role: "CLIENTE",
};

const INITIAL_PROFISSIONAL = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  dataNascimento: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
  especialidade: "",
  descricao: "",
  experienciaAnos: "",
  login: "",
  senha: "",
};

function fmtCpf(v) {
  v = v.replace(/\D/g, "").slice(0, 11);

  return v.replace(
      /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
      (_, a, b, c, d) =>
          d
              ? `${a}.${b}.${c}-${d}`
              : c
                  ? `${a}.${b}.${c}`
                  : b
                      ? `${a}.${b}`
                      : a
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

  return v.length > 5
      ? `${v.slice(0, 5)}-${v.slice(5)}`
      : v;
}

function validateStep1(form) {
  const errs = {};

  if (!form.nome.trim())
    errs.nome = "Nome obrigatório";

  if (!form.cpf || form.cpf.length < 14)
    errs.cpf = "CPF inválido";

  if (!form.telefone || form.telefone.length < 14)
    errs.telefone = "Telefone inválido";

  if (!form.dataNascimento)
    errs.dataNascimento = "Obrigatório";

  return errs;
}

function validateStep2(form, isProfissional) {
  const errs = {};

  if (!form.email || !form.email.includes("@"))
    errs.email = "E-mail inválido";

  if (!form.cep || form.cep.replace(/\D/g, "").length < 8)
    errs.cep = "CEP inválido";

  if (!form.endereco?.trim())
    errs.endereco = "Endereço obrigatório";

  if (!form.cidade?.trim())
    errs.cidade = "Cidade obrigatória";

  if (!form.estado)
    errs.estado = "Estado obrigatório";

  if (
      isProfissional &&
      !form.especialidade?.trim()
  ) {
    errs.especialidade =
        "Especialidade obrigatória";
  }

  return errs;
}

function validateStep3(form) {
  const errs = {};

  if (
      !form.login?.trim() ||
      form.login.length < 4
  ) {
    errs.login =
        "Login mínimo de 4 caracteres";
  }

  if (!form.senha || form.senha.length < 6)
    errs.senha = "Mínimo 6 caracteres";

  return errs;
}

export default function CadastroPage() {

  const navigate = useNavigate();

  const { toast, showToast, hideToast } =
      useToast();

  const [perfil, setPerfil] =
      useState(null);

  const [form, setForm] =
      useState({});

  const [errors, setErrors] =
      useState({});

  const [loading, setLoading] =
      useState(false);

  const [loadingCep, setLoadingCep] =
      useState(false);

  const [showPass, setShowPass] =
      useState(false);

  const [step, setStep] =
      useState(0);

  const isProfissional =
      perfil === "PROFISSIONAL";

  function escolherPerfil(tipo) {

    setPerfil(tipo);

    setForm(
        tipo === "PROFISSIONAL"
            ? { ...INITIAL_PROFISSIONAL }
            : { ...INITIAL_USUARIO }
    );

    setErrors({});
    setStep(1);
  }

  function handleChange(e) {

    let { name, value } = e.target;

    if (name === "cpf")
      value = fmtCpf(value);

    if (name === "telefone")
      value = fmtTel(value);

    if (name === "cep") {

      value = fmtCep(value);

      if (
          value.replace(/\D/g, "").length === 8
      ) {
        buscarCep(value);
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function buscarCep(cep) {

    const cepLimpo =
        cep.replace(/\D/g, "");

    setLoadingCep(true);

    try {

      const res = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await res.json();

      if (data.erro) {

        setErrors((prev) => ({
          ...prev,
          cep: "CEP não encontrado",
        }));

        return;
      }

      setForm((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

    } catch {

      setErrors((prev) => ({
        ...prev,
        cep: "Erro ao buscar CEP",
      }));

    } finally {

      setLoadingCep(false);
    }
  }

  function field(name, label, extra = {}) {
    return {
      label,
      name,
      value: form[name] || "",
      onChange: handleChange,
      error: errors[name],
      ...extra,
    };
  }

  async function handleStep1Next() {

    const errs = validateStep1(form);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {

      const cpfLimpo =
          form.cpf.replace(/\D/g, "");

      const { valido } =
          await validacaoService.validarCpf(
              cpfLimpo
          );

      if (!valido) {

        setErrors({
          cpf: "CPF inválido.",
        });

        return;
      }

      const { existe } =
          await validacaoService.cpfExiste(
              cpfLimpo
          );

      if (existe) {

        setErrors({
          cpf: "CPF já cadastrado.",
        });

        return;
      }

      setStep(2);

    } catch {

      showToast(
          "Erro ao validar CPF.",
          "error"
      );

    } finally {

      setLoading(false);
    }
  }

  function handleStep2Next() {

    const errs =
        validateStep2(
            form,
            isProfissional
        );

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStep(3);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    const errs =
        validateStep3(form);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {

      const cpfLimpo =
          form.cpf.replace(/\D/g, "");

      const telLimpo =
          form.telefone.replace(/\D/g, "");

      const enderecoCompleto = [
        form.endereco,
        form.numero,
        form.complemento,
      ]
          .filter(Boolean)
          .join(", ");

      const payload = {
        nome: form.nome,
        cpf: cpfLimpo,
        dataNascimento:
        form.dataNascimento,
        telefone: telLimpo,
        endereco: enderecoCompleto,
        cidade: form.cidade,
        estado: form.estado,
        email: form.email,
        login: form.login,
        senha: form.senha,
        role: isProfissional
            ? "PROFISSIONAL"
            : "CLIENTE",

        ...(isProfissional && {
          especialidade:
          form.especialidade,

          descricao:
          form.descricao,

          experienciaAnos:
              form.experienciaAnos
                  ? Number(
                      form.experienciaAnos
                  )
                  : null,
        }),
      };

      const endpoint =
          isProfissional
              ? "/api/profissionais"
              : "/api/usuarios";

      await api.post(
          endpoint,
          payload
      );

      showToast(
          "Conta criada com sucesso! 🎉",
          "success"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      const backendMsg =
          error.response?.data?.message ||
          error.response?.data?.erro ||
          JSON.stringify(
              error.response?.data
          );

      showToast(
          backendMsg ||
          "Erro ao criar conta.",
          "error"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
      <div className="wm-auth">

        {/* LEFT */}
        <div className="wm-auth__panel-left">

          <div
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                color: "#fff",
                maxWidth: 460,
              }}
          >

            <div
                style={{
                  fontSize: 56,
                  marginBottom:
                      "var(--sp-6)",
                }}
            >
              🚀
            </div>

            <h2
                style={{
                  fontFamily:
                      "var(--font-display)",
                  fontSize: 38,
                  marginBottom:
                      "var(--sp-4)",
                  lineHeight: 1.15,
                }}
            >
              Crie sua conta no{" "}

              <em
                  style={{
                    color:
                        "var(--clr-yellow)",
                  }}
              >
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
              Conecte clientes e
              profissionais da sua
              região em uma única
              plataforma.
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="wm-auth__panel-right">

          <span
              className="wm-auth__logo"
              onClick={() => navigate("/")}
          >
            Work<span>Match</span>
          </span>

          <div className="wm-auth__card">

            <h1 className="wm-auth__heading">
              Cadastro
            </h1>

            <p className="wm-auth__sub">
              Crie sua conta gratuita
            </p>

            {!perfil && (

                <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sp-4)",
                      marginTop: "var(--sp-5)",
                    }}
                >

                  <Btn
                      fullWidth
                      size="lg"
                      onClick={() =>
                          escolherPerfil(
                              "CLIENTE"
                          )
                      }
                  >
                    👤 Sou Cliente
                  </Btn>

                  <Btn
                      fullWidth
                      size="lg"
                      variant="secondary"
                      onClick={() =>
                          escolherPerfil(
                              "PROFISSIONAL"
                          )
                      }
                  >
                    🛠️ Sou Profissional
                  </Btn>

                </div>
            )}

            {perfil && (

                <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sp-4)",
                      marginTop: "var(--sp-5)",
                    }}
                >

                  {step === 1 && (
                      <>

                        <Input
                            {...field(
                                "nome",
                                "Nome completo"
                            )}
                            icon="👤"
                        />

                        <Input
                            {...field(
                                "cpf",
                                "CPF"
                            )}
                            icon="🪪"
                        />

                        <Input
                            {...field(
                                "telefone",
                                "Telefone"
                            )}
                            icon="📱"
                        />

                        <Input
                            {...field(
                                "dataNascimento",
                                "Data de nascimento",
                                {
                                  type: "date",
                                }
                            )}
                            icon="📅"
                        />

                        <Btn
                            type="button"
                            fullWidth
                            size="lg"
                            loading={loading}
                            onClick={
                              handleStep1Next
                            }
                        >
                          Próximo
                        </Btn>

                      </>
                  )}

                  {step === 2 && (
                      <>

                        <Input
                            {...field(
                                "email",
                                "E-mail"
                            )}
                            icon="📧"
                        />

                        <Input
                            {...field(
                                "cep",
                                "CEP"
                            )}
                            icon="📍"
                        />

                        <Input
                            {...field(
                                "endereco",
                                "Endereço"
                            )}
                            icon="🏠"
                        />

                        <Input
                            {...field(
                                "numero",
                                "Número"
                            )}
                        />

                        <Input
                            {...field(
                                "complemento",
                                "Complemento"
                            )}
                        />

                        <Input
                            {...field(
                                "cidade",
                                "Cidade"
                            )}
                            icon="🌆"
                        />

                        <div className="wm-form-group">

                          <label className="wm-label">
                            Estado
                          </label>

                          <select
                              name="estado"
                              value={form.estado}
                              onChange={
                                handleChange
                              }
                              className="wm-input"
                          >
                            <option value="">
                              Selecione
                            </option>

                            {ESTADOS.map(
                                (uf) => (
                                    <option
                                        key={uf}
                                        value={uf}
                                    >
                                      {uf}
                                    </option>
                                )
                            )}
                          </select>

                          {errors.estado && (
                              <span className="wm-error">
                                {errors.estado}
                              </span>
                          )}

                        </div>

                        {isProfissional && (
                            <>

                              <Input
                                  {...field(
                                      "especialidade",
                                      "Especialidade"
                                  )}
                                  icon="🛠️"
                              />

                              <Input
                                  {...field(
                                      "descricao",
                                      "Descrição"
                                  )}
                                  icon="📝"
                              />

                              <Input
                                  {...field(
                                      "experienciaAnos",
                                      "Anos de experiência",
                                      {
                                        type: "number",
                                      }
                                  )}
                                  icon="⭐"
                              />

                            </>
                        )}

                        <div
                            style={{
                              display: "flex",
                              gap: 12,
                            }}
                        >

                          <Btn
                              type="button"
                              variant="secondary"
                              fullWidth
                              onClick={() =>
                                  setStep(1)
                              }
                          >
                            Voltar
                          </Btn>

                          <Btn
                              type="button"
                              fullWidth
                              onClick={
                                handleStep2Next
                              }
                          >
                            Próximo
                          </Btn>

                        </div>

                      </>
                  )}

                  {step === 3 && (
                      <>

                        <Input
                            {...field(
                                "login",
                                "Login"
                            )}
                            icon="👤"
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
                                type={
                                  showPass
                                      ? "text"
                                      : "password"
                                }
                                value={form.senha}
                                onChange={
                                  handleChange
                                }
                                placeholder="Digite sua senha"
                                className="wm-input wm-input--with-icon"
                                style={{
                                  paddingRight:
                                      "var(--sp-10)",
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPass(
                                        !showPass
                                    )
                                }
                                style={{
                                  position:
                                      "absolute",
                                  right: 12,
                                  top: "50%",
                                  transform:
                                      "translateY(-50%)",
                                  background:
                                      "none",
                                  border: "none",
                                  cursor:
                                      "pointer",
                                  fontSize: 18,
                                }}
                            >
                              {showPass
                                  ? "🙈"
                                  : "👁️"}
                            </button>

                          </div>

                          {errors.senha && (
                              <span className="wm-error">
                                {errors.senha}
                              </span>
                          )}

                        </div>

                        <div
                            style={{
                              display: "flex",
                              gap: 12,
                            }}
                        >

                          <Btn
                              type="button"
                              variant="secondary"
                              fullWidth
                              onClick={() =>
                                  setStep(2)
                              }
                          >
                            Voltar
                          </Btn>

                          <Btn
                              type="submit"
                              fullWidth
                              size="lg"
                              loading={loading}
                          >
                            Criar Conta
                          </Btn>

                        </div>

                      </>
                  )}

                </form>
            )}

            <p
                style={{
                  textAlign: "center",
                  marginTop:
                      "var(--sp-5)",
                  fontSize: 14,
                  color:
                      "var(--clr-text-light)",
                }}
            >

              Já possui conta?{" "}

              <button
                  onClick={() =>
                      navigate("/login")
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color:
                        "var(--clr-purple)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily:
                        "var(--font-body)",
                  }}
              >
                Entrar →
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