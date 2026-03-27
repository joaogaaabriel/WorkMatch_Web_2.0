import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedIcon from "@mui/icons-material/Verified";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function Home() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProfissionais() {
      try {
        const token = localStorage.getItem("token");

        const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/profissionais`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfissionais(resp.data);
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProfissionais();
  }, []);

  const profissionaisFiltrados = profissionais.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.especialidade?.toLowerCase().includes(busca.toLowerCase())
  );

  // Função para gerar avaliação fictícia (entre 4 e 5)
  const gerarAvaliacao = (id) => {
    // Se id for null/undefined, usa 0 como fallback
    const safeId = id || 0;
    // Gera número entre 4.0 e 5.0 baseado no id
    const random = (Math.sin(safeId * 100) * 0.5 + 0.5); // Gera número entre 0 e 1
    const avaliacao = 4.0 + random; // Resultado entre 4.0 e 5.0
    return avaliacao.toFixed(1);
  };

  // Função para gerar estrelas
  const renderEstrelas = (nota) => {
    // Converte string para número se necessário
    const notaNum = parseFloat(nota) || 4.5;
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        i <= Math.floor(notaNum) ? (
          <StarIcon key={i} sx={{ fontSize: 16, color: "#fbbf24" }} />
        ) : (
          <StarBorderIcon key={i} sx={{ fontSize: 16, color: "#d1d5db" }} />
        )
      );
    }
    return estrelas;
  };

  // Função para gerar cor de fundo baseada no ID
  const gerarCorDeFundo = (id) => {
    const safeId = id || 0;
    const cores = [
      "linear-gradient(135deg, #3b82f6, #2563eb)",
      "linear-gradient(135deg, #10b981, #059669)",
      "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      "linear-gradient(135deg, #f59e0b, #d97706)",
      "linear-gradient(135deg, #ef4444, #dc2626)",
      "linear-gradient(135deg, #06b6d4, #0891b2)",
    ];
    return cores[safeId % cores.length];
  };

  // Função para obter iniciais do nome
  const obterIniciais = (nome) => {
    if (!nome || typeof nome !== 'string') return "P";
    const partes = nome.trim().split(" ");
    if (partes.length === 0) return "P";
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
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
            width: "300px",
            height: "300px",
            background: "linear-gradient(135deg, #3b82f6, #10b981)",
            borderRadius: "50%",
            opacity: 0.08,
            top: "-100px",
            right: "-100px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            borderRadius: "50%",
            opacity: 0.08,
            bottom: "-50px",
            left: "-50px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            borderRadius: "50%",
            opacity: 0.08,
            top: "50%",
            left: "10%",
          }}
        />
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        {/* MENU LATERAL */}
        <MenuLateral />

        {/* HEADER PERSONALIZADO - AUMENTADO */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            py: 3,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 5px 3px rgba(0, 0, 0, 0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            minHeight: 80,
          }}
        >
          <PeopleIcon sx={{ 
            fontSize: "3.5rem",
            color: "#3b82f6",
          }} />
        </Box>

        {/* CONTEÚDO PRINCIPAL */}
        <Container
          maxWidth="lg"
          sx={{
            py: 4,
            position: "relative",
            width: "100%",
            maxWidth: "100% !important",
            mx: 0,
            px: { xs: 2, sm: 3, md: 4 },
            mt: 13,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "90%", md: "1200px" },
              mx: "auto",
              animation: "fadeInUp 0.8s ease-out",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(30px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {/* HERO SECTION */}
            <Card
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: "24px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.12)",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                mb: 6,
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
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <RocketLaunchIcon sx={{ 
                    fontSize: "4rem", 
                    color: "#3b82f6",
                    mb: 2 
                  }} />
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      mb: 2,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    Encontre Profissionais
                    <Box sx={{ color: "#10b981", display: "inline", ml: 1 }}>perto de você</Box>
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
                    Conecte-se com os melhores especialistas locais para todos os tipos de serviços do dia a dia.
                  </Typography>
                </Box>

                {/* BARRA DE BUSCA AVANÇADA */}
                <Box id="filtro-busca" sx={{ maxWidth: "800px", mx: "auto", mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por nome, serviço ou especialidade..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#3b82f6" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <FilterListIcon sx={{ color: "#64748b" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                        fontSize: "1.1rem",
                        py: 1,
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "2px solid #3b82f6",
                        },
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.9rem",
                      mt: 1,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    {profissionaisFiltrados.length} profissionais encontrados
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* CARDS DOS PROFISSIONAIS */}
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
                  Buscando profissionais próximos...
                </Typography>
              </Box>
            ) : profissionaisFiltrados.length === 0 ? (
              <Card
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
                  textAlign: "center",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                <SearchIcon sx={{ 
                  fontSize: "4rem", 
                  color: "#94a3b8",
                  mb: 2 
                }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    mb: 2,
                  }}
                >
                  Nenhum profissional encontrado
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  Não encontramos profissionais com o termo "{busca}".
                  Tente buscar por outra palavra-chave ou especialidade.
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={4}>
                {profissionaisFiltrados.map((p) => {
                  const avaliacao = gerarAvaliacao(p?.id);
                  const corFundo = gerarCorDeFundo(p?.id);
                  const iniciais = obterIniciais(p?.nome);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={p?.id || Math.random()}>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          background: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.8)",
                          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                          position: "relative",
                          overflow: "hidden",
                          height: "100%",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                            "& .avatar-container": {
                              transform: "scale(1.1)",
                            },
                            "& .view-button": {
                              transform: "translateY(0)",
                              opacity: 1,
                            },
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "linear-gradient(90deg, #3b82f6, #10b981)",
                            zIndex: 1,
                          },
                        }}
                        onClick={() => navigate(`/perfil-profissional/${p?.id}`)}
                      >
                        {/* BADGE VERIFICADO */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            borderRadius: "20px",
                            px: 1.5,
                            py: 0.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            zIndex: 2,
                          }}
                        >
                          <VerifiedIcon sx={{ fontSize: 16, color: "white" }} />
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Verificado
                          </Typography>
                        </Box>

                        {/* AVATAR DO PROFISSIONAL (SEM FOTO) */}
                        <Box sx={{ position: "relative", overflow: "hidden", height: 180 }}>
                          <Box
                            className="avatar-container"
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: corFundo,
                              transition: "transform 0.5s ease",
                            }}
                          >
                            <Box
                              sx={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(10px)",
                                border: "4px solid rgba(255, 255, 255, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "3.5rem",
                                  fontWeight: 700,
                                  color: "white",
                                }}
                              >
                                {iniciais}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* OVERLAY HOVER */}
                          <Box
                            className="view-button"
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                              color: "white",
                              transform: "translateY(20px)",
                              opacity: 0,
                              transition: "all 0.3s ease",
                              p: 2,
                            }}
                          >
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                borderRadius: "12px",
                                fontWeight: 600,
                                textTransform: "none",
                              }}
                              endIcon={<ArrowForwardIcon />}
                            >
                              Ver Perfil
                            </Button>
                          </Box>
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                          {/* NOME E AVALIAÇÃO */}
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 800,
                                color: "#1e293b",
                                fontSize: "1.25rem",
                              }}
                            >
                              {p?.nome || "Profissional"}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              {renderEstrelas(avaliacao)}
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#1e293b",
                                  fontSize: "0.9rem",
                                  ml: 0.5,
                                }}
                              >
                                {avaliacao}
                              </Typography>
                            </Box>
                          </Box>

                          {/* SERVIÇO/ESPECIALIDADE */}
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <WorkIcon sx={{ color: "#3b82f6", mr: 1, fontSize: 20 }} />
                            <Typography
                              sx={{
                                color: "#1e293b",
                                fontWeight: 600,
                                fontSize: "1rem",
                              }}
                            >
                              {p?.especialidade || "Serviço não informado"}
                            </Typography>
                          </Box>

                          {/* LOCALIZAÇÃO */}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationOnIcon sx={{ color: "#64748b", mr: 1, fontSize: 20 }} />
                            <Typography
                              sx={{
                                color: "#64748b",
                                fontSize: "0.9rem",
                              }}
                            >
                              {p?.cidade || "Cidade não informada"} - {p?.estado || "Estado não informado"}
                            </Typography>
                          </Box>

                          {/* BOTÃO DE AÇÃO */}
                          <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                              mt: 3,
                              borderRadius: "12px",
                              borderColor: "#3b82f6",
                              color: "#3b82f6",
                              fontWeight: 600,
                              py: 1,
                              "&:hover": {
                                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))",
                                borderColor: "#2563eb",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.2)",
                              },
                              transition: "all 0.3s ease",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/perfil-profissional/${p?.id}`);
                            }}
                          >
                            Agendar Serviço
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* FOOTER */}
            <Box
              sx={{
                mt: 8,
                py: 4,
                px: 3,
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: "linear-gradient(135deg, #60a5fa, #34d399)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                WorkMatch
              </Typography>
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.95rem",
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Conectando pessoas a serviços do dia a dia com confiança e qualidade.
                Encontre o profissional perfeito para suas necessidades.
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  mt: 3,
                }}
              >
                © {new Date().getFullYear()} 2025 WorkMatch - Conectando você ao profissional certo, no momento certo.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}