package com.yourapp.app.models.dto.producto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductoQuery {
    private String nombre;
    private Long categoriaId;
    private Long subcategoriaId;
    private Long talleId;
    private Long colorId;
    private Long proveedorId;
    private Boolean stockBajo;
    private String orden;
    private String direccion;
    private Integer pagina;
}
