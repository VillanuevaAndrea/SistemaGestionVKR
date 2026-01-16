package com.yourapp.app.models.dto.venta;

import com.yourapp.app.models.entities.Venta.MetodoPago;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VentaQuery {
    private Long empleadoId;
    private String cliente;
    private MetodoPago metodoPago;
    private String estado; // nombre de la clase
    private String orden;
    private String direccion;
    private Integer pagina;
}
