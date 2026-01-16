import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ProveedorService = {
  // =======================
  // POST /proveedores (Crear proveedor)
  // =======================
    // public class ProveedorCreateRequest {
    //     private String nombre;    
    // }
  crearProveedor: async (payload) => {
    const { data } = await api.post(ENDPOINTS.PROVEEDORES.BASE, payload);
    return data;
  },

  // =======================
  // GET /proveedores (Obtener todos los proveedores)
  // =======================
    // public class ProveedorResponse {
    //     private Long id;
    //     private String nombre;
    // }
  getProveedores: async () => {
    const { data } = await api.get(ENDPOINTS.PROVEEDORES.BASE);
    return data;
  },

  // =======================
  // PATCH /proveedores/{id} (Baja lógica)
  // =======================
  eliminarProveedor: async (id) => {
    await api.patch(ENDPOINTS.PROVEEDORES.ELIMINAR(id));
  },
};

export default ProveedorService;
