import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ProductoService = {

  crearProducto: async (payload) => {
    const { data } = await api.post(ENDPOINTS.PRODUCTOS.BASE, payload);
    return data;
  },

  getProductos: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.PRODUCTOS.BASE, {
      params: filters,
    });
    return data;
  },

  getProductoById: async (id) => {
    const { data } = await api.get(ENDPOINTS.PRODUCTOS.POR_ID(id));
    return data;
  },

  getProductoByCodigo: async (codigo) => {
    const { data } = await api.get(ENDPOINTS.PRODUCTOS.POR_CODIGO(codigo));
    return data;
  },

  actualizarProducto: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.PRODUCTOS.POR_ID(id), payload);
    return data;
  },

  eliminarProducto: async (id) => {
    await api.patch(ENDPOINTS.PRODUCTOS.ELIMINAR(id));
  },

  crearDetalle: async (productoId, payload) => {
    const { data } = await api.post(
      ENDPOINTS.PRODUCTOS.DETALLES.CREAR(productoId), 
      payload
    );
    return data;
  },

  actualizarDetalleProducto: async (productoId, detalleId, payload) => {
    const { data } = await api.patch(
      ENDPOINTS.PRODUCTOS.DETALLES.ACTUALIZAR(productoId, detalleId),
      payload
    );
    return data;
  },

  eliminarDetalleProducto: async (productoId, detalleId) => {
    await api.patch(
      ENDPOINTS.PRODUCTOS.DETALLES.ELIMINAR(productoId, detalleId)
    );
  }
};

export default ProductoService;
