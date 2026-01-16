package com.yourapp.app.models.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsuarioLoginRequest {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String nombreDeUsuario;
    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasenia;
}
