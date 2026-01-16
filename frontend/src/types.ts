
export enum UserRole {
  OWNER = 'DUEÑO',
  EMPLOYEE = 'EMPLEADO'
}

export enum Permission {
  VENTAS = 'VENTAS',
  PRODUCTOS = 'PRODUCTOS',
  CLIENTES = 'CLIENTES',
  EMPLEADOS = 'EMPLEADOS',
  CONFIGURACION = 'CONFIGURACION',
  RESERVAS = 'RESERVAS',
  STOCKS = 'STOCKS',
  ALL = 'ALL'
}

export enum ClienteEstado {
  CONFIABLE = 'CONFIABLE',
  NO_CONFIABLE = 'NO_CONFIABLE'
}

export enum VentaEstado {
  INICIADA = 'INICIADA',
  RESERVADA = 'RESERVADA',
  PAGADA = 'PAGADA',
  CANCELADA = 'CANCELADA',
  RECHAZADA = 'RECHAZADA'
}

export interface ProductoDetalle {
  id: string;
  sku: string;
  color: string;
  talle: string;
  stockDisponible: number;
  stockReservado: number;
  stockMinimo: number;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  proveedor: string;
  descripcion: string;
  precioBase: number;
  variantes: ProductoDetalle[];
}

export interface Cliente {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  estado: ClienteEstado;
  limiteCredito: number;
  deudaActual: number;
}

export interface DetalleVenta {
  sku: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  esCambio?: boolean;
}

export interface PagoCredito {
  id: string;
  monto: number;
  fecha: string;
  numeroSecuencial: number;
}

export interface Venta {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: string;
  estado: VentaEstado;
  detalles: DetalleVenta[];
  total: number;
  pagos: PagoCredito[];
  fechaVencimientoReserva?: string;
  esCambio?: boolean;
  idVentaOriginal?: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  permisos: Permission[];
}

// Java Spring Page Structure
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// System Catalogs
export interface CatalogoItem {
  id: string;
  nombre: string;
}
