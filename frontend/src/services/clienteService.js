import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ClienteService = {
  // =======================
  // POST /clientes (Crear cliente)
  // =======================
    // public class ClienteCreateRequest {
    //     private String nombre;
    //     private String apellido;
    //     private String telefono;
    //     private String dni;
    //     private Double creditoLimite;
    //     private CategoriaCliente categoria;
    // }
  crearCliente: async (payload) => {
    const { data } = await api.post(ENDPOINTS.CLIENTES.BASE, payload);
    return data;
  },

  // =======================
  // GET /clientes (Obtener todos con filtros/paginación)
  // =======================
    // public class ClienteQuery {
    //     private String nombre;
    //     private String apellido;
    //     private String dni;
    //     private CategoriaCliente categoria;
    //     private String orden;
    //     private String direccion;
    //     private Integer pagina;
    // }
  getClientes: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.CLIENTES.BASE, {
      params: filters, // Esto envía el objeto ClienteQuery como query params
    });
    return data;
  },

  // =======================
  // GET /clientes/{id} (Obtener un cliente específico)
  // =======================
    // public class ClienteResponse {
    //     private Long id;
    //     private String nombre;
    //     private String apellido;
    //     private String telefono;
    //     private String dni;
    //     private Double creditoLimite;
    //     private Double deuda;
    //     private Double creditoDisponible;
    //     private CategoriaCliente categoriaCliente;
    // }
  getClienteById: async (id) => {
    const { data } = await api.get(ENDPOINTS.CLIENTES.POR_ID(id));
    return data;
  },

  // =======================
  // PATCH /clientes/{id} (Actualizar cliente)
  // =======================
    // public class ClienteUpdateRequest {
    //     private String nombre;
    //     private String apellido;
    //     private String telefono;
    //     private Double creditoLimite;
    //     private CategoriaCliente categoria;
    // }
  actualizarCliente: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.CLIENTES.POR_ID(id), payload);
    return data;
  },

  // =======================
  // PATCH /clientes/{id}/eliminacion (Borrado lógico)
  // =======================
  eliminarCliente: async (id) => {
    await api.patch(ENDPOINTS.CLIENTES.ELIMINAR(id));
  },
};

export default ClienteService;
