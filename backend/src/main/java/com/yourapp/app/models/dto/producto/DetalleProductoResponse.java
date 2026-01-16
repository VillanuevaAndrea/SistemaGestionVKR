package com.yourapp.app.models.dto.producto;

import com.yourapp.app.models.dto.color.ColorResponse;
import com.yourapp.app.models.dto.talle.TalleResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetalleProductoResponse {
    private Long id;
    private String codigo;
    private TalleResponse talle;
    private ColorResponse color;
    private Integer stockActual;
    private Integer stockReservado;
    private Integer stockDisponible;
    private Integer stockMinimo;
}
