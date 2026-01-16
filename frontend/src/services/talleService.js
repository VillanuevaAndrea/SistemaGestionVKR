import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const TalleService = {
  // =======================
  // POST /talles (Crear un nuevo talle)
  // =======================
    // public class TalleCreateRequest {
    //     private String descripcion;    
    // }
  crearTalle: async (payload) => {
    const { data } = await api.post(ENDPOINTS.TALLES.BASE, payload);
    return data;
  },

  // =======================
  // GET /talles (Obtener todos los talles)
  // =======================
    // public class TalleResponse {
    //     private Long id;
    //     private String descripcion;
    // }
  getTalles: async () => {
    const { data } = await api.get(ENDPOINTS.TALLES.BASE);
    return data;
  },

  // =======================
  // PATCH /talles/{id}/eliminacion (Borrado lógico)
  // =======================
  eliminarTalle: async (id) => {
    await api.patch(ENDPOINTS.TALLES.ELIMINAR(id));
  },
};

export default TalleService;
