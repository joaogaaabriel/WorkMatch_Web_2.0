import React, { useState } from "react";
import { Box, IconButton, Drawer, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function MenuLateral() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => setDrawerOpen(open);

  return (
    <>
      {/* BOTÃO DO MENU */}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 20,
        }}
      >
        <IconButton onClick={() => toggleDrawer(true)}>
          <MenuIcon sx={{ fontSize: 32, color: "#3b82f6" }} />
        </IconButton>
      </Box>

      {/* LOGO */}
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
          transition: "transform 0.2s ease",
          "&:hover": { transform: "scale(1.05)" },
        }}
      />

      {/* MENU LATERAL */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Menu
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List>

            <ListItem button onClick={() => navigate("/home")}>
                <ListItemText primary="Home" />
            </ListItem>

           <ListItem button onClick={() => navigate("/perfil")}>
                <ListItemText primary="Meu Perfil" />
            </ListItem>
           
            <ListItem button onClick={() => navigate("/meus-agendamentos")}>
                <ListItemText primary="Meus Agendamentos" />
            </ListItem>
           
            <ListItem button onClick={() => navigate("/gerenciar-profissionais")}>
                <ListItemText primary="Gerenciar Profissionais" />
            </ListItem>
           
            <ListItem button onClick={() => navigate("/configuracoes")}>
                <ListItemText primary="Configurações" />
            </ListItem>
           
            <ListItem button onClick={() => navigate("/suporte")}>
                <ListItemText primary="Suporte" />
            </ListItem>
           

            <Divider sx={{ my: 1 }} />

            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <ListItemText primary="Sair" sx={{ color: "red" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
