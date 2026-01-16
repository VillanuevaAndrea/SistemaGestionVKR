import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const VentaService = {
  // =======================
  // POST /ventas (Crear venta)
  // =======================
    // public class VentaCreateRequest {
    //     private Long clienteId;
    //     private List<DetalleVentaCreateRequest> detalles;
    // }
    // public class DetalleVentaCreateRequest {
    //     private String codigo; 
    //     private Integer cantidad;
    // }
  crearVenta: async (payload) => {
    const { data } = await api.post(ENDPOINTS.VENTAS.BASE, payload);
    return data;
  },

  // =======================
  // GET /ventas (Lista paginada con filtros)
  // =======================
    // public class VentaQuery {
    //     private Long empleadoId;
    //     private Long clienteId;
    //     private MetodoPago metodoPago;
    //     private String estado; // nombre de la clase
    //     private String orden;
    //     private String direccion;
    //     private Integer pagina;
    // }
  getVentas: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.VENTAS.BASE, {
      params: filters,
    });
    return data;
  },

  // =======================
  // GET /ventas/{id} (Detalle de una venta)
  // =======================
    // public class VentaResponse {
    //     private Long id;
    //     private LocalDateTime fecha;
    //     private EmpleadoResponse empleado;
    //     private ClienteResponse cliente;
    //     private Double total;
    //     private Double montoPagado;
    //     private Double saldoPendiente;
    //     private Double progresoPago;
    //     private Double pagoMinimoParaCredito;
    //     private String metodoPago;
    //     private String estadoNombre;
    //     private LocalDateTime fechaVencimientoReserva;
    //     private List<PagoDeCreditoResponse> pagosCredito;
    //     private List<DetalleVentaResponse> detalles;
    // }
    // public class EmpleadoResponse {
    //     private Long id;
    //     private String nombre;
    //     private String apellido;
    //     private String dni;
    //     private String direccion;
    //     private String mail;
    //     private String telefono;
    //     private UsuarioResponse usuario;
    // }
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
    // public class DetalleVentaResponse {
    //     private Long id;
    //     private DetalleProductoVentaResponse detalleProducto;
    //     private Double precioUnitarioActual;
    //     private Integer cantidad;
    //     private Double precioTotalUnitario;
    // }
    // public class PagoDeCreditoResponse {
    //     private Long id;
    //     private Double monto;
    //     @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    //     private LocalDateTime fecha;
    //     private Integer numeroPago;
    // }
  getVentaById: async (id) => {
    const { data } = await api.get(ENDPOINTS.VENTAS.POR_ID(id));
    return data;
  },

  // =======================
  // PATCH /ventas/{id}/pago (Pagar venta completa)
  // =======================
    // public class VentaPagoRequest {
    //     private MetodoPago metodoPago;
    // }
  pagarVenta: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.PAGAR(id), payload);
    return data;
  },

  // =======================
  // POST /ventas/{id}/reserva (Crear reserva con crédito)
  // =======================
    // public class VentaReservaRequest {
    //     private Double monto;
    // }
  reservarVenta: async (id, payload) => {
    const { data } = await api.post(ENDPOINTS.VENTAS.RESERVAR(id), payload);
    return data;
  },

  // =======================
  // POST /ventas/{id}/reserva-pagos (Agregar pago parcial)
  // =======================
    // public class VentaReservaRequest {
    //     private Double monto;
    // }
  agregarPagoReserva: async (id, payload) => {
    const { data } = await api.post(ENDPOINTS.VENTAS.AGREGAR_PAGO_RESERVA(id), payload);
    return data;
  },

  // =======================
  // PATCH /ventas/{id}/cancelacion (Cancelar venta)
  // =======================
  cancelarVenta: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.CANCELAR(id), payload);
    return data;
  },

  // =======================
  // PATCH /ventas/{id}/rechazo (Rechazar venta)
  // =======================
    // public class VentaMotivoRequest {
    //     private String motivo;
    // }
  rechazarVenta: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.RECHAZAR(id), payload);
    return data;
  },

  // =======================
  // PATCH /ventas/{id}/cambio (Procesar cambio de producto)
  // =======================
    // public class VentaUpdateRequest {
    //     private String motivo;
    //     private List<DetalleVentaCreateRequest> detalles;
    // }
  procesarCambio: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.VENTAS.CAMBIO_PRODUCTO(id), payload);
    return data;
  },

  // =======================
  // GET /ventas/reservas-vencidas (Procesar limpieza)
  // =======================
  procesarVencidas: async () => {
    await api.get(ENDPOINTS.VENTAS.PROCESAR_VENCIDAS);
  },

  // =======================
  // PATCH /ventas/{id}/eliminacion (Borrado lógico)
  // =======================
  eliminarVenta: async (id) => {
    await api.patch(ENDPOINTS.VENTAS.ELIMINAR(id));
  },

  // =======================
  // GET /ventas/ingresos-mes
  // =======================
  ventasMes: async () => {
    const { data } = await api.get(ENDPOINTS.VENTAS.VENTAS_MES);
    return data.total;
  },

  // =======================
  // GET /ventas/ingresos-semana
  // =======================
  ventasSemana: async () => {
    const { data } = await api.get(ENDPOINTS.VENTAS.VENTAS_SEMANALES);
    return data;
  },

};

export default VentaService;
