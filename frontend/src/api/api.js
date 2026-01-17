import axios from "axios";
import { ENDPOINTS } from "./endpoints.js";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTOR DE REQUEST ---
// Se ejecuta antes de enviar la petición: inyecta el token Bearer automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPONSE ---
// Maneja la respuesta del servidor antes de que llegue al componente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverResponse = error.response?.data;
    const status = serverResponse?.status || error.response?.status;
    const mensaje = serverResponse?.message || "Ocurrió un error inesperado";

    const esCambioClaveObligatorio = mensaje.includes("cambiar su contraseña inicial");

    if (status === 401 && !error.config.url.includes(ENDPOINTS.AUTH.LOGIN) && !esCambioClaveObligatorio) {
      localStorage.removeItem("token");
      window.location.href = "/#/login";
      return Promise.reject(error);
    }

    const apiErrorEvent = new CustomEvent("api-error-alert", { 
      detail: { mensaje, status } 
    });
    window.dispatchEvent(apiErrorEvent);

    return Promise.reject(error);
  }
);
