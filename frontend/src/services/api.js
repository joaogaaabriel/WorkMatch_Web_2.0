import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/api/login", credentials);
    return response.data;
  },
};

export const usuariosService = {
  criar: async (data) => {
    const response = await api.post("/api/usuarios", data);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },

  atualizar: async (id, data) => {
    const response = await api.put(`/api/usuarios/${id}`, data);
    return response.data;
  },

  excluir: async (id) => {
    return await api.delete(`/api/usuarios/${id}`);
  },
};

export const validacaoService = {
  validarCpf: async (cpf) => {
    const response = await api.post("/api/validar/cpf", { cpf });
    return response.data;
  },

  cpfExiste: async (cpf) => {
    const response = await api.get(`/api/validar/cpf-existe/${cpf}`);
    return response.data;
  },

  emailExiste: async (email) => {
    const response = await api.get(`/api/validar/email-existe/${email}`);
    return response.data;
  },
};

export default api;