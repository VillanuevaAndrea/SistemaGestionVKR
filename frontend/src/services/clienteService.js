import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ClienteService = {
  crearCliente: async (payload) => {
    const { data } = await api.post(ENDPOINTS.CLIENTES.BASE, payload);
    return data;
  },
getClientes: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.CLIENTES.BASE, {
      params: filters, // Esto envía el objeto ClienteQuery como query params
    });
    return data;
  },
getClienteById: async (id) => {
    const { data } = await api.get(ENDPOINTS.CLIENTES.POR_ID(id));
    return data;
  },
 actualizarCliente: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.CLIENTES.POR_ID(id), payload);
    return data;
  },
eliminarCliente: async (id) => {
    await api.patch(ENDPOINTS.CLIENTES.ELIMINAR(id));
  },
};

export default ClienteService;
