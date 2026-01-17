import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const VentaService = {
 
  crearVenta: async (payload) => {
    const { data } = await api.post(ENDPOINTS.VENTAS.BASE, payload);
    return data;
  },

 
  getVentas: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.VENTAS.BASE, {
      params: filters,
    });
    return data;
  },

  
  getVentaById: async (id) => {
    const { data } = await api.get(ENDPOINTS.VENTAS.POR_ID(id));
    return data;
  },

  
  pagarVenta: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.PAGAR(id), payload);
    return data;
  },

  reservarVenta: async (id, payload) => {
    const { data } = await api.post(ENDPOINTS.VENTAS.RESERVAR(id), payload);
    return data;
  },

 
  agregarPagoReserva: async (id, payload) => {
    const { data } = await api.post(ENDPOINTS.VENTAS.AGREGAR_PAGO_RESERVA(id), payload);
    return data;
  },


  cancelarVenta: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.CANCELAR(id), payload);
    return data;
  },

  
  rechazarVenta: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.RECHAZAR(id), payload);
    return data;
  },

 
  procesarCambio: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.CAMBIO_PRODUCTO(id), payload);
    return data;
  },

 
  procesarVencidas: async () => {
    await api.get(ENDPOINTS.VENTAS.PROCESAR_VENCIDAS);
  },

  
  eliminarVenta: async (id) => {
    await api.patch(ENDPOINTS.VENTAS.ELIMINAR(id));
  },


  ventasMes: async () => {
    const { data } = await api.get(ENDPOINTS.VENTAS.VENTAS_MES);
    return data.total;
  },

  
  ventasSemana: async () => {
    const { data } = await api.get(ENDPOINTS.VENTAS.VENTAS_SEMANALES);
    return data;
  },

};

export default VentaService;
