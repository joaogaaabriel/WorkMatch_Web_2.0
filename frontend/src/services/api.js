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
    window.location.href = "/gerenciar-profissionais";
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

  cadastrar: (data) =>
    apiBackend.post("/api/profissionais", data).then((r) => r.data),

  criar: (data) =>
    apiBackend.post("/api/profissionais", data).then((r) => r.data),

  atualizar: (id, data) =>
    apiBackend.put(`/api/profissionais/${id}`, data).then((r) => r.data),

  excluir: (id) =>
    apiBackend.delete(`/api/profissionais/${id}`),

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

  // GerenciarAgendaPage usa: agendaService.criar(id, payload)
  criar: (profissionalId, data) =>
    apiBackend.post(`/api/agendas/${profissionalId}`, data).then((r) => r.data),

  criarAgenda: (profissionalId, data) =>
    apiBackend.post(`/api/agendas/${profissionalId}`, data).then((r) => r.data),

  buscarAgendas: (profissionalId) =>
    apiBackend.get(`/api/agendas/${profissionalId}`).then((r) => r.data),

  // GerenciarAgendaPage usa: agendaService.atualizarPorId(agendaId, payload)
  atualizarPorId: (agendaId, data) =>
    apiBackend.put(`/api/agendas/${agendaId}`, data).then((r) => r.data),

  atualizarAgenda: (agendaId, data) =>
    apiBackend.put(`/api/agendas/${agendaId}`, data).then((r) => r.data),

  deletarAgenda: (agendaId) =>
    apiBackend.delete(`/api/agendas/${agendaId}`),
};

// ── Usuários ──────────────────────────────────────────────────────────────────
export const usuariosService = {
  // Busca dados do usuário logado:
  // 1) chama /auth/introspect para pegar userId pelo token
  // 2) chama GET /api/usuarios/{userId}
  buscarPerfil: async () => {
    const token = localStorage.getItem("token");
    const intro = await apiAuth.post("/auth/introspect", { token }).then((r) => r.data);
    if (!intro.active || !intro.userId) throw new Error("Token inválido");
    return apiBackend.get(`/api/usuarios/${intro.userId}`).then((r) => r.data);
  },

  // Atualiza perfil do usuário logado (busca userId via introspect)
  atualizarPerfil: async (data) => {
    const token = localStorage.getItem("token");
    const intro = await apiAuth.post("/auth/introspect", { token }).then((r) => r.data);
    if (!intro.active || !intro.userId) throw new Error("Token inválido");
    return apiBackend.put(`/api/usuarios/${intro.userId}`, data).then((r) => r.data);
  },

  // Altera senha — o backend PUT /api/usuarios/{id} aceita o campo senha
  // Se o backend não tiver endpoint dedicado, envia a nova senha criptografada
  // via atualização do usuário (campo senha em plain, backend deve re-encriptar)
  alterarSenha: async ({ senhaAtual, novaSenha }) => {
    const token = localStorage.getItem("token");
    const intro = await apiAuth.post("/auth/introspect", { token }).then((r) => r.data);
    if (!intro.active || !intro.userId) throw new Error("Token inválido");
    // Envia para o backend — o controller de alteração de senha deve tratar isso
    return apiBackend.put(`/api/usuarios/${intro.userId}/senha`, { senhaAtual, novaSenha }).then((r) => r.data);
  },

  buscarPorId: (id) =>
    apiBackend.get(`/api/usuarios/${id}`).then((r) => r.data),

  atualizar: (id, data) =>
    apiBackend.put(`/api/usuarios/${id}`, data).then((r) => r.data),

  cadastrar: (data) =>
    apiBackend.post("/api/usuarios", data).then((r) => r.data),

  excluir: (id) =>
    apiBackend.delete(`/api/usuarios/${id}`),
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
