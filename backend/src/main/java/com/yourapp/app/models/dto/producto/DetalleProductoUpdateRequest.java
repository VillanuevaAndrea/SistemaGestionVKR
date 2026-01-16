package com.yourapp.app.models.dto.producto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetalleProductoUpdateRequest {
    @PositiveOrZero(message = "El stock a aumentar no puede ser un valor negativo")
    private Integer stockAumento;

    @PositiveOrZero(message = "El stock mínimo no puede ser un valor negativo")
    private Integer stockMinimo;
}
