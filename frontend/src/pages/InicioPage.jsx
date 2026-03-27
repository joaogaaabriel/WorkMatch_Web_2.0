import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Paper,
  Avatar,
  Modal,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

// Importação dos ícones (alguns trocados para temas mais cotidianos)
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// ICONES DAS PROFISSÕES/SERVIÇOS 
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import GrassIcon from "@mui/icons-material/Grass";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ConstructionIcon from "@mui/icons-material/Construction";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import BuildIcon from "@mui/icons-material/Build";
import ElderlyIcon from "@mui/icons-material/Elderly";

// ICONES DOS BENEFICIOS
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SpeedIcon from "@mui/icons-material/Speed";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import logo from "../assets/Logo.png";
import conexoesImage from '../assets/Ilustração.jpg';

function InicioPage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleComecar = () => { //handleComecar nao esta dando erro real
    navigate("/login");
  };

  const handleCriarConta = () => {
    navigate("/cadastro");
  };

  // Estilos inline
  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      position: "relative",
      overflowX: "hidden",
      overflowY: "auto",
      margin: 0,
      padding: 0,
    }
  };

  // Dados das categorias - Serviços do dia a dia
  const categorias = [
    { nome: "Reparos Domésticos", icone: <HomeRepairServiceIcon />, projetos: "2.1k+" },   // 3.5k - 40%
    { nome: "Jardinagem em Geral", icone: <GrassIcon />, projetos: "1.7k+" },             // 2.8k - 40%
    { nome: "Limpeza & Organização", icone: <CleaningServicesIcon />, projetos: "2.5k+" }, // 4.2k - 40%
    { nome: "Encanador", icone: <PlumbingIcon />, projetos: "1.1k+" },                   // 1.9k - 40%
    { nome: "Eletricista", icone: <ElectricBoltIcon />, projetos: "720+" },              // 1.2k - 40%
    { nome: "Pedreiro", icone: <ConstructionIcon />, projetos: "1.2k+" },                // 2.1k - 40%
    { nome: "Pintor", icone: <FormatPaintIcon />, projetos: "900+" },                    // 1.5k - 40%
    { nome: "Serralheiro", icone: <BuildIcon />, projetos: "480+" },                     // 800 - 40%
    { nome: "Cuidador de Idosos", icone: <ElderlyIcon />, projetos: "660+" },            // 1.1k - 40%
  ];

  // Dados para a seção de estatísticas
  const estatisticas = [
    { numero: "50.000+", descricao: "Serviços Realizados", icone: <AssignmentTurnedInIcon />, cor: "#3b82f6" },
    { numero: "10.000+", descricao: "Profissionais Ativos", icone: <GroupsIcon />, cor: "#10b981" },
    { numero: "95%", descricao: "Satisfação dos Clientes", icone: <EmojiEventsIcon />, cor: "#8b5cf6" },
    { numero: "200+", descricao: "Cidades Atendidas", icone: <WorkspacePremiumIcon />, cor: "#f59e0b" },
  ];

  // Dados para a seção "Por que nos escolher"
  const beneficios = [
    {
      titulo: "Profissionais Confiáveis",
      descricao: "Todos os profissionais passam por verificação de identidade e avaliação da comunidade.",
      icone: <VerifiedUserIcon />
    },
    {
      titulo: "Pagamento Seguro",
      descricao: "Pague somente quando o serviço for concluído conforme combinado.",
      icone: <SecurityIcon />
    },
    {
      titulo: "Apoio Personalizado",
      descricao: "Nossa equipe ajuda você a encontrar o profissional perfeito para sua necessidade.",
      icone: <SupportAgentIcon />
    },
    {
      titulo: "Resposta Rápida",
      descricao: "Receba orçamentos em minutos e resolva suas necessidades no mesmo dia.",
      icone: <SpeedIcon />
    },
    {
      titulo: "Preços Justos",
      descricao: "Negocie diretamente com profissionais e encontre valores que cabem no seu bolso.",
      icone: <AttachMoneyIcon />
    },
    {
      titulo: "Facilidade Total",
      descricao: "Do pedido ao pagamento, tudo em um só lugar. Simples, rápido e seguro.",
      icone: <ThumbUpIcon />
    }
  ];

  // Dados para profissionais em destaque (nomes mais brasileiros e serviços cotidianos)
  const profissionaisDestaque = [
    { nome: "Ana Santos", profissao: "Cuidadora de Idosos", avaliacao: 4.9, projetos: 42, foto: "A" },
    { nome: "Carlos Mendes", profissao: "Pedreiro", avaliacao: 4.8, projetos: 67, foto: "C" },
    { nome: "Mariana Lima", profissao: "Diarista Profissional", avaliacao: 4.9, projetos: 28, foto: "M" },
    { nome: "Roberto Silva", profissao: "Encanador", avaliacao: 4.7, projetos: 35, foto: "R" },
  ];

  return (
    <Box sx={styles.container}>
      {/* HEADER */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          py: 2,
          px: { xs: 2, md: 4 },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Box
        component="img"
        src={logo}
        alt="WorkMatch Logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          height: { xs: "45px", md: "60px" },
          width: "auto",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />

        {/* Botões de Ação */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{
              color: "#64748b",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": {
                color: "#3b82f6",
                backgroundColor: "transparent",
              },
            }}
          >
            Entrar
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              borderRadius: "8px",
              px: 3,
              py: 0.8,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Oferecer Serviço
          </Button>
        </Box>
      </Box>

      {/* HERO SECTION (BANNER PRINCIPAL) */}
      <Box
        sx={{
          pt: { xs: 12, md: 24 },
          pb: { xs: 8, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          overflow: "hidden",
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
              width: "300px",
              height: "300px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.08))",
              borderRadius: "50%",
              top: "-100px",
              right: "-100px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: "200px",
              height: "200px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))",
              borderRadius: "50%",
              bottom: "-50px",
              left: "-50px",
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">

            {/* Texto Principal */}
            <Grid size={{ xs: 12, md: 6 }}>
            <Typography
            variant="h1"
            sx={{
              fontWeight: 990,
              mb: 1,
              fontSize: { xs: "2.5rem", sm: "3rem", md: "2.5rem" },
              lineHeight: 1.15,
              color: "transparent",
            }}
          >

            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              CONECTANDO{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #3b82f6, #10b981)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                VOCÊ
              </Box>{" "}
              AO
            </Box>

            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #3b82f6, #10b981)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                PROFISSIONAL
              </Box>{" "}
              CERTO,
            </Box>

            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              NO MOMENTO{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg, #3b82f6, #10b981)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                CERTO
              </Box>
              <Box
                component="span"
                sx={{ color: "#000" }}
              >
                .
              </Box>
            </Box>
          </Typography>

              <Typography
              variant="h6"
              sx={{
                color: "#64748b",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Do reparo urgente ao serviço planejado, o{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#1e293b" }}>
                WorkMatch
              </Box>{" "}
              encontra o profissional ideal da sua região rápido, seguro e sem complicação.
            </Typography>


              {/* Botões de Ação */}
              <Box sx={{ display: "flex", gap: 2, mb: 6, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={handleCriarConta}
                  size="large"
                  sx={{
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 25px rgba(59, 130, 246, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Buscar Profissionais
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenModal(true)}
                  size="large"
                  sx={{
                    borderColor: "#e2e8f0",
                    borderWidth: "2px",
                    color: "#64748b",
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      color: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.04)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Oferecer Meus Serviços
                </Button>
              </Box>

              {/* Estatísticas */}
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#3b82f6", mb: 0.5 }}>
                    10k+
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                    Profissionais
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#10b981", mb: 0.5 }}>
                    50k+
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                    Clientes Satisfeitos
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#8b5cf6", mb: 0.5 }}>
                    200+
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                    Cidades Atendidas
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Ilustração */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  animation: "float 20s ease-in-out infinite",
                  "@keyframes float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                  },
                }}
              >
                <Box
                  component="img"
                  src={conexoesImage}
                  alt="Conectando pessoas a serviços"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "20px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SEÇÃO: COMO FUNCIONA*/}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}>
            COMO FUNCIONA NA PRÁTICA?
          </Typography>
          <Typography variant="h6" sx={{ color: "#64748b", maxWidth: "600px", mx: "auto" }}>
            Três passos simples para resolver qualquer necessidade do seu dia a dia
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { 
              titulo: "1. Conte sua necessidade", 
              descricao: "Descreva o que você precisa, seja um reparo, aula ou serviço especializado",
              cor: "#3b82f6" 
            },
            { 
              titulo: "2. Receba orçamentos", 
              descricao: "Profissionais da sua região entram em contato com propostas personalizadas",
              cor: "#10b981" 
            },
            { 
              titulo: "3. Escolha e combine", 
              descricao: "Selecione o profissional ideal, combine os detalhes e resolva seu problema",
              cor: "#8b5cf6" 
            },
          ].map((passo, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "16px",
                  border: `2px solid ${passo.cor}20`,
                  background: "white",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${passo.cor}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "60px",
                    height: "60px",
                    background: `${passo.cor}15`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Box sx={{ color: passo.cor, fontSize: "1.5rem" }}>
                    {index + 1}
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                  {passo.titulo}
                </Typography>
                <Typography sx={{ color: "#64748b" }}>
                  {passo.descricao}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SEÇÃO: SERVIÇOS POPULARES */}
      <Box sx={{ background: "#f8fafc", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}>
              SERVIÇOS MAIS PROCURADOS:
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748b", maxWidth: "600px", mx: "auto" }}>
              Encontre ajuda para tudo, dos pequenos reparos às necessidades especiais
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ px: 1 }}>
            {categorias.map((categoria, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.9s ease",
                    height: "80%",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 14px 24px rgba(0, 0, 0, 0.1)",
                      borderColor: "#3b82f6",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{ color: "#3b82f6", mr: 2 }}>
                      {categoria.icone}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", flex: 1 }}>
                      {categoria.nome}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {categoria.projetos} serviços realizados
                    </Typography>
                    <IconButton size="small" sx={{ color: "#64748b" }}>
                      <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 9 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/cadastro")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: "#3b82f6",
                color: "#3b82f6",
                borderRadius: "8px",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#2563eb",
                  background: "rgba(59, 130, 246, 0.04)",
                },
              }}
            >
              Ver todos os serviços
            </Button>
          </Box>
        </Container>
      </Box>

      {/* SEÇÃO: NOSSOS NÚMEROS */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 6 } }}>
        <Box sx={{ textAlign: "center", mb: 7 }}>
          <Typography variant="h2_5" sx={{ fontSize: "4rem", fontWeight: 800, mb: 2, color: "#1e293b" }}>
            NOSSA COMUNIDADE EM NÚMEROS
          </Typography>
          <Typography variant="h6" sx={{ color: "#64748b", maxWidth: "600px", mx: "auto" }}>
            Uma rede de confiança que cresce todos os dias!
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {estatisticas.map((estatistica, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    background: `${estatistica.cor}15`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <Box sx={{ color: estatistica.cor, fontSize: "2rem" }}>
                    {estatistica.icone}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: estatistica.cor }}>
                  {estatistica.numero}
                </Typography>
                <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
                  {estatistica.descricao}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SEÇÃO: POR QUE ESCOLHER A GENTE */}
      <Box sx={{ background: "#f8fafc", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}>
              POR QUE RESOLVER SUAS NECESSIDADES COM A GENTE?
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748b", maxWidth: "600px", mx: "auto" }}>
              Tudo pensado para ser fácil, seguro e acessível para todo mundo!
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {beneficios.map((beneficio, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    height: "80%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 14px 40px rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "#3b82f6",
                      mb: 3,
                      "& .MuiSvgIcon-root": {
                        fontSize: "2.5rem",
                      },
                    }}
                  >
                    {beneficio.icone}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                    {beneficio.titulo}
                  </Typography>
                  <Typography sx={{ color: "#64748b", lineHeight: 1.6 }}>
                    {beneficio.descricao}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SEÇÃO: PROFISSIONAIS EM DESTAQUE */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}>
            PROFISSIONAIS BEM AVALIADOS
          </Typography>
          <Typography variant="h6" sx={{ color: "#64748b", maxWidth: "600px", mx: "auto" }}>
            Conheça alguns dos profissionais mais queridos pela nossa comunidade
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {profissionaisDestaque.map((profissional, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: "80px",
                    height: "80px",
                    mx: "auto",
                    mb: 2,
                    background: "linear-gradient(135deg, #3b82f6, #10b981)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  {profissional.foto}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}>
                  {profissional.nome}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                  {profissional.profissao}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 2 }}>
                  <StarIcon sx={{ color: "#fbbf24", fontSize: "1rem" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {profissional.avaliacao}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", ml: 1 }}>
                    ({profissional.projetos} serviços)
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/cadastro")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              borderRadius: "8px",
              px: 4,
              py: 1.2,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Conhecer Mais Profissionais
          </Button>
        </Box>
      </Container>

      {/* SEÇÃO: CHAMADA PARA AÇÃO FINAL */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          py: { xs: 8, md: 12 },
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, color: "white" }}>
            PRONTO PARA RESOLVER SUAS NECESSIDADES?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: "600px", mx: "auto" }}>
            Junte-se a milhares de pessoas que já resolveram suas necessidades do dia a dia de forma simples e segura.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleCriarConta}
              size="large"
              sx={{
                background: "white",
                color: "#3b82f6",
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  background: "#f8fafc",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Buscar um Profissional
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(true)}
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  borderColor: "#f8fafc",
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Oferecer Meus Serviços
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ background: "#1e293b", color: "white", py: 6 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4}>

            {/* Coluna 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "white" }}>
                WorkMatch
              </Typography>
              <Typography sx={{ color: "#94a3b8", mb: 3, lineHeight: 1.6 }}>
                Conectando pessoas que precisam de ajuda com profissionais que podem ajudar. 
                Suas necessidades do dia a dia, resolvidas com facilidade e confiança.
              </Typography>
            </Grid>

            {/* Para Clientes */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "white" }}>
                Para Clientes
              </Typography>
              {["Buscar Serviços", "Como Funciona", "Dicas", "Ajuda"].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "#94a3b8",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { color: "white" }
                  }}>
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Para Profissionais */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "white" }}>
                Para Profissionais
              </Typography>

              {/* Aqui é onde adicionamos a funcionalidade de abrir o modal */}
              <Typography
                onClick={() => setOpenModal(true)}
                sx={{
                  color: "#94a3b8",
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { color: "white" }
                }}
              >
                Oferecer Serviços
              </Typography>

              {["Dicas", "FAQ", "Suporte"].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "#94a3b8",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { color: "white" }
                  }}>
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Legal */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "white" }}>
                Legal
              </Typography>
              {["Termos de Uso", "Privacidade", "Segurança", "Cookies"].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "#94a3b8",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { color: "white" }
                  }}>
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* Conectar */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "white" }}>
                Conectar
              </Typography>

              <Typography
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#94a3b8",
                  mb: 1,
                  cursor: "pointer",
                  display: "block",
                  textDecoration: "none",
                  "&:hover": { color: "white" }
                }}
              >
                Instagram
              </Typography>

              <Typography
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#94a3b8",
                  mb: 1,
                  cursor: "pointer",
                  display: "block",
                  textDecoration: "none",
                  "&:hover": { color: "white" }
                }}
              >
                Facebook
              </Typography>

              <Typography
                component="a"
                href="https://web.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#94a3b8",
                  mb: 1,
                  cursor: "pointer",
                  display: "block",
                  textDecoration: "none",
                  "&:hover": { color: "white" }
                }}
              >
                WhatsApp
              </Typography>

              <Typography
                component="a"
                href="https://support.google.com/blogger/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#94a3b8",
                  mb: 1,
                  cursor: "pointer",
                  display: "block",
                  textDecoration: "none",
                  "&:hover": { color: "white" }
                }}
              >
                Blog
              </Typography>
            </Grid>

          </Grid>

          <Divider sx={{ my: 4, borderColor: "#334155" }} />

          <Typography sx={{ color: "#94a3b8", textAlign: "center" }}>
            © 2025 WorkMatch - Conectando você ao profissional certo, no momento certo.
          </Typography>
        </Container>
      </Box>

      {/* MODAL */}
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
            borderRadius: '12px',
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            mx: 2,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              color: '#3b82f6',
              mb: 2,
              '& .MuiSvgIcon-root': {
                fontSize: '3rem',
              },
            }}
          >
            <InfoIcon />
          </Box>

          <Typography id="modal-title" variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
            Em breve!
          </Typography>

          <Typography id="modal-description" sx={{ color: '#64748b', mb: 3 }}>
            Função ainda não disponível no momento.
          </Typography>

          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              width: '100%',
            }}
          >
            Entendi
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default InicioPage;