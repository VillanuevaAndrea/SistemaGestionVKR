import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const EmpleadoService = {
  crearEmpleado: async (payload) => {
    const { data } = await api.post(ENDPOINTS.EMPLEADOS.BASE, payload);
    return data;
  },
  getEmpleados: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.EMPLEADOS.BASE, {
      params: filters, // Mapea EmpleadoQuery
    });
    return data;
  },
  getEmpleadoById: async (id) => {
    const { data } = await api.get(ENDPOINTS.EMPLEADOS.POR_ID(id));
    return data;
  },
  actualizarEmpleado: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.EMPLEADOS.POR_ID(id), payload);
    return data;
  },
  eliminarEmpleado: async (id) => {
    await api.patch(ENDPOINTS.EMPLEADOS.ELIMINAR(id));
  },
};

export default EmpleadoService;
