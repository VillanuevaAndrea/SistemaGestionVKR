package com.yourapp.app.models.dto.usuario;

import com.yourapp.app.models.dto.rol.RolResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsuarioResponse {
    private Long id;
    private String nombreDeUsuario;
    private RolResponse rol;
}
