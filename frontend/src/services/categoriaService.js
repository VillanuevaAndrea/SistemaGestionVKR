import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const CategoriaService = {
  // =======================
  // POST /categorias (Crear categoría)
  // =======================
    // public class CategoriaCreateRequest {
    //     private String descripcion;    
    // }
  crearCategoria: async (payload) => {
    const { data } = await api.post(ENDPOINTS.CATEGORIAS.BASE, payload);
    return data;
  },

  // =======================
  // GET /categorias (Obtener todas)
  // =======================
    //   public class CategoriaResponse {
    //     private Long id;
    //     private String descripcion;
    //     private Boolean estaActiva;
    //     private List<SubcategoriaResponse> subcategorias; 
    //   }
    // public class SubcategoriaResponse {
    //     private Long id;
    //     private String descripcion;
    // }
  getCategorias: async () => {
    const { data } = await api.get(ENDPOINTS.CATEGORIAS.BASE);
    return data;
  },

  // =======================
  // PATCH /categorias/{id}/eliminacion
  // =======================
  eliminarCategoria: async (id) => {
    await api.patch(ENDPOINTS.CATEGORIAS.ELIMINAR(id));
  },
};

export default CategoriaService;
