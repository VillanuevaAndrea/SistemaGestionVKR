import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ColorService = {
crearColor: async (payload) => {
    const { data } = await api.post(ENDPOINTS.COLORES.BASE, payload);
    return data;
  },
getColores: async () => {
    const { data } = await api.get(ENDPOINTS.COLORES.BASE);
    return data;
  },
eliminarColor: async (id) => {
    await api.patch(ENDPOINTS.COLORES.ELIMINAR(id));
  }
};

export default ColorService;
