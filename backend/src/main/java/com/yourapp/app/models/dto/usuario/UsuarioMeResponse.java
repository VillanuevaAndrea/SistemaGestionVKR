package com.yourapp.app.models.dto.usuario;

import com.yourapp.app.models.dto.rol.RolResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsuarioMeResponse {
    private Long id;
    private String nombreDeUsuario;
    private RolResponse rol;
    private Long empleadoId;
    private String empleadoMail;
    private String empleadoTelefono;
}
