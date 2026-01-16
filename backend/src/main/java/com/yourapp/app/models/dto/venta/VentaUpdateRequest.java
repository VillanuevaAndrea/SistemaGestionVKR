package com.yourapp.app.models.dto.venta;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VentaUpdateRequest {
    @NotBlank(message = "El motivo del cambio es obligatorio")
    @Size(max = 500, message = "El motivo no puede superar los 500 caracteres")
    private String motivo;

    @NotEmpty(message = "Debe incluir al menos un producto para realizar el cambio")
    @Valid
    private List<DetalleVentaCreateRequest> detalles;
}
