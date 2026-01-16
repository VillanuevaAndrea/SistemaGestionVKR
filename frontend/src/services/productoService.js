import { api } from "../api/api.js";
import { ENDPOINTS } from "../api/endpoints.js";

const ProductoService = {
  // =======================
  // POST /productos (Crear producto base)
  // =======================
    // public class ProductoCreateRequest {
    //     private String nombre;
    //     private String descripcion;
    //     private Long subcategoriaId;
    //     private Long proveedorId;
    //     private Integer precio;
    // }
  crearProducto: async (payload) => {
    const { data } = await api.post(ENDPOINTS.PRODUCTOS.BASE, payload);
    return data;
  },

  // =======================
  // GET /productos (con filtros)
  // =======================
    // public class ProductoQuery {
    //     private String nombre;
    //     private Long categoriaId;
    //     private Long subcategoriaId;
    //     private Long talleId;
    //     private Long colorId;
    //     private Long proveedorId;
    //     private Boolean stockBajo;
    //     private String orden;
    //     private String direccion;
    //     private Integer pagina;
    // }
  getProductos: async (filters = {}) => {
    const { data } = await api.get(ENDPOINTS.PRODUCTOS.BASE, {
      params: filters,
    });
    return data;
  },

  // =======================
  // GET /productos/{id}
  // =======================
    // public class ProductoResponse {
    //     private Long id;
    //     private String nombre;
    //     private String descripcion;
    //     private SubcategoriaDetalleResponse subcategoria;
    //     private ProveedorResponse proveedor;
    //     private Integer precio;
    //     private Integer stockTotal;
    //     private List<DetalleProductoResponse> detalles;
    // }
    // public class SubcategoriaDetalleResponse {
    //   private Long id;
    //   private String descripcion;
    //   private Long categoriaId;
    //   private String categoriaDescripcion;
    // }
    // public class DetalleProductoResponse {
    //     private Long id;
    //     private String codigo;
    //     private TalleResponse talle;
    //     private ColorResponse color;
    //     private Integer stockActual;
    //     private Integer stockReservado;
    //     private Integer stockDisponible;
    //     private Integer stockMinimo;
    // }
  getProductoById: async (id) => {
    const { data } = await api.get(ENDPOINTS.PRODUCTOS.POR_ID(id));
    return data;
  },

  
  // =======================
  // GET /productos/{codigo}
  // =======================
    // public class DetalleProductoVentaResponse {
    //     private Long id;
    //     private String codigo;
    //     private String productoNombre;
    //     private String productoPrecio;
    //     private String talleNombre;
    //     private String colorNombre;
    // }
  getProductoByCodigo: async (codigo) => {
    const { data } = await api.get(ENDPOINTS.PRODUCTOS.POR_CODIGO(codigo));
    return data;
  },

  // =======================
  // PATCH /productos/{id}
  // =======================
    // public class ProductoUpdateRequest {
    //     private String nombre;
    //     private String descripcion;
    //     private Long subcategoriaId;
    //     private Long proveedorId;
    //     private Integer precio;
    // }
  actualizarProducto: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.PRODUCTOS.POR_ID(id), payload);
    return data;
  },

  // =======================
  // PATCH /productos/{id}/eliminacion
  // =======================
  eliminarProducto: async (id) => {
    await api.patch(ENDPOINTS.PRODUCTOS.ELIMINAR(id));
  },

  // =======================
  // POST /productos/{id}/detalles (Crear variante)
  // =======================
    // public class DetalleProductoCreateRequest {
    //     private Long talleId;
    //     private Long colorId;
    //     private Integer stockActual;
    //     private Integer stockMinimo;
    // }
  crearDetalle: async (productoId, payload) => {
    const { data } = await api.post(
      ENDPOINTS.PRODUCTOS.DETALLES.CREAR(productoId), 
      payload
    );
    return data;
  },

  // =======================
  // PATCH /productos/{id}/detalles/{detalleId}
  // =======================
    // public class DetalleProductoUpdateRequest {
    //     private Integer stockAumento;
    //     private Integer stockMinimo;
    // }
  actualizarDetalleProducto: async (productoId, detalleId, payload) => {
    const { data } = await api.patch(
      ENDPOINTS.PRODUCTOS.DETALLES.ACTUALIZAR(productoId, detalleId),
      payload
    );
    return data;
  },

  // =======================
  // PATCH /productos/{id}/detalles/{detalleId}/eliminacion
  // =======================
  eliminarDetalleProducto: async (productoId, detalleId) => {
    await api.patch(
      ENDPOINTS.PRODUCTOS.DETALLES.ELIMINAR(productoId, detalleId)
    );
  }
};

export default ProductoService;
