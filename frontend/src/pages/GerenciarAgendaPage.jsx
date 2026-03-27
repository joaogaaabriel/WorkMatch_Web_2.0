import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function GerenciarAgendaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [data, setData] = useState("");
  const [horariosTexto, setHorariosTexto] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [agendaEmEdicao, setAgendaEmEdicao] = useState(null);

  const [notificacao, setNotificacao] = useState({
    aberta: false,
    mensagem: "",
    tipo: "success",
  });

  const mostrarNotificacao = (mensagem, tipo = "success") => {
    setNotificacao({ aberta: true, mensagem, tipo });
  };

  const API = import.meta.env.VITE_API_URL;

  const carregarAgendas = async () => {
    try {
      const resp = await axios.get(
        `${API}/api/agendas/profissional`,
        { id }
      );

      const agendasComHorarios = resp.data.map((agenda) => ({
        id: agenda.agendaId,
        data: agenda.data,
        horarios: agenda.horarios.map((h) => ({
          id: h.id,
          horario: h.horario,
        })),
      }));

      setAgendas(agendasComHorarios);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      mostrarNotificacao("Erro ao carregar agendas", "error");
    }
  };

  useEffect(() => {
    carregarAgendas();
  }, []);

  const handleSalvarAgenda = async () => {
    try {
      const req = {
        data,
        horarios: horariosTexto.split(",").map((h) => h.trim()),
      };

      if (agendaEmEdicao) {

        await axios.put(
        `${API}/api/agendas/agendas/${agendaEmEdicao.id}`,
        { req }
      );

        mostrarNotificacao("Agenda atualizada!");
      } else {
        await axios.post(`${import.meta.env.production.VITE_API_URL}/api/agendas/${id}`, req);
        mostrarNotificacao("Agenda salva!");
      }

      setData("");
      setHorariosTexto("");
      setAgendaEmEdicao(null);
      carregarAgendas();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      mostrarNotificacao("Erro ao salvar agenda", "error");
    }
  };

  const handleEditarAgenda = (agenda) => {
    setData(agenda.data);
    setHorariosTexto(agenda.horarios.map((h) => h.horario).join(", "));
    setAgendaEmEdicao(agenda);
  };

  const handleExcluirAgenda = async (agendaId) => {
    if (!window.confirm("Excluir agenda?")) return;

    try {
      await axios.delete(`${API}/api/agendas/${agendaId}`);
      mostrarNotificacao("Agenda excluída!");
      carregarAgendas();
    } catch {
      mostrarNotificacao("Erro ao excluir agenda", "error");
    }
  };

  const handleExcluirHorario = async (agendaId, horarioId) => {
    if (!window.confirm("Excluir horário?")) return;

    try {
      await axios.delete(
        `${API}/api/agendas/${agendaId}/horarios/${horarioId}`
      );
      mostrarNotificacao("Horário excluído!");
      carregarAgendas();
    } catch {
      mostrarNotificacao("Erro ao excluir horário", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      {/* TOPBAR */}
      <Box
        sx={{
          height: 70,
          background: "#1976d2",
          display: "flex",
          alignItems: "center",
          px: 2,
        }}
      >
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h5"
          sx={{ ml: 2, color: "white", fontWeight: "bold" }}
        >
          Gerenciar Agenda
        </Typography>
      </Box>

      {/* MENU LATERAL */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem button onClick={() => navigate("/home")}>
              <ListItemText primary="🏠 Início" />
            </ListItem>

            <ListItem button onClick={() => navigate(`/agenda/${id}`)}>
              <ListItemText primary="📆 Gerenciar Agenda" />
            </ListItem>

            <Divider />

            <ListItem button>
              <ListItemText primary="⚙ Configurações" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* CONTEÚDO */}
      <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
        {/* Formulário */}
        <Card sx={{ p: 3, borderRadius: "18px", boxShadow: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Criar / Editar Agenda
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Horários (08:00, 09:00...)"
                value={horariosTexto}
                onChange={(e) => setHorariosTexto(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSalvarAgenda}
                sx={{ height: "100%" }}
              >
                {agendaEmEdicao ? "Atualizar" : "Salvar"}
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Lista de Agendas */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Agendas Cadastradas
        </Typography>

        <Grid container spacing={3}>
          {agendas.map((agenda) => (
            <Grid item xs={12} md={6} key={agenda.id}>
              <Card sx={{ p: 3, borderRadius: "18px", boxShadow: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📅 {agenda.data}
                </Typography>

                <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
                  {agenda.horarios.map((h) => (
                    <Grid item key={h.id}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() =>
                          handleExcluirHorario(agenda.id, h.id)
                        }
                      >
                        {h.horario} &times;
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleEditarAgenda(agenda)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleExcluirAgenda(agenda.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={notificacao.aberta}
        autoHideDuration={3000}
        onClose={() => setNotificacao({ ...notificacao, aberta: false })}
      >
        <Alert severity={notificacao.tipo}>{notificacao.mensagem}</Alert>
      </Snackbar>
    </Box>
  );
}
