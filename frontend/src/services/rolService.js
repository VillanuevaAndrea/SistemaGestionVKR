import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const RolService = {
  crearRol: async (payload) => {
    const { data } = await api.post(ENDPOINTS.ROLES.BASE, payload);
    return data;
  },

  actualizarPermisos: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.ROLES.POR_ID(id), payload);
    return data;
  },

  eliminarRol: async (id) => {
    await api.patch(ENDPOINTS.ROLES.ELIMINAR(id));
  },

  getRoles: async () => {
    const { data } = await api.get(ENDPOINTS.ROLES.BASE);
    return data;
  },
};

export default RolService;
