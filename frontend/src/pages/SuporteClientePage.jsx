import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  IconButton,
  TextField,
  Alert,
  Snackbar,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MenuLateral from "../components/MenuLateral";

export default function SuporteClientePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  // ESTILOS PARA CORRIGIR AUTOFILL DO CHROME - BASEADO NA TELA DE CADASTRO
  const autofillStyles = {
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.9) inset !important",
      WebkitTextFillColor: "#1e293b !important",
      backgroundColor: "rgba(255, 255, 255, 0.9) !important",
    },
    "& textarea:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.9) inset !important",
      WebkitTextFillColor: "#1e293b !important",
      backgroundColor: "rgba(255, 255, 255, 0.9) !important",
    },
  };

  // ESTILOS INDIVIDUAIS PARA CADA CAMPO (COMO NA TELA DE CADASTRO)
  const campoStyles = {
    nome: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        height: '55px',
        '& fieldset': { 
          borderColor: '#e2e8f0', 
          borderWidth: '2px' 
        },
        '&:hover fieldset': { 
          borderColor: '#3b82f6' 
        },
        '&.Mui-focused fieldset': { 
          borderColor: '#3b82f6', 
          borderWidth: '2px' 
        },
        ...autofillStyles,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px',
        fontSize: '16px',
        fontWeight: 500, // TEXTO MAIS GROSSO
      },
      '& .MuiInputLabel-root': {
        fontSize: '15px',
        fontWeight: 600, // LABEL MAIS GROSSA
        color: '#1e293b',
        '&.Mui-focused': {
          color: '#3b82f6',
        },
      },
    },
    email: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        height: '55px',
        '& fieldset': { 
          borderColor: '#e2e8f0', 
          borderWidth: '2px' 
        },
        '&:hover fieldset': { 
          borderColor: '#3b82f6' 
        },
        '&.Mui-focused fieldset': { 
          borderColor: '#3b82f6', 
          borderWidth: '2px' 
        },
        ...autofillStyles,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px',
        fontSize: '16px',
        fontWeight: 500, // TEXTO MAIS GROSSO
      },
      '& .MuiInputLabel-root': {
        fontSize: '15px',
        fontWeight: 600, // LABEL MAIS GROSSA
        color: '#1e293b',
        '&.Mui-focused': {
          color: '#3b82f6',
        },
      },
    },
    assunto: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        height: '55px',
        '& fieldset': { 
          borderColor: '#e2e8f0', 
          borderWidth: '2px' 
        },
        '&:hover fieldset': { 
          borderColor: '#3b82f6' 
        },
        '&.Mui-focused fieldset': { 
          borderColor: '#3b82f6', 
          borderWidth: '2px' 
        },
        ...autofillStyles,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px',
        fontSize: '16px',
        fontWeight: 500, // TEXTO MAIS GROSSO
      },
      '& .MuiInputLabel-root': {
        fontSize: '15px',
        fontWeight: 600, // LABEL MAIS GROSSA
        color: '#1e293b',
        '&.Mui-focused': {
          color: '#3b82f6',
        },
      },
    },
    mensagem: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        minHeight: '20px',
        alignItems: 'flex-start',
        '& fieldset': { 
          borderColor: '#e2e8f0', 
          borderWidth: '2px' 
        },
        '&:hover fieldset': { 
          borderColor: '#3b82f6' 
        },
        '&.Mui-focused fieldset': { 
          borderColor: '#3b82f6', 
          borderWidth: '2px' 
        },
        ...autofillStyles,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px',
        fontSize: '16px',
        fontWeight: 500, // TEXTO MAIS GROSSO
        minHeight: '50px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '15px',
        fontWeight: 600, // LABEL MAIS GROSSA
        color: '#1e293b',
        '&.Mui-focused': {
          color: '#3b82f6',
        },
      },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Impedir envio sem login
      if (!token) {
        setSnackbar({
          open: true,
          message: "Você precisa estar logado para enviar uma mensagem.",
          severity: "warning",
        });
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
        return;
      }

      // Validação dos campos
      if (!formData.nome || !formData.email || !formData.assunto || !formData.mensagem) {
        setSnackbar({
          open: true,
          message: "Por favor, preencha todos os campos obrigatórios.",
          severity: "warning",
        });
        setLoading(false);
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSnackbar({
          open: true,
          message: "Por favor, insira um e-mail válido.",
          severity: "warning",
        });
        setLoading(false);
        return;
      }

      // Enviar para a API
      await axios.post(
        "http://localhost:8081/api/suporte",
        {
          nome: formData.nome,
          email: formData.email,
          assunto: formData.assunto,
          mensagem: formData.mensagem,
          dataEnvio: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Sucesso
      setSnackbar({
        open: true,
        message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        severity: "success",
      });

      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        assunto: "",
        mensagem: "",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      
      let errorMessage = "Erro ao enviar mensagem. Tente novamente.";
      
      if (error.response) {
        // Erro da API
        switch (error.response.status) {
          case 401:
          case 403:
            errorMessage = "Sessão expirada. Faça login novamente.";
            setTimeout(() => navigate("/login"), 2000);
            break;
          case 400:
            errorMessage = error.response.data?.error || "Dados inválidos. Verifique os campos.";
            break;
          case 500:
            errorMessage = "Erro no servidor. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = error.response.data?.error || errorMessage;
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Impedir acesso sem login
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        position: "relative",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ELEMENTOS DECORATIVOS DO FUNDO */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #3b82f6, #10b981)",
            borderRadius: "50%",
            opacity: 0.1,
            top: "-50px",
            right: "-50px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            borderRadius: "50%",
            opacity: 0.1,
            bottom: "-30px",
            left: "-30px",
          }}
        />
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        {/* MENU LATERAL */}
        <MenuLateral />

        {/* HEADER PERSONALIZADO */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            py: 2,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 5px 3px rgba(0, 0, 0, 0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ ml: { xs: 2, md: 12 } }}
          >
            <ArrowBackIcon sx={{ fontSize: 32, color: "#3b82f6" }} />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 990,
              background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: "2.5rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SupportAgentIcon />
              Suporte ao Cliente
            </Box>
          </Typography>

          <Box sx={{ width: 48, mr: { xs: 2, md: 4 } }} />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            position: "relative",
            width: "100%",
            maxWidth: "100% !important",
            mx: 0,
            px: { xs: 2, sm: 3, md: 4 },
            mt: 10,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "90%", md: "1200px" },
              animation: "fadeInUp 0.8s ease-out",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(30px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {/* CARD PRINCIPAL */}
            <Card
              sx={{
                p: { xs: 3, sm: 4, md: 6 },
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                maxWidth: "1200px",
                mb: 4,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "6px",
                  background: "linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6)",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <ContactSupportIcon sx={{ 
                    fontSize: "4rem", 
                    color: "#3b82f6",
                    mb: 2 
                  }} />
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      mb: 2,
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    Suporte ao Cliente
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#64748b",
                      mb: 4,
                      fontWeight: 400,
                      fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                      maxWidth: "800px",
                      mx: "auto",
                      lineHeight: 1.6,
                    }}
                  >
                    Estamos aqui para te ajudar
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  {/* FORMULÁRIO DE CONTATO */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <HelpOutlineIcon sx={{ color: "#3b82f6" }} />
                        Entre em Contato
                      </Typography>

                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="NOME COMPLETO"
                              name="nome"
                              value={formData.nome}
                              onChange={handleChange}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.nome}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="EMAIL"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.email}
                            />
                          </Grid>
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="ASSUNTO"
                              name="assunto"
                              value={formData.assunto}
                              onChange={handleChange}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.assunto}
                            />
                          </Grid>
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="MENSAGEM"
                              name="mensagem"
                              value={formData.mensagem}
                              onChange={handleChange}
                              required
                              multiline
                              rows={6}
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.mensagem}
                            />
                          </Grid>
                          <Grid size={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              disabled={loading}
                              sx={{
                                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                borderRadius: "12px",
                                py: 2,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)",
                                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                },
                                "&:disabled": {
                                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                                  transform: "none",
                                  boxShadow: "none",
                                },
                                transition: "all 0.3s ease",
                              }}
                              startIcon={<SendIcon />}
                            >
                              {loading ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                  </Grid>

                  {/* INFORMAÇÕES RÁPIDAS */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
                        height: "100%",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <CheckCircleIcon sx={{ color: "#10b981" }} />
                        Informações Rápidas
                      </Typography>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* TELEFONE */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                          }}
                        >
                          <PhoneIcon sx={{ color: "#3b82f6", fontSize: "2rem", mt: 0.5 }} />
                          <Box>
                            <Typography
                              sx={{
                                color: "#64748b",
                                fontSize: "0.9rem",
                                fontWeight: 600, // MAIS GROSSO
                                mb: 0.5,
                              }}
                            >
                              Telefone de Suporte
                            </Typography>
                            <Typography
                              sx={{
                                color: "#1e293b",
                                fontWeight: 700,
                                fontSize: "1.2rem",
                              }}
                            >
                              11 4002-8922
                            </Typography>
                            <Typography
                              sx={{
                                color: "#94a3b8",
                                fontSize: "0.85rem",
                                mt: 0.5,
                              }}
                            >
                              Atendimento 24h para emergências
                            </Typography>
                          </Box>
                        </Box>

                        {/* E-MAIL */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                          }}
                        >
                          <EmailIcon sx={{ color: "#8b5cf6", fontSize: "2rem", mt: 0.5 }} />
                          <Box>
                            <Typography
                              sx={{
                                color: "#64748b",
                                fontSize: "0.9rem",
                                fontWeight: 600, // MAIS GROSSO
                                mb: 0.5,
                              }}
                            >
                              E-mail de Atendimento
                            </Typography>
                            <Typography
                              sx={{
                                color: "#1e293b",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                              }}
                            >
                              suporte@workmatch.com
                            </Typography>
                            <Typography
                              sx={{
                                color: "#94a3b8",
                                fontSize: "0.85rem",
                                mt: 0.5,
                              }}
                            >
                              Resposta em até 24 horas úteis
                            </Typography>
                          </Box>
                        </Box>

                        {/* HORÁRIO */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                          }}
                        >
                          <ScheduleIcon sx={{ color: "#10b981", fontSize: "2rem", mt: 0.5 }} />
                          <Box>
                            <Typography
                              sx={{
                                color: "#64748b",
                                fontSize: "0.9rem",
                                fontWeight: 600, // MAIS GROSSO
                                mb: 0.5,
                              }}
                            >
                              Horário de Funcionamento
                            </Typography>
                            <Typography
                              sx={{
                                color: "#1e293b",
                                fontWeight: 700,
                                fontSize: "1.2rem",
                              }}
                            >
                              Segunda a Sexta
                            </Typography>
                            <Typography
                              sx={{
                                color: "#1e293b",
                                fontWeight: 600,
                                fontSize: "1rem",
                              }}
                            >
                              08:00 - 18:00
                            </Typography>
                            <Typography
                              sx={{
                                color: "#94a3b8",
                                fontSize: "0.85rem",
                                mt: 0.5,
                              }}
                            >
                              Sábados: 09:00 - 12:00
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* INFORMAÇÃO ADICIONAL */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          background: "rgba(59, 130, 246, 0.1)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "0.95rem",
                          }}
                        >
                          Dica Importante
                        </Typography>
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: "0.9rem",
                            lineHeight: 1.5,
                          }}
                        >
                          Para agilizar seu atendimento, tenha em mãos seu número de cliente ou e-mail cadastrado.
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* SEÇÃO DE PERGUNTAS FREQUENTES */}
                <Box sx={{ mt: 12 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#1e293b",
                      mb: 3,
                      textAlign: "center",
                      fontSize: { xs: "1.5rem", md: "1.8rem" },
                    }}
                  >
                    PERGUNTAS FREQUENTES
                  </Typography>
                  <Grid container spacing={8}>
                    {[
                      {
                        pergunta: "COMO CANCELAR UM AGENDAMENTO?",
                        resposta: "Acesse 'Meus Agendamentos', selecione o serviço e clique em 'Cancelar'.",
                      },
                      {
                        pergunta: "ONDE VEJO O HISTÓRICO DE SERVIÇOS?",
                        resposta: "No menu lateral, clique em 'Histórico de Serviços' para visualizar todos os atendimentos.",
                      },
                      {
                        pergunta: "COMO AVALIAR UM PROFISSIONAL?",
                        resposta: "Após o serviço concluído, você receberá um e-mail para avaliar a experiência.",
                      },
                      {
                        pergunta: "QUAIS FORMAS DE PAGAMENTO ACEITAMOS?",
                        resposta: "Cartões de crédito/débito, PIX e pagamentos presenciais combinados.",
                      },
                    ].map((faq, index) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                            height: "100%",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#1e293b",
                              fontWeight: 700, // MAIS GROSSO
                              mb: 1.5,
                              fontSize: "1.1rem",
                            }}
                          >
                            {faq.pergunta}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.95rem",
                              lineHeight: 1.5,
                              fontWeight: 500, // MAIS GROSSO
                            }}
                          >
                            {faq.resposta}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>

        {/* FOOTER */}
        <Box
          sx={{
            py: 2,
            px: 5,
            background: "#1e293b",
            color: "white",
            textAlign: "center",
            mt: "auto",
            ml: { xs: 2, md: -12 },
          }}
        >
          <Typography sx={{ 
            color: "#94a3b8",
            fontWeight: 500, // MAIS GROSSO
          }}>
            © {new Date().getFullYear()} 2025 WorkMatch - Conectando você ao profissional certo, no momento certo.
          </Typography>
        </Box>
      </Box>

      {/* SNACKBAR PARA FEEDBACK */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontWeight: 600, // MAIS GROSSO
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}