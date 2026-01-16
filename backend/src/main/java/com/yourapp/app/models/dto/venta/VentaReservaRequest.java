package com.yourapp.app.models.dto.venta;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VentaReservaRequest {
    @NotNull(message = "El monto es obligatorio")
    @PositiveOrZero(message = "El monto no puede ser negativo")
    private Double monto;
}
