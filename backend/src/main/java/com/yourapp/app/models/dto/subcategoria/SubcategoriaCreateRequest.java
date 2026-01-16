package com.yourapp.app.models.dto.subcategoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SubcategoriaCreateRequest {
    @NotBlank
    @Size(max = 100, message = "La descripción no puede superar los 100 caracteres")
    private String descripcion;  
    
    @NotNull(message = "Debes seleccionar una categoría")
    @Positive(message = "El ID de categoría debe ser un valor válido")
    private Long categoriaId;
}
