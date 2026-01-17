import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const AuthService = {
  login: async (payload) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  getMe: async () => {
    const { data } = await api.get(ENDPOINTS.AUTH.ME);
    return data;
  },

  cambiarContrasenia: async (payload) => {
    const { data } = await api.post(ENDPOINTS.AUTH.CAMBIAR_CONTRASENIA, payload);
    return data;
  },

  recuperarContrasenia: async (payload) => {
    await api.post(ENDPOINTS.AUTH.RECUPERAR_CONTRASENIA, payload);
  },

  resetearContrasenia: async (payload) => {
    await api.post(ENDPOINTS.AUTH.RESETEAR_CONTRASENIA, payload);
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/#/login";
  }
};

export default AuthService;
