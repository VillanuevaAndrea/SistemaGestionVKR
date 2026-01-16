package com.yourapp.app.models.dto.venta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class DetalleVentaCreateRequest {
    @NotBlank(message = "El código del producto es obligatorio")
    @Pattern(regexp = "^\\d+-\\d+-\\d+$", message = "El formato del código es inválido")
    private String codigo; 

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad a vender debe ser mayor a cero")
    private Integer cantidad;
}
