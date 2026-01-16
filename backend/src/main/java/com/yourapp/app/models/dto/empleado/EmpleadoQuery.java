package com.yourapp.app.models.dto.empleado;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmpleadoQuery {
    private String nombre;
    private String apellido;
    private String dni;
    private Boolean tieneUsuario;
    private String orden;
    private String direccion;
    private Integer pagina;
}
