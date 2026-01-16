import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const SubcategoriaService = {
  // =======================
  // POST /subcategorias (Crear subcategoría)
  // =======================
    // public class SubcategoriaCreateRequest {
    //     private String descripcion;
    //     private Long categoriaId;
    // }
  crearSubcategoria: async (payload) => {
    const { data } = await api.post(ENDPOINTS.SUBCATEGORIAS.BASE, payload);
    return data;
  },

  // =======================
  // PATCH /subcategorias/{id}/eliminacion (Borrado lógico)
  // =======================
  eliminarSubcategoria: async (id) => {
    await api.patch(ENDPOINTS.SUBCATEGORIAS.ELIMINAR(id));
  },
};

export default SubcategoriaService;
