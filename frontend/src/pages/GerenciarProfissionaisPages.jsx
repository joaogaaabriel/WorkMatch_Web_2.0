import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GerenciarProfissionaisPages() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    especialidade: "",
    descricao: "",
    experienciaAnos: 0,
  });

  const [notificacao, setNotificacao] = useState({
    aberta: false,
    mensagem: "",
    tipo: "success",
  });

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get(`${API}/api/profissionais`);
      setProfessionals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      mostrarNotificacao("Erro ao buscar profissionais", "error");
      console.error(err);
    }
  };

  const mostrarNotificacao = (mensagem, tipo = "success") => {
    setNotificacao({ aberta: true, mensagem, tipo });
  };

  const handleOpenDialog = (profissional = null) => {
    if (profissional) {
      setFormData({ ...profissional });
    } else {
      setFormData({
        id: "",
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        especialidade: "",
        descricao: "",
        experienciaAnos: 0,
        cidade: "",
        estado: "",
        endereco: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(
          `${API}/api/profissionais/${formData.id}`,
          formData
        );
        mostrarNotificacao("Profissional atualizado com sucesso!");
      } else {
        await axios.post(`${API}/api/profissionais`, formData);
        mostrarNotificacao("Profissional cadastrado com sucesso!");
      }

      fetchProfessionals();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      mostrarNotificacao("Erro ao salvar profissional", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este profissional? ")) return;

    try {
      await axios.delete(`${API}/api/profissionais/${id}`);
      mostrarNotificacao("Profissional excluído com sucesso!");
      fetchProfessionals();
    } catch (err) {
      console.error(err);
      mostrarNotificacao("Erro ao excluir profissional", "error");
    }
  };

  // 🎨 Estilo dos TextFields
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      "& fieldset": { borderColor: "#cbd5e1" },
      "&:hover fieldset": { borderColor: "#3b82f6" },
      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#3b82f6",
    },
  };

  // 🎨 Botão moderno azul
  const modernButton = {
    borderRadius: "12px",
    fontWeight: "bold",
    textTransform: "none",
    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
    color: "#fff",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    "&:hover": {
      transform: "scale(1.03)",
      transition: "0.2s",
      background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
    },
  };

  // 🎨 Botão outline moderno
  const outlineButton = {
    borderRadius: "12px",
    borderColor: "#3b82f6",
    color: "#3b82f6",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
      borderColor: "#2563eb",
      background: "#eff6ff",
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      }}
    >
      <Paper
        sx={{
          height: "92vh",
          width: "96vw",
          p: 4,
          overflowY: "auto",
          borderRadius: "22px",
          backgroundColor: "#ffffffee",
          backdropFilter: "blur(15px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.20)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 4,
            background: "linear-gradient(90deg,#3b82f6,#2563eb)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Gestão de Profissionais
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button variant="contained" sx={modernButton} onClick={() => handleOpenDialog()}>
            Cadastrar Profissional
          </Button>
        </Box>

        {/* ---------- TABELA ----------- */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eff6ff" }}>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Especialidade</strong></TableCell>
                <TableCell><strong>CPF</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell><strong>Data Nasc.</strong></TableCell>
                <TableCell><strong>Descrição</strong></TableCell>
                <TableCell><strong>Experiência</strong></TableCell>
                <TableCell><strong>Cidade</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Endereço</strong></TableCell>
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {professionals.map((p) => (
                <TableRow
                  key={p.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell>{p.nome}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.especialidade}</TableCell>
                  <TableCell>{p.cpf}</TableCell>
                  <TableCell>{p.telefone}</TableCell>
                  <TableCell>{p.dataNascimento}</TableCell>
                  <TableCell>{p.descricao}</TableCell>
                  <TableCell>{p.experienciaAnos}</TableCell>
                  <TableCell>{p.cidade}</TableCell>
                  <TableCell>{p.estado}</TableCell>
                  <TableCell>{p.endereco}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ...outlineButton, mr: 1 }}
                      onClick={() => handleOpenDialog(p)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{ mr: 1, borderRadius: "12px" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Excluir
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      sx={{ ...modernButton, py: 0.4, px: 1.4 }}
                      onClick={() => navigate(`/profissional/${p.id}/agenda`)}
                    >
                      Agenda
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* --------- DIALOG --------- */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {formData.id ? "Editar Profissional" : "Cadastrar Profissional"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Nome" fullWidth value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="CPF" fullWidth value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Email" fullWidth value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Telefone" fullWidth value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Especialidae" fullWidth value={formData.especialidade}
            onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Descrição" fullWidth value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Experiência (anos)" type="number" fullWidth value={formData.experienciaAnos}
            onChange={(e) => setFormData({ ...formData, experienciaAnos: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Cidade" fullWidth value={formData.cidade}
            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Estado" fullWidth value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            sx={textFieldStyle}
          />
          <TextField label="Endereço" fullWidth value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            sx={textFieldStyle}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button variant="contained" sx={modernButton} onClick={handleSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---- SNACKBAR ---- */}
      <Snackbar
        open={notificacao.aberta}
        autoHideDuration={4000}
        onClose={() => setNotificacao((prev) => ({ ...prev, aberta: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notificacao.tipo}
          onClose={() => setNotificacao((prev) => ({ ...prev, aberta: false }))}
          sx={{ width: "100%" }}
        >
          {notificacao.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
