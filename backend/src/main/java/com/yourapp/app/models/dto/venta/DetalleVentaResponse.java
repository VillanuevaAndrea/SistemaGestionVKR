package com.yourapp.app.models.dto.venta;

import com.yourapp.app.models.dto.producto.DetalleProductoVentaResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetalleVentaResponse {
    private Long id;
    private DetalleProductoVentaResponse detalleProducto;
    private Double precioUnitarioActual;
    private Integer cantidad;
    private Double precioTotalUnitario;
}
