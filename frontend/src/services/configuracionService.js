import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ConfiguracionService = {
  getConfiguracion: async () => {
    const { data } = await api.get(ENDPOINTS.CONFIGURACION);
    return data;
  },
  actualizarConfiguracion: async (payload) => {
    const { data } = await api.patch(ENDPOINTS.CONFIGURACION, payload);
    return data;
  }
};

export default ConfiguracionService;
