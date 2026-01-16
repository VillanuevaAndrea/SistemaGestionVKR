package com.yourapp.app.models.dto.producto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetalleProductoCreateRequest {
    @Positive(message = "El ID de talle debe ser un valor válido")
    private Long talleId;

    @Positive(message = "El ID de color debe ser un valor válido")
    private Long colorId;

    @NotNull(message = "El stock actual es obligatorio")
    @PositiveOrZero(message = "El stock actual no puede ser un número negativo")
    private Integer stockActual;

    @PositiveOrZero(message = "El stock mínimo no puede ser un número negativo")
    private Integer stockMinimo;
}
