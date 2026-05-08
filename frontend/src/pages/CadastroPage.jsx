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
  return v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
}

function validateStep1(form) {
  const errs = {};

  if (!form.nome.trim()) errs.nome = "Nome obrigatório";
  if (!form.cpf || form.cpf.length < 14) errs.cpf = "CPF inválido";
  if (!form.telefone || form.telefone.length < 14)
    errs.telefone = "Telefone inválido";
  if (!form.dataNascimento) errs.dataNascimento = "Obrigatório";

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

  if (isProfissional && !form.especialidade?.trim())
    errs.especialidade = "Especialidade obrigatória";

  return errs;
}

function validateStep3(form) {
  const errs = {};

  if (!form.login?.trim() || form.login.length < 4)
    errs.login = "Login mínimo de 4 caracteres";

  if (!form.senha || form.senha.length < 6)
    errs.senha = "Mínimo 6 caracteres";

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

    if (name === "cpf") value = fmtCpf(value);
    if (name === "telefone") value = fmtTel(value);

    if (name === "cep") {
      value = fmtCep(value);

      if (value.replace(/\D/g, "").length === 8) {
        buscarCep(value);
      }
    }

    setForm((p) => ({
      ...p,
      [name]: value,
    }));

    setErrors((p) => ({
      ...p,
      [name]: "",
    }));
  }

  async function buscarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, "");

    setLoadingCep(true);

    try {
      const res = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await res.json();

      if (data.erro) {
        setErrors((p) => ({
          ...p,
          cep: "CEP não encontrado",
        }));

        return;
      }

      setForm((p) => ({
        ...p,
        endereco: data.logradouro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch {
      setErrors((p) => ({
        ...p,
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
      value: form[name] ?? "",
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
      const cpfLimpo = form.cpf.replace(/\D/g, "");

      const { valido } =
          await validacaoService.validarCpf(cpfLimpo);

      if (!valido) {
        setErrors({ cpf: "CPF inválido." });
        return;
      }

      const { existe } =
          await validacaoService.cpfExiste(cpfLimpo);

      if (existe) {
        setErrors({ cpf: "CPF já cadastrado." });
        return;
      }

      setStep(2);
    } catch {
      showToast("Erro ao validar CPF.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleStep2Next() {
    const errs = validateStep2(form, isProfissional);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStep(3);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errs = validateStep3(form);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const cpfLimpo = form.cpf.replace(/\D/g, "");
      const telLimpo = form.telefone.replace(/\D/g, "");

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
        dataNascimento: form.dataNascimento,
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
          especialidade: form.especialidade,
          descricao: form.descricao,
          experienciaAnos: form.experienciaAnos
              ? Number(form.experienciaAnos)
              : null,
        }),
      };

      const endpoint = isProfissional
          ? "/api/profissionais"
          : "/api/usuarios";

      await api.post(endpoint, payload);

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
          JSON.stringify(error.response?.data);

      showToast(
          backendMsg || "Erro ao criar conta.",
          "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
      <div>
        {/* Seu JSX continua aqui normalmente */}
      </div>
  );
}