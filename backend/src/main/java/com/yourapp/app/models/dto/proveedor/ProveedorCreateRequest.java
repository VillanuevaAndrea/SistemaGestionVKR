package com.yourapp.app.models.dto.proveedor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProveedorCreateRequest {
    @NotBlank
    @Size(max = 100, message = "La descripción no puede superar los 100 caracteres")
    private String nombre;    
}
