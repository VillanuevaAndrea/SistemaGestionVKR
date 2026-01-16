import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ConfiguracionService = {
  // =======================
  // GET /configuracion (Obtener configuración de la tienda)
  // =======================
    // public class ConfiguracionResponse {
    //     private String nombreEmpresa;
    //     private Boolean permiteReserva;
    //     private Double porcentajeMinimoSena;
    //     private Integer diasValidezReserva;
    //     private Integer stockMinimoGlobal;
    //     private Integer diasMaximoCancelacion;
    // }
  getConfiguracion: async () => {
    const { data } = await api.get(ENDPOINTS.CONFIGURACION);
    return data;
  },

  // =======================
  // PATCH /configuracion (Actualizar configuración)
  // =======================
    // public class ConfiguracionUpdateRequest {
    //     private String nombreEmpresa;
    //     private Boolean permiteReserva;
    //     private Double porcentajeMinimoSena;
    //     private Integer diasValidezReserva;
    //     private Integer stockMinimoGlobal;
    //     private Integer diasMaximoCancelacion;
    // }
  actualizarConfiguracion: async (payload) => {
    const { data } = await api.patch(ENDPOINTS.CONFIGURACION, payload);
    return data;
  }
};

export default ConfiguracionService;
