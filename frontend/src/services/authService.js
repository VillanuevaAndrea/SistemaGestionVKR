import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const AuthService = {
  // =======================
  // POST /auth/login
  // =======================
    // public class UsuarioLoginRequest {
    //     private String nombreDeUsuario;
    //     private String contrasenia;
    // }
  login: async (payload) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  // =======================
  // GET /auth/me (Obtener datos del usuario logueado)
  // =======================
    // public class UsuarioResponse {
    //     private Long id;
    //     private String nombreDeUsuario;
    //     private RolResponse rol;
    // }
  getMe: async () => {
    const { data } = await api.get(ENDPOINTS.AUTH.ME);
    return data;
  },

  // =======================
  // POST /auth/cambiar-contrasenia
  // =======================
    // public class ContraseniaUpdateRequest {
    //     private String contraseniaActual;
    //     private String contraseniaNueva;
    // }
  cambiarContrasenia: async (payload) => {
    const { data } = await api.post(ENDPOINTS.AUTH.CAMBIAR_CONTRASENIA, payload);
    return data;
  },

  // =======================
  // POST /auth/recuperar-contrasenia
  // =======================
    // public class ContraseniaRecuperarRequest {
    //     private String mail;
    // }
  recuperarContrasenia: async (payload) => {
    await api.post(ENDPOINTS.AUTH.RECUPERAR_CONTRASENIA, payload);
  },

  // =======================
  // POST /auth/resetear-contrasenia
  // =======================
    // public class ContraseniaResetearRequest {
    //     private String token;
    //     private String contraseniaNueva;
    // }
  resetearContrasenia: async (payload) => {
    await api.post(ENDPOINTS.AUTH.RESETEAR_CONTRASENIA, payload);
  },

  // =======================
  // Logout (Solo frontend)
  // =======================
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/#/login";
  }
};

export default AuthService;
