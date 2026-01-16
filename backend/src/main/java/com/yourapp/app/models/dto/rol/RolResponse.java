package com.yourapp.app.models.dto.rol;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RolResponse {
    private Long id;
    private String nombre;
    private List<PermisoResponse> permisos;
}
