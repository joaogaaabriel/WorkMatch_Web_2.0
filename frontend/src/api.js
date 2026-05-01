import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const validacaoService = {
  validarCpf: (cpf) => api.get(`/validacao/cpf/${cpf}`).then((r) => r.data),
  cpfExiste: (cpf) => api.get(`/validacao/cpf/existe/${cpf}`).then((r) => r.data),
};

export const usuariosService = {
  criar: (dados) => api.post("/usuarios", dados).then((r) => r.data),
  buscarPorId: (id) => api.get(`/usuarios/${id}`).then((r) => r.data),
  atualizar: (id, dados) => api.put(`/usuarios/${id}`, dados).then((r) => r.data),
  deletar: (id) => api.delete(`/usuarios/${id}`).then((r) => r.data),
};

export const profissionaisService = {
  criar: (dados) => api.post("/profissionais", dados).then((r) => r.data),
  listar: () => api.get("/profissionais").then((r) => r.data),
  buscarPorId: (id) => api.get(`/profissionais/${id}`).then((r) => r.data),
  atualizar: (id, dados) => api.put(`/profissionais/${id}`, dados).then((r) => r.data),
  deletar: (id) => api.delete(`/profissionais/${id}`).then((r) => r.data),
};

export const authService = {
  login: (dados) => api.post("/auth/login", dados).then((r) => r.data),
};

export default api;