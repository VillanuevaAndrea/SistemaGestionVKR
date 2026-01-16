package com.yourapp.app.models.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ContraseniaUpdateRequest {
    @NotBlank
    private String contraseniaActual;

    @NotBlank 
    private String contraseniaNueva;
}
