package com.yourapp.app.models.dto.venta;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VentaCreateRequest {    
    @Positive(message = "El ID debe ser un valor válido")
    private Long clienteId;
    
    @NotEmpty(message = "La venta debe tener al menos un producto")
    @Valid
    private List<DetalleVentaCreateRequest> detalles;
}
