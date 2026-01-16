export const ENDPOINTS = {
  // --------- AUTENTICACIÓN ---------
  AUTH: {
    LOGIN: "/auth/login",
    CAMBIAR_CONTRASENIA: "/auth/cambiar-contrasenia",
    RECUPERAR_CONTRASENIA: "/auth/recuperar-contrasenia",
    RESETEAR_CONTRASENIA: "/auth/resetear-contrasenia",
    ME: "/auth/me",
  },

  // --------- CATEGORIAS ---------
  CATEGORIAS: {
    BASE: "/categorias",
    ELIMINAR: (id) => `/categorias/${id}/eliminacion`,
  },

  // --------- CLIENTES ---------
  CLIENTES: {
    BASE: "/clientes",
    POR_ID: (id) => `/clientes/${id}`,
    ELIMINAR: (id) => `/clientes/${id}/eliminacion`,
  },

  // --------- COLORES ---------
  COLORES: {
    BASE: "/colores",
    ELIMINAR: (id) => `/colores/${id}/eliminacion`,
  },

  // --------- CONFIGURACION ---------
  CONFIGURACION: "/configuracion",

  // --------- EMPLEADOS ---------
  EMPLEADOS: {
    BASE: "/empleados",
    POR_ID: (id) => `/empleados/${id}`,
    ELIMINAR: (id) => `/empleados/${id}/eliminacion`,
  },

  // --------- PERMISOS ---------
  PERMISOS: "/permisos",

  // --------- PRODUCTOS ---------
  PRODUCTOS: {
    BASE: "/productos",
    POR_ID: (id) => `/productos/${id}`,
    POR_CODIGO: (codigo) => `/productos/detalles/${codigo}`,
    ELIMINAR: (id) => `/productos/${id}/eliminacion`,
    DETALLES: {
      CREAR: (id) => `/productos/${id}/detalles`,
      ACTUALIZAR: (id, detId) => `/productos/${id}/detalles/${detId}`,
      ELIMINAR: (id, detId) => `/productos/${id}/detalles/${detId}/eliminacion`,
    },
  },

  // --------- PROVEEDORES---------
  PROVEEDORES: {
    BASE: "/proveedores",
    ELIMINAR: (id) => `/proveedores/${id}/eliminacion`
  },

  // --------- ROLES ---------
  ROLES: {
    BASE: "/roles",
    POR_ID: (id) => `/roles/${id}`,
    ELIMINAR: (id) => `/roles/${id}/eliminacion`,
  },

  // --------- SUBCATEGORIAS ---------
  SUBCATEGORIAS: {
    BASE: "/subcategorias",
    ELIMINAR: (id) => `/subcategorias/${id}/eliminacion`,
  },

  // --------- TALLES ---------
  TALLES: {
    BASE: "/talles",
    ELIMINAR: (id) => `/talles/${id}/eliminacion`,
  },

  // --------- USUARIOS ---------
  USUARIOS: {
    ACTUALIZAR_ROL: (id) => `/usuarios/${id}`,
  },

  // --------- VENTAS ---------
  VENTAS: {
    BASE: "/ventas",
    POR_ID: (id) => `/ventas/${id}`,
    PAGAR: (id) => `/ventas/${id}/pago`,
    RESERVAR: (id) => `/ventas/${id}/reserva`,
    AGREGAR_PAGO_RESERVA: (id) => `/ventas/${id}/reserva-pagos`,
    CANCELAR: (id) => `/ventas/${id}/cancelacion`,
    RECHAZAR: (id) => `/ventas/${id}/rechazo`,
    ELIMINAR: (id) => `/ventas/${id}/eliminacion`,
    CAMBIO_PRODUCTO: (id) => `/ventas/${id}/cambio`,
    PROCESAR_VENCIDAS: "/ventas/reservas-vencidas",
    VENTAS_MES: "/ventas/ingresos-mes",
    VENTAS_SEMANALES: "/ventas/ingresos-semana",
  },
};