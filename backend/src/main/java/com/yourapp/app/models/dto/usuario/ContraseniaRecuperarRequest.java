package com.yourapp.app.models.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ContraseniaRecuperarRequest {
    @NotBlank
    private String mail;
}
