import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
  Chip,
  IconButton,
  Modal,
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ptBR from "date-fns/locale/pt-BR";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function ProfissionalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [profissional, setProfissional] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const token = localStorage.getItem("token");

  // Impedir acesso sem login
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Buscar dados do profissional
  useEffect(() => {
    axios
      .get(`${API}/api/profissionais/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfissional(res.data))
      .catch((err) => {
        if (err.response && [401, 403].includes(err.response.status)) {
          navigate("/login");
        }
      });
  }, [id, token, navigate]);

  // Buscar horários disponíveis ao trocar a data
  useEffect(() => {
    if (!dataSelecionada) return;

    const dataStr = `${dataSelecionada.getFullYear()}-${String(
      dataSelecionada.getMonth() + 1
    ).padStart(2, "0")}-${String(dataSelecionada.getDate()).padStart(2, "0")}`;

    const normalizeTime = (time) => {
      if (!time) return "";
      let t = String(time).trim();
      if (/^\d:\d\d$/.test(t)) t = "0" + t;
      if (t.includes(":")) {
        const [hh, mm] = t.split(":");
        return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
      }
      return t;
    };

    axios
      .get(`${API}/api/agendas/profissionais/${id}/agendas`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { data: dataStr },
      })
      .then((res) => {
        const horariosBackend = (res.data.horarios || []).map(normalizeTime);
        const ocupados = (res.data.ocupados || []).map(normalizeTime);

        const livres = horariosBackend.filter((h) => !ocupados.includes(h));

        livres.sort((a, b) => {
          const [ha, ma] = a.split(":").map(Number);
          const [hb, mb] = b.split(":").map(Number);
          return ha - hb || ma - mb;
        });

        setHorarios(livres);
        setHorarioSelecionado("");
      })
      .catch(() => {
        setHorarios([]);
        setHorarioSelecionado("");
      });
  }, [dataSelecionada, id, token]);

  const handleConfirmarAgendamento = () => {
    if (!horarioSelecionado) {
      setOpenModal(true);
      return;
    }

    const dataFormatada = `${dataSelecionada.getFullYear()}-${String(
      dataSelecionada.getMonth() + 1
    ).padStart(2, "0")}-${String(dataSelecionada.getDate()).padStart(2, "0")}`;

    axios
      .post(
        "${API}/api/agendamentos",
        {
          data: dataFormatada,
          horario: horarioSelecionado,
          profissional: { id },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setOpenModal(true);
        setHorarioSelecionado("");
        const novosHorarios = horarios.filter(h => h !== horarioSelecionado);
        setHorarios(novosHorarios);
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Erro ao criar agendamento");
      });
  };

  if (!profissional) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#3b82f6",
          }}
        >
          Carregando informações do profissional...
        </Typography>
      </Box>
    );
  }

  // Fallback para imagem
  const fotoPerfil =
    profissional.fotoPerfil && profissional.fotoPerfil.trim() !== ""
      ? profissional.fotoPerfil
      : "/no-image.png";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        position: "relative",
        overflow: "hidden",
        display: "flex",
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
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.08))",
            borderRadius: "50%",
            top: "-50px",
            right: "-50px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))",
            borderRadius: "50%",
            bottom: "-30px",
            left: "-30px",
          }}
        />
      </Box>

      <MenuLateral />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: { xs: 2, md: 12 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Estilizado - AGORA FIXO */}
        <Box
          sx={{
            py: 3,
            px: 4,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            position: "fixed",
            top: 0,
            left: { xs: 2, md: 1 },
            right: 0,
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {/* BOTÃO DE VOLTAR AQUI */}
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "#3b82f6",
                background: "rgba(59, 130, 246, 0.1)",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.2)",
                },
                ml: 8, // ← ADICIONE ESTA LINHA (ou ml: 3, ml: 4, etc.)
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Perfil do Profissional
            </Typography>
            
            <Chip
              icon={<StarIcon />}
              label="Profissional Verificado"
              sx={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                fontWeight: 600,
                ml: 2,
              }}
            />
          </Box>
        </Box>

        {/* Conteúdo Principal - COM SCROLL E MARGEM PARA O HEADER FIXO */}
        <Box
          sx={{
            flex: 1,
            mt: "96px", // Altura do header fixo (py:3 * 2 + conteúdo)
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              flex: 1,
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 4,
              overflow: "auto",
            }}
          >
            {/* Coluna Esquerda - Informações do Profissional */}
            <Box
              sx={{
                flex: { xs: 1, lg: 0.4 },
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minHeight: "min-content",
              }}
            >
              {/* Card do Perfil */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
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
                <CardContent sx={{ p: 4, display: "flex", flexDirection: "column" }}>
                  {/* Avatar e Nome */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                    <Avatar
                      src={fotoPerfil}
                      alt={profissional.nome}
                      sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid #3b82f6",
                        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                        mb: 3,
                      }}
                    />
                    
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        mb: 1,
                        textAlign: "center",
                      }}
                    >
                      {profissional.nome}
                    </Typography>
                    
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#3b82f6",
                        fontWeight: 600,
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      {profissional.servico || "Profissional"}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

                  {/* Informações de Contato */}
                  <Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(59, 130, 246, 0.05)",
                            border: "1px solid rgba(59, 130, 246, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <PhoneIcon sx={{ color: "#3b82f6" }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                              WhatsApp
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                              {profissional.telefone ? (
                                <a
                                  href={`https://wa.me/55${profissional.telefone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#3b82f6",
                                    textDecoration: "none",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {profissional.telefone}
                                </a>
                              ) : (
                                "Não informado"
                              )}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(16, 185, 129, 0.05)",
                            border: "1px solid rgba(16, 185, 129, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <EmailIcon sx={{ color: "#10b981" }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                              Email
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                              {profissional.email || "Não informado"}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(139, 92, 246, 0.05)",
                            border: "1px solid rgba(139, 92, 246, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <LocationOnIcon sx={{ color: "#8b5cf6" }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                              Localização
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                              {profissional.cidade || "Não informada"}, {profissional.estado || "Não informado"}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(245, 158, 11, 0.05)",
                            border: "1px solid rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <DescriptionIcon sx={{ color: "#f59e0b", mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, mb: 1 }}>
                              Descrição
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#1e293b",
                                lineHeight: 1.6,
                                whiteSpace: "pre-line",
                              }}
                            >
                              {profissional.descricao || "Este profissional ainda não adicionou uma descrição."}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Coluna Direita - Agendamento */}
            <Box
              sx={{
                flex: { xs: 1, lg: 0.6 },
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minHeight: "min-content",
              }}
            >
              {/* Card de Agendamento */}
              <Card
                sx={{
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
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
                <CardContent sx={{ p: 4, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      mb: 1,
                      textAlign: "center",
                    }}
                  >
                    Agendar Serviço
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: "#64748b",
                      mb: 4,
                      fontWeight: 400,
                      textAlign: "center",
                      maxWidth: "600px",
                      mx: "auto",
                      lineHeight: 1.6,
                    }}
                  >
                    Escolha uma data e horário disponível para agendar seu serviço com {profissional.nome.split(" ")[0]}
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
                    {/* Calendário */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                        <CalendarTodayIcon sx={{ color: "#3b82f6" }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          Escolha a Data
                        </Typography>
                      </Box>
                      
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                        <StaticDatePicker
                          displayStaticWrapperAs="desktop"
                          value={dataSelecionada}
                          onChange={(newValue) => setDataSelecionada(newValue)}
                          sx={{
                            backgroundColor: "transparent",
                            borderRadius: 3,
                            "& .MuiPickerStaticWrapper-root": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                            "& .MuiPickersDay-daySelected": {
                              backgroundColor: "#3b82f6",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#2563eb",
                              },
                            },
                            "& .MuiPickersDay-today": {
                              borderColor: "#3b82f6",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>

                    {/* Horários */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                        <AccessTimeIcon sx={{ color: "#10b981" }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          Horários Disponíveis
                        </Typography>
                      </Box>

                      {horarios.length > 0 ? (
                        <>
                          <Box
                            sx={{
                              flex: 1,
                              display: "grid",
                              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                              gap: 2,
                              mb: 3,
                              maxHeight: "300px",
                              overflowY: "auto",
                              pr: 1,
                            }}
                          >
                            {horarios.map((h) => (
                              <Button
                                key={h}
                                variant={horarioSelecionado === h ? "contained" : "outlined"}
                                onClick={() => setHorarioSelecionado(h)}
                                sx={{
                                  borderRadius: "12px",
                                  py: 2,
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  borderColor: "#e2e8f0",
                                  borderWidth: "2px",
                                  color: horarioSelecionado === h ? "white" : "#64748b",
                                  background: horarioSelecionado === h
                                    ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                                    : "transparent",
                                  boxShadow: horarioSelecionado === h
                                    ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                                    : "none",
                                  "&:hover": {
                                    borderColor: "#3b82f6",
                                    color: "#3b82f6",
                                    backgroundColor: "rgba(59, 130, 246, 0.04)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {h}
                              </Button>
                            ))}
                          </Box>

                          <Button
                            variant="contained"
                            size="large"
                            onClick={handleConfirmarAgendamento}
                            disabled={!horarioSelecionado}
                            sx={{
                              background: horarioSelecionado
                                ? "linear-gradient(135deg, #10b981, #059669)"
                                : "linear-gradient(135deg, #94a3b8, #64748b)",
                              borderRadius: "12px",
                              py: 2,
                              fontWeight: 700,
                              fontSize: "1.1rem",
                              textTransform: "none",
                              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                              "&:hover": {
                                background: "linear-gradient(135deg, #059669, #047857)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 25px rgba(16, 185, 129, 0.4)",
                              },
                              "&:disabled": {
                                background: "linear-gradient(135deg, #94a3b8, #64748b)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <CheckCircleIcon sx={{ mr: 1 }} />
                            Confirmar Agendamento
                          </Button>

                          {horarioSelecionado && (
                            <Typography
                              variant="body2"
                              sx={{
                                textAlign: "center",
                                mt: 2,
                                color: "#10b981",
                                fontWeight: 600,
                              }}
                            >
                              ✅ Horário selecionado: {horarioSelecionado}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            textAlign: "center",
                            p: 4,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 2, opacity: 0.5 }} />
                          <Typography variant="h6" sx={{ color: "#64748b", mb: 1, fontWeight: 600 }}>
                            Nenhum horário disponível
                          </Typography>
                          <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                            Selecione outra data para ver os horários disponíveis
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Container>

          {/* Footer */}
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

      {/* Modal de Confirmação */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            mx: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "linear-gradient(90deg, #3b82f6, #10b981)",
            },
          }}
        >
          <Box
            sx={{
              color: '#10b981',
              mb: 2,
              '& .MuiSvgIcon-root': {
                fontSize: '3rem',
              },
            }}
          >
            <CheckCircleIcon />
          </Box>
          <Typography id="modal-title" variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1e293b' }}>
            Agendamento Confirmado!
          </Typography>
          <Typography id="modal-description" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6 }}>
            Seu agendamento com <strong>{profissional?.nome}</strong> foi realizado com sucesso para o dia {dataSelecionada.toLocaleDateString('pt-BR')} às {horarioSelecionado}.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '12px',
              px: 4,
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              width: '100%',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Entendi
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/meus-agendamentos")}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '12px',
              px: 4,
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              width: '100%',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Ver Agendamento
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default ProfissionalDetalhes;