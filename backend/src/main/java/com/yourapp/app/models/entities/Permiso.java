package com.yourapp.app.models.entities;

public enum Permiso {
    // --------- CATEGORIA ----------
    CATEGORIA_CREAR("Crear una categoria"),
    CATEGORIA_ELIMINAR("Eliminar una categoria"),

    // --------- CLIENTE ----------
    CLIENTE_CREAR("Crear un cliente"),
    CLIENTE_VER("Ver todos los clientes"),
    CLIENTE_MODIFICAR("Modificar un cliente"),
    CLIENTE_ELIMINAR("Eliminar un cliente"),

    // --------- COLOR ----------
    COLOR_CREAR("Crear un color"),
    COLOR_ELIMINAR("Eliminar un color"),

    // --------- CONFIGURACION ----------
    // CONFIGURACION_VER("Ver la configuracion de la tienda"),
    CONFIGURACION_EDITAR("Editar la configuracion de la tienda"),

    // --------- EMPLEADO ----------
    EMPLEADO_CREAR("Crear un empleado"),
    EMPLEADO_VER("Ver todos los empleados"),
    EMPLEADO_MODIFICAR("Modificar un empleado"),
    EMPLEADO_ELIMINAR("Eliminar un empleado"),

    // --------- PERMISO ----------
    PERMISO_VER("Ver todos los permisos"),

    // --------- PRODUCTO ----------
    PRODUCTO_CREAR("Crear un producto o un detalle de producto"),
    PRODUCTO_VER("Ver todos los productos"),
    PRODUCTO_MODIFICAR("Modificar un producto o un detalle de producto"),
    PRODUCTO_ELIMINAR("Eliminar un producto o un detalle de producto"),

    // --------- PROVEEDOR ----------
    PROVEEDOR_CREAR("Crear un proveedor"),
    PROVEEDOR_ELIMINAR("Eliminar un proveedor"),

    // --------- ROL ----------
    ROL_CREAR("Crear un rol"),
    ROL_ACTUALIZAR("Actualizar los permisos de un rol"),
    ROL_ELIMINAR("Eliminar un rol"),
    ROL_VER("Ver todos los roles"),

    // --------- SUBCATEGORIA ----------
    SUBCATEGORIA_CREAR("Crear una subcategoria"),
    SUBCATEGORIA_ELIMINAR("Eliminar una subcategoria"),

    // --------- TALLE ----------
    TALLE_CREAR("Crear un talle"),
    TALLE_ELIMINAR("Eliminar un talle"),

    // --------- USUARIO ----------
    USUARIO_MODIFICAR("Modificar el rol de un usuario"),

    // --------- VENTA ----------
    VENTA_CREAR("Crear una venta"),
    VENTA_VER("Ver todas las ventas"),
    VENTA_PAGAR("Pagar una venta"),
    VENTA_RESERVAR("Reservar una venta"),
    VENTA_CANCELAR("Cancelar una venta"),
    VENTA_RECHAZAR("Rechazar una venta"),
    VENTA_ELIMINAR("Eliminar una venta"),
    VENTA_CAMBIAR("Cambiar productos en una venta"),
    VENTA_PROCESAR("Cancelar reservas vencidas automáticamente");
    
    private final String descripcion;

    Permiso(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
