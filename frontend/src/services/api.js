import axios from "axios";

const API_BACKEND = import.meta.env.VITE_API_URL  || "http://localhost:8081";
const API_AUTH    = import.meta.env.VITE_API_URL1 || "http://localhost:8082";

export const apiBackend = axios.create({ baseURL: API_BACKEND });
export const apiAuth    = axios.create({ baseURL: API_AUTH });

const addToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

apiBackend.interceptors.request.use(addToken);
apiAuth.interceptors.request.use(addToken);

apiBackend.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

export const authService = {
  login: (credentials) =>
      apiAuth.post("/api/login", credentials).then((r) => r.data),
};

export const profissionaisService = {
  listar: () =>
      apiBackend.get("/api/profissionais").then((r) => r.data),

  buscarPorId: (id) =>
      apiBackend.get(`/api/profissionais/${id}`).then((r) => r.data),

  criar: (data) =>
      apiBackend.post("/api/profissionais", data).then((r) => r.data),

  atualizar: (id, data) =>
      apiBackend.put(`/api/profissionais/${id}`, data).then((r) => r.data),

  excluir: (id) =>
      apiBackend.delete(`/api/profissionais/${id}`),
};

export const agendamentosService = {
  meus: () =>
      apiBackend.get("/api/agendamentos/meus").then((r) => r.data),

  criar: (data) =>
      apiBackend.post("/api/agendamentos", data).then((r) => r.data),

  cancelar: (id) =>
      apiBackend.delete(`/api/agendamentos/${id}`),
};

export const agendaService = {
  horariosPorData: (profissionalId, data) =>
      apiBackend
          .get(`/api/agendas/profissionais/${profissionalId}/agendas`, { params: { data } })
          .then((r) => r.data),

  criar: (profissionalId, data) =>
      apiBackend.post(`/api/agendas/${profissionalId}`, data).then((r) => r.data),

  buscarPorProfissional: (profissionalId) =>
      apiBackend.get(`/api/agendas/${profissionalId}`).then((r) => r.data),

  atualizar: (agendaId, data) =>
      apiBackend.put(`/api/agendas/${agendaId}`, data).then((r) => r.data),

  excluir: (agendaId) =>
      apiBackend.delete(`/api/agendas/${agendaId}`),
};

const introspect = async () => {
  const token = localStorage.getItem("token");
  const intro = await apiAuth.post("/auth/introspect", { token }).then((r) => r.data);
  if (!intro.active || !intro.userId) throw new Error("Token inválido");
  return intro.userId;
};

export const usuariosService = {
  buscarPerfil: async () => {
    const userId = await introspect();
    return apiBackend.get(`/api/usuarios/${userId}`).then((r) => r.data);
  },

  atualizarPerfil: async (data) => {
    const userId = await introspect();
    return apiBackend.put(`/api/usuarios/${userId}`, data).then((r) => r.data);
  },

  alterarSenha: async ({ senhaAtual, novaSenha }) => {
    const userId = await introspect();
    return apiBackend.put(`/api/usuarios/${userId}/senha`, { senhaAtual, novaSenha }).then((r) => r.data);
  },

  buscarPorId: (id) =>
      apiBackend.get(`/api/usuarios/${id}`).then((r) => r.data),

  atualizar: (id, data) =>
      apiBackend.put(`/api/usuarios/${id}`, data).then((r) => r.data),

  criar: (data) =>
      apiBackend.post("/api/usuarios", data).then((r) => r.data),

  excluir: (id) =>
      apiBackend.delete(`/api/usuarios/${id}`),
};

export const validacaoService = {
  validarCpf: (cpf) =>
      apiBackend.post("/api/validar/cpf", { cpf }).then((r) => r.data),

  cpfExiste: (cpf) =>
      apiBackend.get(`/api/validar/cpf-existe/${cpf}`).then((r) => r.data),

  emailExiste: (email) =>
      apiBackend.get(`/api/validar/email-existe/${email}`).then((r) => r.data),
};