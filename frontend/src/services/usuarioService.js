import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const UsuarioService = {
  // =======================
  // PATCH /usuarios/{id} (Actualizar rol)
  // =======================
    // public class UsuarioUpdateRequest {
    //     @NotNull
    //     private Long rolId;
    // }
  actualizarRolUsuario: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.USUARIOS.ACTUALIZAR_ROL(id), payload);
    return data;
  },
};

export default UsuarioService;
