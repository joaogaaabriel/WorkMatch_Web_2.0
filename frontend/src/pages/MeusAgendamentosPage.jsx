import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Container,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function MeusAgendamentosPage() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

   const API = import.meta.env.VITE_API_URL;

  const carregarAgendamentos = async () => {
    try {
      const token = localStorage.getItem("token");

      const resp = await axios.get("${API}/api/agendamentos/meus", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatados = resp.data.map((ag) => ({
        id: ag.id,
        data: ag.data,
        horario: ag.horario,
        profissional: ag.profissional?.nome,
        especialidade: ag.profissional?.especialidade,
        profissionalId: ag.profissional?.id,
      }));

      setAgendamentos(formatados);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

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
      {/* ELEMENTOS DECORATIVOS DO FUNDO - MESMO ESTILO DA HOME */}
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
        {/* ⭐ MENU LATERAL (correto, não mexer) */}
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
              <EventAvailableIcon />
              Meus Agendamentos
            </Box>
          </Typography>

          <Box sx={{ width: 48, mr: { xs: 2, md: 4 } }} /> {/* Espaço para alinhamento */}
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
                  <EventAvailableIcon sx={{ 
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
                    Meus Agendamentos
                  </Typography>
                </Box>
                
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
                    textAlign: "center",
                  }}
                >
                  Gerencie e acompanhe todos os seus agendamentos marcados com profissionais.
                </Typography>

                {loading ? (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <CircularProgress 
                      size={60}
                      sx={{
                        color: "#3b82f6",
                        mb: 2,
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontWeight: 500,
                        fontSize: "1.1rem",
                      }}
                    >
                      Carregando seus agendamentos...
                    </Typography>
                  </Box>
                ) : agendamentos.length === 0 ? (
                  <Card
                    sx={{
                      p: 4,
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      textAlign: "center",
                      maxWidth: "600px",
                      mx: "auto",
                    }}
                  >
                    <MailOutlineIcon sx={{ 
                      fontSize: "4rem", 
                      color: "#94a3b8",
                      mb: 2 
                    }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        mb: 2,
                      }}
                    >
                      Nenhum agendamento encontrado
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748b",
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      Você ainda não possui nenhum agendamento marcado.
                      Encontre profissionais e marque seu primeiro serviço!
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        borderRadius: "12px",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => navigate("/")}
                      startIcon={<RocketLaunchIcon />}
                    >
                      Encontrar Profissionais
                    </Button>
                  </Card>
                ) : (
                  <Box>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <FactCheckIcon sx={{ 
                        fontSize: "3rem", 
                        color: "#10b981",
                        mb: 1 
                      }} />
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          mb: 1,
                          fontSize: { xs: "1.5rem", md: "2rem" },
                        }}
                      >
                        {agendamentos.length} Agendamento{agendamentos.length !== 1 ? 's' : ''} Marcado{agendamentos.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    <Grid container spacing={12}>
                      {agendamentos.map((ag) => (
                        <Grid size={{ xs: 12, md: 6 }} key={ag.id}>
                          <Card
                            sx={{
                              p: { xs: 2, sm: 3 },
                              borderRadius: "16px",
                              background: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.8)",
                              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                              position: "relative",
                              overflow: "hidden",
                              height: "100%",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                              },
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "4px",
                                background: "linear-gradient(90deg, #3b82f6, #10b981)",
                              },
                            }}
                          >
                            <CardContent>
                              {/* CABEÇALHO DO AGENDAMENTO */}
                              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Box sx={{ 
                                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
                                  borderRadius: "50%",
                                  p: 1,
                                  mr: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}>
                                  <PeopleIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                                </Box>
                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  {ag.profissional}
                                </Typography>
                              </Box>

                              {/* DETALHES DO AGENDAMENTO */}
                              <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                  <CalendarTodayIcon sx={{ color: "#3b82f6", mr: 2, fontSize: "1.5rem" }} />
                                  <Box>
                                    <Typography sx={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>
                                      Data
                                    </Typography>
                                    <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>
                                      {ag.data}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                  <ScheduleIcon sx={{ color: "#3b82f6", mr: 2, fontSize: "1.5rem" }} />
                                  <Box>
                                    <Typography sx={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>
                                      Horário
                                    </Typography>
                                    <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>
                                      {ag.horario}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                  <WorkOutlineIcon sx={{ color: "#3b82f6", mr: 2, fontSize: "1.5rem" }} />
                                  <Box>
                                    <Typography sx={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 500 }}>
                                      Especialidade
                                    </Typography>
                                    <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>
                                      {ag.especialidade}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* BOTÃO DE AÇÃO */}
                              <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                  borderRadius: "12px",
                                  py: 1.5,
                                  fontSize: "1rem",
                                  fontWeight: 600,
                                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)",
                                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                  },
                                  transition: "all 0.3s ease",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                onClick={() => navigate(`/profissional/${ag.profissionalId}`)}
                                startIcon={<SearchIcon />}
                                endIcon={<ArrowForwardIcon />}
                              >
                                Ver detalhes do profissional
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* RODAPÉ INFORMATIVO */}
                    <Card
                      sx={{
                        mt: 10,
                        p: 3,
                        borderRadius: "16px",
                        background: "rgba(59, 130, 246, 0.05)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <InfoIcon sx={{ color: "#3b82f6", mr: 1, mt: 1.5 }} />
                      <Box>
                        <Typography
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 900,
                            mb: 0.5,
                          }}
                        >
                          Informação importante
                        </Typography>
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                          }}
                        >
                          Você pode remarcar ou cancelar agendamentos entrando em contato diretamente com o profissional através da página de detalhes.
                        </Typography>
                      </Box>
                    </Card>
                  </Box>
                )}
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
          <Typography sx={{ color: "#94a3b8" }}>
            © {new Date().getFullYear()} 2025 WorkMatch - Conectando você ao profissional certo, no momento certo.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}