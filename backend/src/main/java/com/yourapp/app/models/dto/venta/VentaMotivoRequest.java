package com.yourapp.app.models.dto.venta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VentaMotivoRequest {
    @NotBlank(message = "El motivo del cambio es obligatorio")
    @Size(max = 500, message = "El motivo no puede superar los 500 caracteres")
    private String motivo;
}
