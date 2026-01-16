package com.yourapp.app.models.dto.producto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetalleProductoVentaResponse {
    private Long id;
    private String codigo;
    private String productoNombre;
    private String productoPrecio;
    private String talleNombre;
    private String colorNombre;
}
