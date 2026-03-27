import React, { useState } from "react";
import { 
  Box, 
  IconButton, 
  Drawer, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  ListItemIcon,
  Avatar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function MenuLateral() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => setDrawerOpen(open);

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Meu Perfil", icon: <PersonIcon />, path: "/perfil" },
    { text: "Meus Agendamentos", icon: <EventAvailableIcon />, path: "/meus-agendamentos" },
    { text: "Gerenciar Profissionais", icon: <ManageAccountsIcon />, path: "/gerenciar-profissionais" },
    { text: "Configurações", icon: <SettingsIcon />, path: "/configuracoes" },
    { text: "Suporte", icon: <SupportIcon />, path: "/suporte" },
  ];

  return (
    <>
      {/* BOTÃO DO MENU - ESTILO ATUALIZADO */}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 20,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
          "&:hover": {
            boxShadow: "0 12px 30px rgba(59, 130, 246, 0.25)",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <IconButton 
          onClick={() => toggleDrawer(true)}
          sx={{
            p: 1.5,
            "&:hover": {
              background: "rgba(59, 130, 246, 0.1)",
            },
          }}
        >
          <MenuIcon sx={{ 
            fontSize: 32, 
            color: "#3b82f6",
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))"
          }} />
        </IconButton>
      </Box>

      {/* LOGO - ESTILO ATUALIZADO */}
      <Box
        component="img"
        src={logo}
        alt="WorkMatch Logo"
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          height: "45px",
          cursor: "pointer",
          zIndex: 20,
          transition: "all 0.3s ease",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "8px 12px",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
          "&:hover": {
            transform: "scale(1.05) translateY(-2px)",
            boxShadow: "0 12px 30px rgba(59, 130, 246, 0.25)",
          },
        }}
      />

      {/* MENU LATERAL - ESTILO ATUALIZADO */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 320,
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRight: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "20px 0 40px rgba(0, 0, 0, 0.1)",
          }
        }}
      >
        <Box sx={{ 
          width: 320, 
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}>
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
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #3b82f6, #10b981)",
                borderRadius: "50%",
                opacity: 0.08,
                top: "-30px",
                right: "-30px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                borderRadius: "50%",
                opacity: 0.08,
                bottom: "40px",
                left: "-20px",
              }}
            />
          </Box>

          {/* CABEÇALHO DO MENU */}
          <Box sx={{ 
            p: 3, 
            position: "relative",
            zIndex: 1,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
              >
                <DashboardIcon sx={{ fontSize: 28, color: "white" }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontSize: "1.4rem",
                    textShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Menu Principal
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#64748b",
                    fontSize: "0.85rem",
                  }}
                >
                  Gerencie sua conta
                </Typography>
              </Box>
            </Box>
            <Divider 
              sx={{ 
                borderColor: "rgba(226, 232, 240, 0.8)",
                "&::before, &::after": {
                  borderColor: "rgba(226, 232, 240, 0.5)",
                }
              }} 
            />
          </Box>

          {/* LISTA DE MENU COM BOTÃO SAIR MAIS ALTO */}
          <Box sx={{ 
            p: 2, 
            position: "relative",
            zIndex: 1,
            height: "calc(100% - 140px)",
            display: "flex",
            flexDirection: "column",
          }}>
            <List sx={{ flexGrow: 0 }}>
              {/* CORRIGIDO: removido o parâmetro index não utilizado */}
              {menuItems.map((item) => (
                <ListItem 
                  key={item.text}
                  button 
                  onClick={() => {
                    navigate(item.path);
                    toggleDrawer(false);
                  }}
                  sx={{
                    borderRadius: "12px",
                    mb: 1,
                    py: 1.5,
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.7)",
                    border: "1px solid rgba(226, 232, 240, 0.5)",
                    "&:hover": {
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                      borderColor: "rgba(59, 130, 246, 0.3)",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                    },
                    "& .MuiListItemIcon-root": {
                      minWidth: 40,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#3b82f6" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: "0.95rem",
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* BOTÃO SAIR - AGORA MAIS ALTO */}
            <Box sx={{ p: 2, mt: 2 }}>
              <Divider sx={{ mb: 2, borderColor: "rgba(226, 232, 240, 0.8)" }} />
              <ListItem 
                button 
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                  toggleDrawer(false);
                }}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  "&:hover": {
                    background: "rgba(239, 68, 68, 0.1)",
                    borderColor: "rgba(239, 68, 68, 0.4)",
                    transform: "translateX(8px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon sx={{ color: "#ef4444" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Sair" 
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 600,
                      color: "#ef4444",
                    }
                  }}
                />
              </ListItem>
            </Box>
          </Box>

          {/* RODAPÉ DO MENU */}
          <Box sx={{ 
            p: 2, 
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: "#94a3b8",
                textAlign: "center",
                display: "block",
                fontSize: "0.75rem",
              }}
            >
              WorkMatch © 2024
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}