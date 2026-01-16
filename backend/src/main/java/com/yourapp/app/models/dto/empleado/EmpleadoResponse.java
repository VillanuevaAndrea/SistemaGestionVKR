package com.yourapp.app.models.dto.empleado;

import com.yourapp.app.models.dto.usuario.UsuarioResponse;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmpleadoResponse {
    private Long id;
    private String nombre;
    private String apellido;
    private String dni;
    private String direccion;
    private String mail;
    private String telefono;
    private UsuarioResponse usuario;
}
