package com.yourapp.app.models.dto.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductoCreateRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    @NotNull(message = "Debes seleccionar una subcategoria")
    @Positive(message = "El ID de subcategoria debe ser un valor válido")
    private Long subcategoriaId;

    @Positive(message = "El ID de proveedor debe ser un valor válido")
    private Long proveedorId;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio no puede ser un valor negativo")
    private Integer precio;
}
