import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const PermisoService = {
  getPermisos: async () => {
    const { data } = await api.get(ENDPOINTS.PERMISOS);
    return data;
  }
};

export default PermisoService;
