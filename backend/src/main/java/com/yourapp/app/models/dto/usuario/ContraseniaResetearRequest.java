package com.yourapp.app.models.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ContraseniaResetearRequest {
    @NotBlank
    private String token;
    @NotBlank
    private String contraseniaNueva;
}
