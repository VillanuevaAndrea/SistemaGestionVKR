import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ProveedorService = {

  crearProveedor: async (payload) => {
    const { data } = await api.post(ENDPOINTS.PROVEEDORES.BASE, payload);
    return data;
  },

  getProveedores: async () => {
    const { data } = await api.get(ENDPOINTS.PROVEEDORES.BASE);
    return data;
  },

  eliminarProveedor: async (id) => {
    await api.patch(ENDPOINTS.PROVEEDORES.ELIMINAR(id));
  },
};

export default ProveedorService;
