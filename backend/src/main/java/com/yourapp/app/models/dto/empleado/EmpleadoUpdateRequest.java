package com.yourapp.app.models.dto.empleado;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmpleadoUpdateRequest {
    private String direccion;
    private String mail;
    private String telefono;
}
