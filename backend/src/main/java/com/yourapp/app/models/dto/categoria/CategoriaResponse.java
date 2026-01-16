package com.yourapp.app.models.dto.categoria;

import java.util.List;

import com.yourapp.app.models.dto.subcategoria.SubcategoriaResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CategoriaResponse {
    private Long id;
    private String descripcion;
    private Boolean estaActiva;
    private List<SubcategoriaResponse> subcategorias; 
}
