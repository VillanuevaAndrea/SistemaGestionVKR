package com.yourapp.app.models.dto.subcategoria;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SubcategoriaDetalleResponse {
    private Long id;
    private String descripcion;
    private Long categoriaId;
    private String categoriaDescripcion;
}
