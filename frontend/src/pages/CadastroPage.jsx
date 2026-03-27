import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    endereco: "",
    senha: "",
    role: "CLIENTE",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [, setMensagem] = useState({ tipo: "", texto: "" });
  const [notificacao, setNotificacao] = useState({
    aberta: false,
    mensagem: "",
    tipo: "success",
  });

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const formatarCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const formatarTelefone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cpf") {
      value = formatarCPF(value);
      if (value.length > 14) return;
    }

    if (name === "telefone") {
      value = formatarTelefone(value);
      if (value.length > 15) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validarCpfNoBackend = async (cpf) => {
    try {
      const response = await axios.post(`${API}/api/validar/cpf`, { cpf });

      if (typeof response.data.valido === "boolean") {
        return response.data.valido;
      }

      return null;
    } catch (error) {
      console.error("Erro ao validar CPF no backend:", error);
      return null;
    }
  };

  const mostrarNotificacao = (mensagem, tipo = "success") => {
    setNotificacao({ aberta: true, mensagem, tipo });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });

    const cpfLimpo = formData.cpf.replace(/\D/g, "");

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailValido) {
      mostrarNotificacao("E-mail inválido!", "error");
      return;
    }

    const telefoneLimpo = formData.telefone.replace(/\D/g, "");
    if (telefoneLimpo.length !== 11) {
      mostrarNotificacao("O telefone deve conter 11 dígitos!", "error");
      return;
    }

    const hoje = new Date();
    const dataNasc = new Date(formData.dataNascimento);

    if (isNaN(dataNasc.getTime())) {
      mostrarNotificacao("Data de nascimento inválida!", "error");
      return;
    }

    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) idade--;

    if (idade < 18) {
      mostrarNotificacao("É necessário ter pelo menos 18 anos.", "error");
      return;
    }

    if (idade > 100) {
      mostrarNotificacao("Idade inválida! Limite é 100 anos.", "error");
      return;
    }

    const cpfValido = await validarCpfNoBackend(cpfLimpo);

    if (cpfValido === false) {
      mostrarNotificacao("CPF inválido!", "error");
      return;
    }

    if (cpfValido === null) {
      mostrarNotificacao("Erro ao validar CPF. Tente novamente.", "error");
      return;
    }

    try {
      const dadosParaEnvio = { ...formData, cpf: cpfLimpo };

      await axios.post(`${API}/api/usuarios`, dadosParaEnvio);

      mostrarNotificacao("Cadastro realizado com sucesso!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (error.response?.status === 409 || error.response?.status === 400) {
        mostrarNotificacao(error.response.data, "error");
      } else {
        mostrarNotificacao("Erro ao cadastrar usuário.", "error");
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="WorkMatch Logo"
              sx={{ height: 50, mb: 2, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
            <Typography variant="h4" fontWeight={700}>
              Cadastre-se
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleCadastro}>
            <Grid container spacing={2}>
              {[
                { name: "nome", label: "Nome Completo" },
                { name: "cpf", label: "CPF" },
                { name: "email", label: "E-mail", type: "email" },
                { name: "telefone", label: "Telefone" },
                {
                  name: "dataNascimento",
                  label: "Data de Nascimento",
                  type: "date",
                  shrink: true,
                },
                { name: "endereco", label: "Endereço" },
              ].map((campo) => (
                <Grid item xs={12} key={campo.name}>
                  <TextField
                    fullWidth
                    required
                    name={campo.name}
                    label={campo.label}
                    type={campo.type || "text"}
                    value={formData[campo.name]}
                    onChange={handleChange}
                    InputLabelProps={campo.shrink ? { shrink: true } : undefined}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="senha"
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Cadastrar
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/login")}
            >
              Já tem conta? Faça login
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={notificacao.aberta}
        autoHideDuration={4000}
        onClose={() => setNotificacao((p) => ({ ...p, aberta: false }))}
      >
        <Alert severity={notificacao.tipo}>{notificacao.mensagem}</Alert>
      </Snackbar>
    </Box>
  );
}

export default CadastroPage;