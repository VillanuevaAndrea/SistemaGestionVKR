import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const CategoriaService = {
  crearCategoria: async (payload) => {
    const { data } = await api.post(ENDPOINTS.CATEGORIAS.BASE, payload);
    return data;
  },
getCategorias: async () => {
    const { data } = await api.get(ENDPOINTS.CATEGORIAS.BASE);
    return data;
  },
eliminarCategoria: async (id) => {
    await api.patch(ENDPOINTS.CATEGORIAS.ELIMINAR(id));
  },
};

export default CategoriaService;
