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
  Avatar,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import MenuLateral from "../components/MenuLateral";

export default function ConfiguracaoPerfilPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Estado para edição dos dados
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  // Estado para senha
  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // Estados para visualização de senha
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Estado para foto
  const [fotoPreview, setFotoPreview] = useState("");
  const [fotoFile, setFotoFile] = useState(null);

  const token = localStorage.getItem("token");

  // ESTILOS PARA CORRIGIR AUTOFILL DO CHROME
  const autofillStyles = {
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.9) inset !important",
      WebkitTextFillColor: "#1e293b !important",
      backgroundColor: "rgba(255, 255, 255, 0.9) !important",
    },
  };

  // ESTILOS DOS CAMPOS
  const campoStyles = {
    comum: {
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
        fontWeight: 500,
      },
      '& .MuiInputLabel-root': {
        fontSize: '15px',
        fontWeight: 600,
        color: '#1e293b',
        '&.Mui-focused': {
          color: '#3b82f6',
        },
      },
    },
  };

  // Carregar dados do usuário
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    carregarPerfilUsuario();
  }, [token, navigate]);

  const carregarPerfilUsuario = async () => {
    try {
      setLoading(true);
      
     const response = await axios.get(
      "http://localhost:8081/api/usuarios/perfil",
      { headers: { Authorization: `Bearer ${token}` } }
    );


      const dadosUsuario = response.data;
      setFormData({
        nome: dadosUsuario.nome || "",  
        email: dadosUsuario.email || "",
        telefone: dadosUsuario.telefone || "",
      });
      
      if (dadosUsuario.fotoPerfil) {
        setFotoPreview(dadosUsuario.fotoPerfil);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar dados do perfil.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDados = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeSenha = (e) => {
    const { name, value } = e.target;
    setSenhaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatarTelefone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value;
  };

  // Atualizar dados do perfil
  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Formatar telefone
      const telefoneFormatado = formatarTelefone(formData.telefone);
      
      // Enviar dados para API
      await axios.put(
        "http://localhost:8081/api/usuarios/perfil",
        {
          nome: formData.nome,
          email: formData.email,
          telefone: telefoneFormatado,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Atualizar foto se houver
      if (fotoFile) {
        const formDataFoto = new FormData();
        formDataFoto.append("foto", fotoFile);
        
        await axios.post(
          "http://localhost:8081/api/usuarios/upload-foto",
          formDataFoto,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setSnackbar({
        open: true,
        message: "Dados atualizados com sucesso!",
        severity: "success",
      });

      // Recarregar dados
      carregarPerfilUsuario();
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao atualizar dados.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Alterar senha
  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      setSnackbar({
        open: true,
        message: "As senhas não coincidem!",
        severity: "warning",
      });
      return;
    }

    if (senhaData.novaSenha.length < 6) {
      setSnackbar({
        open: true,
        message: "A senha deve ter pelo menos 6 caracteres!",
        severity: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        "http://localhost:8081/api/usuarios/alterar-senha",
        {
          senhaAtual: senhaData.senhaAtual,
          novaSenha: senhaData.novaSenha,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbar({
        open: true,
        message: "Senha alterada com sucesso!",
        severity: "success",
      });

      // Limpar campos de senha
      setSenhaData({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });
      
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao alterar senha.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Formatar telefone enquanto digita
  const handleTelefoneChange = (e) => {
    let { value } = e.target;
    value = formatarTelefone(value);
    if (value.length > 15) return;
    
    setFormData((prev) => ({
      ...prev,
      telefone: value,
    }));
  };

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
              <PersonIcon />
              Configuração de Perfil
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
              maxWidth: { xs: "100%", sm: "90%", md: "1000px" },
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
                maxWidth: "1000px",
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
                <Box sx={{ textAlign: "center", mb: 6 }}>
                  <EditIcon sx={{ 
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
                    Configuração de Perfil
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
                    Gerencie suas informações pessoais e senha
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  {/* COLUNA ESQUERDA - FOTO E INFORMAÇÕES BÁSICAS */}
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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
                        <PersonIcon sx={{ color: "#3b82f6" }} />
                        Foto de Perfil
                      </Typography>

                      {/* ÁREA DA FOTO */}
                      <Box sx={{ mb: 4, textAlign: "center" }}>
                        <Avatar
                          src={fotoPreview || "/no-image.png"}
                          alt="Foto do perfil"
                          sx={{
                            width: 180,
                            height: 180,
                            border: "4px solid #3b82f6",
                            boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                            mb: 3,
                            mx: "auto",
                          }}
                        />
                        
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="foto-perfil"
                          type="file"
                          onChange={handleFotoChange}
                        />
                        <label htmlFor="foto-perfil">
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<PhotoCameraIcon />}
                            sx={{
                              background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                              borderRadius: "12px",
                              px: 3,
                              py: 1.2,
                              fontWeight: 600,
                              boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 25px rgba(139, 92, 246, 0.4)",
                                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            Alterar Foto
                          </Button>
                        </label>
                        
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#94a3b8",
                            mt: 2,
                            fontSize: "0.85rem",
                          }}
                        >
                          Formatos: JPG, PNG (max. 5MB)
                        </Typography>
                      </Box>

                      <Divider sx={{ width: "100%", my: 3 }} />

                      {/* INFORMAÇÕES DO USUÁRIO */}
                      <Box sx={{ width: "100%" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#1e293b",
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PersonIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
                          Informações da Conta
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                            }}
                          >
                            Membro desde
                          </Typography>
                          <Typography
                            sx={{
                              color: "#1e293b",
                              fontWeight: 600,
                            }}
                          >
                            {new Date().toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                            }}
                          >
                            Tipo de Conta
                          </Typography>
                          <Typography
                            sx={{
                              color: "#1e293b",
                              fontWeight: 600,
                            }}
                          >
                            Cliente
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* COLUNA DIREITA - FORMULÁRIOS */}
                  <Grid size={{ xs: 12, md: 7 }}>
                    {/* FORMULÁRIO DE DADOS PESSOAIS */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
                        mb: 4,
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
                        <EditIcon sx={{ color: "#3b82f6" }} />
                        Dados Pessoais
                      </Typography>

                      <form onSubmit={handleSalvarDados}>
                        <Grid container spacing={3}>
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="NOME COMPLETO"
                              name="nome"
                              value={formData.nome}
                              onChange={handleChangeDados}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.comum}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ color: "#64748b" }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="EMAIL"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChangeDados}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.comum}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "#64748b" }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="TELEFONE"
                              name="telefone"
                              value={formData.telefone}
                              onChange={handleTelefoneChange}
                              required
                              variant="outlined"
                              disabled={loading}
                              inputProps={{ maxLength: 15 }}
                              sx={campoStyles.comum}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: "#64748b" }} />
                                  </InputAdornment>
                                ),
                              }}
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
                              startIcon={<SaveIcon />}
                            >
                              {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>

                    {/* FORMULÁRIO DE ALTERAÇÃO DE SENHA */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
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
                        <LockIcon sx={{ color: "#10b981" }} />
                        Alterar Senha
                      </Typography>

                      <form onSubmit={handleAlterarSenha}>
                        <Grid container spacing={3}>
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="SENHA ATUAL"
                              name="senhaAtual"
                              type={showSenhaAtual ? "text" : "password"}
                              value={senhaData.senhaAtual}
                              onChange={handleChangeSenha}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.comum}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#64748b" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                                      edge="end"
                                      sx={{ color: "#64748b" }}
                                    >
                                      {showSenhaAtual ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="NOVA SENHA"
                              name="novaSenha"
                              type={showNovaSenha ? "text" : "password"}
                              value={senhaData.novaSenha}
                              onChange={handleChangeSenha}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.comum}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#64748b" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowNovaSenha(!showNovaSenha)}
                                      edge="end"
                                      sx={{ color: "#64748b" }}
                                    >
                                      {showNovaSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="CONFIRMAR SENHA"
                              name="confirmarSenha"
                              type={showConfirmarSenha ? "text" : "password"}
                              value={senhaData.confirmarSenha}
                              onChange={handleChangeSenha}
                              required
                              variant="outlined"
                              disabled={loading}
                              sx={campoStyles.comum}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#64748b" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                                      edge="end"
                                      sx={{ color: "#64748b" }}
                                    >
                                      {showConfirmarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid size={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              disabled={loading}
                              sx={{
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                borderRadius: "12px",
                                py: 2,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 12px 25px rgba(16, 185, 129, 0.4)",
                                  background: "linear-gradient(135deg, #059669, #047857)",
                                },
                                "&:disabled": {
                                  background: "linear-gradient(135deg, #94a3b8, #64748b)",
                                  transform: "none",
                                  boxShadow: "none",
                                },
                                transition: "all 0.3s ease",
                              }}
                              startIcon={<SaveIcon />}
                            >
                              ALTERAR SENHA
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                  </Grid>
                </Grid>

                {/* INFORMAÇÃO IMPORTANTE */}
                <Box sx={{ mt: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <LockIcon sx={{ color: "#3b82f6", mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography
                        sx={{
                          color: "#3b82f6",
                          fontWeight: 700,
                          mb: 1,
                          fontSize: "1rem",
                        }}
                      >
                        Importante
                      </Typography>
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontSize: "0.95rem",
                          lineHeight: 1.5,
                        }}
                      >
                        Certifique-se de que todas as informações estejam atualizadas. 
                        Mantenha sua senha em local seguro e não a compartilhe com ninguém.
                      </Typography>
                    </Box>
                  </Paper>
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
            fontWeight: 500,
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
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}