package com.yourapp.app.models.dto.producto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductoUpdateRequest {
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    @Positive(message = "El ID de subcategoría debe ser un valor válido")
    private Long subcategoriaId;

    @Positive(message = "El ID de proveedor debe ser un valor válido")
    private Long proveedorId;

    @Min(value = 0, message = "El precio no puede ser un valor negativo")
    private Integer precio;
}
