import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const TalleService = {
  crearTalle: async (payload) => {
    const { data } = await api.post(ENDPOINTS.TALLES.BASE, payload);
    return data;
  },

  getTalles: async () => {
    const { data } = await api.get(ENDPOINTS.TALLES.BASE);
    return data;
  },

  eliminarTalle: async (id) => {
    await api.patch(ENDPOINTS.TALLES.ELIMINAR(id));
  },
};

export default TalleService;
