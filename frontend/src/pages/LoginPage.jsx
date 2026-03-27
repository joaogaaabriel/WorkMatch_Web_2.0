  import React, { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "../context/AuthContext";

  import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    Card,
    CardContent,
  } from "@mui/material";

  import axios from "axios";
import logo from "../assets/Logo.png";

  function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API = import.meta.env.VITE_API_URL1;

    const [notificacao, setNotificacao] = useState({
      aberta: false,
      mensagem: "",
      tipo: "success",
    });

    const handleLogin = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.post("${API}/api/login", {
          email: email.includes("@") ? email : null,
          login: !email.includes("@") ? email : null,
          senha: password,
        });

        localStorage.setItem("token", response.data.token);

        login({
          token: response.data.token,
          nome: response.data.nome,
          role: response.data.role
        });

        mostrarNotificacao(`Bem-vindo, ${response.data.nome}!`, "success");

        navigate("/home");

      } catch (error) {
        console.error("Erro no login:", error);
        mostrarNotificacao("Email ou senha inválidos!", "error");
      }
    };

    const mostrarNotificacao = (mensagem, tipo = "success") => {
      setNotificacao({ aberta: true, mensagem, tipo });
    };

    const textFieldStyle = {
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        height: "55px",
        
        // ESTILO PARA QUANDO O CHROME PREENCHE AUTOMATICAMENTE
        "&:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.9) inset !important",
          WebkitTextFillColor: "#1e293b !important",
        },
        "&:-webkit-autofill:hover": {
          WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.95) inset !important",
        },
        "&:-webkit-autofill:focus": {
          WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.9) inset !important",
        },
        
        "& fieldset": {
          borderColor: "#e2e8f0",
          borderWidth: "2px",
        },
        "&:hover fieldset": {
          borderColor: "#3b82f6",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#3b82f6",
          borderWidth: "2px",
        },
      },
      
      "& .MuiInputLabel-root": {
        color: "#64748b",
        "&.Mui-focused": {
          color: "#3b82f6",
        },
      },
      
      "& .MuiOutlinedInput-input": {
        color: "#1e293b",
        fontWeight: 500,
        padding: "20px 24px 24px 16px",
        fontSize: "16px",
        
        // ESTILO ESPECÍFICO PARA O INPUT COM AUTOFILL
        "&:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.9) inset !important",
          WebkitTextFillColor: "#1e293b !important",
          backgroundColor: "rgba(255, 255, 255, 0.9) !important",
        },
      },
      
      marginBottom: "0px",
    };

    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Elementos Decorativos do Fundo */}
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

        {/* Cabeçalho */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            py: 3,
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
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="WorkMatch Logo"
            onClick={() => navigate("/")}
            sx={{
              height: { xs: "35px", md: "45px" },
              width: "auto",
              ml: { xs: 2, md: 4 },
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>

        {/* Conteúdo Principal do Login */}
        <Box sx={{ zIndex: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              position: "relative",
              zIndex: 1,
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
                maxWidth: { xs: "100%", sm: "90%", md: "450px" },
                animation: "fadeInUp 0.8s ease-out",
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Card
                sx={{
                  p: { xs: 1, sm: 2, md: 3 },
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
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
                <CardContent sx={{ 
                  p: { xs: 1, sm: 1, md: 2 },
                  "&:last-child": {
                    pb: { xs: 1, sm: 1, md: 2 }
                  }
                }}>
                  {/* Cabeçalho do Login */}
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        mb: 1,
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      }}
                    >
                      Login
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: "#64748b", 
                        mb: 4,
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" }
                      }}
                    >
                      Acesse sua conta WorkMatch
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleLogin}>
                    {/* Campo Email */}
                    <TextField
                      label="E-mail"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                      sx={textFieldStyle}
                    />

                    {/* Campo Senha */}
                    <TextField
                      label="Senha"
                      type="password"
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      required
                      sx={{
                        ...textFieldStyle,
                        mt: 2
                      }}
                    />

                    {/* Botão Entrar */}
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        borderRadius: "12px",
                        py: 2,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                        transition: "all 0.3s ease",
                        mt: 3,
                        "&:hover": {
                          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 35px rgba(59, 130, 246, 0.6)",
                        },
                      }}
                    >
                      Entrar
                    </Button>

                    {/* Botão Criar Conta */}
                    <Button
                      onClick={() => navigate("/cadastro")}
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: "#e2e8f0",
                        color: "#64748b",
                        borderRadius: "12px",
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        mt: 2,
                        "&:hover": {
                          borderColor: "#3b82f6",
                          backgroundColor: "rgba(59, 130, 246, 0.04)",
                          color: "#3b82f6",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Criar Conta
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Snackbar para notificações */}
            <Snackbar
              open={notificacao.aberta}
              autoHideDuration={4000}
              onClose={() => setNotificacao(prev => ({ ...prev, aberta: false }))}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setNotificacao(prev => ({ ...prev, aberta: false }))} 
                severity={notificacao.tipo} 
                sx={{ width: '100%' }}
              >
                {notificacao.mensagem}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    );
  }

  export default LoginPage;