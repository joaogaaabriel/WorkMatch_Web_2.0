/**
 * WorkMatch 2.0 — API Service Layer
 *
 * BUGS CORRIGIDOS:
 * - URLs com aspas simples em vez de backtick (template literals)
 * - VITE_API_URL dev apontava para porta 8080 (nenhum serviço)
 * - LoginPage usava VITE_API_URL1 mas auth-serve é outra porta
 */

import axios from "axios";

// Backend principal (porta 8081 dev / workmatch-pi.onrender.com prod)
const API_BACKEND = import.meta.env.VITE_API_URL || "http://localhost:8081";

// Auth-serve (porta 8082 dev / workmatch-pi-1.onrender.com prod)
const API_AUTH = import.meta.env.VITE_API_URL1 || "http://localhost:8082";

// ── Instâncias axios ──────────────────────────────────────────────────────────

export const apiBackend = axios.create({ baseURL: API_BACKEND });
export const apiAuth    = axios.create({ baseURL: API_AUTH });

// Injeta Bearer token em todas as requisições
const addToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

apiBackend.interceptors.request.use(addToken);
apiAuth.interceptors.request.use(addToken);

// Redireciona para login em 401/403
const handleAuthError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

apiBackend.interceptors.response.use(null, handleAuthError);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) =>
    apiAuth.post("/api/login", credentials).then((r) => r.data),
};

// ── Profissionais ─────────────────────────────────────────────────────────────
export const profissionaisService = {
  listar: () =>
    apiBackend.get("/api/profissionais").then((r) => r.data),

  buscarPorId: (id) =>
    apiBackend.get(`/api/profissionais/${id}`).then((r) => r.data),

  criar: (data) =>
    apiBackend.post("/api/profissionais", data).then((r) => r.data),

  atualizar: (id, data) =>
    apiBackend.put(`/api/profissionais/${id}`, data).then((r) => r.data),

  deletar: (id) =>
    apiBackend.delete(`/api/profissionais/${id}`),
};

// ── Agendamentos ──────────────────────────────────────────────────────────────
export const agendamentosService = {
  meus: () =>
    apiBackend.get("/api/agendamentos/meus").then((r) => r.data),

  criar: (data) =>
    apiBackend.post("/api/agendamentos", data).then((r) => r.data),

  cancelar: (id) =>
    apiBackend.delete(`/api/agendamentos/${id}`),
};

// ── Agenda / Horários ─────────────────────────────────────────────────────────
export const agendaService = {
  horariosPorData: (profissionalId, data) =>
    apiBackend
      .get(`/api/agendas/profissionais/${profissionalId}/agendas`, { params: { data } })
      .then((r) => r.data),

  criarAgenda: (profissionalId, data) =>
    apiBackend.post(`/api/agendas/${profissionalId}`, data).then((r) => r.data),

  buscarAgendas: (profissionalId) =>
    apiBackend.get(`/api/agendas/${profissionalId}`).then((r) => r.data),

  atualizarAgenda: (agendaId, data) =>
    apiBackend.put(`/api/agendas/${agendaId}`, data).then((r) => r.data),

  deletarAgenda: (agendaId) =>
    apiBackend.delete(`/api/agendas/${agendaId}`),
};

// ── Usuários ──────────────────────────────────────────────────────────────────
export const usuariosService = {
  perfil: (id) =>
    apiBackend.get(`/api/usuarios/${id}`).then((r) => r.data),

  atualizar: (id, data) =>
    apiBackend.put(`/api/usuarios/${id}`, data).then((r) => r.data),

  cadastrar: (data) =>
    apiBackend.post("/api/usuarios", data).then((r) => r.data),
};

// ── Validação ─────────────────────────────────────────────────────────────────
export const validacaoService = {
  validarCpf: (cpf) =>
    apiBackend.post("/api/validar/cpf", { cpf }).then((r) => r.data),

  cpfExiste: (cpf) =>
    apiBackend.get(`/api/validar/cpf-existe/${cpf}`).then((r) => r.data),

  emailExiste: (email) =>
    apiBackend.get(`/api/validar/email-existe/${email}`).then((r) => r.data),
};
